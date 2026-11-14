import { describe, expect, it } from 'vitest';
import { blockContaining, homeworkBlock } from './block';
import { calendarDate, dayKey } from '../utils/dayKey';

// Weekend cohort: one lesson on Saturday, two on Sunday. Starts Saturday 2026-11-07.
const WEEKEND = [6, 0, 0];
const START = calendarDate('2026-11-07');
const TOTAL = 96;

const block = (today: string, lessonDays = WEEKEND, start = START, total = TOTAL) =>
  homeworkBlock(start, lessonDays, calendarDate(today), total);

describe('homeworkBlock — weekend cohort', () => {
  it('is null before the first weekend is over', () => {
    expect(block('2026-11-06')).toBeNull();
    expect(block('2026-11-07')).toBeNull();
    // Sunday: Saturday's lesson is done, but the weekend is not — no set yet.
    expect(block('2026-11-08')).toBeNull();
  });

  it("opens on Monday with the whole weekend's three lessons, due Friday 23:59 Tashkent", () => {
    const set = block('2026-11-09');
    expect(set).toMatchObject({ from: 1, to: 3, opensOn: '2026-11-09' });
    expect(dayKey(set!.dueAt)).toBe('2026-11-13');
    expect(set!.dueAt.toISOString()).toBe('2026-11-13T18:59:59.999Z');
  });

  it('keeps the same set through Saturday — the teacher reads results before class', () => {
    for (const day of ['2026-11-10', '2026-11-13', '2026-11-14']) {
      expect(block(day)).toMatchObject({ from: 1, to: 3 });
    }
  });

  it('does not open a half-weekend set on Sunday', () => {
    expect(block('2026-11-15')).toMatchObject({ from: 1, to: 3 });
  });

  it('moves to the next weekend on Monday', () => {
    expect(block('2026-11-16')).toMatchObject({ from: 4, to: 6, opensOn: '2026-11-16' });
  });
});

describe('homeworkBlock — other timetables', () => {
  it('gives a Mon/Wed/Fri cohort one lesson per set, due the evening before the next class', () => {
    const start = calendarDate('2026-11-02'); // Monday
    const set = homeworkBlock(start, [1, 3, 5], calendarDate('2026-11-03'), TOTAL);
    expect(set).toMatchObject({ from: 1, to: 1, opensOn: '2026-11-03' });
    expect(dayKey(set!.dueAt)).toBe('2026-11-03');
  });

  it('gives the last block of the course a week', () => {
    const set = block('2026-11-09', WEEKEND, START, 3);
    expect(set).toMatchObject({ from: 1, to: 3 });
    expect(dayKey(set!.dueAt)).toBe('2026-11-15');
  });
});

describe('blockContaining — which set a lesson belongs to, even before it opens', () => {
  it("puts Saturday's and Sunday's lessons in the same weekend set", () => {
    for (const order of [1, 2, 3]) {
      const set = blockContaining(START, WEEKEND, order, TOTAL);
      expect(set).toMatchObject({ from: 1, to: 3, opensOn: '2026-11-09' });
      expect(dayKey(set!.dueAt)).toBe('2026-11-13');
    }
    expect(blockContaining(START, WEEKEND, 4, TOTAL)).toMatchObject({ from: 4, to: 6 });
  });

  it('agrees with homeworkBlock once the block is over', () => {
    expect(blockContaining(START, WEEKEND, 5, TOTAL)).toEqual(block('2026-11-16'));
  });

  it('stops at the end of the course', () => {
    expect(blockContaining(START, WEEKEND, 3, 2)).toBeNull();
    expect(blockContaining(START, WEEKEND, 2, 2)).toMatchObject({ from: 1, to: 2 });
  });
});
