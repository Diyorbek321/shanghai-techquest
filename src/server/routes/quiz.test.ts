import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Role, Track } from '@prisma/client';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { quizRouter, QUIZ_XP_REWARD } from './quiz';

/**
 * The router is mounted locally rather than through createApp(): a separate
 * agent owns src/server/routes/index.ts, so these tests must not depend on the
 * wiring having landed yet.
 */
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/quiz', quizRouter);

const unique = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function cookieFor(userId: string, role: Role, track: Track | null): string {
  return `${AUTH_COOKIE_NAME}=${signToken({ sub: userId, role, track })}`;
}

const lessonOneKey = unique('vitest-quiz-lesson-1');
const lessonTwoKey = unique('vitest-quiz-lesson-2');

let studentId: string;
let studentCookie: string;
let otherTrackCookie: string;
let otherTrackStudentId: string;
let lessonOneId: string;
let lessonTwoId: string;
let q1Id: string;
let q2Id: string;
let lessonTwoQuestionId: string;
const CORRECT_INDEX = 2;

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

function lessonData(key: string, order: number) {
  return {
    key,
    track: Track.BACKEND,
    order,
    month: 98,
    week: 98,
    title: `Vitest quiz dars ${order}`,
    section: 'Vitest',
    summary: 'Test lesson',
    objectives: ['a'],
    homeworkMain: 'Asosiy topshiriq',
    homeworkReview: ['Takrorlash'],
    makeEasy: 'oson',
    makeMedium: "o'rta",
    makeHard: 'qiyin',
    quiz: ['q1'],
    kind: 'lesson',
    xpReward: 100,
  };
}

function questionData(lessonId: string, order: number) {
  return {
    lessonId,
    order,
    prompt: `Node.js da nima ${order}?`,
    choices: ['Birinchi', 'Ikkinchi', "To'g'ri javob", "To'rtinchi"],
    correctIndex: CORRECT_INDEX,
    explanation: "MAXFIY-IZOH-SIZIB-KETMASLIGI-KERAK",
  };
}

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const [student, otherStudent] = await Promise.all([
    prisma.user.create({
      data: {
        email: `${unique('quiz-student')}@vitest.local`,
        passwordHash,
        name: 'Quiz Student',
        role: Role.STUDENT,
        track: Track.BACKEND,
      },
    }),
    prisma.user.create({
      data: {
        email: `${unique('quiz-frontend')}@vitest.local`,
        passwordHash,
        name: 'Frontend Student',
        role: Role.STUDENT,
        track: Track.FRONTEND,
      },
    }),
  ]);
  studentId = student.id;
  otherTrackStudentId = otherStudent.id;
  studentCookie = cookieFor(student.id, student.role, student.track);
  otherTrackCookie = cookieFor(otherStudent.id, otherStudent.role, otherStudent.track);

  const [lessonOne, lessonTwo] = await Promise.all([
    prisma.lesson.create({ data: lessonData(lessonOneKey, 9800) }),
    prisma.lesson.create({ data: lessonData(lessonTwoKey, 9801) }),
  ]);
  lessonOneId = lessonOne.id;
  lessonTwoId = lessonTwo.id;

  const [q1, q2, lessonTwoQuestion] = await Promise.all([
    prisma.quizQuestion.create({ data: questionData(lessonOneId, 1) }),
    prisma.quizQuestion.create({ data: questionData(lessonOneId, 2) }),
    prisma.quizQuestion.create({ data: questionData(lessonTwoId, 1) }),
  ]);
  q1Id = q1.id;
  q2Id = q2.id;
  lessonTwoQuestionId = lessonTwoQuestion.id;
});

beforeEach(async () => {
  await prisma.quizAttempt.deleteMany({ where: { userId: studentId } });
  await prisma.user.update({ where: { id: studentId }, data: { xp: 0 } });
});

afterAll(async () => {
  await prisma.quizAttempt.deleteMany({ where: { userId: { in: [studentId, otherTrackStudentId] } } });
  await prisma.quizQuestion.deleteMany({ where: { lessonId: { in: [lessonOneId, lessonTwoId] } } });
  await prisma.lesson.deleteMany({ where: { key: { in: [lessonOneKey, lessonTwoKey] } } });
  await prisma.user.deleteMany({ where: { id: { in: [studentId, otherTrackStudentId] } } });
  await prisma.$disconnect();
});

const answer = (questionId: string, choiceIndex: number, cookie = studentCookie) =>
  request(app).post(`/api/quiz/${questionId}/answer`).set('Cookie', cookie).send({ choiceIndex });

