/**
 * Finds lesson problems and quiz questions whose numbers suggest the content
 * itself is wrong — a broken test, a wrong answer key, an unclear statement —
 * rather than that the students are weak.
 *
 * Pure functions only: the route gathers the counts, this decides what to
 * flag. A flag is a reason for the teacher to look, never an automatic edit.
 */

/** Below this many students, a bad rate is noise rather than a signal. */
export const MIN_SAMPLE = 5;
/** Fewer than this share of trying students solving it is suspicious. */
export const LOW_SOLVE_RATE = 0.3;
/** Fewer than this share of answers being right suggests a wrong key. */
export const LOW_CORRECT_RATE = 0.3;
/** At or below this, a quiz question is almost certainly broken. */
export const BROKEN_CORRECT_RATE = 0.15;

export type Severity = 'high' | 'medium';

export type ProblemFlag = 'no_tests' | 'nobody_solves' | 'easy_but_unsolved' | 'low_solve_rate';
export type QuestionFlag = 'mostly_wrong';

export interface ProblemStats {
  readonly id: string;
  readonly title: string;
  readonly difficulty: string;
  readonly lessonOrder: number;
  readonly lessonTitle: string;
  readonly testCount: number;
  /** Distinct students who submitted written code. */
  readonly attempted: number;
  /** Distinct students with a passing submission. */
  readonly solved: number;
  readonly submissions: number;
}

export interface QuestionStats {
  readonly id: string;
  readonly prompt: string;
  readonly lessonOrder: number;
  readonly lessonTitle: string;
  /** Distinct students who answered it. */
  readonly students: number;
  readonly timesSeen: number;
  readonly timesCorrect: number;
}

export interface ProblemFinding extends ProblemStats {
  readonly kind: 'problem';
  readonly flag: ProblemFlag;
  readonly severity: Severity;
  readonly solveRate: number | null;
}

export interface QuestionFinding extends QuestionStats {
  readonly kind: 'question';
  readonly flag: QuestionFlag;
  readonly severity: Severity;
  readonly correctRate: number;
}

export type Finding = ProblemFinding | QuestionFinding;

function problemFlag(p: ProblemStats): { flag: ProblemFlag; severity: Severity } | null {
  // No tests means no student can ever pass it: broken whether or not anyone tried.
  if (p.testCount === 0) return { flag: 'no_tests', severity: 'high' };
  if (p.attempted < MIN_SAMPLE) return null;
  if (p.solved === 0) return { flag: 'nobody_solves', severity: 'high' };
  const rate = p.solved / p.attempted;
  if (rate >= LOW_SOLVE_RATE) return null;
  return p.difficulty === 'EASY'
    ? { flag: 'easy_but_unsolved', severity: 'high' }
    : { flag: 'low_solve_rate', severity: 'medium' };
}

export function classifyProblem(p: ProblemStats): ProblemFinding | null {
  const verdict = problemFlag(p);
  if (!verdict) return null;
  return { ...p, kind: 'problem', ...verdict, solveRate: p.attempted > 0 ? p.solved / p.attempted : null };
}

export function classifyQuestion(q: QuestionStats): QuestionFinding | null {
  if (q.students < MIN_SAMPLE || q.timesSeen === 0) return null;
  const correctRate = q.timesCorrect / q.timesSeen;
  if (correctRate >= LOW_CORRECT_RATE) return null;
  return {
    ...q,
    kind: 'question',
    flag: 'mostly_wrong',
    severity: correctRate <= BROKEN_CORRECT_RATE ? 'high' : 'medium',
    correctRate,
  };
}

const SEVERITY_RANK: Record<Severity, number> = { high: 0, medium: 1 };

/** Worst first, then in course order, so the teacher fixes what hurts most. */
export function findContentIssues(problems: readonly ProblemStats[], questions: readonly QuestionStats[]): Finding[] {
  const findings: Finding[] = [
    ...problems.map(classifyProblem).filter((f): f is ProblemFinding => f !== null),
    ...questions.map(classifyQuestion).filter((f): f is QuestionFinding => f !== null),
  ];
  return [...findings].sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || a.lessonOrder - b.lessonOrder
  );
}
