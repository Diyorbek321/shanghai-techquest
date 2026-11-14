import { OUTPUT_ORDER_BASE, type LessonOutputRecord } from './types';

/** One question as authored: code and output are raw template literals. */
export interface OutputItem {
  readonly code: string;
  readonly out: string;
  readonly why: string;
  readonly prompt?: string;
}

/** Drops the line break right after the opening backtick and before the closing one. */
const trimEdges = (text: string): string => text.replace(/^\n/, '').replace(/\n\s*$/, '');

/**
 * Numbers a lesson's output questions 101, 102, ... and attaches its key, so a
 * part file only lists the questions themselves.
 */
export function outputSet(lessonOrder: number, items: readonly OutputItem[]): LessonOutputRecord[] {
  const lessonKey = `backend-dars-${String(lessonOrder).padStart(2, '0')}`;
  return items.map((item, index) => ({
    lessonKey,
    order: OUTPUT_ORDER_BASE + index + 1,
    code: trimEdges(item.code),
    expectedOutput: trimEdges(item.out),
    explanation: item.why,
    ...(item.prompt ? { prompt: item.prompt } : {}),
  }));
}

/** Tag for code blocks: backslashes stay as written, so `\n` reaches Python intact. */
export const py = String.raw;
