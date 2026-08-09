import { Track } from '@prisma/client';
import { prisma } from '../db';

/**
 * How far into the curriculum a student who has submitted nothing yet may be
 * drilled. Without it the pool for a fresh student is empty and they are shown
 * "no exercise today" every day — which is what kept the whole streak loop from
 * ever starting on the backend track.
 */
export const STARTER_LESSON_WINDOW = 4;

interface Drillable {
  lessonOrder: number | null;
}

/**
 * The drills a student at `reachedOrder` should be picked from.
 *
 * Exercises without a lessonOrder belong to the older module-based pools
 * (FRONTEND, OFFICE) and stay eligible for everyone, so those tracks behave
 * exactly as before.
 */
export function eligiblePool<T extends Drillable>(pool: T[], reachedOrder: number): T[] {
  const window = Math.max(reachedOrder, STARTER_LESSON_WINDOW);
  const eligible = pool.filter((item) => item.lessonOrder === null || item.lessonOrder <= window);
  // A track whose drills all sit past the window would otherwise serve nothing;
  // an over-hard exercise beats a dead day.
  return eligible.length > 0 ? eligible : pool;
}

/**
 * The furthest lesson the student has actually handed something in for.
 *
 * Submissions are the honest signal: a lesson's assignment exists for the whole
 * cohort from the start, so its mere presence says nothing about progress.
 */
export async function reachedLessonOrder(userId: string, track: Track): Promise<number> {
  const latest = await prisma.submission.findFirst({
    where: { userId, assignment: { track, lessonId: { not: null } } },
    orderBy: { assignment: { lesson: { order: 'desc' } } },
    select: { assignment: { select: { lesson: { select: { order: true } } } } },
  });
  return latest?.assignment.lesson?.order ?? 0;
}
