import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Prisma, Role, Track } from '@prisma/client';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { calendarDate, todayKey } from '../utils/dayKey';
import { weeklyRouter } from './weekly';
import { quizRouter } from './quiz';

// OFFICE track: no other test file creates OFFICE lessons, so lesson orders and
// the track's lesson count are ours alone.
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/weekly', weeklyRouter);
app.use('/api/quiz', quizRouter);

const DAY = 24 * 60 * 60 * 1000;
const unique = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const cookieFor = (id: string, role: Role, track: Track | null) =>
  `${AUTH_COOKIE_NAME}=${signToken({ sub: id, role, track })}`;

let studentId: string;
let studentCookie: string;
let teacherCookie: string;
let otherTeacherCookie: string;
let classId: string;
const userIds: string[] = [];
const lessonIds: string[] = [];
let choiceId: string;
let outputId: string;
let olderQuestionId: string;
let nextQuestionId: string;
let problemId: string;

function lessonData(order: number) {
  return {
    key: unique(`vitest-weekly-${order}`),
    track: Track.OFFICE,
    order,
    month: 1,
    week: 1,
    title: `Hafta darsi ${order}`,
    section: 'Vitest',
    summary: 'Test',
    objectives: ['a'],
    homeworkMain: 'Asosiy',
    homeworkReview: ['Takror'],
    makeEasy: 'oson',
    makeMedium: "o'rta",
    makeHard: 'qiyin',
    quiz: [],
  };
}

const answerChoice = (questionId: string, choiceIndex: number) =>
  request(app).post(`/api/quiz/${questionId}/answer`).set('Cookie', studentCookie).send({ choiceIndex });

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const make = (label: string, role: Role, track: Track | null) =>
    prisma.user.create({ data: { email: `${unique(label)}@vitest.local`, passwordHash, name: label, role, track } });
  const [student, teacher, otherTeacher] = await Promise.all([
    make('weekly-student', Role.STUDENT, Track.OFFICE),
    make('weekly-teacher', Role.TEACHER, null),
    make('weekly-other-teacher', Role.TEACHER, null),
  ]);
  userIds.push(student.id, teacher.id, otherTeacher.id);
  studentId = student.id;
  studentCookie = cookieFor(student.id, student.role, student.track);
  teacherCookie = cookieFor(teacher.id, teacher.role, null);
  otherTeacherCookie = cookieFor(otherTeacher.id, otherTeacher.role, null);

  // One lesson a week on yesterday's weekday, 20 days back: lessons 1, 2, 3 are
  // taught, lesson 3 was yesterday, so the open set is lesson 3 alone, due the
  // evening before lesson 4 next week.
  const today = calendarDate(todayKey());
  const yesterdayWeekday = (today.getUTCDay() + 6) % 7;
  const group = await prisma.classGroup.create({
    data: {
      title: unique('Weekly class'),
      track: Track.OFFICE,
      teacherId: teacher.id,
      startDate: new Date(today.getTime() - 20 * DAY),
      lessonDays: [yesterdayWeekday],
      enrollments: { create: { userId: student.id } },
    },
  });
  classId = group.id;

  for (const order of [1, 2, 3, 4]) {
    const lesson = await prisma.lesson.create({ data: lessonData(order) });
    lessonIds.push(lesson.id);
  }
  const [, lessonTwo, lessonThree, lessonFour] = lessonIds;
  const next = await prisma.quizQuestion.create({
    data: { lessonId: lessonFour, order: 1, prompt: 'Keyingi', choices: ['a', 'b', 'c', 'd'], correctIndex: 1, explanation: 'i' },
  });
  nextQuestionId = next.id;
  const older = await prisma.quizQuestion.create({
    data: { lessonId: lessonTwo, order: 1, prompt: 'Eski', choices: ['a', 'b', 'c', 'd'], correctIndex: 0, explanation: 'i' },
  });
  olderQuestionId = older.id;
  const choice = await prisma.quizQuestion.create({
    data: { lessonId: lessonThree, order: 1, prompt: 'Tanlov', choices: ['a', 'b', 'c', 'd'], correctIndex: 2, explanation: 'MAXFIY' },
  });
  choiceId = choice.id;
  const output = await prisma.quizQuestion.create({
    data: {
      lessonId: lessonThree,
      order: 101,
      kind: 'output',
      prompt: 'Bu kod ekranga nima chiqaradi?',
      code: 'print(1 + 1)',
      choices: [],
      correctIndex: -1,
      expectedOutput: '2',
      explanation: 'MAXFIY',
    },
  });
  outputId = output.id;
  const problem = await prisma.problem.create({
    data: {
      key: unique('vitest-weekly-p'),
      title: 'Hafta masalasi',
      difficulty: 'EASY',
      points: 10,
      tags: [],
      description: 'Test',
      lessonId: lessonThree,
      testCases: [{ stdin: '', expectedStdout: '1', hidden: false, label: 't' }] as Prisma.InputJsonValue,
    },
  });
  problemId = problem.id;
});

afterAll(async () => {
  await prisma.weeklySet.deleteMany({ where: { classId } });
  await prisma.quizAttempt.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.problemSubmission.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.problem.deleteMany({ where: { lessonId: { in: lessonIds } } });
  await prisma.quizQuestion.deleteMany({ where: { lessonId: { in: lessonIds } } });
  await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } });
  await prisma.classGroup.deleteMany({ where: { id: classId } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});

