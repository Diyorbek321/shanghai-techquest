import { DailyPlan, Prisma, Track } from '@prisma/client';
import { prisma } from '../db';
import { DEFAULT_LESSON_DAYS, isLessonDay, lessonsTaughtBefore } from '../lessons/schedule';
import { notify } from '../notifications/notify';
import { calendarDate, dayBefore, dayStart, todayKey } from '../utils/dayKey';
import { buildDailyPlan, evaluatePlan, parsePlanItems, type Evaluation, type PlanItem } from './planner';
import { streakChange } from './streak';

/** XP for finishing the day's plan on the day itself. */
export const DAILY_PLAN_XP = 30;
/** Finishing a past day still pays something, but less, and never the streak. */
export const LATE_PLAN_XP = 15;
/**
 * Ordering given lines (routes/problems.ts stores those attempts under this
 * language) is scaffolding. A plan's problem is done only when the student
 * wrote code that passes the tests — otherwise every day would be solved the
 * easy way and the writing practice would quietly disappear.
 */
const PARSONS_LANGUAGE = 'parsons';

/** How far back an unfinished plan can still be made up. */
export const LATE_WINDOW_DAYS = 7;

export interface Cohort {
  classId: string;
  startDate: Date;
  lessonDays: number[];
}

/**
 * The cohort whose timetable drives the student's days: the most recently
 * joined class on their own track that has a start date. Without one there is
 * no calendar to plan against, and the caller falls back to the older drill.
 */
export async function findCohort(userId: string, track: Track): Promise<Cohort | null> {
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, class: { track, startDate: { not: null } } },
    orderBy: { joinedAt: 'desc' },
    select: { class: { select: { id: true, startDate: true, lessonDays: true } } },
  });
  if (!enrollment?.class.startDate) return null;
  const { id, startDate, lessonDays } = enrollment.class;
  return { classId: id, startDate, lessonDays: lessonDays.length > 0 ? lessonDays : DEFAULT_LESSON_DAYS };
}

async function composeItems(userId: string, track: Track, cohort: Cohort, date: string): Promise<PlanItem[]> {
  const day = calendarDate(date);
  const totalLessons = await prisma.lesson.count({ where: { track } });
  const taughtOrder = lessonsTaughtBefore(cohort.startDate, cohort.lessonDays, day, totalLessons);
  if (taughtOrder < 1) return [];

  const taughtLesson = { track, order: { lte: taughtOrder } };
  const [problems, passed, dueAttempts, freshQuestions] = await Promise.all([
    prisma.problem.findMany({
      where: { lesson: taughtLesson },
      select: { id: true, lesson: { select: { order: true } } },
      orderBy: { key: 'asc' },
    }),
    prisma.problemSubmission.findMany({
      where: { userId, passed: true, language: { not: PARSONS_LANGUAGE }, problem: { lesson: taughtLesson } },
      select: { problemId: true },
      distinct: ['problemId'],
    }),
    prisma.quizAttempt.findMany({
      where: { userId, dueAt: { lte: new Date() }, question: { lesson: taughtLesson } },
      select: { questionId: true },
      orderBy: { dueAt: 'asc' },
    }),
    prisma.quizQuestion.findMany({
      where: { lesson: taughtLesson, attempts: { none: { userId } } },
      select: { id: true, lesson: { select: { order: true } } },
      orderBy: { order: 'asc' },
    }),
  ]);

  const solved = new Set(passed.map((row) => row.problemId));
  return buildDailyPlan({
    lessonDay: isLessonDay(cohort.startDate, cohort.lessonDays, day),
    taughtOrder,
    lessonsPerWeek: cohort.lessonDays.length,
    unsolvedProblems: problems
      .filter((p) => !solved.has(p.id) && p.lesson)
      .map((p) => ({ id: p.id, lessonOrder: p.lesson!.order })),
    dueQuestionIds: dueAttempts.map((a) => a.questionId),
    freshQuestions: freshQuestions.map((q) => ({ id: q.id, lessonOrder: q.lesson.order })),
  });
}

