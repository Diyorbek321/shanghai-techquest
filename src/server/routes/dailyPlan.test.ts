import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Prisma, Role, Track } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { calendarDate, dayBefore, todayKey } from '../utils/dayKey';
import { DAILY_PLAN_XP, LATE_PLAN_XP } from '../dailyPlan/service';

/**
 * Runs on ROBOTICS because that track has no curriculum of its own: the planner
 * counts a track's lessons, so temporary lessons here cannot collide with the
 * real 96-lesson backend course.
 */
const app = createApp();
const unique = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const cookieFor = (userId: string, role: Role, track: Track | null) =>
  `${AUTH_COOKIE_NAME}=${signToken({ sub: userId, role, track })}`;

const DAY = 24 * 60 * 60 * 1000;
const CORRECT = 1;

let studentId: string;
let studentCookie: string;
let loneStudentCookie: string;
let teacherCookie: string;
let otherTeacherCookie: string;
let classId: string;
const userIds: string[] = [];
const lessonIds: string[] = [];
const problemIds: string[] = [];
const questionIds: string[] = [];

function lessonData(order: number) {
  return {
    key: unique(`vitest-plan-${order}`),
    track: Track.ROBOTICS,
    order,
    month: 1,
    week: 1,
    title: `Reja darsi ${order}`,
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

async function pass(problemId: string, language = 'python') {
  await prisma.problemSubmission.create({
    data: { problemId, userId: studentId, code: 'print(1)', language, passed: true, feedback: '', pointsAwarded: 0 },
  });
}

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const make = (label: string, role: Role, track: Track | null) =>
    prisma.user.create({
      data: { email: `${unique(label)}@vitest.local`, passwordHash, name: label, role, track },
    });
  const [student, lone, teacher, otherTeacher] = await Promise.all([
    make('plan-student', Role.STUDENT, Track.ROBOTICS),
    make('plan-lone', Role.STUDENT, Track.ROBOTICS),
    make('plan-teacher', Role.TEACHER, null),
    make('plan-other-teacher', Role.TEACHER, null),
  ]);
  userIds.push(student.id, lone.id, teacher.id, otherTeacher.id);
  studentId = student.id;
  studentCookie = cookieFor(student.id, student.role, student.track);
  loneStudentCookie = cookieFor(lone.id, lone.role, lone.track);
  teacherCookie = cookieFor(teacher.id, teacher.role, null);
  otherTeacherCookie = cookieFor(otherTeacher.id, otherTeacher.role, null);

  // One lesson a week, held on tomorrow's weekday, starting three weeks back:
  // three lessons have been taught and today is a free day.
  const today = calendarDate(todayKey());
  const tomorrowWeekday = (today.getUTCDay() + 1) % 7;
  const start = new Date(today.getTime() - 20 * DAY);
  const group = await prisma.classGroup.create({
    data: {
      title: unique('Plan class'),
      track: Track.ROBOTICS,
      teacherId: teacher.id,
      startDate: start,
      lessonDays: [tomorrowWeekday],
      enrollments: { create: { userId: student.id } },
    },
  });
  classId = group.id;

  for (const order of [1, 2, 3]) {
    const lesson = await prisma.lesson.create({ data: lessonData(order) });
    lessonIds.push(lesson.id);
    const problem = await prisma.problem.create({
      data: {
        key: unique(`vitest-plan-p${order}`),
        title: `Reja masalasi ${order}`,
        difficulty: 'EASY',
        points: 10,
        tags: [],
        description: 'Test',
        lessonId: lesson.id,
        testCases: [{ stdin: '', expectedStdout: '1', hidden: false, label: 't' }] as Prisma.InputJsonValue,
      },
    });
    problemIds.push(problem.id);
    const question = await prisma.quizQuestion.create({
      data: {
        lessonId: lesson.id,
        order: 1,
        prompt: `Savol ${order}`,
        choices: ['a', 'b', 'c', 'd'],
        correctIndex: CORRECT,
        explanation: 'izoh',
      },
    });
    questionIds.push(question.id);
  }
});

