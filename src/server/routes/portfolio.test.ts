import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Difficulty, Role, SubmissionStatus, Track } from '@prisma/client';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { portfolioRouter } from './portfolio';
import { DEFAULT_PROJECT_RUBRIC, parseRubricCriteria, parseRubricScores, scoreFromRubric } from '../lessons/rubric';

// The router is mounted standalone: src/server/routes/index.ts is owned by the
// wiring agent, so this suite must not depend on it having landed yet.
function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/portfolio', portfolioRouter);
  return app;
}

const app = buildApp();

const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const uniqueEmail = (label: string) => `${label}-${suffix}@portfolio.vitest.test`;

function cookieFor(userId: string, role: Role, track: Track | null): string {
  const token = signToken({ sub: userId, role, track });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

let publicStudentId: string;
let publicStudentCookie: string;
let privateStudentId: string;
let privateStudentCookie: string;
let strangerCookie: string;
let strangerId: string;
let teacherId: string;
let teacherCookie: string;

let lessonId: string;
let assignmentId: string;
let submissionId: string;
let privateSubmissionId: string;
let problemId: string;

async function createProjectLesson(key: string, order: number) {
  return prisma.lesson.create({
    data: {
      key,
      track: Track.BACKEND,
      order,
      month: 1,
      week: 1,
      title: 'Yakuniy loyiha: REST API',
      section: 'Backend',
      summary: 'Kichik REST API yozish.',
      objectives: ['API yozish'],
      homeworkMain: 'API tayyorlang',
      homeworkReview: [],
      makeEasy: 'oson',
      makeMedium: "o'rta",
      makeHard: 'qiyin',
      quiz: [],
      kind: 'project',
    },
  });
}

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);

  const [publicStudent, privateStudent, stranger, teacher] = await Promise.all([
    prisma.user.create({
      data: {
        email: uniqueEmail('public'),
        passwordHash,
        name: 'Ochiq Talaba',
        role: Role.STUDENT,
        track: Track.BACKEND,
        profilePublic: true,
      },
    }),
    prisma.user.create({
      data: {
        email: uniqueEmail('private'),
        passwordHash,
        name: 'Yopiq Talaba',
        role: Role.STUDENT,
        track: Track.BACKEND,
        profilePublic: false,
      },
    }),
    prisma.user.create({
      data: { email: uniqueEmail('stranger'), passwordHash, name: 'Begona', role: Role.STUDENT, track: Track.BACKEND },
    }),
    prisma.user.create({
      data: { email: uniqueEmail('teacher'), passwordHash, name: "O'qituvchi", role: Role.TEACHER },
    }),
  ]);

  publicStudentId = publicStudent.id;
  publicStudentCookie = cookieFor(publicStudent.id, publicStudent.role, publicStudent.track);
  privateStudentId = privateStudent.id;
  privateStudentCookie = cookieFor(privateStudent.id, privateStudent.role, privateStudent.track);
  strangerId = stranger.id;
  strangerCookie = cookieFor(stranger.id, stranger.role, stranger.track);
  teacherId = teacher.id;
  teacherCookie = cookieFor(teacher.id, teacher.role, teacher.track);

  const lesson = await createProjectLesson(`portfolio-test-project-${suffix}`, 900_000 + Math.floor(Math.random() * 1000));
  lessonId = lesson.id;

  const assignment = await prisma.assignment.create({
    data: {
      title: 'Yakuniy loyiha topshirig‘i',
      description: 'REST API',
      track: Track.BACKEND,
      lessonId: lesson.id,
      dueDate: new Date(Date.now() + 86_400_000),
      xpReward: 0,
      moduleKey: `portfolio-test-${suffix}`,
    },
  });
  assignmentId = assignment.id;

  const [submission, privateSubmission] = await Promise.all([
    prisma.submission.create({
      data: {
        assignmentId: assignment.id,
        userId: publicStudent.id,
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date(),
        content: 'MAXFIY-KOD-BLOKI',
        githubUrl: 'https://github.com/example/final-api',
        demoUrl: 'https://demo.example.com',
      },
    }),
    prisma.submission.create({
      data: {
        assignmentId: assignment.id,
        userId: privateStudent.id,
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date(),
        githubUrl: 'https://github.com/example/private-api',
      },
    }),
  ]);
  submissionId = submission.id;
  privateSubmissionId = privateSubmission.id;

  const problem = await prisma.problem.create({
    data: {
      key: `portfolio-test-problem-${suffix}`,
      title: 'Ikki sonni qo‘shish',
      difficulty: Difficulty.EASY,
      points: 10,
      tags: ['math'],
      description: 'Ikki sonni qo‘shing.',
      testCases: [],
    },
  });
  problemId = problem.id;

  // Two passing rows for the same problem: the portfolio must de-duplicate.
  await prisma.problemSubmission.createMany({
    data: [
      {
        problemId: problem.id,
        userId: publicStudent.id,
        code: 'print(1)',
        language: 'python',
        passed: true,
        feedback: 'ok',
        pointsAwarded: 10,
      },
      {
        problemId: problem.id,
        userId: publicStudent.id,
        code: 'print(1)',
        language: 'python',
        passed: true,
        feedback: 'ok',
        pointsAwarded: 0,
      },
      {
        problemId: problem.id,
        userId: publicStudent.id,
        code: 'print(2)',
        language: 'python',
        passed: false,
        feedback: 'xato',
        pointsAwarded: 0,
      },
    ],
  });
});