/**
 * Today's plan, fixed the first time it is asked for. Only today's is ever
 * created: a day nobody opened is simply missed, there is nothing to make up.
 */
export async function getOrCreateTodaysPlan(userId: string, track: Track, cohort: Cohort): Promise<DailyPlan> {
  const date = todayKey();
  const existing = await prisma.dailyPlan.findUnique({ where: { userId_date: { userId, date } } });
  if (existing) return existing;

  const items = await composeItems(userId, track, cohort, date);
  try {
    return await prisma.dailyPlan.create({
      data: { userId, date, classId: cohort.classId, items: items as unknown as Prisma.InputJsonValue },
    });
  } catch (err) {
    // Two tabs opening the dashboard at once: the other request won the insert.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return prisma.dailyPlan.findUniqueOrThrow({ where: { userId_date: { userId, date } } });
    }
    throw err;
  }
}

export async function evaluate(userId: string, plan: Pick<DailyPlan, 'items' | 'date'>): Promise<Evaluation> {
  const items = parsePlanItems(plan.items);
  const problemIds = items.flatMap((item) => (item.kind === 'problem' ? [item.problemId] : []));
  const questionIds = items.flatMap((item) => (item.kind === 'quiz' ? item.questionIds : []));

  const [passed, attempts] = await Promise.all([
    problemIds.length > 0
      ? prisma.problemSubmission.findMany({
          where: { userId, passed: true, language: { not: PARSONS_LANGUAGE }, problemId: { in: problemIds } },
          select: { problemId: true },
          distinct: ['problemId'],
        })
      : [],
    questionIds.length > 0
      ? prisma.quizAttempt.findMany({
          where: { userId, questionId: { in: questionIds } },
          select: { questionId: true, correct: true, answeredAt: true },
        })
      : [],
  ]);

  return evaluatePlan(items, {
    passedProblemIds: new Set(passed.map((row) => row.problemId)),
    attempts: new Map(attempts.map((a) => [a.questionId, { correct: a.correct, answeredAt: a.answeredAt }])),
    dayStart: dayStart(plan.date),
  });
}

/**
 * The same verdicts as `evaluate`, for many students' plans at once — two
 * queries in total rather than two per plan, for the teacher's class board.
 */
export async function evaluateMany(plans: readonly DailyPlan[]): Promise<Map<string, Evaluation>> {
  const parsed = plans.map((plan) => ({ plan, items: parsePlanItems(plan.items) }));
  const userIds = [...new Set(plans.map((plan) => plan.userId))];
  const problemIds = [...new Set(parsed.flatMap(({ items }) => items.flatMap((i) => (i.kind === 'problem' ? [i.problemId] : []))))];
  const questionIds = [...new Set(parsed.flatMap(({ items }) => items.flatMap((i) => (i.kind === 'quiz' ? i.questionIds : []))))];

  const [passed, attempts] = await Promise.all([
    problemIds.length > 0
      ? prisma.problemSubmission.findMany({
          where: { userId: { in: userIds }, passed: true, language: { not: PARSONS_LANGUAGE }, problemId: { in: problemIds } },
          select: { userId: true, problemId: true },
          distinct: ['userId', 'problemId'],
        })
      : [],
    questionIds.length > 0
      ? prisma.quizAttempt.findMany({
          where: { userId: { in: userIds }, questionId: { in: questionIds } },
          select: { userId: true, questionId: true, correct: true, answeredAt: true },
        })
      : [],
  ]);

  const passedByUser = new Map<string, Set<string>>();
  for (const row of passed) {
    passedByUser.set(row.userId, (passedByUser.get(row.userId) ?? new Set()).add(row.problemId));
  }
  const attemptsByUser = new Map<string, Map<string, { correct: boolean; answeredAt: Date }>>();
  for (const row of attempts) {
    const forUser = attemptsByUser.get(row.userId) ?? new Map();
    forUser.set(row.questionId, { correct: row.correct, answeredAt: row.answeredAt });
    attemptsByUser.set(row.userId, forUser);
  }

  return new Map(
    parsed.map(({ plan, items }) => [
      plan.id,
      evaluatePlan(items, {
        passedProblemIds: passedByUser.get(plan.userId) ?? new Set(),
        attempts: attemptsByUser.get(plan.userId) ?? new Map(),
        dayStart: dayStart(plan.date),
      }),
    ])
  );
}

