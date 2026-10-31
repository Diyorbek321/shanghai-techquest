import { describe, expect, it } from 'vitest';
import { backendLessons } from '../../../prisma/lessonsData/backend';
import { backendLessonQuiz } from '../../../prisma/lessonsData/backendQuiz';

/** A full Jonli viktorina round needs at least this many questions per lesson. */
const MIN_QUESTIONS_PER_LESSON = 10;

describe('backend lesson quiz data', () => {
  it(`gives every lesson at least ${MIN_QUESTIONS_PER_LESSON} questions with gapless orders`, () => {
    for (const lesson of backendLessons) {
      const orders = backendLessonQuiz
        .filter((q) => q.lessonKey === lesson.key)
        .map((q) => q.order)
        .sort((a, b) => a - b);
      expect(orders.length, lesson.key).toBeGreaterThanOrEqual(MIN_QUESTIONS_PER_LESSON);
      expect(orders, lesson.key).toEqual(Array.from({ length: orders.length }, (_, i) => i + 1));
    }
  });

  it('only references existing lessons', () => {
    const keys = new Set(backendLessons.map((l) => l.key));
    expect(backendLessonQuiz.filter((q) => !keys.has(q.lessonKey))).toEqual([]);
  });

  it('has four non-empty distinct choices and a valid correctIndex', () => {
    for (const q of backendLessonQuiz) {
      const where = `${q.lessonKey} #${q.order}`;
      expect(q.choices, where).toHaveLength(4);
      expect(q.choices.every((c) => c.trim().length > 0), where).toBe(true);
      // Compared verbatim: a strip() question may legitimately offer '  ali ' next to 'ali'.
      expect(new Set(q.choices).size, where).toBe(4);
      expect(q.correctIndex >= 0 && q.correctIndex <= 3, where).toBe(true);
      expect(q.prompt.trim().length, where).toBeGreaterThan(0);
      expect(q.explanation.trim().length, where).toBeGreaterThan(0);
    }
  });

  it('does not repeat a prompt inside one lesson', () => {
    const seen = new Set<string>();
    const repeats = backendLessonQuiz
      .map((q) => `${q.lessonKey}::${q.prompt.trim().toLowerCase()}`)
      .filter((k) => (seen.has(k) ? true : (seen.add(k), false)));
    expect(repeats).toEqual([]);
  });
});
