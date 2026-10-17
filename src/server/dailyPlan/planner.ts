/**
 * Picks what a student works on each day, and decides whether they did it.
 *
 * Pure functions only: no Prisma, no `Date.now()` — the route supplies every
 * input, the same way quiz/schedule.ts is kept testable.
 *
 * The cohort may meet only twice a week (a weekend cohort holds three lessons
 * on Saturday and Sunday), so the practice has to live on the days between.
 * Every item is something the server checks by itself — a problem against its
 * test cases, a quiz question against its answer key — so a day is never
 * "done" because a student pressed a button.
 */

export type PlanItem =
  | { readonly kind: 'problem'; readonly problemId: string }
  | { readonly kind: 'quiz'; readonly questionIds: readonly string[] };

export interface LessonLinked {
  readonly id: string;
  readonly lessonOrder: number;
}

export interface BuildPlanInput {
  /** The cohort has class today, so the day's practice is kept short. */
  readonly lessonDay: boolean;
  /** Lessons held before today; nothing past this is ever handed out. */
  readonly taughtOrder: number;
  /** Lessons per week, which is how far back "this week's material" reaches. */
  readonly lessonsPerWeek: number;
  /** Lesson problems the student has not passed yet. */
  readonly unsolvedProblems: readonly LessonLinked[];
  /** Spaced-repetition reviews that are due, oldest due first. */
  readonly dueQuestionIds: readonly string[];
  /** Questions from taught lessons the student has never answered. */
  readonly freshQuestions: readonly LessonLinked[];
}

export const FREE_DAY_PROBLEMS = 2;
export const QUIZ_SIZE = 5;

/**
 * Problems in the order they should be worked: this week's lessons first, in
 * the order they were taught, then anything older still unsolved, most recent
 * first. A student who is behind keeps up with the class and catches up on the
 * side, rather than being parked on month-old material forever.
 */
function orderProblems(input: BuildPlanInput): LessonLinked[] {
  const taught = input.unsolvedProblems.filter((p) => p.lessonOrder >= 1 && p.lessonOrder <= input.taughtOrder);
  const weekStart = input.taughtOrder - Math.max(input.lessonsPerWeek, 1);
  const thisWeek = taught.filter((p) => p.lessonOrder > weekStart).sort((a, b) => a.lessonOrder - b.lessonOrder);
  const older = taught.filter((p) => p.lessonOrder <= weekStart).sort((a, b) => b.lessonOrder - a.lessonOrder);
  return [...thisWeek, ...older];
}

function pickQuestions(input: BuildPlanInput): string[] {
  const fresh = input.freshQuestions
    .filter((q) => q.lessonOrder >= 1 && q.lessonOrder <= input.taughtOrder)
    .sort((a, b) => b.lessonOrder - a.lessonOrder)
    .map((q) => q.id);
  return [...new Set([...input.dueQuestionIds, ...fresh])].slice(0, QUIZ_SIZE);
}

export function buildDailyPlan(input: BuildPlanInput): PlanItem[] {
  if (input.taughtOrder < 1) return [];

  const questionIds = pickQuestions(input);
  const problemSlots = input.lessonDay ? (questionIds.length > 0 ? 0 : 1) : FREE_DAY_PROBLEMS;
  const problems: PlanItem[] = orderProblems(input)
    .slice(0, problemSlots)
    .map((p) => ({ kind: 'problem', problemId: p.id }));

  return questionIds.length > 0 ? [...problems, { kind: 'quiz', questionIds }] : problems;
}

export interface AttemptState {
  readonly correct: boolean;
  readonly answeredAt: Date;
}

export interface EvaluationInput {
  readonly passedProblemIds: ReadonlySet<string>;
  readonly attempts: ReadonlyMap<string, AttemptState>;
  /** Start of the plan's own day; quiz answers before it do not count. */
  readonly dayStart: Date;
}

export type EvaluatedItem =
  | (PlanItem & { kind: 'problem'; done: boolean })
  | (PlanItem & { kind: 'quiz'; done: boolean; answeredCorrectly: number; total: number });

export interface Evaluation {
  readonly done: boolean;
  readonly items: EvaluatedItem[];
}

/**
 * A problem is done once any submission passed its tests. A quiz is done once
 * every question's latest answer, given on or after the plan's day, is right —
 * a wrong answer comes back with its explanation and can be retried, so the
 * bar is getting it right, not getting it right first time.
 */
export function evaluatePlan(items: readonly PlanItem[], input: EvaluationInput): Evaluation {
  const evaluated: EvaluatedItem[] = items.map((item) => {
    if (item.kind === 'problem') {
      return { ...item, done: input.passedProblemIds.has(item.problemId) };
    }
    const answeredCorrectly = item.questionIds.filter((id) => {
      const attempt = input.attempts.get(id);
      return attempt !== undefined && attempt.correct && attempt.answeredAt.getTime() >= input.dayStart.getTime();
    }).length;
    return { ...item, done: answeredCorrectly === item.questionIds.length, answeredCorrectly, total: item.questionIds.length };
  });
  return { done: evaluated.length > 0 && evaluated.every((item) => item.done), items: evaluated };
}

/** Stored JSON is re-validated on read; a bad row is dropped, not trusted. */
export function parsePlanItems(raw: unknown): PlanItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry): PlanItem[] => {
    if (typeof entry !== 'object' || entry === null) return [];
    const row = entry as Record<string, unknown>;
    if (row.kind === 'problem' && typeof row.problemId === 'string') {
      return [{ kind: 'problem', problemId: row.problemId }];
    }
    if (
      row.kind === 'quiz' &&
      Array.isArray(row.questionIds) &&
      row.questionIds.length > 0 &&
      row.questionIds.every((id) => typeof id === 'string')
    ) {
      return [{ kind: 'quiz', questionIds: row.questionIds as string[] }];
    }
    return [];
  });
}
