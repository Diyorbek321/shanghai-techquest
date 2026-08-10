import { Router } from 'express';
import { Role, SubmissionStatus } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { unlockState } from '../unlocks/stages';

export const unlocksRouter = Router();

unlocksRouter.use(requireAuth);

/**
 * Which mechanics are open for the caller.
 *
 * The client uses this to hide or lock nav entries. It is NOT an authorisation
 * boundary: a locked feature is a pacing decision, not a permission, and every
 * route keeps its own role checks. Treating this as security would mean a
 * student who typed a URL could reach something they must not — that is what
 * requireRole is for, and it is unchanged.
 */
unlocksRouter.get('/', async (req, res) => {
  const staff = req.user!.role !== Role.STUDENT;
  if (staff) {
    return res.json({ lessonsCompleted: 0, ...unlockState(0, true) });
  }

  // Same definition of "done" the course view and the certificates use.
  const lessonsCompleted = await prisma.submission.count({
    where: {
      userId: req.user!.id,
      status: { in: [SubmissionStatus.SUBMITTED, SubmissionStatus.GRADED] },
      assignment: { lessonId: { not: null } },
    },
  });

  res.json({ lessonsCompleted, ...unlockState(lessonsCompleted) });
});
