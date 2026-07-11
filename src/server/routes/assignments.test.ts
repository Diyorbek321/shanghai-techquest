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

function cookieFor(userId: string, role: Role, track: Track | null): string {
  const token = signToken({ sub: userId, role, track });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

let studentId: string;
let studentCookie: string;
let teacherId: string;
let teacherCookie: string;
let assignmentId: string;

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const student = await prisma.user.create({
    data: { email: uniqueEmail('student'), passwordHash, name: 'Test Student', role: Role.STUDENT, track: Track.FRONTEND },
  });
  const teacher = await prisma.user.create({
    data: { email: uniqueEmail('teacher'), passwordHash, name: 'Test Teacher', role: Role.TEACHER },
  });
  studentId = student.id;
  teacherId = teacher.id;
  studentCookie = cookieFor(student.id, student.role, student.track);
  teacherCookie = cookieFor(teacher.id, teacher.role, teacher.track);

  const assignment = await prisma.assignment.create({
    data: {
      title: 'Test Assignment',
      description: 'Test description',
      track: Track.FRONTEND,
      dueDate: new Date(Date.now() + 86_400_000),
      xpReward: 100,
    },
  });
  assignmentId = assignment.id;
});

afterAll(async () => {
  await prisma.assignment.delete({ where: { id: assignmentId } });
  await prisma.user.deleteMany({ where: { id: { in: [studentId, teacherId] } } });
  await prisma.$disconnect();
});

describe('POST /api/assignments/:id/submissions', () => {
  it('rejects a submission without a githubUrl', async () => {
    const res = await request(app)
      .post(`/api/assignments/${assignmentId}/submissions`)
      .set('Cookie', studentCookie)
      .send({ demoUrl: 'https://example.com' });

    expect(res.status).toBe(400);
  });

  it('rejects a non-http(s) githubUrl scheme', async () => {
    const res = await request(app)
      .post(`/api/assignments/${assignmentId}/submissions`)
      .set('Cookie', studentCookie)
      .send({ githubUrl: 'javascript:alert(1)' });

    expect(res.status).toBe(400);
  });

  it('rejects submissions from a non-student role', async () => {
    const res = await request(app)
      .post(`/api/assignments/${assignmentId}/submissions`)
      .set('Cookie', teacherCookie)
      .send({ githubUrl: 'https://github.com/example/repo' });

    expect(res.status).toBe(403);
  });

  it('accepts a valid submission with githubUrl and demoUrl', async () => {
    const res = await request(app)
      .post(`/api/assignments/${assignmentId}/submissions`)
      .set('Cookie', studentCookie)
      .send({
        githubUrl: 'https://github.com/example/repo',
        demoUrl: 'https://example.vercel.app',
        content: 'Some notes',
      });

    expect(res.status).toBe(201);
    expect(res.body.githubUrl).toBe('https://github.com/example/repo');
    expect(res.body.demoUrl).toBe('https://example.vercel.app');
    expect(res.body.status).toBe('SUBMITTED');
  });
});

describe('GET /api/assignments/:id/submissions', () => {
  it('rejects a student from listing submissions', async () => {
    const res = await request(app)
      .get(`/api/assignments/${assignmentId}/submissions`)
      .set('Cookie', studentCookie);

    expect(res.status).toBe(403);
  });

  it('lets a teacher list submissions with student info', async () => {
    await request(app)
      .post(`/api/assignments/${assignmentId}/submissions`)
      .set('Cookie', studentCookie)
      .send({ githubUrl: 'https://github.com/example/repo' });

    const res = await request(app)
      .get(`/api/assignments/${assignmentId}/submissions`)
      .set('Cookie', teacherCookie);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].user.name).toBe('Test Student');
  });
});
