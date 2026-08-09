import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import bcrypt from 'bcryptjs';
import { ClassGoalMetric, Role, Track } from '@prisma/client';
import { prisma } from '../db';
import { goalProgress, summarise } from './progress';

const uniqueEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@vitest.local`;

let classId: string;
let teacherId: string;
let memberA: string;
let memberB: string;
let outsiderId: string;
let problemId: string;
let exerciseId: string;

const WINDOW_START = new Date('2026-03-01T00:00:00.000Z');
const WINDOW_END = new Date('2026-03-08T00:00:00.000Z');
const INSIDE = new Date('2026-03-03T12:00:00.000Z');
const BEFORE = new Date('2026-02-20T12:00:00.000Z');

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const mk = (label: string, role: Role, track: Track | null = null) =>
    prisma.user.create({ data: { email: uniqueEmail(label), passwordHash, name: `Goal ${label}`, role, track } });

  const [teacher, a, b, outsider] = await Promise.all([
    mk('teacher', Role.TEACHER),
    mk('a', Role.STUDENT, Track.BACKEND),
    mk('b', Role.STUDENT, Track.BACKEND),
    mk('outsider', Role.STUDENT, Track.BACKEND),
  ]);
  teacherId = teacher.id;
  memberA = a.id;
  memberB = b.id;
  outsiderId = outsider.id;

  const group = await prisma.classGroup.create({
    data: { title: 'Goal class', track: Track.BACKEND, teacherId: teacher.id },
  });
  classId = group.id;
  await prisma.enrollment.createMany({
    data: [
      { userId: a.id, classId: group.id },
      { userId: b.id, classId: group.id },
    ],
  });

  const problem = await prisma.problem.create({
    data: {
      key: `goal-problem-${Date.now()}`,
      title: 'Goal problem',
      difficulty: 'EASY',
      points: 10,
      tags: [],
      description: 'x',
    },
  });
  problemId = problem.id;

  const exercise = await prisma.dailyExercise.create({
    data: { key: `goal-drill-${Date.now()}`, track: Track.BACKEND, prompt: 'x', estMinutes: 5 },
  });
  exerciseId = exercise.id;
});

afterAll(async () => {
  const ids = [teacherId, memberA, memberB, outsiderId];
  await prisma.classGoal.deleteMany({ where: { classId } });
  await prisma.problemSubmission.deleteMany({ where: { userId: { in: ids } } });
  await prisma.dailyExerciseLog.deleteMany({ where: { userId: { in: ids } } });
  await prisma.homework.deleteMany({ where: { classId } });
  await prisma.enrollment.deleteMany({ where: { classId } });
  await prisma.classGroup.delete({ where: { id: classId } });
  await prisma.problem.delete({ where: { id: problemId } });
  await prisma.dailyExercise.delete({ where: { id: exerciseId } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
});

async function makeGoal(metric: ClassGoalMetric, target: number) {
  return prisma.classGoal.create({
    data: { classId, title: `${metric} goal`, metric, target, startsAt: WINDOW_START, endsAt: WINDOW_END },
  });
}

describe('goalProgress — PROBLEMS_SOLVED', () => {
  it('counts only passed submissions from class members inside the window', async () => {
    await prisma.problemSubmission.createMany({
      data: [
        // counted
        { problemId, userId: memberA, code: '', language: 'python', passed: true, feedback: '', pointsAwarded: 10, submittedAt: INSIDE },
        { problemId, userId: memberB, code: '', language: 'python', passed: true, feedback: '', pointsAwarded: 10, submittedAt: INSIDE },
        // failed attempt — must not count
        { problemId, userId: memberA, code: '', language: 'python', passed: false, feedback: '', pointsAwarded: 0, submittedAt: INSIDE },
        // outside the window
        { problemId, userId: memberA, code: '', language: 'python', passed: true, feedback: '', pointsAwarded: 10, submittedAt: BEFORE },
        // a student who is not in this class
        { problemId, userId: outsiderId, code: '', language: 'python', passed: true, feedback: '', pointsAwarded: 10, submittedAt: INSIDE },
      ],
    });

    const goal = await makeGoal(ClassGoalMetric.PROBLEMS_SOLVED, 10);
    expect(await goalProgress(goal)).toBe(2);
  });
});

describe('goalProgress — DAILY_EXERCISES', () => {
  it('counts completed drills inside the window only', async () => {
    await prisma.dailyExerciseLog.createMany({
      data: [
        { userId: memberA, exerciseId, date: '2026-03-03', completed: true, completedAt: INSIDE },
        { userId: memberB, exerciseId, date: '2026-03-04', completed: true, completedAt: INSIDE },
        // started but not finished
        { userId: memberA, exerciseId, date: '2026-03-05', completed: false },
        { userId: outsiderId, exerciseId, date: '2026-03-03', completed: true, completedAt: INSIDE },
      ],
    });

    const goal = await makeGoal(ClassGoalMetric.DAILY_EXERCISES, 10);
    expect(await goalProgress(goal)).toBe(2);
  });
});

describe('goalProgress — HOMEWORK_DONE', () => {
  it('counts completed homework of this class due inside the window', async () => {
    await prisma.homework.createMany({
      data: [
        { userId: memberA, classId, track: Track.BACKEND, title: 'h1', course: 'c', dueDate: INSIDE, completed: true },
        { userId: memberB, classId, track: Track.BACKEND, title: 'h1', course: 'c', dueDate: INSIDE, completed: false },
        { userId: memberA, classId, track: Track.BACKEND, title: 'old', course: 'c', dueDate: BEFORE, completed: true },
      ],
    });

    const goal = await makeGoal(ClassGoalMetric.HOMEWORK_DONE, 5);
    expect(await goalProgress(goal)).toBe(1);
  });
});

describe('summarise', () => {
  it('reports percent and reached state', () => {
    const base = { target: 10, xpReward: 100, achievedAt: null };
    expect(summarise({ ...base }, 4)).toMatchObject({ current: 4, percent: 40, reached: false });
    expect(summarise({ ...base }, 10)).toMatchObject({ percent: 100, reached: true });
  });

  it('clamps a run past the target to 100%', () => {
    // A class that blows past the goal should read "done", not 240%.
    expect(summarise({ target: 10, xpReward: 0, achievedAt: null }, 24)).toMatchObject({ percent: 100, reached: true });
  });

  it('treats a zero target as already reached rather than dividing by zero', () => {
    expect(summarise({ target: 0, xpReward: 0, achievedAt: null }, 0)).toMatchObject({ percent: 100, reached: true });
  });
});
