import { describe, expect, it } from 'vitest';
import { assignReviews, type Submitter } from './assign';

const sub = (userId: string, partnerId: string | null = null): Submitter => ({
  submissionId: `s-${userId}`,
  userId,
  partnerId,
});

const cohort = (n: number) => Array.from({ length: n }, (_, i) => sub(`u${String(i).padStart(2, '0')}`));

describe('assignReviews', () => {
  it('never assigns a student their own work', () => {
    for (const a of assignReviews(cohort(6), 2)) expect(a.reviewerId).not.toBe(a.authorId);
  });

  // A random draw only balances on average — and the student who received no
  // review is the one who notices.
  it('gives every student the same number to do and to receive', () => {
    const plan = assignReviews(cohort(7), 2);
    const given = new Map<string, number>();
    const received = new Map<string, number>();
    for (const a of plan) {
      given.set(a.reviewerId, (given.get(a.reviewerId) ?? 0) + 1);
      received.set(a.authorId, (received.get(a.authorId) ?? 0) + 1);
    }
    expect([...given.values()]).toEqual(Array(7).fill(2));
    expect([...received.values()]).toEqual(Array(7).fill(2));
  });

  // A pair's two rows are the same work, so reviewing a partner is self-review.
  it('never pairs a student with their pair-programming partner', () => {
    const plan = assignReviews([sub('a', 'b'), sub('b', 'a'), sub('c'), sub('d')], 1);
    for (const a of plan) {
      if (a.reviewerId === 'a') expect(a.authorId).not.toBe('b');
      if (a.reviewerId === 'b') expect(a.authorId).not.toBe('a');
    }
  });

  it('is reproducible, so a reload shows the same work', () => {
    const first = assignReviews(cohort(5), 2);
    const shuffled = [...cohort(5)].reverse();
    expect(assignReviews(shuffled, 2)).toEqual(first);
  });

  it('assigns nothing when there is nobody else to review', () => {
    expect(assignReviews([sub('solo')], 2)).toEqual([]);
    expect(assignReviews([sub('a', 'b'), sub('b', 'a')], 1)).toEqual([]);
  });

  it('caps at the cohort size rather than repeating a classmate', () => {
    const plan = assignReviews(cohort(3), 5);
    const forOne = plan.filter((a) => a.reviewerId === 'u00');
    expect(forOne).toHaveLength(2);
    expect(new Set(forOne.map((a) => a.authorId)).size).toBe(2);
  });

  it('assigns nothing for a non-positive review count', () => {
    expect(assignReviews(cohort(4), 0)).toEqual([]);
  });
});
