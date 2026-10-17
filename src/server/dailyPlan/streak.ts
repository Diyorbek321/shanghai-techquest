import { Prisma, PrismaClient } from '@prisma/client';

type Db = PrismaClient | Prisma.TransactionClient;

/**
 * Whether `date` already counts towards the student's streak.
 *
 * Two things can carry a day: the older self-reported drill (DailyExerciseLog)
 * and the auto-checked plan (DailyPlan). Both are read so a student who does
 * both on one day is not credited twice, and switching from one to the other
 * does not break a streak.
 *
 * `excuseEmpty`: a plan that came out empty (nothing taught yet) cannot be
 * done, so looking back it must not read as a missed day. It is only an
 * excuse, though — for today it does not count as already credited, or the
 * drill done that day would never move the streak.
 */
export async function dayCounted(
  db: Db,
  userId: string,
  date: string,
  { excuseEmpty = false, ignorePlanId }: { excuseEmpty?: boolean; ignorePlanId?: string } = {}
): Promise<boolean> {
  const [log, plan] = await Promise.all([
    db.dailyExerciseLog.findUnique({ where: { userId_date: { userId, date } }, select: { completed: true } }),
    db.dailyPlan.findUnique({ where: { userId_date: { userId, date } }, select: { id: true, completedAt: true, late: true, items: true } }),
  ]);
  if (log?.completed) return true;
  if (!plan || plan.id === ignorePlanId) return false;
  const emptyPlan = Array.isArray(plan.items) && plan.items.length === 0;
  return (excuseEmpty && emptyPlan) || (plan.completedAt !== null && !plan.late);
}

export interface StreakChange {
  data: Prisma.UserUpdateInput;
  usedFreeze: boolean;
}

/**
 * The streak part of crediting `today`. Must be worked out BEFORE the caller
 * writes its own completion row, or that row would read as "already counted" —
 * unless the caller passes that row's plan id to be ignored.
 *
 * A missed day normally drops the streak back to 1. A freeze bought from the
 * shop absorbs that, but only when there is a real streak to save: a first-day
 * student has nothing at risk and must not have one silently burned.
 */
export async function streakChange(
  db: Db,
  user: { id: string; streak: number; streakFreezes: number },
  today: string,
  yesterday: string,
  /** The plan being credited right now, already claimed in the same transaction. */
  ignorePlanId?: string
): Promise<StreakChange> {
  if (await dayCounted(db, user.id, today, { ignorePlanId })) {
    return { data: {}, usedFreeze: false };
  }
  const missedYesterday = !(await dayCounted(db, user.id, yesterday, { excuseEmpty: true }));
  const streakAtRisk = missedYesterday && user.streak > 0;
  const usedFreeze = streakAtRisk && user.streakFreezes > 0;
  const continues = !missedYesterday || usedFreeze;
  return {
    data: {
      streak: continues ? { increment: 1 } : 1,
      ...(usedFreeze ? { streakFreezes: { decrement: 1 } } : {}),
    },
    usedFreeze,
  };
}
