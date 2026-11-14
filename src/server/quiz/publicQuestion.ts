// Shared by /api/quiz and /api/daily-plan so both serve the same redacted shape.

/**
 * What a student is allowed to see BEFORE answering. `correctIndex`,
 * `expectedOutput` and `explanation` are the answer key and are deliberately absent — the choices
 * array is visible in devtools, so leaking the index would make the quiz
 * pointless. Same redaction principle as hidden test cases in judge.ts.
 */
export type QuizKind = 'choice' | 'output';

export interface PublicQuizQuestion {
  id: string;
  kind: QuizKind;
  prompt: string;
  choices: string[];
  /** The snippet to read, for output questions; null for multiple choice. */
  code: string | null;
  lessonKey: string;
  isReview: boolean;
}

export interface QuestionRow {
  id: string;
  kind: string;
  prompt: string;
  choices: string[];
  code: string | null;
  lesson: { key: string };
}

/** The columns a student may see before answering — never the answer key. */
export const PUBLIC_QUESTION_SELECT = {
  id: true,
  kind: true,
  prompt: true,
  choices: true,
  code: true,
  lesson: { select: { key: true } },
} as const;

export const toPublicQuestion = (row: QuestionRow, isReview: boolean): PublicQuizQuestion => ({
  id: row.id,
  kind: row.kind === 'output' ? 'output' : 'choice',
  prompt: row.prompt,
  choices: row.choices,
  code: row.code,
  lessonKey: row.lesson.key,
  isReview,
});
