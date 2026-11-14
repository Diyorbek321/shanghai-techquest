/**
 * "Kod nima chiqaradi?" — output-prediction questions.
 *
 * The student reads a short Python snippet and types what it prints. Grading is
 * an exact comparison after the same whitespace forgiveness the code judge uses
 * (judge.ts), so the answer key is a fact, not an opinion: `expectedOutput` is
 * captured by really running the snippet (scripts/verifyOutputQuestions.ts),
 * never written by a model or guessed by hand.
 *
 * Pure functions only — no Prisma, no IO.
 */

/** Longest answer the API accepts; comfortably above any allowed expected output. */
export const OUTPUT_ANSWER_MAX_LENGTH = 400;

/** Keeps the answer short enough to type on a phone. */
export const MAX_OUTPUT_LINES = 8;
export const MAX_OUTPUT_CHARS = 200;
export const MAX_CODE_LINES = 15;

/**
 * CRLF → LF, trailing whitespace dropped from every line, blank lines dropped
 * from both ends. Leading spaces inside a line stay significant.
 */
export function normalizeOutput(text: string): string {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((line) => line.replace(/\s+$/, ''));
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start] === '') start += 1;
  while (end > start && lines[end - 1] === '') end -= 1;
  return lines.slice(start, end).join('\n');
}

export function isOutputAnswerCorrect(expected: string, answer: string): boolean {
  const typed = normalizeOutput(answer);
  return typed !== '' && typed === normalizeOutput(expected);
}

export interface OutputRecordFields {
  readonly code: string;
  readonly expectedOutput: string;
  readonly explanation: string;
}

/** Static checks on authored content; returns human-readable problems, empty when fine. */
export function validateOutputRecord(record: OutputRecordFields): string[] {
  const problems: string[] = [];
  const expected = normalizeOutput(record.expectedOutput);
  if (record.code.trim() === '') problems.push("code bo'sh");
  if (/\binput\s*\(/.test(record.code)) problems.push('input() ishlatilmasin');
  if (record.code.split('\n').length > MAX_CODE_LINES) problems.push(`kod ${MAX_CODE_LINES} qatordan oshmasin`);
  if (expected === '') problems.push("expectedOutput bo'sh");
  if (expected.split('\n').length > MAX_OUTPUT_LINES) problems.push(`natija ${MAX_OUTPUT_LINES} qatordan oshmasin`);
  if (expected.length > MAX_OUTPUT_CHARS) problems.push(`natija ${MAX_OUTPUT_CHARS} belgidan oshmasin`);
  if (record.explanation.trim() === '') problems.push("explanation bo'sh");
  return problems;
}
