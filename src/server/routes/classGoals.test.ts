import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Role, Track } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';

const app = createApp();
const uniqueEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@vitest.local`;
const cookieFor = (id: string, role: Role, track: Track | null) =>
  `${AUTH_COOKIE_NAME}=${signToken({ sub: id, role, track })}`;

let teacherId: string;
let teacherCookie: string;
let strangerCookie: string;
let memberId: string;
let memberCookie: string;
let outsiderCookie: string;
let classId: string;
let problemId: string;

const WINDOW = {
  startsAt: '2026-04-01T00:00:00.000Z',
  endsAt: '2026-04-08T00:00:00.000Z',
};
const INSIDE = new Date('2026-04-03T10:00:00.000Z');

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const mk = (label: string, role: Role, track: Track | null = null) =>
    prisma.user.create({ data: { email: uniqueEmail(label), passwordHash, name: `CG ${label}`, role, track } });

  const [teacher, stranger, member, outsider] = await Promise.all([
    mk('teacher', Role.TEACHER),
    mk('stranger', Role.TEACHER),
    mk('member', Role.STUDENT, Track.BACKEND),
    mk('outsider', Role.STUDENT, Track.BACKEND),
  ]);
  teacherId = teacher.id;
  memberId = member.id;
  teacherCookie = cookieFor(teacher.id, teacher.role, null);
  strangerCookie = cookieFor(stranger.id, stranger.role, null);
  memberCookie = cookieFor(member.id, member.role, member.track);
  outsiderCookie = cookieFor(outsider.id, outsider.role, outsider.track);

  const group = await prisma.classGroup.create({
    data: { title: 'CG class', track: Track.BACKEND, teacherId: teacher.id },
  });
  classId = group.id;
  await prisma.enrollment.create({ data: { userId: member.id, classId: group.id } });

  const problem = await prisma.problem.create({
    data: { key: `cg-problem-${Date.now()}`, title: 'CG', difficulty: 'EASY', points: 10, tags: [], description: 'x' },
  });
  problemId = problem.id;
});

afterAll(async () => {
  const ids = await prisma.user.findMany({ where: { name: { startsWith: 'CG ' } }, select: { id: true } });
  const userIds = ids.map((u) => u.id);
  await prisma.classGoal.deleteMany({ where: { classId } });
  await prisma.problemSubmission.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.notification.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.enrollment.deleteMany({ where: { classId } });
  await prisma.classGroup.delete({ where: { id: classId } });
  await prisma.problem.delete({ where: { id: problemId } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
});

const goalBody = (over: Record<string, unknown> = {}) => ({
  classId,
  title: 'Shu hafta 3 ta masala',
  metric: 'PROBLEMS_SOLVED',
  target: 3,
  xpReward: 50,
  ...WINDOW,
  ...over,
});

describe('POST /api/class-goals', () => {
  it('refuses a student', async () => {
    await request(app).post('/api/class-goals').set('Cookie', memberCookie).send(goalBody()).expect(403);
  });

  it('refuses a teacher who does not own the class', async () => {
    await request(app).post('/api/class-goals').set('Cookie', strangerCookie).send(goalBody()).expect(403);
  });

  it('rejects a window that ends before it starts', async () => {
    await request(app)
      .post('/api/class-goals')
      .set('Cookie', teacherCookie)
      .send(goalBody({ endsAt: '2026-03-01T00:00:00.000Z' }))
      .expect(400);
  });

  it('creates the goal and notifies the class', async () => {
    const res = await request(app).post('/api/class-goals').set('Cookie', teacherCookie).send(goalBody()).expect(201);
    expect(res.body).toMatchObject({ target: 3, current: 0, percent: 0, reached: false });

    const note = await prisma.notification.findFirst({ where: { userId: memberId }, orderBy: { createdAt: 'desc' } });
    expect(note?.title).toBe('Yangi sinf maqsadi');
  });
});

describe('GET /api/class-goals', () => {
  it('shows the enrolled student their class goal', async () => {
    const res = await request(app).get(`/api/class-goals?classId=${classId}`).set('Cookie', memberCookie).expect(200);
    expect(res.body).toHaveLength(1);
  });

  it('hides it from a student in another class', async () => {
    await request(app).get(`/api/class-goals?classId=${classId}`).set('Cookie', outsiderCookie).expect(403);
  });

  it('hides it from another teacher', async () => {
    await request(app).get(`/api/class-goals?classId=${classId}`).set('Cookie', strangerCookie).expect(403);
  });

  it('tracks progress as the class works', async () => {
    await prisma.problemSubmission.create({
      data: { problemId, userId: memberId, code: '', language: 'python', passed: true, feedback: '', pointsAwarded: 10, submittedAt: INSIDE },
    });

    const res = await request(app).get(`/api/class-goals?classId=${classId}`).set('Cookie', memberCookie).expect(200);
    expect(res.body[0]).toMatchObject({ current: 1, percent: 33, reached: false });
  });
});

describe('reward payout', () => {
  it('pays every member once when the target is reached', async () => {
    const before = await prisma.user.findUniqueOrThrow({ where: { id: memberId } });

    // Two more passes take the class from 1 to the target of 3.
    await prisma.problemSubmission.createMany({
      data: [
        { problemId, userId: memberId, code: '', language: 'python', passed: true, feedback: '', pointsAwarded: 10, submittedAt: INSIDE },
        { problemId, userId: memberId, code: '', language: 'python', passed: true, feedback: '', pointsAwarded: 10, submittedAt: INSIDE },
      ],
    });

    const first = await request(app).get(`/api/class-goals?classId=${classId}`).set('Cookie', teacherCookie).expect(200);
    expect(first.body[0]).toMatchObject({ reached: true, percent: 100, rewarded: true });

    const afterFirst = await prisma.user.findUniqueOrThrow({ where: { id: memberId } });
    expect(afterFirst.xp).toBe(before.xp + 50);

    // Reading again must not pay a second time.
    await request(app).get(`/api/class-goals?classId=${classId}`).set('Cookie', teacherCookie).expect(200);
    const afterSecond = await prisma.user.findUniqueOrThrow({ where: { id: memberId } });
    expect(afterSecond.xp).toBe(afterFirst.xp);
  });
});

describe('GET /api/class-goals/mine', () => {
  it('returns the goals of every class the student is in', async () => {
    const res = await request(app).get('/api/class-goals/mine').set('Cookie', memberCookie).expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].classId).toBe(classId);
  });

  it('is empty for a student with no class', async () => {
    const res = await request(app).get('/api/class-goals/mine').set('Cookie', outsiderCookie).expect(200);
    expect(res.body).toEqual([]);
  });
});

describe('DELETE /api/class-goals/:id', () => {
  it('refuses another teacher', async () => {
    const goal = await prisma.classGoal.findFirstOrThrow({ where: { classId } });
    await request(app).delete(`/api/class-goals/${goal.id}`).set('Cookie', strangerCookie).expect(403);
  });

  it('lets the owner remove it', async () => {
    const goal = await prisma.classGoal.findFirstOrThrow({ where: { classId } });
    await request(app).delete(`/api/class-goals/${goal.id}`).set('Cookie', teacherCookie).expect(204);
    expect(await prisma.classGoal.count({ where: { id: goal.id } })).toBe(0);
  });
});