afterAll(async () => {
  await prisma.dailyPlan.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.notification.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.classGroup.deleteMany({ where: { id: classId } });
  await prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } });
  await prisma.problem.deleteMany({ where: { id: { in: problemIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});

describe('GET /api/daily-plan', () => {
  it('returns 404 for a student without a scheduled class', async () => {
    const res = await request(app).get('/api/daily-plan').set('Cookie', loneStudentCookie);
    expect(res.status).toBe(404);
  });

  it("builds a free day from this week's lesson first, then the most recent older one, plus a quiz", async () => {
    const res = await request(app).get('/api/daily-plan').set('Cookie', studentCookie);
    expect(res.status).toBe(200);
    expect(res.body.today.date).toBe(todayKey());
    expect(res.body.today.lessonDay).toBe(false);
    const kinds = res.body.today.items.map((item: { kind: string; problemId?: string }) => item.problemId ?? item.kind);
    expect(kinds).toEqual([problemIds[2], problemIds[1], 'quiz']);
    expect(res.body.today.items[2]).toMatchObject({ total: 3, answeredCorrectly: 0, done: false });
    expect(res.body.today.done).toBe(false);
  });

  it('keeps the same plan for the whole day', async () => {
    const first = await request(app).get('/api/daily-plan').set('Cookie', studentCookie);
    await pass(problemIds[0]);
    const second = await request(app).get('/api/daily-plan').set('Cookie', studentCookie);
    expect(second.body.today.items.map((i: { problemId?: string }) => i.problemId)).toEqual(
      first.body.today.items.map((i: { problemId?: string }) => i.problemId)
    );
  });

  it('serves the quiz without the answer key', async () => {
    const res = await request(app).get(`/api/daily-plan/day/${todayKey()}/quiz`).set('Cookie', studentCookie);
    expect(res.status).toBe(200);
    expect(res.body.questions).toHaveLength(3);
    expect(JSON.stringify(res.body)).not.toContain('correctIndex');
    expect(JSON.stringify(res.body)).not.toContain('izoh');
  });

  it('does not accept a line-ordering solve as the written problem', async () => {
    await pass(problemIds[2], 'parsons');
    const res = await request(app).get('/api/daily-plan').set('Cookie', studentCookie);
    expect(res.body.today.items[0]).toMatchObject({ problemId: problemIds[2], done: false });
  });

  it('closes the day by itself the moment the last item is checked', async () => {
    await pass(problemIds[2]);
    await pass(problemIds[1]);
    const before = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });

    for (const id of questionIds) {
      const answer = await request(app)
        .post(`/api/quiz/${id}/answer`)
        .set('Cookie', studentCookie)
        .send({ choiceIndex: CORRECT });
      expect(answer.status).toBe(200);
    }

    const plan = await prisma.dailyPlan.findUniqueOrThrow({
      where: { userId_date: { userId: studentId, date: todayKey() } },
    });
    expect(plan.completedAt).not.toBeNull();
    expect(plan).toMatchObject({ late: false, xpAwarded: DAILY_PLAN_XP });

    const after = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
    expect(after.streak).toBe(1);

    // Opening the card again must not pay twice.
    const res = await request(app).get('/api/daily-plan').set('Cookie', studentCookie);
    expect(res.body.today.done).toBe(true);
    const again = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
    expect(again.xp).toBe(after.xp);
    expect(after.xp).toBeGreaterThanOrEqual(before.xp + DAILY_PLAN_XP);
  });

  it('lets an unfinished earlier day be made up, at the late rate', async () => {
    const yesterday = dayBefore(todayKey());
    const extra = await prisma.problem.create({
      data: {
        key: unique('vitest-plan-late'),
        title: 'Kechikkan masala',
        difficulty: 'EASY',
        points: 10,
        tags: [],
        description: 'Test',
        lessonId: lessonIds[0],
      },
    });
    problemIds.push(extra.id);
    await prisma.dailyPlan.create({
      data: { userId: studentId, date: yesterday, classId, items: [{ kind: 'problem', problemId: extra.id }] },
    });

    const open = await request(app).get('/api/daily-plan').set('Cookie', studentCookie);
    expect(open.body.pending).toEqual([{ date: yesterday, done: 0, total: 1 }]);

    const streakBefore = (await prisma.user.findUniqueOrThrow({ where: { id: studentId } })).streak;
    await pass(extra.id);
    const closed = await request(app).get('/api/daily-plan').set('Cookie', studentCookie);
    expect(closed.body.pending).toEqual([]);

    const plan = await prisma.dailyPlan.findUniqueOrThrow({
      where: { userId_date: { userId: studentId, date: yesterday } },
    });
    expect(plan).toMatchObject({ late: true, xpAwarded: LATE_PLAN_XP });
    expect((await prisma.user.findUniqueOrThrow({ where: { id: studentId } })).streak).toBe(streakBefore);
  });

  it('refuses a day outside the make-up window', async () => {
    const res = await request(app).get('/api/daily-plan/day/2020-01-01').set('Cookie', studentCookie);
    expect(res.status).toBe(404);
  });
});

describe('GET /api/daily-plan/class/:classId', () => {
  it("shows the class's teacher each student's days", async () => {
    const res = await request(app).get(`/api/daily-plan/class/${classId}?days=3`).set('Cookie', teacherCookie);
    expect(res.status).toBe(200);
    expect(res.body.dates.map((d: { date: string }) => d.date)).toEqual([
      dayBefore(dayBefore(todayKey())),
      dayBefore(todayKey()),
      todayKey(),
    ]);
    const [student] = res.body.students;
    expect(student.days.map((d: { status: string }) => d.status)).toEqual(['missed', 'late', 'done']);
  });

  it("refuses another teacher's class", async () => {
    const res = await request(app).get(`/api/daily-plan/class/${classId}`).set('Cookie', otherTeacherCookie);
    expect(res.status).toBe(403);
  });
});
