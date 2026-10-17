import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Role, Track } from '@prisma/client';

vi.mock('../ai/gemini', async () => {
  const actual = await vi.importActual<typeof import('../ai/gemini')>('../ai/gemini');
  return { ...actual, askGeminiJson: vi.fn() };
});

import { askGeminiJson } from '../ai/gemini';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';

const app = createApp();
const unique = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const cookieFor = (id: string, role: Role) => `${AUTH_COOKIE_NAME}=${signToken({ sub: id, role, track: null })}`;

let teacherCookie: string;
let studentCookie: string;
let otherTeacherCookie: string;
let withTextId: string;
let linkOnlyId: string;
let classId: string;
let assignmentId: string;
const userIds: string[] = [];

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const make = (label: string, role: Role) =>
    prisma.user.create({ data: { email: `${unique(label)}@vitest.local`, passwordHash, name: label, role } });
  const [teacher, other, a, b] = await Promise.all([
    make('ai-teacher', Role.TEACHER),
    make('ai-other', Role.TEACHER),
    make('ai-student-a', Role.STUDENT),
    make('ai-student-b', Role.STUDENT),
  ]);
  userIds.push(teacher.id, other.id, a.id, b.id);
  teacherCookie = cookieFor(teacher.id, teacher.role);
  otherTeacherCookie = cookieFor(other.id, other.role);
  studentCookie = cookieFor(a.id, a.role);

  const group = await prisma.classGroup.create({
    data: { title: unique('AI class'), track: Track.ROBOTICS, teacherId: teacher.id },
  });
  classId = group.id;
  const assignment = await prisma.assignment.create({
    data: { title: 'AI vazifa', description: 'Ikki sonni qo\'shuvchi funksiya yozing', track: Track.ROBOTICS, classId, dueDate: new Date() },
  });
  assignmentId = assignment.id;
  withTextId = (
    await prisma.submission.create({
      data: { assignmentId, userId: a.id, content: 'def add(a, b):\n    return a + b', status: 'SUBMITTED' },
    })
  ).id;
  linkOnlyId = (
    await prisma.submission.create({
      data: { assignmentId, userId: b.id, githubUrl: 'https://github.com/x/y', status: 'SUBMITTED' },
    })
  ).id;
});

beforeEach(() => {
  vi.mocked(askGeminiJson).mockReset();
});

afterAll(async () => {
  await prisma.assignment.deleteMany({ where: { id: assignmentId } });
  await prisma.classGroup.deleteMany({ where: { id: classId } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});

describe('POST /api/submissions/:id/ai-review', () => {
  it('stores a validated suggestion without grading the work', async () => {
    vi.mocked(askGeminiJson).mockResolvedValue({
      score: 87.6,
      summary: 'Funksiya to\'g\'ri ishlaydi.',
      strengths: ['Qisqa'],
      improvements: ['Tip izohlari qo\'shing'],
    });
    const res = await request(app).post(`/api/submissions/${withTextId}/ai-review`).set('Cookie', teacherCookie);
    expect(res.status).toBe(200);
    expect(res.body.aiReview).toMatchObject({ score: 88, strengths: ['Qisqa'] });

    const row = await prisma.submission.findUniqueOrThrow({ where: { id: withTextId } });
    expect(row.aiReviewedAt).not.toBeNull();
    expect(row.status).toBe('SUBMITTED');
    expect(await prisma.grade.count({ where: { assignmentId } })).toBe(0);
  });

  it('never shows the suggestion to the student', async () => {
    const one = await request(app).get(`/api/assignments/${assignmentId}`).set('Cookie', studentCookie);
    expect(one.status).toBe(200);
    expect(one.body.submission.content).toContain('def add');
    expect(one.body.submission).not.toHaveProperty('aiReview');
    const list = await request(app).get('/api/assignments').set('Cookie', studentCookie);
    expect(JSON.stringify(list.body)).not.toContain('aiReview');
  });

  it('refuses a second paid request within the cooldown', async () => {
    const res = await request(app).post(`/api/submissions/${withTextId}/ai-review`).set('Cookie', teacherCookie);
    expect(res.status).toBe(429);
    expect(askGeminiJson).not.toHaveBeenCalled();
  });

  it('clears the old suggestion when the student hands in again', async () => {
    const res = await request(app)
      .post(`/api/assignments/${assignmentId}/submissions`)
      .set('Cookie', studentCookie)
      .send({ githubUrl: 'https://github.com/x/add', content: 'def add(a, b):\n    return b + a' });
    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty('aiReview');
    const row = await prisma.submission.findUniqueOrThrow({ where: { id: withTextId } });
    expect(row.aiReview).toBeNull();
    expect(row.aiReviewedAt).toBeNull();
  });

  it('rejects a malformed model answer instead of storing it', async () => {
    await prisma.submission.update({ where: { id: withTextId }, data: { aiReviewedAt: null } });
    vi.mocked(askGeminiJson).mockResolvedValue({ score: 'juda yaxshi' });
    const res = await request(app).post(`/api/submissions/${withTextId}/ai-review`).set('Cookie', teacherCookie);
    expect(res.status).toBe(502);
  });

  it('refuses work with no text for the model to read', async () => {
    const res = await request(app).post(`/api/submissions/${linkOnlyId}/ai-review`).set('Cookie', teacherCookie);
    expect(res.status).toBe(422);
    expect(askGeminiJson).not.toHaveBeenCalled();
  });

  it("refuses another teacher's class", async () => {
    const res = await request(app).post(`/api/submissions/${withTextId}/ai-review`).set('Cookie', otherTeacherCookie);
    expect(res.status).toBe(403);
  });
});
