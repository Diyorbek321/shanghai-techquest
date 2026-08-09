import { describe, expect, it } from 'vitest';

import {
  isDue,
  MAX_CURRENT_LESSON_QUESTIONS,
  MAX_INTERLEAVED_REVIEW_QUESTIONS,
  nextReview,
  RETRY_AFTER_MINUTES,
  REVIEW_INTERVALS_DAYS,
  selectReviewQuestions,
} from './schedule';

const NOW = new Date('2026-08-02T09:00:00.000Z');
const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 24 * 60 * MS_PER_MINUTE;

const daysFrom = (base: Date, days: number) => new Date(base.getTime() + days * MS_PER_DAY);

describe('REVIEW_INTERVALS_DAYS', () => {
  it('is the expanding ladder 1/2/4/7/15/30', () => {
    expect([...REVIEW_INTERVALS_DAYS]).toEqual([1, 2, 4, 7, 15, 30]);
  });
});

describe('nextReview - correct answers', () => {
  it.each([
    [0, 1, 1],
    [1, 2, 2],
    [2, 3, 4],
    [3, 4, 7],
    [4, 5, 15],
    [5, 6, 30],
  ])('streak %i -> %i, due in %i day(s)', (prevStreak, expectedStreak, expectedDays) => {
    const result = nextReview({ streak: prevStreak }, true, NOW);
    expect(result.streak).toBe(expectedStreak);
    expect(result.dueAt.toISOString()).toBe(daysFrom(NOW, expectedDays).toISOString());
  });

  it('saturates at 30 days once the ladder is exhausted', () => {
    for (const prevStreak of [6, 7, 12, 100]) {
      const result = nextReview({ streak: prevStreak }, true, NOW);
      expect(result.streak).toBe(prevStreak + 1);
      expect(result.dueAt.toISOString()).toBe(daysFrom(NOW, 30).toISOString());
    }
  });

  it('never moves dueAt backwards when the stored dueAt is further out', () => {
    const storedDue = daysFrom(NOW, 20);
    const result = nextReview({ streak: 0, dueAt: storedDue }, true, NOW);

    expect(result.streak).toBe(1);
    expect(result.dueAt.toISOString()).toBe(storedDue.toISOString());
    expect(result.dueAt.getTime()).toBeGreaterThanOrEqual(NOW.getTime());
  });

  it('uses the fresh interval when the stored dueAt is in the past', () => {
    const result = nextReview({ streak: 2, dueAt: daysFrom(NOW, -5) }, true, NOW);
    expect(result.dueAt.toISOString()).toBe(daysFrom(NOW, 4).toISOString());
  });

  it('does not mutate the input state', () => {
    const prev = { streak: 3 };
    nextReview(prev, true, NOW);
    expect(prev).toEqual({ streak: 3 });
  });
});

describe('nextReview - wrong answers', () => {
  it('resets the streak to 0 and requeues the same day', () => {
    const result = nextReview({ streak: 5 }, false, NOW);
    expect(result.streak).toBe(0);
    expect(result.dueAt.toISOString()).toBe(
      new Date(NOW.getTime() + RETRY_AFTER_MINUTES * MS_PER_MINUTE).toISOString(),
    );
    expect(result.dueAt.getTime() - NOW.getTime()).toBeLessThan(MS_PER_DAY);
  });

  it('ignores a far-future stored dueAt so the retry stays in-session', () => {
    const result = nextReview({ streak: 4, dueAt: daysFrom(NOW, 30) }, false, NOW);
    expect(result.streak).toBe(0);
    expect(result.dueAt.getTime()).toBe(NOW.getTime() + RETRY_AFTER_MINUTES * MS_PER_MINUTE);
  });

  it('a reset streak climbs the ladder again from 1 day', () => {
    const missed = nextReview({ streak: 5 }, false, NOW);
    const recovered = nextReview(missed, true, NOW);
    expect(recovered.streak).toBe(1);
    expect(recovered.dueAt.toISOString()).toBe(daysFrom(NOW, 1).toISOString());
  });
});

describe('isDue', () => {
  it('is true exactly at the dueAt boundary', () => {
    expect(isDue({ dueAt: new Date(NOW.getTime()) }, NOW)).toBe(true);
  });

  it('is true one millisecond after dueAt', () => {
    expect(isDue({ dueAt: new Date(NOW.getTime() - 1) }, NOW)).toBe(true);
  });

  it('is false one millisecond before dueAt', () => {
    expect(isDue({ dueAt: new Date(NOW.getTime() + 1) }, NOW)).toBe(false);
  });

  it('rejects invalid dates explicitly', () => {
    expect(() => isDue({ dueAt: new Date('nope') }, NOW)).toThrow(TypeError);
  });
});

