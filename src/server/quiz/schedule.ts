/**
 * Spaced-repetition scheduler for lesson quizzes.
 *
 * Pure functions only: no Prisma, no IO, no `Date.now()`. The caller always
 * supplies `now`, which keeps the behaviour deterministic and testable.
 *
 * Evidence base: retrieval practice with expanding spacing beats rereading on
 * delayed retention, and interleaving older material with new material beats
 * blocked study of a single lesson.
 */

/** Expanding review ladder, in days, indexed by (streak - 1). Saturates at 30. */
export const REVIEW_INTERVALS_DAYS = [1, 2, 4, 7, 15, 30] as const;

/** A missed question comes back inside the same session, not tomorrow. */
export const RETRY_AFTER_MINUTES = 10;

/** How many due questions from EARLIER lessons get interleaved into a session. */
export const MAX_INTERLEAVED_REVIEW_QUESTIONS = 3;

/** Upper bound on the current lesson's questions in one session. */
export const MAX_CURRENT_LESSON_QUESTIONS = 5;

const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 24 * 60 * MS_PER_MINUTE;

export interface ScheduleState {
  readonly streak: number;
}

export interface NextReview {
  readonly streak: number;
  readonly dueAt: Date;
}

/** A question from an earlier lesson that already has an attempt row. */
export interface DueCandidate<T> {
  readonly item: T;
  readonly dueAt: Date;
}

export interface SelectReviewQuestionsInput<T> {
  /** Questions belonging to the lesson the student is on right now. */
  readonly currentLessonQuestions: readonly T[];
  /** Previously-seen questions from EARLIER lessons, with their due dates. */
  readonly previousLessonCandidates: readonly DueCandidate<T>[];
  readonly now: Date;
  /** Override the interleaving cap (defaults to MAX_INTERLEAVED_REVIEW_QUESTIONS). */
  readonly maxReview?: number;
  /** Override the current-lesson cap (defaults to MAX_CURRENT_LESSON_QUESTIONS). */
  readonly maxCurrent?: number;
}

function intervalDaysFor(streak: number): number {
  const lastIndex = REVIEW_INTERVALS_DAYS.length - 1;
  const index = Math.min(Math.max(streak - 1, 0), lastIndex);
  return REVIEW_INTERVALS_DAYS[index];
}

function assertValidDate(value: Date, label: string): void {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new TypeError(`${label} yaroqli Date bo'lishi kerak`);
  }
}

/**
 * Compute the next streak and due date for a single answered question.
 *
 * Correct  -> streak + 1, next interval from the ladder (saturating at 30 days).
 * Wrong    -> streak resets to 0 and the item returns after RETRY_AFTER_MINUTES.
 *
 * On a correct answer the due date never moves backwards: if the caller passes
 * the previous `dueAt` and it is further out than the freshly computed one, the
 * later of the two wins.
 */
export function nextReview(
  prev: ScheduleState & { readonly dueAt?: Date },
  correct: boolean,
  now: Date,
): NextReview {
  assertValidDate(now, 'now');

  const prevStreak = Number.isFinite(prev.streak) ? Math.max(Math.trunc(prev.streak), 0) : 0;

  if (!correct) {
    return {
      streak: 0,
      dueAt: new Date(now.getTime() + RETRY_AFTER_MINUTES * MS_PER_MINUTE),
    };
  }

  const streak = prevStreak + 1;
  const computed = now.getTime() + intervalDaysFor(streak) * MS_PER_DAY;
  const floor =
    prev.dueAt instanceof Date && !Number.isNaN(prev.dueAt.getTime()) ? prev.dueAt.getTime() : computed;

  return { streak, dueAt: new Date(Math.max(computed, floor)) };
}

/** True when the attempt is due for review at `now` (inclusive at the boundary). */
export function isDue(attempt: { readonly dueAt: Date }, now: Date): boolean {
  assertValidDate(now, 'now');
  assertValidDate(attempt.dueAt, 'dueAt');
  return attempt.dueAt.getTime() <= now.getTime();
}

/**
 * Interleaving policy: up to `maxReview` due questions from earlier lessons
 * (oldest due first) come FIRST, then up to `maxCurrent` of the current
 * lesson's questions. Order within each group is stable.
 *
 * Handles the "no previous questions yet" case (lesson 1, or lessons whose
 * questions have never been seen) by simply returning the current lesson's set.
 */
export function selectReviewQuestions<T>(input: SelectReviewQuestionsInput<T>): T[] {
  const {
    currentLessonQuestions,
    previousLessonCandidates,
    now,
    maxReview = MAX_INTERLEAVED_REVIEW_QUESTIONS,
    maxCurrent = MAX_CURRENT_LESSON_QUESTIONS,
  } = input;

  assertValidDate(now, 'now');

  const reviewSlots = Math.max(maxReview, 0);
  const currentSlots = Math.max(maxCurrent, 0);

  const due = previousLessonCandidates
    .filter((candidate) => isDue(candidate, now))
    .slice()
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
    .slice(0, reviewSlots)
    .map((candidate) => candidate.item);

  return [...due, ...currentLessonQuestions.slice(0, currentSlots)];
}
