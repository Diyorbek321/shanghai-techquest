import { z } from 'zod';
import { executeCode, type RunLanguage } from './piston';

export interface ProblemTestCase {
  stdin: string;
  expectedStdout: string;
  hidden: boolean;
  label: string;
}

export interface TestCaseResult {
  label: string;
  hidden: boolean;
  passed: boolean;
  /** Never set for hidden cases — this payload is returned to students. */
  expected?: string;
  actual?: string;
  stderr?: string;
}

export interface JudgeResult {
  passed: boolean;
  testsPassed: number;
  testsTotal: number;
  results: TestCaseResult[];
  /** True when the stored case list was longer than MAX_TEST_CASES and got clipped. */
  truncated?: boolean;
}

/**
 * Piston is a single shared sandbox, so a runaway test-case list would both hog
 * it and blow past the request timeout. Everything beyond this is ignored.
 */
export const MAX_TEST_CASES = 20;

const testCaseSchema = z.object({
  stdin: z.string(),
  expectedStdout: z.string(),
  hidden: z.boolean(),
  label: z.string(),
});

const testCaseListSchema = z.array(testCaseSchema);

/**
 * Reads the untyped `Problem.testCases` Json column. The column defaults to `[]`
 * and predates this feature, so malformed or legacy content must degrade to an
 * empty list rather than throw — an unverifiable problem is not a server error.
 */
export function parseTestCases(raw: unknown): ProblemTestCase[] {
  const parsed = testCaseListSchema.safeParse(raw);
  if (!parsed.success) {
    return [];
  }
  return parsed.data.map((testCase) => ({ ...testCase }));
}

/**
 * Normalizes program output before comparison: trailing whitespace on each line
 * is ignored (students' `print` habits vary), as are trailing blank lines.
 * Leading whitespace stays significant — indentation is often the answer.
 */
function normalizeOutput(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').split('\n').map((line) => line.replace(/\s+$/, ''));
  let end = lines.length;
  while (end > 0 && lines[end - 1] === '') {
    end -= 1;
  }
  return lines.slice(0, end).join('\n');
}

function buildResult(testCase: ProblemTestCase, passed: boolean, actual: string, stderr: string): TestCaseResult {
  if (testCase.hidden) {
    // Hidden cases exist so students cannot hard-code answers: expose the
    // verdict only, never the expectation, the produced output or the stderr.
    return { label: testCase.label, hidden: true, passed };
  }

  return {
    label: testCase.label,
    hidden: false,
    passed,
    expected: testCase.expectedStdout,
    actual,
    ...(stderr.length > 0 ? { stderr } : {}),
  };
}

/**
 * Deterministic grader: runs the submission against every stored test case and
 * reports how many passed. `PistonUnavailableError` from `executeCode` is left
 * to propagate so the route can map it to a 503.
 */
export async function judgeSubmission(
  language: RunLanguage,
  code: string,
  testCases: readonly ProblemTestCase[]
): Promise<JudgeResult> {
  const truncated = testCases.length > MAX_TEST_CASES;
  const cases = testCases.slice(0, MAX_TEST_CASES);

  // No test cases means we cannot verify anything, so the submission is NOT a
  // pass. Silently returning `passed: true` here would let an unconfigured
  // problem grant credit for any code at all.
  if (cases.length === 0) {
    return { passed: false, testsPassed: 0, testsTotal: 0, results: [], ...(truncated ? { truncated } : {}) };
  }

  const results: TestCaseResult[] = [];
  // Sequential on purpose: Piston is one shared sandbox and a parallel burst
  // trips its rate limiting.
  for (const testCase of cases) {
    const execution = await executeCode(language, code, testCase.stdin);
    const failedToCompile = execution.compileOutput !== null && execution.stdout === '' && execution.stderr === '';
    const passed =
      !execution.timedOut &&
      !failedToCompile &&
      normalizeOutput(execution.stdout) === normalizeOutput(testCase.expectedStdout);

    const stderr = execution.compileOutput ?? execution.stderr;
    results.push(buildResult(testCase, passed, execution.stdout, stderr));
  }

  const testsPassed = results.filter((result) => result.passed).length;

  return {
    // `passed` requires at least one case AND a clean sweep.
    passed: testsPassed === results.length,
    testsPassed,
    testsTotal: results.length,
    results,
    ...(truncated ? { truncated } : {}),
  };
}