afterAll(async () => {
  const userIds = [publicStudentId, privateStudentId, strangerId, teacherId].filter(Boolean);
  await prisma.grade.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.problemSubmission.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.submission.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.problem.deleteMany({ where: { id: problemId } });
  await prisma.assignment.deleteMany({ where: { id: assignmentId } });
  await prisma.projectRubric.deleteMany({ where: { lessonId } });
  await prisma.lesson.deleteMany({ where: { id: lessonId } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});

describe('rubric helpers', () => {
  it('ships a default rubric whose maxPoints sum to 100', () => {
    const total = DEFAULT_PROJECT_RUBRIC.reduce((sum, criterion) => sum + criterion.maxPoints, 0);
    expect(total).toBe(100);
    expect(DEFAULT_PROJECT_RUBRIC.length).toBeGreaterThanOrEqual(4);
  });

  it('falls back to the default rubric for malformed criteria Json instead of throwing', () => {
    expect(() => parseRubricCriteria({ nope: true })).not.toThrow();
    expect(parseRubricCriteria({ nope: true })).toHaveLength(DEFAULT_PROJECT_RUBRIC.length);
    expect(parseRubricCriteria(null)).toHaveLength(DEFAULT_PROJECT_RUBRIC.length);
    expect(parseRubricCriteria([{ label: 'X', maxPoints: 50, hint: '' }])).toEqual([
      { label: 'X', maxPoints: 50, hint: '' },
    ]);
  });

  it('reads malformed score Json as "not graded yet"', () => {
    expect(parseRubricScores('garbage')).toEqual([]);
    expect(parseRubricScores([{ label: 'Kod sifati' }])).toEqual([]);
    expect(parseRubricScores([])).toEqual([]);
  });

  it('ignores unknown labels, clamps over-max points and counts a label once', () => {
    const scores = [
      { label: 'Funksionallik', points: 999, note: '' },
      { label: 'Funksionallik', points: 40, note: 'takror' },
      { label: 'Yo‘q mezon', points: 500, note: '' },
      { label: 'Kod sifati', points: -10, note: '' },
    ];
    expect(scoreFromRubric(scores)).toBe(40);
  });
});

describe('GET /api/portfolio/:userId', () => {
  it('lets a stranger read a public portfolio', async () => {
    const res = await request(app).get(`/api/portfolio/${publicStudentId}`).set('Cookie', strangerCookie);
    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('Ochiq Talaba');
    expect(res.body.solvedCount).toBe(1);
    expect(res.body.solved[0].title).toBe('Ikki sonni qo‘shish');
    expect(res.body.projects).toHaveLength(1);
    expect(res.body.projects[0].githubUrl).toBe('https://github.com/example/final-api');
    expect(res.body.projects[0].demoUrl).toBe('https://demo.example.com');
  });

  it('never exposes email or submitted code', async () => {
    const res = await request(app).get(`/api/portfolio/${publicStudentId}`).set('Cookie', strangerCookie);
    const body = JSON.stringify(res.body);
    expect(body).not.toContain('@portfolio.vitest.test');
    expect(body).not.toContain('email');
    expect(body).not.toContain('MAXFIY-KOD-BLOKI');
    expect(body).not.toContain('print(1)');
    expect(body).not.toContain('passwordHash');
  });

  it('404s a private portfolio for a stranger without confirming the account exists', async () => {
    const res = await request(app).get(`/api/portfolio/${privateStudentId}`).set('Cookie', strangerCookie);
    expect(res.status).toBe(404);
    const missing = await request(app).get('/api/portfolio/does-not-exist').set('Cookie', strangerCookie);
    expect(missing.status).toBe(404);
    expect(res.body).toEqual(missing.body);
  });

  it('lets the owner read their own private portfolio', async () => {
    const res = await request(app).get(`/api/portfolio/${privateStudentId}`).set('Cookie', privateStudentCookie);
    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(privateStudentId);
  });

  it('lets a teacher read a private portfolio', async () => {
    const res = await request(app).get(`/api/portfolio/${privateStudentId}`).set('Cookie', teacherCookie);
    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(privateStudentId);
    expect(JSON.stringify(res.body)).not.toContain('@portfolio.vitest.test');
  });

  it('requires authentication', async () => {
    const res = await request(app).get(`/api/portfolio/${publicStudentId}`);
    expect(res.status).toBe(401);
  });

  it('degrades safely when the stored rubric Json is malformed', async () => {
    await prisma.submission.update({
      where: { id: submissionId },
      data: { rubricScores: { broken: 'yes' } },
    });

    const res = await request(app).get(`/api/portfolio/${publicStudentId}`).set('Cookie', strangerCookie);
    expect(res.status).toBe(200);
    expect(res.body.projects[0].rubricTotal).toBeNull();
    expect(res.body.projects[0].rubricScores).toEqual([]);
    expect(res.body.projects[0].rubricMax).toBe(100);

    await prisma.submission.update({ where: { id: submissionId }, data: { rubricScores: [] } });
  });
});

describe('POST /api/portfolio/projects/:submissionId/defense', () => {
  it('lets the owner write their defense', async () => {
    const res = await request(app)
      .post(`/api/portfolio/projects/${submissionId}/defense`)
      .set('Cookie', publicStudentCookie)
      .send({ defense: 'Men Express va Prisma tanladim, chunki ular tez va xavfsiz.' });
    expect(res.status).toBe(200);
    expect(res.body.defense).toContain('Express');

    const portfolio = await request(app).get(`/api/portfolio/${publicStudentId}`).set('Cookie', strangerCookie);
    expect(portfolio.body.projects[0].defense).toContain('Express');
  });

  it('rejects a non-owner with 403', async () => {
    const res = await request(app)
      .post(`/api/portfolio/projects/${submissionId}/defense`)
      .set('Cookie', strangerCookie)
      .send({ defense: 'Bu mening loyiham emas.' });
    expect(res.status).toBe(403);
  });

  it('rejects an empty or over-long defense', async () => {
    const empty = await request(app)
      .post(`/api/portfolio/projects/${submissionId}/defense`)
      .set('Cookie', publicStudentCookie)
      .send({ defense: '   ' });
    expect(empty.status).toBe(400);

    const tooLong = await request(app)
      .post(`/api/portfolio/projects/${submissionId}/defense`)
      .set('Cookie', publicStudentCookie)
      .send({ defense: 'a'.repeat(2001) });
    expect(tooLong.status).toBe(400);
  });
});

describe('POST /api/portfolio/projects/:submissionId/rubric', () => {
  it('rejects a student with 403', async () => {
    const res = await request(app)
      .post(`/api/portfolio/projects/${submissionId}/rubric`)
      .set('Cookie', publicStudentCookie)
      .send({ scores: [{ label: 'Funksionallik', points: 40 }] });
    expect(res.status).toBe(403);
  });

  it('stores clamped scores and writes a Grade row for the teacher', async () => {
    const res = await request(app)
      .post(`/api/portfolio/projects/${submissionId}/rubric`)
      .set('Cookie', teacherCookie)
      .send({
        scores: [
          { label: 'Funksionallik', points: 999, note: 'Hammasi ishlaydi' },
          { label: 'Kod sifati', points: 20, note: 'Yaxshi' },
          { label: 'Nomalum mezon', points: 50, note: 'e‘tiborsiz' },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(60);
    expect(res.body.maxScore).toBe(100);
    expect(res.body.rubricScores).toHaveLength(2);
    expect(res.body.status).toBe('GRADED');

    const grade = await prisma.grade.findFirst({ where: { userId: publicStudentId, assignmentId } });
    expect(grade).not.toBeNull();
    expect(grade?.score).toBe(60);
    expect(grade?.maxScore).toBe(100);
  });

  it('updates the same Grade row on re-grade instead of creating a second one', async () => {
    const res = await request(app)
      .post(`/api/portfolio/projects/${submissionId}/rubric`)
      .set('Cookie', teacherCookie)
      .send({ scores: [{ label: 'Funksionallik', points: 30 }] });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(30);

    const grades = await prisma.grade.findMany({ where: { userId: publicStudentId, assignmentId } });
    expect(grades).toHaveLength(1);
    expect(grades[0].score).toBe(30);
  });

  it('400s when no submitted label matches the rubric', async () => {
    const res = await request(app)
      .post(`/api/portfolio/projects/${privateSubmissionId}/rubric`)
      .set('Cookie', teacherCookie)
      .send({ scores: [{ label: 'Butunlay boshqa narsa', points: 10 }] });
    expect(res.status).toBe(400);
  });

  it('404s for an unknown submission', async () => {
    const res = await request(app)
      .post('/api/portfolio/projects/nope/rubric')
      .set('Cookie', teacherCookie)
      .send({ scores: [{ label: 'Funksionallik', points: 10 }] });
    expect(res.status).toBe(404);
  });

  it('honours a lesson-specific rubric when one exists', async () => {
    await prisma.projectRubric.create({
      data: { lessonId, criteria: [{ label: 'Deploy', maxPoints: 60, hint: 'Ishlab turibdimi?' }] },
    });

    const res = await request(app)
      .post(`/api/portfolio/projects/${privateSubmissionId}/rubric`)
      .set('Cookie', teacherCookie)
      .send({
        scores: [
          { label: 'Deploy', points: 100 },
          { label: 'Funksionallik', points: 40 },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(60);
    expect(res.body.maxScore).toBe(60);
    expect(res.body.rubricScores).toEqual([{ label: 'Deploy', points: 60, note: '' }]);

    await prisma.projectRubric.deleteMany({ where: { lessonId } });
  });
});
