import { describe, expect, it } from 'vitest';
import { calendarDate, dayBefore, dayKey, dayStart } from './dayKey';

describe('dayKey (Tashkent time)', () => {
  it('turns the day over at Tashkent midnight, not UTC midnight', () => {
    // 23:59 and 00:00 in Tashkent are 18:59 and 19:00 UTC.
    expect(dayKey(new Date('2026-10-17T18:59:59.999Z'))).toBe('2026-10-17');
    expect(dayKey(new Date('2026-10-17T19:00:00.000Z'))).toBe('2026-10-18');
    // 03:00 Tashkent is still the same day it was at 01:00 — the old UTC
    // boundary put it on the previous day until 05:00.
    expect(dayKey(new Date('2026-10-17T22:00:00.000Z'))).toBe('2026-10-18');
  });

  it('starts the day at the Tashkent midnight instant', () => {
    expect(dayStart('2026-10-18').toISOString()).toBe('2026-10-17T19:00:00.000Z');
    expect(dayKey(dayStart('2026-10-18'))).toBe('2026-10-18');
  });

  it('steps back across month boundaries and keeps calendar dates in UTC', () => {
    expect(dayBefore('2026-11-01')).toBe('2026-10-31');
    expect(calendarDate('2026-10-18').getUTCDay()).toBe(0);
  });
});
