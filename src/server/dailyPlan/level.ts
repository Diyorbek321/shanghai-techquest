/**
 * How the student is doing lately, judged only from their own recent code
 * submissions, so the daily plan can lead a struggling student with the
 * easier problems and a strong one with the harder ones.
 *
 * It only reorders the problems a student already owes — nothing is skipped
 * and nothing from an untaught lesson appears — so a wrong guess costs a
 * little pacing, never content.
 */

export type StudentLevel = 'struggling' | 'normal' | 'strong';

/** How far back "lately" reaches. */
export const LEVEL_WINDOW_DAYS = 14;
/** With fewer distinct problems tried than this, there is nothing to judge. */
export const MIN_PROBLEMS_FOR_LEVEL = 3;

export interface RecentWork {
  /** Distinct problems the student submitted code for. */
  readonly attempted: number;
  /** Of those, how many have a passing submission. */
  readonly solved: number;
  /** Every submission in the window, passing or not. */
  readonly submissions: number;
}

export function studentLevel(work: RecentWork): StudentLevel {
  if (work.attempted < MIN_PROBLEMS_FOR_LEVEL) return 'normal';
  const solveRate = work.solved / work.attempted;
  const triesPerProblem = work.submissions / work.attempted;
  if (solveRate < 0.5 || triesPerProblem >= 5) return 'struggling';
  if (solveRate >= 0.9 && triesPerProblem <= 2) return 'strong';
  return 'normal';
}

export interface Submission {
  readonly problemId: string;
  readonly passed: boolean;
}

export function summarizeWork(submissions: readonly Submission[]): RecentWork {
  const attempted = new Set(submissions.map((s) => s.problemId));
  const solved = new Set(submissions.filter((s) => s.passed).map((s) => s.problemId));
  return { attempted: attempted.size, solved: solved.size, submissions: submissions.length };
}

const DIFFICULTY_RANK: Record<string, number> = { EASY: 0, MEDIUM: 1, HARD: 2, EXPERT: 3, MASTER: 4 };

/** Unknown difficulty sits in the middle rather than jumping either end. */
export function difficultyRank(difficulty: string | undefined): number {
  return difficulty !== undefined && difficulty in DIFFICULTY_RANK ? DIFFICULTY_RANK[difficulty] : 1;
}
