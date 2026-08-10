import { Router } from 'express';
import { Role, SubmissionStatus } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { buildParentReport, type WeekCounts } from '../parents/report';
import { teacherOwnsClass } from '../utils/teacherScope';

export const parentReportRouter = Router();

parentReportRouter.use(requireAuth);

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 7;

async function weekCounts(userId: string, since: Date): Promise<WeekCounts> {
  const [lessonsCompleted, solved, quiz, dailyExercises, user] = await Promise.all([
    prisma.submission.count({
      where: {
        userId,
        submittedAt: { gte: since },
        status: { in: [SubmissionStatus.SUBMITTED, SubmissionStatus.GRADED] },
      },
    }),
    prisma.problemSubmission.findMany({
      where: { userId, passed: true, submittedAt: { gte: since } },
      select: { problemId: true, problem: { select: { tags: true } } },
      distinct: ['problemId'],
    }),
    prisma.quizAttempt.findMany({
      where: { userId, answeredAt: { gte: since } },
      select: { correct: true },
    }),
    prisma.dailyExerciseLog.count({ where: { userId, completed: true, completedAt: { gte: since } } }),
    prisma.user.findUnique({ where: { id: userId }, select: { streak: true } }),
  ]);

  // The topic the week was actually spent on, by solved-problem count.
  const tagCounts = new Map<string, number>();
  for (const row of solved) {
    for (const tag of row.problem.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
  let strongestTopic: string | null = null;
  let best = 0;
  for (const [tag, count] of tagCounts) {
    if (count > best) {
      best = count;
      strongestTopic = tag;
    }
  }

  return {
    lessonsCompleted,
    problemsSolved: solved.length,
    quizAnswered: quiz.length,
    quizCorrect: quiz.filter((q) => q.correct).length,
    dailyExercises,
    streak: user?.streak ?? 0,
    strongestTopic,
  };
}

/**
 * A student's own weekly report, or one of their students' for a teacher.
 *
 * Deliberately NOT a public link. A certificate is a document a student chooses
 * to show; a weekly activity report on a minor is not, and a guessable public
 * URL for one would be a standing exposure. Parents see this on the student's
 * screen or from the teacher.
 */
parentReportRouter.get('/:userId', async (req, res) => {
  const target = await prisma.user.findUnique({
    where: { id: req.params.userId },
    select: { id: true, name: true, role: true },
  });
  if (!target || target.role !== Role.STUDENT) {
    return res.status(404).json({ error: "O'quvchi topilmadi." });
  }

  const isSelf = target.id === req.user!.id;
  const isStaff = req.user!.role === Role.ADMIN;
  let allowed = isSelf || isStaff;

  if (!allowed && req.user!.role === Role.TEACHER) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: target.id },
      select: { classId: true },
    });
    for (const { classId } of enrollments) {
      if (await teacherOwnsClass({ id: req.user!.id, role: req.user!.role }, classId)) {
        allowed = true;
        break;
      }
    }
  }
  if (!allowed) {
    return res.status(403).json({ error: "Bu hisobotni ko'rish huquqingiz yo'q." });
  }

  const since = new Date(Date.now() - WINDOW_DAYS * DAY_MS);
  const counts = await weekCounts(target.id, since);

  res.json({
    student: { id: target.id, name: target.name },
    weekStart: since,
    counts,
    report: buildParentReport(target.name, counts),
  });
});