describe('selectReviewQuestions', () => {
  const current = ['c1', 'c2', 'c3', 'c4', 'c5'];

  const candidate = (item: string, days: number) => ({ item, dueAt: daysFrom(NOW, days) });

  it('caps interleaved reviews and puts the oldest due first', () => {
    const result = selectReviewQuestions({
      currentLessonQuestions: current,
      previousLessonCandidates: [
        candidate('p-newest', -1),
        candidate('p-oldest', -30),
        candidate('p-mid', -10),
        candidate('p-extra', -5),
        candidate('p-extra2', -4),
      ],
      now: NOW,
    });

    expect(MAX_INTERLEAVED_REVIEW_QUESTIONS).toBe(3);
    expect(result.slice(0, 3)).toEqual(['p-oldest', 'p-mid', 'p-extra']);
    expect(result.slice(3)).toEqual(current);
    expect(result).toHaveLength(3 + current.length);
  });

  it('excludes questions that are not due yet', () => {
    const result = selectReviewQuestions({
      currentLessonQuestions: current,
      previousLessonCandidates: [candidate('future-1', 3), candidate('due-1', -2), candidate('future-2', 9)],
      now: NOW,
    });

    expect(result).toEqual(['due-1', ...current]);
  });

  it('includes a question whose dueAt is exactly now', () => {
    const result = selectReviewQuestions({
      currentLessonQuestions: ['c1'],
      previousLessonCandidates: [{ item: 'boundary', dueAt: new Date(NOW.getTime()) }],
      now: NOW,
    });

    expect(result).toEqual(['boundary', 'c1']);
  });

  it('returns only the current lesson when nothing is due', () => {
    const result = selectReviewQuestions({
      currentLessonQuestions: current,
      previousLessonCandidates: [candidate('future', 5)],
      now: NOW,
    });

    expect(result).toEqual(current);
  });

  it('handles fewer due questions than the cap', () => {
    const result = selectReviewQuestions({
      currentLessonQuestions: current,
      previousLessonCandidates: [candidate('p1', -1), candidate('p2', -2)],
      now: NOW,
    });

    expect(result).toEqual(['p2', 'p1', ...current]);
  });

  it('handles an empty previous pool (first lesson)', () => {
    const result = selectReviewQuestions({
      currentLessonQuestions: current,
      previousLessonCandidates: [],
      now: NOW,
    });

    expect(result).toEqual(current);
  });

  it('handles a lesson with no questions of its own', () => {
    const result = selectReviewQuestions({
      currentLessonQuestions: [],
      previousLessonCandidates: [candidate('p1', -1)],
      now: NOW,
    });

    expect(result).toEqual(['p1']);
  });

  it('caps the current lesson questions', () => {
    expect(MAX_CURRENT_LESSON_QUESTIONS).toBe(5);
    const result = selectReviewQuestions({
      currentLessonQuestions: [...current, 'c6', 'c7'],
      previousLessonCandidates: [],
      now: NOW,
    });

    expect(result).toEqual(current);
  });

  it('respects explicit cap overrides', () => {
    const result = selectReviewQuestions({
      currentLessonQuestions: current,
      previousLessonCandidates: [candidate('p1', -1), candidate('p2', -2)],
      now: NOW,
      maxReview: 1,
      maxCurrent: 2,
    });

    expect(result).toEqual(['p2', 'c1', 'c2']);
  });

  it('does not mutate the caller arrays', () => {
    const candidates = [candidate('p1', -1), candidate('p2', -9)];
    const snapshot = candidates.map((c) => c.item);
    const currentCopy = [...current];

    selectReviewQuestions({
      currentLessonQuestions: currentCopy,
      previousLessonCandidates: candidates,
      now: NOW,
    });

    expect(candidates.map((c) => c.item)).toEqual(snapshot);
    expect(currentCopy).toEqual(current);
  });

  it('works with object questions, not just strings', () => {
    const q = { id: 'q1', prompt: "O'zgaruvchi nima?" };
    const p = { id: 'q0', prompt: "Massiv nima?" };

    const result = selectReviewQuestions({
      currentLessonQuestions: [q],
      previousLessonCandidates: [{ item: p, dueAt: daysFrom(NOW, -1) }],
      now: NOW,
    });

    expect(result).toEqual([p, q]);
  });
});
