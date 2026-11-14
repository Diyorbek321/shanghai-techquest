/**
 * Which lessons a cohort's current homework set covers, and when it is due.
 *
 * A set is one run of consecutive lesson days — a weekend cohort's Saturday +
 * Sunday (three lessons), or a single lesson for a Mon/Wed/Fri cohort. It opens
 * the day after the run ends and is due at 23:59 Tashkent on the evening
 * before the next lesson, so a weekend cohort's work is due Friday night and
 * the teacher walks into Saturday's class with the results already in.
 *
 * Pure functions only: dates are calendar dates carried as midnight UTC, as in
 * lessons/schedule.ts; only `dueAt` is a real instant.
 */
import { isLessonDay, latestLessonBlock, lessonDate } from '../lessons/schedule';
import { TASHKENT_UTC_OFFSET_MINUTES } from '../utils/dayKey';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
/** The course's final block has no next lesson to be due before. */
export const LAST_BLOCK_DAYS = 7;

export interface HomeworkBlock {
  /** First and last lesson order covered, inclusive. */
  readonly from: number;
  readonly to: number;
  /** YYYY-MM-DD: the day after the block's last lesson. */
  readonly opensOn: string;
  /** 23:59:59.999 Tashkent on the evening before the next lesson. */
  readonly dueAt: Date;
}

const shift = (date: Date, days: number): Date => new Date(date.getTime() + days * MS_PER_DAY);

/** The last millisecond of a calendar day, on Tashkent time. */
const endOfTashkentDay = (day: Date): Date =>
  new Date(shift(day, 1).getTime() - TASHKENT_UTC_OFFSET_MINUTES * 60_000 - 1);

/**
 * The set in force on `today`, or null before the first block is over.
 *
 * While a block is still running (Sunday, after Saturday's lesson) the previous
 * one stays current: a set never opens with half a weekend in it.
 */
export function homeworkBlock(
  startDate: Date,
  lessonDays: readonly number[],
  today: Date,
  totalLessons: number
): HomeworkBlock | null {
  let block = latestLessonBlock(startDate, lessonDays, today, totalLessons);
  if (!block) return null;

  const stillRunning =
    block.to < totalLessons &&
    isLessonDay(startDate, lessonDays, today) &&
    lessonDate(startDate, lessonDays, block.to).getTime() === shift(today, -1).getTime();
  if (stillRunning) {
    block = latestLessonBlock(startDate, lessonDays, lessonDate(startDate, lessonDays, block.from), totalLessons);
    if (!block) return null;
  }

  return withDates(startDate, lessonDays, block, totalLessons);
}

function withDates(
  startDate: Date,
  lessonDays: readonly number[],
  block: { from: number; to: number },
  totalLessons: number
): HomeworkBlock {
  const lastDay = lessonDate(startDate, lessonDays, block.to);
  const dueAt =
    block.to < totalLessons
      ? endOfTashkentDay(shift(lessonDate(startDate, lessonDays, block.to + 1), -1))
      : endOfTashkentDay(shift(lastDay, LAST_BLOCK_DAYS));

  return {
    from: block.from,
    to: block.to,
    opensOn: shift(lastDay, 1).toISOString().slice(0, 10),
    dueAt,
  };
}

/** A run of lesson days never spans more than a week. */
const MAX_BLOCK_DAYS = 7;

/**
 * The set lesson `order` belongs to — known from the timetable before the set
 * opens. A student who answers Saturday's questions on Saturday evening is
 * graded on THAT answer: waiting for Monday would let them see every key over
 * the weekend and then "first-answer" the set perfectly.
 */
export function blockContaining(
  startDate: Date,
  lessonDays: readonly number[],
  order: number,
  totalLessons: number
): HomeworkBlock | null {
  if (!Number.isInteger(order) || order < 1 || order > totalLessons) return null;
  let end = lessonDate(startDate, lessonDays, order);
  for (let i = 0; i < MAX_BLOCK_DAYS && isLessonDay(startDate, lessonDays, shift(end, 1)); i++) {
    end = shift(end, 1);
  }
  const block = latestLessonBlock(startDate, lessonDays, shift(end, 1), totalLessons);
  return block ? withDates(startDate, lessonDays, block, totalLessons) : null;
}