describe('Hafta vazifasi', () => {
  it("opens with yesterday's lesson: every question and problem, due before next week's lesson", async () => {
    const res = await request(app).get('/api/weekly/current').set('Cookie', studentCookie).expect(200);
    expect(res.body.set).toMatchObject({ fromOrder: 3, toOrder: 3 });
    expect(new Date(res.body.set.dueAt).getTime()).toBeGreaterThan(Date.now() + 5 * DAY);
    expect(res.body.score).toMatchObject({ total: 3, done: 0, percent: 0, status: 'not_started' });
    expect(res.body.quiz).toEqual({ total: 2, answered: 0 });
    expect(res.body.problems).toEqual([expect.objectContaining({ id: problemId, solved: false })]);
  });

  it('serves only this set\'s questions, without the answer key', async () => {
    const res = await request(app).get('/api/weekly/current/quiz').set('Cookie', studentCookie).expect(200);
    expect(res.body.questions.map((q: { id: string }) => q.id)).toEqual([choiceId, outputId]);
    expect(JSON.stringify(res.body)).not.toContain('MAXFIY');
    expect(JSON.stringify(res.body)).not.toContain('expectedOutput');
  });

  it('grades the FIRST answer — a retry that gets it right does not change the grade', async () => {
    await answerChoice(choiceId, 0).expect(200);
    await answerChoice(choiceId, 2).expect(200);
    const row = await prisma.weeklyAnswer.findFirst({ where: { userId: studentId, questionId: choiceId } });
    expect(row?.correct).toBe(false);

    const quiz = await request(app).get('/api/weekly/current/quiz').set('Cookie', studentCookie).expect(200);
    expect(quiz.body.questions.map((q: { id: string }) => q.id)).toEqual([outputId]);
  });

  it('records output answers, and ignores questions from lessons outside the set', async () => {
    await request(app).post(`/api/quiz/${outputId}/answer`).set('Cookie', studentCookie).send({ output: '2' }).expect(200);
    await answerChoice(olderQuestionId, 0).expect(200);
    expect(await prisma.weeklyAnswer.count({ where: { userId: studentId, questionId: olderQuestionId } })).toBe(0);

    await prisma.problemSubmission.create({
      data: { problemId, userId: studentId, code: 'print(1)', language: 'python', passed: true, feedback: '', pointsAwarded: 0 },
    });
    const res = await request(app).get('/api/weekly/current').set('Cookie', studentCookie).expect(200);
    expect(res.body.score).toMatchObject({ total: 3, done: 3, correct: 2, percent: 67, status: 'done' });
    expect(res.body.problems[0].solved).toBe(true);
  });

  it("does not count a Parsons (line-ordering) pass as the student's own code", async () => {
    const other = await prisma.problem.create({
      data: {
        key: unique('vitest-weekly-p2'),
        title: 'Parsons',
        difficulty: 'MEDIUM',
        points: 20,
        tags: [],
        description: 'Test',
        lessonId: lessonIds[2],
        testCases: [] as Prisma.InputJsonValue,
      },
    });
    await prisma.problemSubmission.create({
      data: { problemId: other.id, userId: studentId, code: 'x', language: 'parsons', passed: true, feedback: '', pointsAwarded: 0 },
    });
    const res = await request(app).get('/api/weekly/current').set('Cookie', studentCookie).expect(200);
    expect(res.body.problems.find((p: { id: string }) => p.id === other.id).solved).toBe(false);
    await prisma.problemSubmission.deleteMany({ where: { problemId: other.id } });
    await prisma.problem.delete({ where: { id: other.id } });
  });

  it("shows the class's teacher every student's grade, and nobody else", async () => {
    const res = await request(app).get(`/api/weekly/class/${classId}`).set('Cookie', teacherCookie).expect(200);
    expect(res.body.set).toMatchObject({ fromOrder: 3, toOrder: 3 });
    expect(res.body.students).toEqual([
      expect.objectContaining({ id: studentId, score: expect.objectContaining({ percent: 67, done: 3 }) }),
    ]);
    // One student is too few answers to call a question "most missed".
    expect(res.body.missed).toEqual([]);

    await request(app).get(`/api/weekly/class/${classId}`).set('Cookie', otherTeacherCookie).expect(403);
    await request(app).get(`/api/weekly/class/${classId}`).set('Cookie', studentCookie).expect(403);
  });

  it('keeps one set per block however many times it is read', async () => {
    await request(app).get('/api/weekly/current').set('Cookie', studentCookie).expect(200);
    await request(app).get('/api/weekly/current').set('Cookie', studentCookie).expect(200);
    expect(await prisma.weeklySet.count({ where: { classId, fromOrder: 3 } })).toBe(1);
  });

  it("grades a lesson's question from the first answer after class, before its set opens", async () => {
    // Lesson 4 is next week's: answering it now (say, on the lesson page) is
    // the graded first answer — waiting for the set to open would let the
    // student learn the key first and "first-answer" it perfectly.
    await answerChoice(nextQuestionId, 0).expect(200);
    await answerChoice(nextQuestionId, 1).expect(200);
    const sets = await prisma.weeklySet.findMany({ where: { classId }, orderBy: { fromOrder: 'asc' } });
    expect(sets.map((s) => s.fromOrder)).toEqual([3, 4]);
    const row = await prisma.weeklyAnswer.findFirst({ where: { userId: studentId, questionId: nextQuestionId } });
    expect(row).toMatchObject({ setId: sets[1].id, correct: false });

    // The open set is still lesson 3's.
    const res = await request(app).get('/api/weekly/current').set('Cookie', studentCookie).expect(200);
    expect(res.body.set).toMatchObject({ fromOrder: 3, toOrder: 3 });
  });

  it('is for students only', async () => {
    await request(app).get('/api/weekly/current').set('Cookie', teacherCookie).expect(403);
  });
});
