import { describe, expect, it } from 'vitest';
import { formatTashkentDateTime } from './uzDate';

describe('formatTashkentDateTime', () => {
  it('shows the homework deadline on the Tashkent clock', () => {
    expect(formatTashkentDateTime('2026-11-13T18:59:59.999Z')).toBe('Juma, 13-noyabr, 23:59');
  });

  it('rolls the day over at Tashkent midnight, not UTC', () => {
    expect(formatTashkentDateTime('2026-12-31T19:30:00Z')).toBe('Juma, 1-yanvar, 00:30');
  });
});
