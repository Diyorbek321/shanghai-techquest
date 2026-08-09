/**
 * Turns a cohort's start date into a per-lesson deadline.
 *
 * Classes meet on fixed weekdays (Mon/Wed/Fri by default), so lesson N lands on
 * the Nth meeting on or after the start date. Homework for a lesson is due when
 * the next lesson begins, which is what students actually experience: "keyingi
 * darsgacha bajarasiz".
 *
 * All arithmetic is UTC so a server timezone change never shifts a deadline by a
 * day (same approach as src/server/routes/dailyExercise.ts).
 */

export const DEFAULT_LESSON_DAYS = [1, 3, 5];

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_PER_WEEK = 7;

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function normalizeLessonDays(lessonDays: readonly number[]): number[] {
  const unique = [...new Set(lessonDays.map((day) => ((day % DAYS_PER_WEEK) + DAYS_PER_WEEK) % DAYS_PER_WEEK))];
  return unique.sort((a, b) => a - b);
}

/**
 * Date of the `order`-th lesson (1-based), counting meetings from `startDate`
 * inclusive. Returns midnight UTC on that day.
 */
export function lessonDate(startDate: Date, lessonDays: readonly number[], order: number): Date {
  if (order < 1 || !Number.isInteger(order)) {
    throw new Error(`Dars tartibi 1 dan katta butun son bo'lishi kerak (${order}).`);
  }
  const days = normalizeLessonDays(lessonDays);
  if (days.length === 0) {
    throw new Error("Sinf uchun dars kunlari belgilanmagan.");
  }

  const start = startOfUtcDay(startDate);
  const startWeekday = start.getUTCDay();

  // Offsets, in days from the start date, of the meetings in the first week.
  const firstWeek = days.map((day) => (day - startWeekday + DAYS_PER_WEEK) % DAYS_PER_WEEK).sort((a, b) => a - b);

  const zeroBased = order - 1;
  const fullWeeks = Math.floor(zeroBased / days.length);
  const offsetInWeek = firstWeek[zeroBased % days.length];

  return new Date(start.getTime() + (fullWeeks * DAYS_PER_WEEK + offsetInWeek) * MS_PER_DAY);
}

/**
 * Deadline for lesson `order`'s homework: the end of the day before the next
 * lesson, so it is "due by the next class".
 */
export function lessonDueDate(startDate: Date, lessonDays: readonly number[], order: number): Date {
  const nextLesson = lessonDate(startDate, lessonDays, order + 1);
  return new Date(nextLesson.getTime() - 1);
}
