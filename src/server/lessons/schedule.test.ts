import { describe, expect, it } from 'vitest';
import { DEFAULT_LESSON_DAYS, isLessonDay, lessonDate, lessonDueDate, lessonsTaughtBefore } from './schedule';

// 2026-09-07 is a Monday.
const MONDAY = new Date('2026-09-07T00:00:00.000Z');
const iso = (date: Date) => date.toISOString().slice(0, 10);

describe('lessonDate', () => {
  it('puts the first lesson on the start date when it is a lesson day', () => {
    expect(iso(lessonDate(MONDAY, DEFAULT_LESSON_DAYS, 1))).toBe('2026-09-07');
  });

  it('walks Mon/Wed/Fri within the first week', () => {
    expect(iso(lessonDate(MONDAY, DEFAULT_LESSON_DAYS, 2))).toBe('2026-09-09');
    expect(iso(lessonDate(MONDAY, DEFAULT_LESSON_DAYS, 3))).toBe('2026-09-11');
  });

  it('rolls into the next week after three lessons', () => {
    expect(iso(lessonDate(MONDAY, DEFAULT_LESSON_DAYS, 4))).toBe('2026-09-14');
  });

  it('spans 32 weeks across the 96-lesson course', () => {
    const last = lessonDate(MONDAY, DEFAULT_LESSON_DAYS, 96);
    expect(iso(last)).toBe('2027-04-16');
    // 96 lessons at 3/week = 32 weeks: the last lesson is the Friday of week 32,
    // i.e. 31 whole weeks after the Monday the course started.
    const wholeWeeks = Math.floor((last.getTime() - MONDAY.getTime()) / (7 * 24 * 3600 * 1000));
    expect(wholeWeeks).toBe(31);
  });

  it('skips forward when the start date is not a lesson day', () => {
    const sunday = new Date('2026-09-06T00:00:00.000Z');
    expect(iso(lessonDate(sunday, DEFAULT_LESSON_DAYS, 1))).toBe('2026-09-07');
  });

  it('starts mid-week without losing lessons', () => {
    const wednesday = new Date('2026-09-09T00:00:00.000Z');
    expect(iso(lessonDate(wednesday, DEFAULT_LESSON_DAYS, 1))).toBe('2026-09-09');
    expect(iso(lessonDate(wednesday, DEFAULT_LESSON_DAYS, 2))).toBe('2026-09-11');
    expect(iso(lessonDate(wednesday, DEFAULT_LESSON_DAYS, 3))).toBe('2026-09-14');
  });

  it('supports schedules other than three days a week', () => {
    expect(iso(lessonDate(MONDAY, [2, 4], 1))).toBe('2026-09-08');
    expect(iso(lessonDate(MONDAY, [2, 4], 2))).toBe('2026-09-10');
    expect(iso(lessonDate(MONDAY, [2, 4], 3))).toBe('2026-09-15');
  });

  it('ignores unsorted lesson days', () => {
    expect(iso(lessonDate(MONDAY, [5, 1, 3], 2))).toBe('2026-09-09');
  });

  it('holds two lessons on a weekday listed twice', () => {
    // Saturday 1.5h = one lesson, Sunday 3h = two lessons back to back.
    const weekend = [6, 0, 0];
    const saturday = new Date('2026-09-12T00:00:00.000Z');
    expect(iso(lessonDate(saturday, weekend, 1))).toBe('2026-09-12');
    expect(iso(lessonDate(saturday, weekend, 2))).toBe('2026-09-13');
    expect(iso(lessonDate(saturday, weekend, 3))).toBe('2026-09-13');
    expect(iso(lessonDate(saturday, weekend, 4))).toBe('2026-09-19');
  });

  it('keeps a weekend double-lesson course at 32 weeks', () => {
    const saturday = new Date('2026-09-12T00:00:00.000Z');
    const last = lessonDate(saturday, [6, 0, 0], 96);
    const wholeWeeks = Math.floor((last.getTime() - saturday.getTime()) / (7 * 24 * 3600 * 1000));
    expect(wholeWeeks).toBe(31);
  });

  it('rejects an empty schedule and a non-positive order', () => {
    expect(() => lessonDate(MONDAY, [], 1)).toThrow();
    expect(() => lessonDate(MONDAY, DEFAULT_LESSON_DAYS, 0)).toThrow();
  });
});

describe('lessonDueDate', () => {
  it('falls just before the next lesson starts', () => {
    const due = lessonDueDate(MONDAY, DEFAULT_LESSON_DAYS, 1);
    expect(iso(due)).toBe('2026-09-08');
    // 23:59:59.999 in Tashkent (UTC+5) on the evening before.
    expect(due.toISOString()).toBe('2026-09-08T18:59:59.999Z');
  });

  it('never gives a homework only one evening when the next lesson is the very next day', () => {
    // Weekend cohort: Saturday's and both Sunday lessons are due on Friday, so
    // the work spreads over the five free weekdays instead of one night.
    const saturday = new Date('2026-09-12T00:00:00.000Z');
    const weekend = [6, 0, 0];
    expect(iso(lessonDueDate(saturday, weekend, 1))).toBe('2026-09-18');
    expect(iso(lessonDueDate(saturday, weekend, 2))).toBe('2026-09-18');
    expect(iso(lessonDueDate(saturday, weekend, 3))).toBe('2026-09-18');
  });

  it('gives the last lesson a deadline after the course ends', () => {
    const due = lessonDueDate(MONDAY, DEFAULT_LESSON_DAYS, 96);
    expect(due.getTime()).toBeGreaterThan(lessonDate(MONDAY, DEFAULT_LESSON_DAYS, 96).getTime());
  });
});

describe('lessonsTaughtBefore', () => {
  const saturday = new Date('2026-09-12T00:00:00.000Z');
  const weekend = [6, 0, 0];
  const day = (value: string) => new Date(`${value}T00:00:00.000Z`);

  it('is zero up to and including the first lesson day', () => {
    expect(lessonsTaughtBefore(saturday, weekend, day('2026-09-01'), 96)).toBe(0);
    expect(lessonsTaughtBefore(saturday, weekend, saturday, 96)).toBe(0);
  });

  it('counts both lessons of a double day once that day is over', () => {
    expect(lessonsTaughtBefore(saturday, weekend, day('2026-09-13'), 96)).toBe(1);
    expect(lessonsTaughtBefore(saturday, weekend, day('2026-09-14'), 96)).toBe(3);
    expect(lessonsTaughtBefore(saturday, weekend, day('2026-09-21'), 96)).toBe(6);
  });

  it('stops at the end of the course', () => {
    expect(lessonsTaughtBefore(saturday, weekend, day('2030-01-01'), 96)).toBe(96);
  });
});

describe('isLessonDay', () => {
  const saturday = new Date('2026-09-12T00:00:00.000Z');

  it('is true only on scheduled weekdays from the start date on', () => {
    expect(isLessonDay(saturday, [6, 0, 0], new Date('2026-09-13T10:00:00.000Z'))).toBe(true);
    expect(isLessonDay(saturday, [6, 0, 0], new Date('2026-09-14T00:00:00.000Z'))).toBe(false);
    expect(isLessonDay(saturday, [6, 0, 0], new Date('2026-09-06T00:00:00.000Z'))).toBe(false);
  });
});
