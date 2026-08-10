import { Prisma, PrismaClient } from '@prisma/client';

type Db = PrismaClient | Prisma.TransactionClient;

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 7;

export interface WeeklyProgress {
  /** Problems solved in the last 7 days. */
  thisWeek: number;
  /** Problems solved in the 7 days before that. */
  lastWeek: number;
  /** thisWeek - lastWeek; positive means the student is speeding up. */
  delta: number;
}

/**
 * "More than last week" — the one leaderboard number a student cannot lose by
 * someone else working harder.
 *
 * Counts distinct problems SOLVED rather than submissions, so a student who
 * retries the same problem five times before it passes gets credit once and the
 * measure stays a measure of learning rather than of clicking. Rolling 7-day
 * windows rather than calendar weeks: on a Monday a calendar week would compare
 * one day against seven and always report a collapse.
 */
export async function weeklyProgress(db: Db, userId: string): Promise<WeeklyProgress> {
  const now = Date.now();
  const thisWeekStart = new Date(now - WINDOW_DAYS * DAY_MS);
  const lastWeekStart = new Date(now - 2 * WINDOW_DAYS * DAY_MS);

  const solved = await db.problemSubmission.findMany({
    where: { userId, passed: true, submittedAt: { gte: lastWeekStart } },
    select: { problemId: true, submittedAt: true },
    orderBy: { submittedAt: 'asc' },
  });

  // A problem first solved last week and solved again this week is progress
  // only once, and it belongs to the week it was first solved.
  const firstSolve = new Map<string, Date>();
  for (const row of solved) {
    if (!firstSolve.has(row.problemId)) firstSolve.set(row.problemId, row.submittedAt);
  }

  let thisWeek = 0;
  let lastWeek = 0;
  for (const at of firstSolve.values()) {
    if (at >= thisWeekStart) thisWeek += 1;
    else lastWeek += 1;
  }

  return { thisWeek, lastWeek, delta: thisWeek - lastWeek };
}
