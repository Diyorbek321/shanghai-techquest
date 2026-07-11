import { Router } from 'express';
import { z } from 'zod';
import { Role, SubmissionStatus } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { notify } from '../notifications/notify';
import { checkAchievements } from '../achievements/check';

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

submissionsRouter.patch('/:id', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const submission = await prisma.submission.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status },
    include: { assignment: true },
  });

  if (parsed.data.status === 'GRADED' && parsed.data.score !== undefined) {
    const maxScore = parsed.data.maxScore ?? 100;
    const existingGrade = await prisma.grade.findFirst({
      where: { userId: submission.userId, assignmentId: submission.assignmentId },
    });
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
