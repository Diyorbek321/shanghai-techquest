/**
 * Grades one student's homework set. Pure — the caller loads everything.
 *
 * - A question is graded by the student's FIRST answer inside the set. Later
 *   tries still teach (the explanation is shown, spaced repetition brings it
 *   back) but cannot turn a 4-option guess into a guaranteed 100%.
 * - A problem counts once the student's own code passes its tests.
 * - Work finished after the deadline is "done" but earns no grade; `late`
 *   tells the teacher how much of it there was.
 */

export interface FirstAnswer {
  readonly correct: boolean;
  readonly answeredAt: Date;
}

export interface ScoreInput {
  readonly questionIds: readonly string[];
  readonly problemIds: readonly string[];
  /** First answer per question, for this set. */
  readonly answers: ReadonlyMap<string, FirstAnswer>;
  /** When each problem was first passed. */
  readonly passed: ReadonlyMap<string, Date>;
  readonly dueAt: Date;
}

export type SetStatus = 'not_started' | 'partial' | 'done';

export interface SetScore {
  readonly total: number;
  /** Items attempted (questions) or solved (problems), on time or not. */
  readonly done: number;
  /** Graded on time: first answer right, or problem passed before the deadline. */
  readonly correct: number;
  /** Items finished after the deadline. */
  readonly late: number;
  /** correct / total, rounded. */
  readonly percent: number;
  readonly status: SetStatus;
}

export function scoreSet(input: ScoreInput): SetScore {
  const due = input.dueAt.getTime();
  let done = 0;
  let correct = 0;
  let late = 0;

  for (const id of input.questionIds) {
    const answer = input.answers.get(id);
    if (!answer) continue;
    done += 1;
    if (answer.answeredAt.getTime() > due) late += 1;
    else if (answer.correct) correct += 1;
  }
  for (const id of input.problemIds) {
    const passedAt = input.passed.get(id);
    if (!passedAt) continue;
    done += 1;
    if (passedAt.getTime() > due) late += 1;
    else correct += 1;
  }

  const total = input.questionIds.length + input.problemIds.length;
  const status: SetStatus = done === 0 ? 'not_started' : done >= total ? 'done' : 'partial';
  return { total, done, correct, late, percent: total > 0 ? Math.round((correct / total) * 100) : 0, status };
}
