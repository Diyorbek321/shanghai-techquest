import { describe, expect, it } from 'vitest';
import { DEFAULT_LESSON_DAYS, lessonDate, lessonDueDate } from './schedule';

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

  it('ignores duplicate and unsorted lesson days', () => {
    expect(iso(lessonDate(MONDAY, [5, 1, 3, 1], 2))).toBe('2026-09-09');
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
    expect(due.getTime()).toBe(lessonDate(MONDAY, DEFAULT_LESSON_DAYS, 2).getTime() - 1);
  });

  it('gives the last lesson a deadline after the course ends', () => {
    const due = lessonDueDate(MONDAY, DEFAULT_LESSON_DAYS, 96);
    expect(due.getTime()).toBeGreaterThan(lessonDate(MONDAY, DEFAULT_LESSON_DAYS, 96).getTime());
  });
});
