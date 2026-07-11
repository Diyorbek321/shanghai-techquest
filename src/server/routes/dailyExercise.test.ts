import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Role, Track } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';

const app = createApp();
const uniqueEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@vitest.local`;

function cookieFor(userId: string, role: Role, track: Track | null): string {
  const token = signToken({ sub: userId, role, track });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

function offsetKey(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

let officeStudentId: string;
let officeCookie: string;
let teacherCookie: string;
let userIds: string[] = [];

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const student = await prisma.user.create({
    data: { email: uniqueEmail('daily-office'), passwordHash, name: 'Daily Office Student', role: Role.STUDENT, track: Track.OFFICE },
  });
  const teacher = await prisma.user.create({
    data: { email: uniqueEmail('daily-teacher'), passwordHash, name: 'Daily Teacher', role: Role.TEACHER },
  });
  officeStudentId = student.id;
  userIds = [student.id, teacher.id];
  officeCookie = cookieFor(student.id, student.role, student.track);
  teacherCookie = cookieFor(teacher.id, teacher.role, teacher.track);
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});

describe('GET /api/daily-exercise', () => {
  it('returns 400 when the user has no track', async () => {
    const res = await request(app).get('/api/daily-exercise').set('Cookie', teacherCookie);
    expect(res.status).toBe(400);
  });

  it('returns the same exercise on repeated calls the same day', async () => {
    const first = await request(app).get('/api/daily-exercise').set('Cookie', officeCookie);
    const second = await request(app).get('/api/daily-exercise').set('Cookie', officeCookie);

    expect(first.status).toBe(200);
    expect(first.body.id).toBe(second.body.id);
    expect(first.body.prompt).toBeTypeOf('string');
  });
});

describe('POST /api/daily-exercise/complete', () => {
  beforeEach(async () => {
    await prisma.dailyExerciseLog.deleteMany({ where: { userId: officeStudentId } });
    await prisma.user.update({ where: { id: officeStudentId }, data: { streak: 0 } });
  });

  it('rejects completion when the user has no track', async () => {
    const res = await request(app).post('/api/daily-exercise/complete').set('Cookie', teacherCookie);
    expect(res.status).toBe(400);
  });

  it('awards XP and starts a streak at 1 from zero', async () => {
    const before = await prisma.user.findUniqueOrThrow({ where: { id: officeStudentId } });
    const res = await request(app).post('/api/daily-exercise/complete').set('Cookie', officeCookie);

    expect(res.status).toBe(200);
    expect(res.body.streak).toBe(1);
    expect(res.body.xp).toBe(before.xp + res.body.xpAwarded);
  });

  it('rejects completing the same day twice', async () => {
    await request(app).post('/api/daily-exercise/complete').set('Cookie', officeCookie);
    const res = await request(app).post('/api/daily-exercise/complete').set('Cookie', officeCookie);
    expect(res.status).toBe(409);
  });

  it('increments an existing streak when yesterday was completed', async () => {
    await prisma.user.update({ where: { id: officeStudentId }, data: { streak: 5 } });
    const exercise = await prisma.dailyExercise.findFirstOrThrow({ where: { track: Track.OFFICE } });
    await prisma.dailyExerciseLog.create({
      data: { userId: officeStudentId, exerciseId: exercise.id, date: offsetKey(-1), completed: true, completedAt: new Date() },
    });

    const res = await request(app).post('/api/daily-exercise/complete').set('Cookie', officeCookie);
    expect(res.status).toBe(200);
    expect(res.body.streak).toBe(6);
  });

  it('resets an existing streak to 1 after a gap day', async () => {
    await prisma.user.update({ where: { id: officeStudentId }, data: { streak: 5 } });
    const exercise = await prisma.dailyExercise.findFirstOrThrow({ where: { track: Track.OFFICE } });
    await prisma.dailyExerciseLog.create({
      data: { userId: officeStudentId, exerciseId: exercise.id, date: offsetKey(-2), completed: true, completedAt: new Date() },
    });

    const res = await request(app).post('/api/daily-exercise/complete').set('Cookie', officeCookie);
    expect(res.status).toBe(200);
    expect(res.body.streak).toBe(1);
  });
});
