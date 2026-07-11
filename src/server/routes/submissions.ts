import { Router } from 'express';
import { z } from 'zod';
import { Role, SubmissionStatus } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { notify } from '../notifications/notify';
import { checkAchievements } from '../achievements/check';

export const submissionsRouter = Router();

submissionsRouter.use(requireAuth);

const updateSchema = z.object({
  status: z.enum(['PENDING', 'SUBMITTED', 'GRADED', 'LATE'] as [SubmissionStatus, ...SubmissionStatus[]]),
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

  if (parsed.data.status === 'GRADED') {
    await notify(prisma, {
      userId: submission.userId,
      type: 'SUCCESS',
      title: 'Vazifa baholandi',
      body: `"${submission.assignment.title}" vazifangiz baholandi.`,
    });
  }
  await checkAchievements(submission.userId);

  res.json(submission);
});
