import { describe, expect, it } from 'vitest';
import { STARTER_LESSON_WINDOW, eligiblePool } from './progress';

const drill = (lessonOrder: number | null) => ({ lessonOrder });

describe('eligiblePool', () => {
  it('keeps exercises at or below the lesson the student has reached', () => {
    const pool = [drill(1), drill(5), drill(6), drill(90)];
    expect(eligiblePool(pool, 5)).toEqual([drill(1), drill(5)]);
  });

  it('gives a brand-new student the opening lessons rather than nothing', () => {
    // reached = 0 would otherwise filter the whole 96-lesson pool away and the
    // student would see "no exercise today" — exactly the dead loop this fixes.
    const pool = [drill(1), drill(2), drill(3), drill(4), drill(5), drill(40)];
    expect(eligiblePool(pool, 0)).toEqual([drill(1), drill(2), drill(3), drill(4)]);
    expect(STARTER_LESSON_WINDOW).toBe(4);
  });

  it('never widens the window below what the student reached', () => {
    const pool = [drill(1), drill(2), drill(3), drill(4), drill(5)];
    expect(eligiblePool(pool, 2)).toEqual([drill(1), drill(2), drill(3), drill(4)]);
  });

  it('leaves module-based pools untouched', () => {
    // FRONTEND and OFFICE drills carry no lessonOrder; filtering them out would
    // break tracks that work fine today.
    const pool = [drill(null), drill(null)];
    expect(eligiblePool(pool, 0)).toEqual(pool);
  });

  it('mixes lesson drills with module drills', () => {
    const pool = [drill(null), drill(2), drill(70)];
    expect(eligiblePool(pool, 2)).toEqual([drill(null), drill(2)]);
  });

  it('returns the whole pool for a student at the end of the course', () => {
    const pool = [drill(1), drill(50), drill(96)];
    expect(eligiblePool(pool, 96)).toEqual(pool);
  });

  it('falls back to the full pool rather than starving the student', () => {
    // A track whose drills all sit above the window must still serve something.
    const pool = [drill(80), drill(90)];
    expect(eligiblePool(pool, 1)).toEqual(pool);
  });
});
