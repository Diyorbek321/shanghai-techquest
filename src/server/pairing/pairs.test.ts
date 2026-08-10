import { describe, expect, it } from 'vitest';
import { suggestPairs, type Pairable } from './pairs';

const s = (id: string, score: number): Pairable => ({ id, name: id, score });

describe('suggestPairs', () => {
  it('pairs adjacent skill levels, not strongest with weakest', () => {
    const plan = suggestPairs([s('a', 10), s('b', 90), s('c', 20), s('d', 80)]);

    expect(plan.pairs).toHaveLength(2);
    expect(plan.pairs[0].gap).toBe(10);
    expect(plan.pairs[1].gap).toBe(10);
    // The failure mode being avoided: 10 paired with 90.
    for (const pair of plan.pairs) expect(pair.gap).toBeLessThan(70);
  });

  // A strong student alone for one session loses less than a struggling student
  // left without a partner — and the struggling one is who pairing is for.
  it('leaves the highest scorer unpaired when the class is odd', () => {
    const plan = suggestPairs([s('weak', 5), s('mid', 50), s('strong', 95)]);

    expect(plan.unpaired?.id).toBe('strong');
    expect(plan.pairs[0].a.id).toBe('weak');
    expect(plan.pairs[0].b.id).toBe('mid');
  });

  it('is stable when scores tie', () => {
    const first = suggestPairs([s('b', 10), s('a', 10), s('c', 10), s('d', 10)]);
    const second = suggestPairs([s('d', 10), s('c', 10), s('b', 10), s('a', 10)]);
    expect(first.pairs.map((p) => [p.a.id, p.b.id])).toEqual(second.pairs.map((p) => [p.a.id, p.b.id]));
  });

  it('handles an empty and a single-student class', () => {
    expect(suggestPairs([])).toEqual({ pairs: [], unpaired: null });
    expect(suggestPairs([s('only', 1)]).unpaired?.id).toBe('only');
  });
});
