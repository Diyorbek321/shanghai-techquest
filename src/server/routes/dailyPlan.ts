import { Router } from 'express';
import { z } from 'zod';
import { DailyPlan, Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { teacherOwnsClass } from '../utils/teacherScope';
import { calendarDate, dayBefore, dayStart, todayKey } from '../utils/dayKey';
import { isLessonDay } from '../lessons/schedule';
import {
  DAILY_PLAN_XP,
  LATE_PLAN_XP,
  evaluate,
  evaluateMany,
  findCohort,
  getOrCreateTodaysPlan,
  isWithinLateWindow,
  openPlans,
  settle,
  type Cohort,
} from '../dailyPlan/service';
import type { Evaluation } from '../dailyPlan/planner';

export const dailyPlanRouter = Router();

dailyPlanRouter.use(requireAuth);

const NO_COHORT_ERROR = "Sizga dars jadvali biriktirilmagan — kunlik reja sinf jadvalidan tuziladi.";

const dateParam = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

type PlanViewItem =
  | { kind: 'quiz'; done: boolean; answeredCorrectly: number; total: number }
  | {
      kind: 'problem';
      done: boolean;
      problemId: string;
      title: string;
      difficulty: string;
      points: number;
      lessonOrder: number | null;
      lessonTitle: string | null;
    };

async function planView(plan: DailyPlan, evaluation: Evaluation, cohort: Cohort | null) {
  const problemIds = evaluation.items.flatMap((item) => (item.kind === 'problem' ? [item.problemId] : []));
  const problems = await prisma.problem.findMany({
    where: { id: { in: problemIds } },
    select: { id: true, title: true, difficulty: true, points: true, lesson: { select: { order: true, title: true } } },
  });
  const byId = new Map(problems.map((p) => [p.id, p]));

  return {
    date: plan.date,
    lessonDay: cohort ? isLessonDay(cohort.startDate, cohort.lessonDays, calendarDate(plan.date)) : false,
    items: evaluation.items.flatMap((item): PlanViewItem[] => {
      if (item.kind === 'quiz') {
        return [{ kind: 'quiz', done: item.done, answeredCorrectly: item.answeredCorrectly, total: item.total }];
      }
      // A problem deleted since the plan was made is left out rather than
      // shown as an item nobody can ever finish.
      const problem = byId.get(item.problemId);
      if (!problem) return [];
      return [
        {
          kind: 'problem',
          done: item.done,
          problemId: problem.id,
          title: problem.title,
          difficulty: problem.difficulty,
          points: problem.points,
          lessonOrder: problem.lesson?.order ?? null,
          lessonTitle: problem.lesson?.title ?? null,
        },
      ];
    }),
    done: plan.completedAt !== null,
    completedAt: plan.completedAt,
    late: plan.late,
    xpAwarded: plan.xpAwarded,
    xpReward: plan.date === todayKey() ? DAILY_PLAN_XP : LATE_PLAN_XP,
  };
}

/** Evaluate and, if finished, pay out — so opening the card is enough to close a day. */
async function evaluateAndSettle(userId: string, plan: DailyPlan) {
  const evaluation = await evaluate(userId, plan);
  return { plan: await settle(plan, evaluation), evaluation };
}

/** GET /api/daily-plan — today's plan plus earlier days that can still be made up. */
dailyPlanRouter.get('/', requireRole(Role.STUDENT), async (req, res) => {
  const user = req.user!;
  if (!user.track) {
    return res.status(400).json({ error: "Hisobingizga yo'nalish biriktirilmagan." });
  }
  const cohort = await findCohort(user.id, user.track);
  if (!cohort) {
    return res.status(404).json({ error: NO_COHORT_ERROR });
  }

  const todays = await evaluateAndSettle(user.id, await getOrCreateTodaysPlan(user.id, user.track, cohort));

  const today = todayKey();
  const pending = [];
  for (const plan of await openPlans(user.id)) {
    if (plan.date === today) continue;
    const { plan: settled, evaluation } = await evaluateAndSettle(user.id, plan);
    if (settled.completedAt || evaluation.items.length === 0) continue;
    pending.push({
      date: plan.date,
      done: evaluation.items.filter((item) => item.done).length,
      total: evaluation.items.length,
    });
  }

  const fresh = await prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: { streak: true } });
  res.json({ today: await planView(todays.plan, todays.evaluation, cohort), pending, streak: fresh.streak });
});

async function ownPlan(userId: string, rawDate: string) {
  const parsed = dateParam.safeParse(rawDate);
  if (!parsed.success || !isWithinLateWindow(parsed.data)) return null;
  return prisma.dailyPlan.findUnique({ where: { userId_date: { userId, date: parsed.data } } });
}

