import { describe, expect, it } from 'vitest';
import { backendLessons } from '../../../prisma/lessonsData/backend';
import { backendLessonOutput } from '../../../prisma/lessonsData/backendOutput';
import { OUTPUT_ORDER_BASE } from '../../../prisma/lessonsData/types';
import { validateOutputRecord } from '../quiz/output';

/**
 * Static checks on the "Kod nima chiqaradi?" bank. That each snippet really
 * prints its expectedOutput is proven separately on Python 3.10 by
 * scripts/verifyOutputQuestions.ts — vitest does not assume Python is installed.
 */
describe('backend output question data', () => {
  it('only references existing lessons', () => {
    const keys = new Set(backendLessons.map((l) => l.key));
    expect(backendLessonOutput.filter((q) => !keys.has(q.lessonKey))).toEqual([]);
  });

  it('numbers each lesson 101, 102, ... without gaps, clear of the choice questions', () => {
    const byLesson = new Map<string, number[]>();
    for (const q of backendLessonOutput) byLesson.set(q.lessonKey, [...(byLesson.get(q.lessonKey) ?? []), q.order]);
    for (const [key, orders] of byLesson) {
      expect(orders, key).toEqual(orders.map((_, i) => OUTPUT_ORDER_BASE + i + 1));
    }
  });

  it('passes the content rules every record is seeded under', () => {
    const bad = backendLessonOutput
      .map((q) => ({ where: `${q.lessonKey} #${q.order}`, problems: validateOutputRecord(q) }))
      .filter((row) => row.problems.length > 0);
    expect(bad).toEqual([]);
  });

  it('does not repeat a snippet inside one lesson', () => {
    const seen = new Set<string>();
    const repeats = backendLessonOutput.filter((q) => {
      const id = `${q.lessonKey}\n${q.code}`;
      const repeated = seen.has(id);
      seen.add(id);
      return repeated;
    });
    expect(repeats).toEqual([]);
  });

  it('covers lessons 1..33 except the pip lesson (21), five each', () => {
    const counts = new Map<string, number>();
    for (const q of backendLessonOutput) counts.set(q.lessonKey, (counts.get(q.lessonKey) ?? 0) + 1);
    const expected = Array.from({ length: 33 }, (_, i) => i + 1)
      .filter((order) => order !== 21)
      .map((order) => `backend-dars-${String(order).padStart(2, '0')}`);
    expect([...counts.keys()].sort()).toEqual(expected);
    expect([...new Set(counts.values())]).toEqual([5]);
  });
});
