import { Router } from 'express';
import { z } from 'zod';
import { Role, SubmissionStatus } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { notify } from '../notifications/notify';
import { checkAchievements } from '../achievements/check';
import { teacherOwnsClass } from '../utils/teacherScope';
import { GeminiNotConfiguredError } from '../ai/gemini';
import { NothingToReviewError, reviewSubmission } from '../ai/reviewSubmission';

export const submissionsRouter = Router();

submissionsRouter.use(requireAuth);

const updateSchema = z
  .object({
    status: z.enum(['PENDING', 'SUBMITTED', 'GRADED', 'LATE'] as [SubmissionStatus, ...SubmissionStatus[]]),
    score: z.number().min(0).max(1000).optional(),
    maxScore: z.number().min(1).max(1000).optional(),
  })
  .refine((data) => data.status !== 'GRADED' || data.score !== undefined, {
    message: "Baholash uchun ball kiritilishi shart.",
    path: ['score'],
  });

const PASS_RATIO = 0.6;

submissionsRouter.patch('/:id', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const previous = await prisma.submission.findUnique({ where: { id: req.params.id } });
  if (!previous) {
    return res.status(404).json({ error: 'Topshiriq topilmadi.' });
  }
  const existingGrade = await prisma.grade.findFirst({
    where: { userId: previous.userId, assignmentId: previous.assignmentId },
  });
  const wasAlreadyPassed =
    previous.status === 'GRADED' && existingGrade !== null && existingGrade.score / existingGrade.maxScore >= PASS_RATIO;

  const submission = await prisma.submission.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status },
    include: { assignment: true },
  });

  if (parsed.data.status === 'GRADED' && parsed.data.score !== undefined) {
    const maxScore = parsed.data.maxScore ?? 100;
    const passed = parsed.data.score / maxScore >= PASS_RATIO;
    if (existingGrade) {
      await prisma.grade.update({
        where: { id: existingGrade.id },
        data: { score: parsed.data.score, maxScore, gradedAt: new Date() },
      });
    } else {
      await prisma.grade.create({
        data: {
          userId: submission.userId,
          assignmentId: submission.assignmentId,
          subject: submission.assignment.title,
          score: parsed.data.score,
          maxScore,
        },
      });
    }

    if (!wasAlreadyPassed && passed && submission.assignment.xpReward > 0) {
      await prisma.user.update({
        where: { id: submission.userId },
        data: { xp: { increment: submission.assignment.xpReward } },
      });
    }

    if (submission.assignment.moduleKey) {
      const existingProgress = await prisma.moduleProgress.findUnique({
        where: { userId_moduleKey: { userId: submission.userId, moduleKey: submission.assignment.moduleKey } },
      });
      const progress = passed ? 100 : Math.max(existingProgress?.progress ?? 0, 50);
      await prisma.moduleProgress.upsert({
        where: { userId_moduleKey: { userId: submission.userId, moduleKey: submission.assignment.moduleKey } },
        update: { progress, unlocked: true },
        create: {
          userId: submission.userId,
          track: submission.assignment.track,
          moduleKey: submission.assignment.moduleKey,
          progress,
          unlocked: true,
        },
      });
    }

    await notify(prisma, {
      userId: submission.userId,
      type: 'SUCCESS',
      title: 'Vazifa baholandi',
      body: `"${submission.assignment.title}" vazifangiz baholandi: ${parsed.data.score}/${maxScore}.`,
    });
  }
  await checkAchievements(submission.userId);

  res.json(submission);
});

const AI_REVIEW_COOLDOWN_MS = 60_000;

/**
 * POST /api/submissions/:id/ai-review — ask Gemini for a suggested mark again
 * (the first one runs by itself on hand-in). Advisory: it never grades.
 */
submissionsRouter.post('/:id/ai-review', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const submission = await prisma.submission.findUnique({
    where: { id: req.params.id },
    select: { id: true, aiReviewedAt: true, assignment: { select: { classId: true } } },
  });
  if (!submission) {
    return res.status(404).json({ error: 'Topshiriq topilmadi.' });
  }
  // Track-wide assignments have no class; only an admin may run those.
  const allowed = submission.assignment.classId
    ? await teacherOwnsClass(req.user!, submission.assignment.classId)
    : req.user!.role === Role.ADMIN;
  if (!allowed) {
    return res.status(403).json({ error: "Bu topshiriqni ko'rish huquqingiz yo'q." });
  }

  // Each call is a paid model request; a double click must not be two.
  if (submission.aiReviewedAt && Date.now() - submission.aiReviewedAt.getTime() < AI_REVIEW_COOLDOWN_MS) {
    return res.status(429).json({ error: "Bu ish hozirgina tekshirildi. Bir daqiqadan keyin qayta urinib ko'ring." });
  }

  try {
    const review = await reviewSubmission(submission.id);
    res.json({ aiReview: review });
  } catch (err) {
    if (err instanceof NothingToReviewError) {
      return res.status(422).json({ error: err.message });
    }
    if (err instanceof GeminiNotConfiguredError) {
      return res.status(503).json({ error: 'AI xizmati sozlanmagan.' });
    }
    console.error('AI review error:', err);
    return res.status(502).json({ error: "AI baholashni bajarib bo'lmadi. Birozdan keyin qayta urinib ko'ring." });
  }
});
