import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Difficulty, Role, Track } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { MAX_PARSONS_LINES, toLines } from '../parsons/blocks';
import { parsonsPoints } from '../parsons/award';

const app = createApp();
const unique = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const SOLUTION = ['a = int(input())', 'b = int(input())', 'print(a + b)'].join('\n');
const POINTS = 30;

let studentId: string;
let studentCookie: string;
let otherCookie: string;
let problemId: string;
let plainProblemId: string;
let longProblemId: string;

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const mk = (label: string) =>
    prisma.user.create({
      data: {
        email: `${unique(label)}@vitest.local`,
        passwordHash,
        name: `Parsons ${label}`,
        role: Role.STUDENT,
        track: Track.BACKEND,
      },
    });

  const [student, other] = await Promise.all([mk('student'), mk('other')]);
  studentId = student.id;
  studentCookie = `${AUTH_COOKIE_NAME}=${signToken({ sub: student.id, role: Role.STUDENT, track: Track.BACKEND })}`;
  otherCookie = `${AUTH_COOKIE_NAME}=${signToken({ sub: other.id, role: Role.STUDENT, track: Track.BACKEND })}`;

  const base = {
    title: 'Ikki sonni qo\'shish',
    difficulty: Difficulty.EASY,
    points: POINTS,
    tags: ['arifmetika'],
    description: 'Ikki sonni qo\'shing.',
    starterCodePy: '',
    testCases: [],
  };

  // Verified content, but too many lines to shuffle usefully — stored, not offered.
  const LONG_SOLUTION = Array.from({ length: MAX_PARSONS_LINES + 5 }, (_, i) => `print(${i})`).join('\n');

  const [withSolution, without, tooLong] = await Promise.all([
    prisma.problem.create({ data: { ...base, key: unique('parsons-with'), solutionPy: SOLUTION } }),
    prisma.problem.create({ data: { ...base, key: unique('parsons-without') } }),
    prisma.problem.create({ data: { ...base, key: unique('parsons-long'), solutionPy: LONG_SOLUTION } }),
  ]);
  problemId = withSolution.id;
  plainProblemId = without.id;
  longProblemId = tooLong.id;
});

afterAll(async () => {
  const ids = [problemId, plainProblemId, longProblemId];
  await prisma.problemSubmission.deleteMany({ where: { problemId: { in: ids } } });
  await prisma.problem.deleteMany({ where: { id: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: studentId } });
});

const boardFor = (cookie: string) =>
  request(app).get(`/api/problems/${problemId}/parsons`).set('Cookie', cookie).expect(200);

describe('GET /api/problems/:id/parsons', () => {
  it('deals every solution line, shuffled', async () => {
    const res = await boardFor(studentCookie);
    const texts = res.body.blocks.map((b: { text: string }) => b.text);

    expect([...texts].sort()).toEqual([...toLines(SOLUTION)].sort());
    expect(texts).not.toEqual(toLines(SOLUTION));
  });

  // The single most important property: the ordered solution must never reach
  // the client, in any field.
  it('never ships the solution or anything that encodes its order', async () => {
    const res = await boardFor(studentCookie);
    const payload = JSON.stringify(res.body);

    expect(payload).not.toContain(SOLUTION);
    expect(res.body.solutionPy).toBeUndefined();
    for (const block of res.body.blocks) expect(block.id).not.toMatch(/^b?\d+$/);
  });

  it('is stable across requests so a refresh does not reshuffle', async () => {
    const [first, second] = await Promise.all([boardFor(studentCookie), boardFor(studentCookie)]);
    expect(first.body.blocks).toEqual(second.body.blocks);
  });

  it('deals a different arrangement to a different student', async () => {
    const [mine, theirs] = await Promise.all([boardFor(studentCookie), boardFor(otherCookie)]);
    expect(mine.body.blocks.map((b: { id: string }) => b.id)).not.toEqual(
      theirs.body.blocks.map((b: { id: string }) => b.id)
    );
  });

  // The three endpoints must agree. A problem listed as having the exercise but
  // 404ing when opened is worse than one that never advertised it.
  it('withholds a solution that is too long, consistently across endpoints', async () => {
    const detail = await request(app)
      .get(`/api/problems/${longProblemId}`)
      .set('Cookie', studentCookie)
      .expect(200);
    expect(detail.body.hasParsons).toBe(false);

    await request(app)
      .get(`/api/problems/${longProblemId}/parsons`)
      .set('Cookie', studentCookie)
      .expect(404);

    await request(app)
      .post(`/api/problems/${longProblemId}/parsons`)
      .set('Cookie', studentCookie)
      .send({ order: ['anything'] })
      .expect(404);
  });

  it('advertises the exercise on a problem that has a workable solution', async () => {
    const detail = await request(app)
      .get(`/api/problems/${problemId}`)
      .set('Cookie', studentCookie)
      .expect(200);
    expect(detail.body.hasParsons).toBe(true);
  });

  it('404s for a problem with no Parsons variant', async () => {
    await request(app)
      .get(`/api/problems/${plainProblemId}/parsons`)
      .set('Cookie', studentCookie)
      .expect(404);
  });
});

describe('POST /api/problems/:id/parsons', () => {
  const orderedIds = async (cookie: string) => {
    const board = await boardFor(cookie);
    const byText = new Map<string, string>();
    for (const block of board.body.blocks) byText.set(block.text, block.id);
    return toLines(SOLUTION).map((line) => byText.get(line)!);
  };

  it('rejects ids that were never dealt', async () => {
    await request(app)
      .post(`/api/problems/${problemId}/parsons`)
      .set('Cookie', studentCookie)
      .send({ order: ['bogus-id'] })
      .expect(400);
  });

  it('reports wrong positions without revealing the expected text', async () => {
    const ids = await orderedIds(studentCookie);
    const swapped = [ids[1], ids[0], ids[2]];

    const res = await request(app)
      .post(`/api/problems/${problemId}/parsons`)
      .set('Cookie', studentCookie)
      .send({ order: swapped })
      .expect(201);

    expect(res.body.correct).toBe(false);
    expect(res.body.wrongPositions).toEqual([1, 2]);
    expect(res.body.pointsAwarded).toBe(0);
    expect(JSON.stringify(res.body)).not.toContain('int(input())');
  });

  it('awards a fraction of the problem points on the first correct ordering', async () => {
    const res = await request(app)
      .post(`/api/problems/${problemId}/parsons`)
      .set('Cookie', studentCookie)
      .send({ order: await orderedIds(studentCookie) })
      .expect(201);

    expect(res.body.correct).toBe(true);
    expect(res.body.pointsAwarded).toBe(parsonsPoints(POINTS));
    expect(res.body.pointsAwarded).toBeLessThan(POINTS);
  });

  it('does not pay twice for the same problem', async () => {
    const res = await request(app)
      .post(`/api/problems/${problemId}/parsons`)
      .set('Cookie', studentCookie)
      .send({ order: await orderedIds(studentCookie) })
      .expect(201);

    expect(res.body.correct).toBe(true);
    expect(res.body.pointsAwarded).toBe(0);
  });

  it('records the attempt as a line-ordering submission, not written code', async () => {
    const row = await prisma.problemSubmission.findFirst({
      where: { problemId, userId: studentId, passed: true },
      orderBy: { submittedAt: 'desc' },
    });
    expect(row?.language).toBe('parsons');
  });
});
