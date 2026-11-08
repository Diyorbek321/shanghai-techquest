import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import bcrypt from 'bcryptjs';
import { Prisma, Role, Track } from '@prisma/client';
import { prisma } from '../db';
import { calendarDate, todayKey } from '../utils/dayKey';
import { issueTodaysPlans, sendNotices } from './scheduler';

/**
 * ROBOTICS, like routes/dailyPlan.test.ts: it has no real curriculum, so the
 * temporary lessons here decide the plan alone. Every call is scoped to this
 * file's students, so other data in the database is never touched.
 */
const unique = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const DAY = 24 * 60 * 60 * 1000;

let studentId: string;
let mutedId: string;
let loneId: string;
let classId: string;
const userIds: string[] = [];
const lessonIds: string[] = [];
const problemIds: string[] = [];

const notices = (userId: string) => prisma.notification.findMany({ where: { userId } });

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const make = (label: string, role: Role, track: Track | null, pushEnabled = true) =>
    prisma.user.create({
      data: { email: `${unique(label)}@vitest.local`, passwordHash, name: label, role, track, pushEnabled },
    });
  const [student, muted, lone, teacher] = await Promise.all([
    make('sched-student', Role.STUDENT, Track.ROBOTICS),
    make('sched-muted', Role.STUDENT, Track.ROBOTICS, false),
    make('sched-lone', Role.STUDENT, Track.ROBOTICS),
    make('sched-teacher', Role.TEACHER, null),
  ]);
  userIds.push(student.id, muted.id, lone.id, teacher.id);
  studentId = student.id;
  mutedId = muted.id;
  loneId = lone.id;

  // Lessons on tomorrow's weekday, started three weeks ago: today is a free day.
  const today = calendarDate(todayKey());
  const group = await prisma.classGroup.create({
    data: {
      title: unique('Sched class'),
      track: Track.ROBOTICS,
      teacherId: teacher.id,
      startDate: new Date(today.getTime() - 20 * DAY),
      lessonDays: [(today.getUTCDay() + 1) % 7],
      enrollments: { create: [{ userId: student.id }, { userId: muted.id }] },
    },
  });
  classId = group.id;

  for (const order of [1, 2]) {
    const lesson = await prisma.lesson.create({
      data: {
        key: unique(`vitest-sched-${order}`),
        track: Track.ROBOTICS,
        order,
        month: 1,
        week: 1,
        title: `Sched ${order}`,
        section: 'Vitest',
        summary: 'Test',
        objectives: ['a'],
        homeworkMain: 'Asosiy',
        homeworkReview: ['Takror'],
        makeEasy: 'oson',
        makeMedium: "o'rta",
        makeHard: 'qiyin',
        quiz: [],
      },
    });
    lessonIds.push(lesson.id);
    const problem = await prisma.problem.create({
      data: {
        key: unique(`vitest-sched-p${order}`),
        title: `Sched masala ${order}`,
        difficulty: 'EASY',
        points: 10,
        tags: [],
        description: 'Test',
        lessonId: lesson.id,
        testCases: [{ stdin: '', expectedStdout: '1', hidden: false, label: 't' }] as Prisma.InputJsonValue,
      },
    });
    problemIds.push(problem.id);
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

describe('issueTodaysPlans', () => {
  it('creates today\'s plan for enrolled students who never opened the site', async () => {
    const created = await issueTodaysPlans({ userIds });
    expect(created).toBe(2);

    const plan = await prisma.dailyPlan.findUnique({ where: { userId_date: { userId: studentId, date: todayKey() } } });
    expect(plan).not.toBeNull();
    expect(plan!.classId).toBe(classId);
    expect(Array.isArray(plan!.items) && plan!.items.length).toBeGreaterThan(0);
  });

  it('skips students without a timetabled class', async () => {
    expect(await prisma.dailyPlan.count({ where: { userId: loneId } })).toBe(0);
  });

  it('is idempotent', async () => {
    expect(await issueTodaysPlans({ userIds })).toBe(0);
    expect(await prisma.dailyPlan.count({ where: { userId: studentId } })).toBe(1);
  });
});

describe('sendNotices', () => {
  it('sends the morning notice once, and not to students who muted notifications', async () => {
    expect(await sendNotices('morning', { userIds })).toBe(1);
    expect(await sendNotices('morning', { userIds })).toBe(0);

    const sent = await notices(studentId);
    expect(sent).toHaveLength(1);
    expect(sent[0].title).toBe('Bugungi vazifangiz tayyor');
    expect(await notices(mutedId)).toHaveLength(0);
  });

  it('sends the evening reminder once for an unfinished plan', async () => {
    expect(await sendNotices('evening', { userIds })).toBe(1);
    expect(await sendNotices('evening', { userIds })).toBe(0);
    const titles = (await notices(studentId)).map((n) => n.title);
    expect(titles).toContain('Bugungi vazifa hali tugamagan');
  });

  it('does not remind a student who finished the day — it settles the plan instead', async () => {
    await prisma.dailyPlan.updateMany({ where: { userId: studentId }, data: { remindedAt: null } });
    for (const problemId of problemIds) {
      await prisma.problemSubmission.create({
        data: { problemId, userId: studentId, code: 'print(1)', language: 'python', passed: true, feedback: '', pointsAwarded: 0 },
      });
    }
    expect(await sendNotices('evening', { userIds })).toBe(0);
    const plan = await prisma.dailyPlan.findUniqueOrThrow({ where: { userId_date: { userId: studentId, date: todayKey() } } });
    expect(plan.completedAt).not.toBeNull();
  });
});
