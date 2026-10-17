/**
 * Turns a cohort's start date into a per-lesson deadline.
 *
 * Classes meet on fixed weekdays (Mon/Wed/Fri by default), so lesson N lands on
 * the Nth meeting on or after the start date. A weekday may be listed more than
 * once: [6, 0, 0] is a weekend cohort with one lesson on Saturday and a double
 * lesson on Sunday. Homework for a lesson is due when the next lesson begins,
 * which is what students actually experience: "keyingi darsgacha bajarasiz".
 *
 * Dates are calendar dates carried as midnight UTC, so a server timezone change
 * never shifts a deadline by a day. Only the deadline instant itself is turned
 * into Tashkent time — the end of the student's own evening.
 */

import { TASHKENT_UTC_OFFSET_MINUTES } from '../utils/dayKey';

export const DEFAULT_LESSON_DAYS = [1, 3, 5];

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_PER_WEEK = 7;

/**
 * A homework deadline never lands on the same evening as its lesson: when the
 * next lesson is the very next day (Saturday then Sunday), the work is due
 * before the meeting after that instead.
 */
export const MIN_HOMEWORK_GAP_DAYS = 2;

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Duplicates are kept on purpose — each one is another lesson that day. */
function normalizeLessonDays(lessonDays: readonly number[]): number[] {
  return lessonDays.map((day) => ((day % DAYS_PER_WEEK) + DAYS_PER_WEEK) % DAYS_PER_WEEK).sort((a, b) => a - b);
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
 * lesson at least MIN_HOMEWORK_GAP_DAYS away, so it is "due by the next class"
 * without ever leaving a single evening for it.
 */
export function lessonDueDate(startDate: Date, lessonDays: readonly number[], order: number): Date {
  const taught = lessonDate(startDate, lessonDays, order).getTime();
  let next = order + 1;
  while (lessonDate(startDate, lessonDays, next).getTime() - taught < MIN_HOMEWORK_GAP_DAYS * MS_PER_DAY) {
    next++;
  }
  // 23:59:59.999 Tashkent time on the day before that lesson.
  return new Date(lessonDate(startDate, lessonDays, next).getTime() - TASHKENT_UTC_OFFSET_MINUTES * 60_000 - 1);
}

/**
 * How many lessons were held on days strictly before `date`, capped at the
 * course length. Today's own lessons are not counted: a student is not asked to
 * practise material before the class that teaches it is over.
 */
export function lessonsTaughtBefore(
  startDate: Date,
  lessonDays: readonly number[],
  date: Date,
  totalLessons: number
): number {
  const day = startOfUtcDay(date).getTime();
  let taught = 0;
  while (taught < totalLessons && lessonDate(startDate, lessonDays, taught + 1).getTime() < day) {
    taught++;
  }
  return taught;
}

/** True when the cohort has a lesson on `date`'s UTC day. */
export function isLessonDay(startDate: Date, lessonDays: readonly number[], date: Date): boolean {
  const day = startOfUtcDay(date);
  return day.getTime() >= startOfUtcDay(startDate).getTime() && normalizeLessonDays(lessonDays).includes(day.getUTCDay());
}
