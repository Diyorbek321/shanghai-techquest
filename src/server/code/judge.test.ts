import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ExecutionResult } from './piston';
import { judgeSubmission, MAX_TEST_CASES, parseTestCases, type ProblemTestCase } from './judge';

vi.mock('./piston', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./piston')>();
  return { ...actual, executeCode: vi.fn() };
});

const { executeCode } = await import('./piston');
const executeCodeMock = vi.mocked(executeCode);

function ok(stdout: string): ExecutionResult {
  return { stdout, stderr: '', compileOutput: null, timedOut: false };
}

function testCase(overrides: Partial<ProblemTestCase> = {}): ProblemTestCase {
  return { stdin: '', expectedStdout: '5', hidden: false, label: '1-holat', ...overrides };
}

beforeEach(() => {
  executeCodeMock.mockReset();
});

describe('parseTestCases', () => {
  it('parses a well formed list', () => {
    const raw = [{ stdin: '2 3', expectedStdout: '5', hidden: false, label: 'Oddiy holat' }];

    expect(parseTestCases(raw)).toEqual(raw);
  });

  it('returns an empty list for the legacy default value', () => {
    expect(parseTestCases([])).toEqual([]);
  });

  it('never throws on malformed Json and returns an empty list instead', () => {
    expect(parseTestCases(null)).toEqual([]);
    expect(parseTestCases(undefined)).toEqual([]);
    expect(parseTestCases('[]')).toEqual([]);
    expect(parseTestCases({ stdin: '1' })).toEqual([]);
    expect(parseTestCases([{ stdin: 1, expectedStdout: '5', hidden: false, label: 'x' }])).toEqual([]);
    expect(parseTestCases([{ stdin: '1', expectedStdout: '5' }])).toEqual([]);
  });
});

describe('judgeSubmission', () => {
  it('passes when every case matches', async () => {
    executeCodeMock.mockResolvedValueOnce(ok('5')).mockResolvedValueOnce(ok('7'));

    const result = await judgeSubmission('python', 'print(x)', [
      testCase({ expectedStdout: '5' }),
      testCase({ expectedStdout: '7', label: '2-holat' }),
    ]);

    expect(result.passed).toBe(true);
    expect(result.testsPassed).toBe(2);
    expect(result.testsTotal).toBe(2);
  });

  it('fails overall when a single case fails but still reports the passing ones', async () => {
    executeCodeMock.mockResolvedValueOnce(ok('5')).mockResolvedValueOnce(ok('42'));

    const result = await judgeSubmission('python', 'print(x)', [
      testCase({ expectedStdout: '5' }),
      testCase({ expectedStdout: '7', label: '2-holat' }),
    ]);

    expect(result.passed).toBe(false);
    expect(result.testsPassed).toBe(1);
    expect(result.testsTotal).toBe(2);
    expect(result.results[1]).toMatchObject({ passed: false, expected: '7', actual: '42' });
  });

  it('tolerates trailing whitespace and trailing blank lines but not leading whitespace', async () => {
    executeCodeMock
      .mockResolvedValueOnce(ok('salom   \ndunyo\t\n\n\n'))
      .mockResolvedValueOnce(ok('  salom'));

    const forgiving = await judgeSubmission('python', 'code', [
      testCase({ expectedStdout: 'salom\ndunyo' }),
    ]);
    const strict = await judgeSubmission('python', 'code', [testCase({ expectedStdout: 'salom' })]);

    expect(forgiving.passed).toBe(true);
    expect(strict.passed).toBe(false);
  });

  it('never leaks expected or actual output for hidden cases', async () => {
    executeCodeMock.mockResolvedValueOnce(ok('nope'));

    const result = await judgeSubmission('python', 'code', [
      testCase({ hidden: true, label: 'Yashirin holat', expectedStdout: 'maxfiy' }),
    ]);

    expect(result.results[0]).toEqual({ label: 'Yashirin holat', hidden: true, passed: false });
    expect(JSON.stringify(result)).not.toContain('maxfiy');
    expect(JSON.stringify(result)).not.toContain('nope');
  });

  it('reports failure for an empty test-case list without running any code', async () => {
    const result = await judgeSubmission('python', 'code', []);

    expect(result).toEqual({ passed: false, testsPassed: 0, testsTotal: 0, results: [] });
    expect(executeCodeMock).not.toHaveBeenCalled();
  });

  it('marks a timed out run as failed', async () => {
    executeCodeMock.mockResolvedValueOnce({ stdout: '5', stderr: '', compileOutput: null, timedOut: true });

    const result = await judgeSubmission('python', 'while True: pass', [testCase()]);

    expect(result.passed).toBe(false);
  });

  it('surfaces compiler output as stderr on a visible case', async () => {
    executeCodeMock.mockResolvedValueOnce({
      stdout: '',
      stderr: '',
      compileOutput: "error: expected ';'",
      timedOut: false,
    });

    const result = await judgeSubmission('cpp', 'int main() {', [testCase()]);

    expect(result.results[0].passed).toBe(false);
    expect(result.results[0].stderr).toContain('expected');
  });

  it('runs the cases sequentially', async () => {
    let running = 0;
    let maxConcurrent = 0;
    executeCodeMock.mockImplementation(async () => {
      running += 1;
      maxConcurrent = Math.max(maxConcurrent, running);
      await Promise.resolve();
      running -= 1;
      return ok('5');
    });

    await judgeSubmission('python', 'code', [testCase(), testCase(), testCase()]);

    expect(maxConcurrent).toBe(1);
  });

  it('caps execution at MAX_TEST_CASES and flags the truncation', async () => {
    executeCodeMock.mockResolvedValue(ok('5'));
    const many = Array.from({ length: MAX_TEST_CASES + 5 }, (_, index) =>
      testCase({ label: `${index + 1}-holat` })
    );

    const result = await judgeSubmission('python', 'code', many);

    expect(executeCodeMock).toHaveBeenCalledTimes(MAX_TEST_CASES);
    expect(result.testsTotal).toBe(MAX_TEST_CASES);
    expect(result.results).toHaveLength(MAX_TEST_CASES);
    expect(result.truncated).toBe(true);
    expect(result.passed).toBe(true);
  });

  it('does not flag truncation when the list fits', async () => {
    executeCodeMock.mockResolvedValue(ok('5'));

    const result = await judgeSubmission('python', 'code', [testCase()]);

    expect(result.truncated).toBeUndefined();
  });
});
