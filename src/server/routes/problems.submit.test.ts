import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Difficulty, Role } from '@prisma/client';

vi.mock('../code/piston', async () => {
  const actual = await vi.importActual<typeof import('../code/piston')>('../code/piston');
  return { ...actual, executeCode: vi.fn() };
});

import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { executeCode, PistonUnavailableError, type ExecutionResult } from '../code/piston';

const app = createApp();
const unique = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const PROBLEM_POINTS = 40;

let studentId: string;
let studentCookie: string;
const problemIds: string[] = [];

function ok(stdout: string): ExecutionResult {
  return { stdout, stderr: '', compileOutput: null, timedOut: false };
}

async function createProblem(testCases: unknown): Promise<string> {
  const problem = await prisma.problem.create({
    data: {
      key: unique('submit-test'),
      title: 'Ikki sonni qoshish',
      description: 'stdin dan ikkita son oqib, yigindisini chiqaring.',
      difficulty: Difficulty.EASY,
      points: PROBLEM_POINTS,
      tags: ['test'],
      starterCodePy: '# kod',
      testCases: testCases as never,
    },
  });
  problemIds.push(problem.id);
  return problem.id;
}

function submit(problemId: string, code = 'print(1)') {
  return request(app)
    .post(`/api/problems/${problemId}/submit`)
    .set('Cookie', studentCookie)
    .send({ code, language: 'python' });
}

async function xp(): Promise<number> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
  return user.xp;
}

const TWO_CASES = [
  { stdin: '1 2\n', expectedStdout: '3', hidden: false, label: 'Oddiy holat' },
  { stdin: '5 5\n', expectedStdout: '10', hidden: true, label: 'Yashirin holat' },
];

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const student = await prisma.user.create({
    data: {
      email: `${unique('student')}@problemssubmit.vitest.test`,
      passwordHash,
      name: 'Submit Test Student',
      role: Role.STUDENT,
      xp: 0,
    },
  });
  studentId = student.id;
  studentCookie = `${AUTH_COOKIE_NAME}=${signToken({ sub: student.id, role: student.role, track: student.track })}`;
});

beforeEach(async () => {
  await prisma.problemSubmission.deleteMany({ where: { userId: studentId } });
  await prisma.user.update({ where: { id: studentId }, data: { xp: 0 } });
});

afterEach(() => {
  vi.mocked(executeCode).mockReset();
});

afterAll(async () => {
  await prisma.problemSubmission.deleteMany({ where: { userId: studentId } });
  await prisma.notification.deleteMany({ where: { userId: studentId } });
  await prisma.problem.deleteMany({ where: { id: { in: problemIds } } });
  await prisma.user.deleteMany({ where: { id: studentId } });
  await prisma.$disconnect();
});

describe('POST /api/problems/:id/submit', () => {
  it('rejects unauthenticated requests', async () => {
    const problemId = await createProblem(TWO_CASES);
    const res = await request(app).post(`/api/problems/${problemId}/submit`).send({ code: 'x', language: 'python' });
    expect(res.status).toBe(401);
  });

  it('returns 404 for an unknown problem', async () => {
    const res = await submit('does-not-exist');
    expect(res.status).toBe(404);
  });

  it('awards full XP when every test case passes', async () => {
    const problemId = await createProblem(TWO_CASES);
    vi.mocked(executeCode).mockResolvedValueOnce(ok('3\n')).mockResolvedValueOnce(ok('10\n'));

    const res = await submit(problemId);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ passed: true, testsPassed: 2, testsTotal: 2, pointsAwarded: PROBLEM_POINTS });
    expect(typeof res.body.feedback).toBe('string');
    expect(res.body.results).toHaveLength(2);
    expect(await xp()).toBe(PROBLEM_POINTS);

    const stored = await prisma.problemSubmission.findFirstOrThrow({ where: { userId: studentId, problemId } });
    expect(stored.testsPassed).toBe(2);
    expect(stored.testsTotal).toBe(2);
    expect(stored.pointsAwarded).toBe(PROBLEM_POINTS);
  });

  it('does not award partial credit when only some test cases pass', async () => {
    const problemId = await createProblem(TWO_CASES);
    vi.mocked(executeCode).mockResolvedValueOnce(ok('3\n')).mockResolvedValueOnce(ok('999\n'));

    const res = await submit(problemId);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ passed: false, testsPassed: 1, testsTotal: 2, pointsAwarded: 0 });
    expect(await xp()).toBe(0);
  });

  it('keeps hidden test-case results redacted', async () => {
    const problemId = await createProblem(TWO_CASES);
    vi.mocked(executeCode).mockResolvedValueOnce(ok('3\n')).mockResolvedValueOnce(ok('999\n'));

    const res = await submit(problemId);

    const hidden = res.body.results.find((r: { hidden: boolean }) => r.hidden);
    expect(hidden).toEqual({ label: 'Yashirin holat', hidden: true, passed: false });
  });

  it('fails honestly and awards nothing when the problem has no test cases', async () => {
    const problemId = await createProblem([]);

    const res = await submit(problemId);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ passed: false, testsPassed: 0, testsTotal: 0, pointsAwarded: 0, results: [] });
    expect(res.body.feedback).toContain('avtomatik tekshiruv');
    expect(vi.mocked(executeCode)).not.toHaveBeenCalled();
    expect(await xp()).toBe(0);
  });

  it('treats malformed stored test cases as "no automatic check" rather than a pass', async () => {
    const problemId = await createProblem({ nope: true });

    const res = await submit(problemId);

    expect(res.status).toBe(201);
    expect(res.body.passed).toBe(false);
    expect(res.body.pointsAwarded).toBe(0);
    expect(await xp()).toBe(0);
  });

  it('does not award XP twice when an already-solved problem is re-solved', async () => {
    const problemId = await createProblem(TWO_CASES);
    vi.mocked(executeCode).mockResolvedValue(ok('3\n'));

    const single = [{ stdin: '1 2\n', expectedStdout: '3', hidden: false, label: 'Oddiy holat' }];
    await prisma.problem.update({ where: { id: problemId }, data: { testCases: single as never } });

    const first = await submit(problemId);
    expect(first.body.pointsAwarded).toBe(PROBLEM_POINTS);
    expect(await xp()).toBe(PROBLEM_POINTS);

    const second = await submit(problemId);
    expect(second.status).toBe(201);
    expect(second.body.passed).toBe(true);
    expect(second.body.pointsAwarded).toBe(0);
    expect(await xp()).toBe(PROBLEM_POINTS);
  });

  it('returns 503 when the execution sandbox is unavailable', async () => {
    const problemId = await createProblem(TWO_CASES);
    vi.mocked(executeCode).mockRejectedValue(new PistonUnavailableError('down'));

    const res = await submit(problemId);

    expect(res.status).toBe(503);
    expect(typeof res.body.error).toBe('string');
    expect(await prisma.problemSubmission.count({ where: { userId: studentId } })).toBe(0);
  });

  it('still returns a deterministic verdict with GEMINI_API_KEY unset', async () => {
    expect(process.env.GEMINI_API_KEY ?? '').toBe('');

    const problemId = await createProblem(TWO_CASES);
    vi.mocked(executeCode).mockResolvedValue(ok('nope\n'));

    const res = await submit(problemId);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ passed: false, testsPassed: 0, testsTotal: 2, pointsAwarded: 0 });
    expect(res.body.feedback).toContain('0/2');
    expect(res.body.feedback).toContain('Oddiy holat');
  });
});