describe('GET /api/quiz/:lessonKey', () => {
  it('requires authentication', async () => {
    await request(app).get(`/api/quiz/${lessonOneKey}`).expect(401);
  });

  it('NEVER leaks correctIndex or explanation', async () => {
    const res = await request(app).get(`/api/quiz/${lessonOneKey}`).set('Cookie', studentCookie).expect(200);

    expect(res.body.questions).toHaveLength(2);
    res.body.questions.forEach((question: Record<string, unknown>) => {
      // Exact key set — a new field must be added deliberately, never by spread.
      expect(Object.keys(question).sort()).toEqual(['choices', 'id', 'isReview', 'lessonKey', 'prompt']);
      expect(question).not.toHaveProperty('correctIndex');
      expect(question).not.toHaveProperty('explanation');
    });
    // Belt and braces: the answer key must not appear anywhere in the payload.
    const raw = JSON.stringify(res.body);
    expect(raw).not.toContain('correctIndex');
    expect(raw).not.toContain('MAXFIY-IZOH');
  });

  it('serves the current lesson questions in order, none marked as review', async () => {
    const res = await request(app).get(`/api/quiz/${lessonOneKey}`).set('Cookie', studentCookie).expect(200);
    expect(res.body.lessonKey).toBe(lessonOneKey);
    expect(res.body.questions.map((q: { id: string }) => q.id)).toEqual([q1Id, q2Id]);
    expect(res.body.questions.every((q: { isReview: boolean }) => q.isReview === false)).toBe(true);
    expect(res.body.questions[0].choices).toHaveLength(4);
  });

  it('interleaves due questions from earlier lessons and flags them as review', async () => {
    await prisma.quizAttempt.create({
      data: {
        userId: studentId,
        questionId: q1Id,
        correct: true,
        streak: 1,
        timesSeen: 1,
        timesCorrect: 1,
        dueAt: new Date(Date.now() - DAY),
      },
    });

    const res = await request(app).get(`/api/quiz/${lessonTwoKey}`).set('Cookie', studentCookie).expect(200);
    const review = res.body.questions.find((q: { id: string }) => q.id === q1Id);
    expect(review).toBeDefined();
    expect(review.isReview).toBe(true);
    expect(review.lessonKey).toBe(lessonOneKey);
    // Reviews come first, current lesson after.
    expect(res.body.questions[0].id).toBe(q1Id);
    expect(res.body.questions.map((q: { id: string }) => q.id)).toContain(lessonTwoQuestionId);
  });

  it('does not interleave a question that is not due yet', async () => {
    await prisma.quizAttempt.create({
      data: {
        userId: studentId,
        questionId: q1Id,
        correct: true,
        streak: 3,
        timesSeen: 3,
        timesCorrect: 3,
        dueAt: new Date(Date.now() + 4 * DAY),
      },
    });

    const res = await request(app).get(`/api/quiz/${lessonTwoKey}`).set('Cookie', studentCookie).expect(200);
    expect(res.body.questions.map((q: { id: string }) => q.id)).toEqual([lessonTwoQuestionId]);
  });

  it('blocks a student from another track', async () => {
    const res = await request(app).get(`/api/quiz/${lessonOneKey}`).set('Cookie', otherTrackCookie).expect(403);
    expect(res.body.error).toBe("Bu dars sizning yo'nalishingizga tegishli emas.");
  });

  it('404s for an unknown lesson', async () => {
    await request(app).get('/api/quiz/no-such-lesson').set('Cookie', studentCookie).expect(404);
  });
});

