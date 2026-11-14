import { describe, expect, it } from 'vitest';
import { isOutputAnswerCorrect, normalizeOutput, OUTPUT_ANSWER_MAX_LENGTH, validateOutputRecord } from './output';

describe('normalizeOutput', () => {
  it('ignores trailing spaces, CRLF and blank lines around the answer', () => {
    expect(normalizeOutput('\n\r\n5  \r\n10\r\n\n')).toBe('5\n10');
  });

  it('keeps leading spaces inside a line — indentation can be the answer', () => {
    expect(normalizeOutput('  a\nb')).toBe('  a\nb');
  });
});

describe('isOutputAnswerCorrect', () => {
  it('accepts the same output typed with sloppy whitespace', () => {
    expect(isOutputAnswerCorrect('Salom 3\n7\n', 'Salom 3 \r\n7')).toBe(true);
  });

  it('rejects a different value', () => {
    expect(isOutputAnswerCorrect('3.0', '3')).toBe(false);
  });

  it('is case-sensitive: True and true are different Python values', () => {
    expect(isOutputAnswerCorrect('True', 'true')).toBe(false);
  });

  it('rejects an empty answer even when blank output is expected', () => {
    expect(isOutputAnswerCorrect('', '   \n')).toBe(false);
  });
});

describe('validateOutputRecord', () => {
  const ok = { code: 'print(2 + 3)', expectedOutput: '5', explanation: '2 + 3 = 5.' };

  it('accepts a small, self-contained snippet', () => {
    expect(validateOutputRecord(ok)).toEqual([]);
  });

  it('rejects code that reads stdin — there is nobody to type it', () => {
    expect(validateOutputRecord({ ...ok, code: 'x = input()\nprint(x)' })).toContain('input() ishlatilmasin');
  });

  it('rejects empty expected output and missing explanation', () => {
    const problems = validateOutputRecord({ code: 'x = 1', expectedOutput: '', explanation: ' ' });
    expect(problems).toContain("expectedOutput bo'sh");
    expect(problems).toContain("explanation bo'sh");
  });

  it('rejects output too long to type', () => {
    const long = Array.from({ length: 9 }, (_, i) => String(i)).join('\n');
    expect(validateOutputRecord({ ...ok, expectedOutput: long })).toContain('natija 8 qatordan oshmasin');
  });

  it('keeps the answer limit above any allowed expected output', () => {
    expect(OUTPUT_ANSWER_MAX_LENGTH).toBeGreaterThanOrEqual(400);
  });
});