/** GET /api/daily-plan/day/:date — one of the student's own recent days. */
dailyPlanRouter.get('/day/:date', requireRole(Role.STUDENT), async (req, res) => {
  const plan = await ownPlan(req.user!.id, req.params.date);
  if (!plan) {
    return res.status(404).json({ error: 'Bu kun uchun reja topilmadi.' });
  }
  const cohort = req.user!.track ? await findCohort(req.user!.id, req.user!.track) : null;
  const { plan: settled, evaluation } = await evaluateAndSettle(req.user!.id, plan);
  res.json(await planView(settled, evaluation, cohort));
});

/**
 * GET /api/daily-plan/day/:date/quiz — the day's questions, in the same
 * redacted shape as /api/quiz/:lessonKey so the same quiz component plays them.
 * Answers go through POST /api/quiz/:questionId/answer as usual.
 */
dailyPlanRouter.get('/day/:date/quiz', requireRole(Role.STUDENT), async (req, res) => {
  const plan = await ownPlan(req.user!.id, req.params.date);
  if (!plan) {
    return res.status(404).json({ error: 'Bu kun uchun reja topilmadi.' });
  }
  const evaluation = await evaluate(req.user!.id, plan);
  const questionIds = evaluation.items.flatMap((item) => (item.kind === 'quiz' ? item.questionIds : []));
  const [rows, attempts] = await Promise.all([
    prisma.quizQuestion.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, prompt: true, choices: true, lesson: { select: { key: true } } },
    }),
    prisma.quizAttempt.findMany({
      where: { userId: req.user!.id, questionId: { in: questionIds } },
      select: { questionId: true, correct: true, answeredAt: true },
    }),
  ]);
  // Questions already answered right today are not asked again.
  const start = dayStart(plan.date).getTime();
  const doneIds = new Set(
    attempts.filter((a) => a.correct && a.answeredAt.getTime() >= start).map((a) => a.questionId)
  );
  const byId = new Map(rows.map((row) => [row.id, row]));
  res.json({
    lessonKey: `daily-${plan.date}`,
    questions: questionIds
      .filter((id) => !doneIds.has(id))
      .flatMap((id) => {
        const row = byId.get(id);
        return row
          ? [{ id: row.id, prompt: row.prompt, choices: row.choices, lessonKey: row.lesson.key, isReview: true }]
          : [];
      }),
  });
});

const classQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(14).default(7),
});

type DayStatus = 'done' | 'late' | 'partial' | 'missed' | 'rest' | 'open';

/**
 * GET /api/daily-plan/class/:classId — who did their daily work, day by day.
 *
 * Read-only for the teacher: it never creates plans, so a day a student never
 * opened is shown as missed rather than quietly filled in.
 */
dailyPlanRouter.get('/class/:classId', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const parsed = classQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri so'rov parametrlari." });
  }
  if (!(await teacherOwnsClass(req.user!, req.params.classId))) {
    return res.status(403).json({ error: "Bu sinfga kirish huquqingiz yo'q." });
  }
  const group = await prisma.classGroup.findUniqueOrThrow({
    where: { id: req.params.classId },
    select: { startDate: true, lessonDays: true },
  });

  const today = todayKey();
  const dates = [today];
  while (dates.length < parsed.data.days) dates.unshift(dayBefore(dates[0]));

  const enrollments = await prisma.enrollment.findMany({
    where: { classId: req.params.classId },
    select: { user: { select: { id: true, name: true, streak: true } } },
    orderBy: { user: { name: 'asc' } },
  });
  const studentIds = enrollments.map((e) => e.user.id);
  const plans = await prisma.dailyPlan.findMany({
    where: { userId: { in: studentIds }, date: { gte: dates[0], lte: today } },
  });
  const byKey = new Map(plans.map((plan) => [`${plan.userId}:${plan.date}`, plan]));
  const evaluations = await evaluateMany(plans);

  const students = [];
  for (const { user } of enrollments) {
    const days: { date: string; status: DayStatus; done: number; total: number }[] = [];
    for (const date of dates) {
      const plan = byKey.get(`${user.id}:${date}`);
      if (!plan) {
        days.push({ date, status: date === today ? 'open' : 'missed', done: 0, total: 0 });
        continue;
      }
      const evaluation = evaluations.get(plan.id)!;
      const total = evaluation.items.length;
      const done = evaluation.items.filter((item) => item.done).length;
      const status: DayStatus =
        total === 0
          ? 'rest'
          : plan.completedAt
            ? plan.late
              ? 'late'
              : 'done'
            : date === today
              ? 'open'
              : done > 0
                ? 'partial'
                : 'missed';
      days.push({ date, status, done, total });
    }
    students.push({ id: user.id, name: user.name, streak: user.streak, days });
  }

  res.json({
    dates: dates.map((date) => ({
      date,
      lessonDay: group.startDate ? isLessonDay(group.startDate, group.lessonDays, calendarDate(date)) : false,
    })),
    students,
  });
});