describe('POST /api/quiz/:questionId/answer', () => {
  it('requires authentication', async () => {
    await request(app).post(`/api/quiz/${q1Id}/answer`).send({ choiceIndex: 0 }).expect(401);
  });

  it('reveals the answer only after the student commits, and advances the streak', async () => {
    const before = Date.now();
    const res = await answer(q1Id, CORRECT_INDEX).expect(200);

    expect(res.body.correct).toBe(true);
    expect(res.body.correctIndex).toBe(CORRECT_INDEX);
    expect(res.body.explanation).toContain('MAXFIY-IZOH');

    const attempt = await prisma.quizAttempt.findUnique({
      where: { userId_questionId: { userId: studentId, questionId: q1Id } },
    });
    expect(attempt?.streak).toBe(1);
    expect(attempt?.timesSeen).toBe(1);
    expect(attempt?.timesCorrect).toBe(1);
    expect(attempt?.correct).toBe(true);
    // First correct answer -> one day out.
    expect(attempt!.dueAt.getTime()).toBeGreaterThan(before + DAY - MINUTE);
    expect(attempt!.dueAt.getTime()).toBeLessThan(before + DAY + MINUTE);
  });

  it('grades a wrong choice as wrong', async () => {
    const res = await answer(q1Id, 0).expect(200);
    expect(res.body.correct).toBe(false);
    expect(res.body.correctIndex).toBe(CORRECT_INDEX);
  });

  it('resets the streak and requeues the question inside the same session on a wrong answer', async () => {
    await answer(q1Id, CORRECT_INDEX).expect(200);
    await answer(q1Id, CORRECT_INDEX).expect(200);

    const before = Date.now();
    await answer(q1Id, 0).expect(200);

    const attempt = await prisma.quizAttempt.findUnique({
      where: { userId_questionId: { userId: studentId, questionId: q1Id } },
    });
    expect(attempt?.streak).toBe(0);
    expect(attempt?.timesSeen).toBe(3);
    expect(attempt?.timesCorrect).toBe(2);
    expect(attempt!.dueAt.getTime()).toBeGreaterThan(before);
    expect(attempt!.dueAt.getTime()).toBeLessThanOrEqual(before + 11 * MINUTE);
  });

  it('awards XP on the first-ever correct answer only', async () => {
    const first = await answer(q1Id, CORRECT_INDEX).expect(200);
    expect(first.body.xpAwarded).toBe(QUIZ_XP_REWARD);
    const afterFirst = await prisma.user.findUnique({ where: { id: studentId }, select: { xp: true } });
    expect(afterFirst?.xp).toBe(QUIZ_XP_REWARD);

    // A re-review of the same question must never pay again.
    const second = await answer(q1Id, CORRECT_INDEX).expect(200);
    expect(second.body.xpAwarded).toBe(0);
    const third = await answer(q1Id, CORRECT_INDEX).expect(200);
    expect(third.body.xpAwarded).toBe(0);

    const afterReviews = await prisma.user.findUnique({ where: { id: studentId }, select: { xp: true } });
    expect(afterReviews?.xp).toBe(QUIZ_XP_REWARD);
  });

  it('awards no XP for a wrong answer, then pays once when it is finally right', async () => {
    const wrong = await answer(q1Id, 0).expect(200);
    expect(wrong.body.xpAwarded).toBe(0);
    expect((await prisma.user.findUnique({ where: { id: studentId }, select: { xp: true } }))?.xp).toBe(0);

    const right = await answer(q1Id, CORRECT_INDEX).expect(200);
    expect(right.body.xpAwarded).toBe(QUIZ_XP_REWARD);
    expect((await prisma.user.findUnique({ where: { id: studentId }, select: { xp: true } }))?.xp).toBe(
      QUIZ_XP_REWARD
    );
  });

  it('rejects a choiceIndex beyond the question\'s own choices', async () => {
    await answer(q1Id, 4).expect(400);
    await answer(q1Id, 99).expect(400);
    await answer(q1Id, -1).expect(400);
  });

  it('rejects a malformed body', async () => {
    await request(app).post(`/api/quiz/${q1Id}/answer`).set('Cookie', studentCookie).send({}).expect(400);
    await request(app)
      .post(`/api/quiz/${q1Id}/answer`)
      .set('Cookie', studentCookie)
      .send({ choiceIndex: '2' })
      .expect(400);
    await request(app)
      .post(`/api/quiz/${q1Id}/answer`)
      .set('Cookie', studentCookie)
      .send({ choiceIndex: 1.5 })
      .expect(400);
  });

  it('does not persist an attempt for a rejected choice', async () => {
    await answer(q1Id, 42).expect(400);
    const attempt = await prisma.quizAttempt.findUnique({
      where: { userId_questionId: { userId: studentId, questionId: q1Id } },
    });
    expect(attempt).toBeNull();
  });

  it('blocks a student from another track', async () => {
    await answer(q1Id, CORRECT_INDEX, otherTrackCookie).expect(403);
  });

  it('404s for an unknown question', async () => {
    await answer('00000000-0000-0000-0000-000000000000', 0).expect(404);
  });
});

describe('GET /api/quiz/due/count', () => {
  it('requires authentication', async () => {
    await request(app).get('/api/quiz/due/count').expect(401);
  });

  it('counts zero when nothing has been answered', async () => {
    const res = await request(app).get('/api/quiz/due/count').set('Cookie', studentCookie).expect(200);
    expect(res.body.count).toBe(0);
  });

  it('counts only questions that are due now', async () => {
    await prisma.quizAttempt.createMany({
      data: [
        {
          userId: studentId,
          questionId: q1Id,
          correct: true,
          streak: 1,
          timesSeen: 1,
          timesCorrect: 1,
          dueAt: new Date(Date.now() - DAY),
        },
        {
          userId: studentId,
          questionId: q2Id,
          correct: true,
          streak: 4,
          timesSeen: 4,
          timesCorrect: 4,
          dueAt: new Date(Date.now() + 7 * DAY),
        },
      ],
    });

    const res = await request(app).get('/api/quiz/due/count').set('Cookie', studentCookie).expect(200);
    expect(res.body.count).toBe(1);
  });

  it('drops to zero once the due question is answered correctly', async () => {
    await answer(q1Id, CORRECT_INDEX).expect(200);
    const res = await request(app).get('/api/quiz/due/count').set('Cookie', studentCookie).expect(200);
    expect(res.body.count).toBe(0);
  });
});