/**
 * Pays out a plan whose work is all checked off. Safe to call as often as
 * anything changes: the `completedAt: null` guard means only the first caller
 * to see it finished credits it.
 */
export async function settle(plan: DailyPlan, evaluation: Evaluation): Promise<DailyPlan> {
  if (plan.completedAt || !evaluation.done) return plan;

  const today = todayKey();
  const late = plan.date !== today;
  const xp = late ? LATE_PLAN_XP : DAILY_PLAN_XP;
  // Claim, streak and XP move together: a plan marked done with no XP paid
  // would never be retried, since only unclaimed plans are ever settled.
  const result = await prisma.$transaction(async (tx) => {
    const claimed = await tx.dailyPlan.updateMany({
      where: { id: plan.id, completedAt: null },
      data: { completedAt: new Date(), late, xpAwarded: xp },
    });
    if (claimed.count === 0) return null;

    const user = await tx.user.findUniqueOrThrow({
      where: { id: plan.userId },
      select: { id: true, streak: true, streakFreezes: true },
    });
    // Read with this plan's own row excluded from "today", which the claim
    // above would otherwise make look already counted.
    const streak = late
      ? { data: {}, usedFreeze: false }
      : await streakChange(tx, user, today, dayBefore(today), plan.id);
    const updated = await tx.user.update({
      where: { id: user.id },
      data: { xp: { increment: xp }, ...streak.data },
    });
    return { updated, usedFreeze: streak.usedFreeze };
  });
  if (!result) {
    return prisma.dailyPlan.findUniqueOrThrow({ where: { id: plan.id } });
  }
  const { updated } = result;

  await notify(prisma, {
    userId: updated.id,
    type: 'SUCCESS',
    title: late ? 'Kechikkan kunlik reja bajarildi' : 'Kunlik reja bajarildi!',
    body: late
      ? `${plan.date} kungi reja yopildi: +${xp} XP. Kechikkan kun ketma-ketlikka qo'shilmaydi.`
      : result.usedFreeze
        ? `+${xp} XP. Muzlatish ishlatildi — ketma-ket kunlar saqlanib qoldi: ${updated.streak}.`
        : `+${xp} XP. Ketma-ket kunlar: ${updated.streak}.`,
  });
  return prisma.dailyPlan.findUniqueOrThrow({ where: { id: plan.id } });
}

function lateWindowStart(): string {
  let key = todayKey();
  for (let i = 0; i < LATE_WINDOW_DAYS; i++) key = dayBefore(key);
  return key;
}

/** Unfinished plans that can still be made up, newest first, today included. */
export async function openPlans(userId: string): Promise<DailyPlan[]> {
  return prisma.dailyPlan.findMany({
    where: { userId, completedAt: null, date: { gte: lateWindowStart() } },
    orderBy: { date: 'desc' },
  });
}

/**
 * Called after anything that can tick off a plan item — a problem passing, a
 * quiz answer — so a day closes the moment its last piece is checked, without
 * the student having to come back to the dashboard. Never throws: a failure
 * here must not turn the submission that triggered it into an error.
 */
export async function settleOpenPlans(userId: string): Promise<void> {
  try {
    for (const plan of await openPlans(userId)) {
      await settle(plan, await evaluate(userId, plan));
    }
  } catch (err) {
    console.error('Daily plan settle failed:', err);
  }
}

export function isWithinLateWindow(date: string): boolean {
  return date >= lateWindowStart() && date <= todayKey();
}
