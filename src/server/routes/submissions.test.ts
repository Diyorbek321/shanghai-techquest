import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Role, Track } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';

const app = createApp();
// Deliberately NOT "@vitest.local" — auth.test.ts's afterAll does a blanket
// deleteMany on that exact domain and runs concurrently with this file, which
// would delete this file's in-flight test user out from under it.
const uniqueEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@submissions.vitest.test`;

function cookieFor(userId: string, role: Role, track: Track | null): string {
  const token = signToken({ sub: userId, role, track });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

let studentId: string;
let studentCookie: string;
let teacherCookie: string;
const assignmentIds: string[] = [];

async function createModuleAssignment(moduleKey: string, xpReward: number) {
  const assignment = await prisma.assignment.create({
    data: {
      title: `Test Module Assignment ${moduleKey}`,
      description: 'Test description',
      track: Track.FRONTEND,
      dueDate: new Date(Date.now() + 86_400_000),
      xpReward,
      moduleKey,
    },
  });
  assignmentIds.push(assignment.id);
  return assignment;
}

async function submitAndGrade(assignmentId: string, score: number, maxScore = 100) {
  const submitRes = await request(app)
    .post(`/api/assignments/${assignmentId}/submissions`)
    .set('Cookie', studentCookie)
    .send({ githubUrl: 'https://github.com/example/repo' });
  expect(submitRes.status).toBe(201);

  const gradeRes = await request(app)
    .patch(`/api/submissions/${submitRes.body.id}`)
    .set('Cookie', teacherCookie)
    .send({ status: 'GRADED', score, maxScore });
  expect(gradeRes.status).toBe(200);
  return gradeRes;
}

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const student = await prisma.user.create({
    data: { email: uniqueEmail('student'), passwordHash, name: 'Test Student', role: Role.STUDENT, track: Track.FRONTEND, xp: 0 },
  });
  const teacher = await prisma.user.create({
    data: { email: uniqueEmail('teacher'), passwordHash, name: 'Test Teacher', role: Role.TEACHER },
  });
  studentId = student.id;
  studentCookie = cookieFor(student.id, student.role, student.track);
  teacherCookie = cookieFor(teacher.id, teacher.role, teacher.track);
});

afterAll(async () => {
  await prisma.grade.deleteMany({ where: { userId: studentId } });
  await prisma.submission.deleteMany({ where: { userId: studentId } });
  await prisma.moduleProgress.deleteMany({ where: { userId: studentId } });
  await prisma.assignment.deleteMany({ where: { id: { in: assignmentIds } } });
  await prisma.user.deleteMany({ where: { id: studentId } });
  await prisma.$disconnect();
});

describe('PATCH /api/submissions/:id', () => {
  it('awards full XP and marks the module 100% complete on a passing grade', async () => {
    const assignment = await createModuleAssignment('test-module-pass', 150);
    await submitAndGrade(assignment.id, 90, 100);

    const user = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
    expect(user.xp).toBe(150);

    const progress = await prisma.moduleProgress.findUnique({
      where: { userId_moduleKey: { userId: studentId, moduleKey: 'test-module-pass' } },
    });
    expect(progress?.progress).toBe(100);
  });

  it('does not award XP and marks the module 50% (in-progress) on a failing grade', async () => {
    const assignment = await createModuleAssignment('test-module-fail', 200);
    await submitAndGrade(assignment.id, 40, 100);

    const user = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
    expect(user.xp).toBe(150); // unchanged from the previous passing test

    const progress = await prisma.moduleProgress.findUnique({
      where: { userId_moduleKey: { userId: studentId, moduleKey: 'test-module-fail' } },
    });
    expect(progress?.progress).toBe(50);
  });

  it('never downgrades an already-completed module when re-graded with a failing score', async () => {
    const assignment = await createModuleAssignment('test-module-regrade', 100);
    const first = await submitAndGrade(assignment.id, 95, 100);

    const progressAfterPass = await prisma.moduleProgress.findUnique({
      where: { userId_moduleKey: { userId: studentId, moduleKey: 'test-module-regrade' } },
    });
    expect(progressAfterPass?.progress).toBe(100);

    const regradeRes = await request(app)
      .patch(`/api/submissions/${first.body.id}`)
      .set('Cookie', teacherCookie)
      .send({ status: 'GRADED', score: 30, maxScore: 100 });
    expect(regradeRes.status).toBe(200);

    const progressAfterRegrade = await prisma.moduleProgress.findUnique({
      where: { userId_moduleKey: { userId: studentId, moduleKey: 'test-module-regrade' } },
    });
    expect(progressAfterRegrade?.progress).toBe(100);
  });

  it('does not award XP twice when a passing submission is re-graded', async () => {
    const assignment = await createModuleAssignment('test-module-double-xp', 120);
    const submitRes = await request(app)
      .post(`/api/assignments/${assignment.id}/submissions`)
      .set('Cookie', studentCookie)
      .send({ githubUrl: 'https://github.com/example/repo' });

    await request(app)
      .patch(`/api/submissions/${submitRes.body.id}`)
      .set('Cookie', teacherCookie)
      .send({ status: 'GRADED', score: 90, maxScore: 100 });

    const userBeforeRegrade = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });

    await request(app)
      .patch(`/api/submissions/${submitRes.body.id}`)
      .set('Cookie', teacherCookie)
      .send({ status: 'GRADED', score: 100, maxScore: 100 });

    const userAfterRegrade = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
    expect(userAfterRegrade.xp).toBe(userBeforeRegrade.xp);
  });

  it('awards XP retroactively when a failing grade is later corrected to a pass', async () => {
    const assignment = await createModuleAssignment('test-module-fail-then-pass', 80);
    const submitRes = await request(app)
      .post(`/api/assignments/${assignment.id}/submissions`)
      .set('Cookie', studentCookie)
      .send({ githubUrl: 'https://github.com/example/repo' });

    await request(app)
      .patch(`/api/submissions/${submitRes.body.id}`)
      .set('Cookie', teacherCookie)
      .send({ status: 'GRADED', score: 20, maxScore: 100 });

    const userAfterFail = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });

    await request(app)
      .patch(`/api/submissions/${submitRes.body.id}`)
      .set('Cookie', teacherCookie)
      .send({ status: 'GRADED', score: 85, maxScore: 100 });

    const userAfterPass = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
    expect(userAfterPass.xp).toBe(userAfterFail.xp + 80);
  });
});
