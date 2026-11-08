import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Prisma, Role, Track } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { MIN_SAMPLE } from '../quality/contentHealth';

/** ROBOTICS has no real curriculum, so only this file's content is counted. */
const app = createApp();
const unique = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const cookieFor = (userId: string, role: Role) => `${AUTH_COOKIE_NAME}=${signToken({ sub: userId, role, track: null })}`;

let teacherCookie: string;
let otherTeacherCookie: string;
let classId: string;
let brokenProblemId: string;
let noTestsProblemId: string;
let healthyProblemId: string;
let lessonId: string;
const userIds: string[] = [];

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const make = (label: string, role: Role) =>
    prisma.user.create({
      data: { email: `${unique(label)}@vitest.local`, passwordHash, name: label, role, track: role === Role.STUDENT ? Track.ROBOTICS : null },
    });
  const teacher = await make('q-teacher', Role.TEACHER);
  const other = await make('q-other', Role.TEACHER);
  const students = await Promise.all(Array.from({ length: MIN_SAMPLE }, (_, i) => make(`q-student-${i}`, Role.STUDENT)));
  userIds.push(teacher.id, other.id, ...students.map((s) => s.id));
  teacherCookie = cookieFor(teacher.id, Role.TEACHER);
  otherTeacherCookie = cookieFor(other.id, Role.TEACHER);

  classId = (await prisma.classGroup.create({ data: { title: unique('Q class'), track: Track.ROBOTICS, teacherId: teacher.id } })).id;
  lessonId = (
    await prisma.lesson.create({
      data: {
        key: unique('vitest-q'), track: Track.ROBOTICS, order: 1, month: 1, week: 1, title: 'Sifat darsi',
        section: 'Vitest', summary: 'Test', objectives: ['a'], homeworkMain: 'A', homeworkReview: ['B'],
        makeEasy: 'o', makeMedium: 'o', makeHard: 'q', quiz: [],
      },
    })
  ).id;
  const tests = [{ stdin: '', expectedStdout: '1', hidden: false, label: 't' }] as Prisma.InputJsonValue;
  const makeProblem = (title: string, testCases: Prisma.InputJsonValue) =>
    prisma.problem.create({
      data: { key: unique('vitest-q-p'), title, difficulty: 'EASY', points: 10, tags: [], description: 'T', lessonId, testCases },
    });
  brokenProblemId = (await makeProblem('Buzuq', tests)).id;
  noTestsProblemId = (await makeProblem('Testsiz', [] as Prisma.InputJsonValue)).id;
  healthyProblemId = (await makeProblem("Sog'lom", tests)).id;

  for (const student of students) {
    await prisma.problemSubmission.createMany({
      data: [
        { problemId: brokenProblemId, userId: student.id, code: 'x', language: 'python', passed: false, feedback: '', pointsAwarded: 0 },
        // A Parsons pass is not written code and must not hide the problem.
        { problemId: brokenProblemId, userId: student.id, code: 'x', language: 'parsons', passed: true, feedback: '', pointsAwarded: 0 },
        { problemId: healthyProblemId, userId: student.id, code: 'x', language: 'python', passed: true, feedback: '', pointsAwarded: 0 },
      ],
    });
  }
});

afterAll(async () => {
  await prisma.lesson.deleteMany({ where: { id: lessonId } });
  await prisma.classGroup.deleteMany({ where: { id: classId } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});

describe('GET /api/quality/class/:classId', () => {
  it("refuses a teacher who does not own the class", async () => {
    const res = await request(app).get(`/api/quality/class/${classId}`).set('Cookie', otherTeacherCookie);
    expect(res.status).toBe(403);
  });

  it('flags the problem nobody solves and the one without tests, not the healthy one', async () => {
    const res = await request(app).get(`/api/quality/class/${classId}`).set('Cookie', teacherCookie);
    expect(res.status).toBe(200);
    const byId = new Map(res.body.issues.map((i: { id: string; flag: string }) => [i.id, i.flag]));
    expect(byId.get(brokenProblemId)).toBe('nobody_solves');
    expect(byId.get(noTestsProblemId)).toBe('no_tests');
    expect(byId.has(healthyProblemId)).toBe(false);
  });
});
