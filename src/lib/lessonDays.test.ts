import { describe, expect, it } from 'vitest';
import { countsFromLessonDays, describeLessonDays, lessonDaysFromCounts } from './lessonDays';

describe('lessonDays', () => {
  it('round-trips a weekend double-lesson timetable', () => {
    const counts = countsFromLessonDays([6, 0, 0]);
    expect(counts).toEqual([2, 0, 0, 0, 0, 0, 1]);
    expect(lessonDaysFromCounts(counts)).toEqual([0, 0, 6]);
  });

  it('caps a weekday at three lessons and ignores invalid days', () => {
    expect(countsFromLessonDays([1, 1, 1, 1, 9, -1])).toEqual([0, 3, 0, 0, 0, 0, 0]);
  });

  it('describes the week Monday-first', () => {
    expect(describeLessonDays([6, 0, 0])).toBe('Sh · Ya ×2 — haftasiga 3 dars');
    expect(describeLessonDays([1, 3, 5])).toBe('Du · Ch · Ju — haftasiga 3 dars');
  });
});
