import { Router } from 'express';
import { z } from 'zod';
import { ClassGoal, ClassGoalMetric, Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { teacherOwnsClass } from '../utils/teacherScope';
import { goalProgress, summarise } from '../classGoals/progress';
import { notifyMany } from '../notifications/notify';

export const classGoalsRouter = Router();

classGoalsRouter.use(requireAuth);

const METRICS = ['PROBLEMS_SOLVED', 'DAILY_EXERCISES', 'HOMEWORK_DONE'] as const;

const createSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(1).max(200),
  metric: z.enum(METRICS),
  target: z.number().int().min(1).max(100_000),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  xpReward: z.number().int().min(0).max(1000).default(0),
});

/**
 * Pay the goal out the first time it is seen as reached.
 *
 * There is no scheduler in this app, so the payout happens lazily on read. The
 * `achievedAt: null` guard inside updateMany is what makes that safe: two
 * concurrent readers race on the same row and only the one that flips it from
 * null gets a non-zero count, so the XP is granted exactly once.
 */
async function settleIfReached(goal: ClassGoal, current: number): Promise<ClassGoal> {
  if (goal.achievedAt !== null || current < goal.target) return goal;

  const { count } = await prisma.classGoal.updateMany({
    where: { id: goal.id, achievedAt: null },
    data: { achievedAt: new Date() },
  });
  if (count === 0) return prisma.classGoal.findUniqueOrThrow({ where: { id: goal.id } });

  const members = await prisma.enrollment.findMany({
    where: { classId: goal.classId },
    select: { userId: true },
  });
  const userIds = members.map((m) => m.userId);

  if (goal.xpReward > 0 && userIds.length > 0) {
    await prisma.user.updateMany({ where: { id: { in: userIds } }, data: { xp: { increment: goal.xpReward } } });
  }
  if (userIds.length > 0) {
    await notifyMany(prisma, userIds, {
      type: 'SUCCESS',
      title: 'Sinf maqsadi bajarildi! 🎉',
      body: goal.xpReward > 0 ? `"${goal.title}" — har biringizga +${goal.xpReward} XP.` : `"${goal.title}" bajarildi.`,
    });
  }

  return prisma.classGoal.findUniqueOrThrow({ where: { id: goal.id } });
}

async function serialise(goal: ClassGoal) {
  const current = await goalProgress(goal);
  const settled = await settleIfReached(goal, current);
  return {
    id: settled.id,
    classId: settled.classId,
    title: settled.title,
    metric: settled.metric,
    startsAt: settled.startsAt,
    endsAt: settled.endsAt,
    ...summarise(settled, current),
  };
}

classGoalsRouter.post('/', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const { classId, startsAt, endsAt, ...rest } = parsed.data;

  if (endsAt <= startsAt) {
    return res.status(400).json({ error: "Tugash sanasi boshlanish sanasidan keyin bo'lishi kerak." });
  }
  if (!(await teacherOwnsClass(req.user!, classId))) {
    return res.status(403).json({ error: "Bu sinfga maqsad qo'yish huquqingiz yo'q." });
  }

  const goal = await prisma.classGoal.create({
    data: { classId, startsAt, endsAt, ...rest, metric: rest.metric as ClassGoalMetric },
  });

  const members = await prisma.enrollment.findMany({ where: { classId }, select: { userId: true } });
  if (members.length > 0) {
    await notifyMany(prisma, members.map((m) => m.userId), {
      type: 'INFO',
      title: 'Yangi sinf maqsadi',
      body: `"${goal.title}" — birgalikda ${goal.target} ta natijaga erishing.`,
    });
  }

  res.status(201).json(await serialise(goal));
});

/** Goals of one class — the teacher who owns it, or a student enrolled in it. */
classGoalsRouter.get('/', async (req, res) => {
  const classId = typeof req.query.classId === 'string' ? req.query.classId : null;
  if (!classId) {
    return res.status(400).json({ error: 'classId talab qilinadi.' });
  }

  const allowed =
    req.user!.role === Role.STUDENT
      ? (await prisma.enrollment.count({ where: { userId: req.user!.id, classId } })) > 0
      : await teacherOwnsClass(req.user!, classId);
  if (!allowed) {
    return res.status(403).json({ error: "Bu sinfni ko'rish huquqingiz yo'q." });
  }

  const goals = await prisma.classGoal.findMany({ where: { classId }, orderBy: { endsAt: 'desc' } });
  res.json(await Promise.all(goals.map(serialise)));
});

/** Every goal of every class the caller is enrolled in — the student's widget. */
classGoalsRouter.get('/mine', async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.user!.id },
    select: { classId: true },
  });
  if (enrollments.length === 0) return res.json([]);

  const goals = await prisma.classGoal.findMany({
    where: { classId: { in: enrollments.map((e) => e.classId) } },
    orderBy: { endsAt: 'desc' },
  });
  res.json(await Promise.all(goals.map(serialise)));
});

classGoalsRouter.delete('/:id', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const goal = await prisma.classGoal.findUnique({ where: { id: req.params.id } });
  if (!goal) {
    return res.status(404).json({ error: 'Maqsad topilmadi.' });
  }
  if (!(await teacherOwnsClass(req.user!, goal.classId))) {
    return res.status(403).json({ error: "Bu maqsadni o'chirish huquqingiz yo'q." });
  }
  await prisma.classGoal.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
