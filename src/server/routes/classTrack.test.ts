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
  return `${AUTH_COOKIE_NAME}=${signToken({ sub: userId, role, track })}`;
}

let ownerCookie: string;
let strangerCookie: string;
let studentCookie: string;
let classId: string;
let studentId: string;
let untouchedAssignmentId: string;
let gradedAssignmentId: string;
let teacherAssignmentId: string;
const createdUserIds: string[] = [];
const createdClassIds: string[] = [];
const createdLessonIds: string[] = [];

/** A Lesson row needs a lot of non-null curriculum text; none of it matters here. */
function lessonFixture(key: string, order: number) {
  return {
    key,
    track: Track.FRONTEND,
    order,
    month: 1,
    week: 1,
    title: `Retrack ${key}`,
    section: 'test',
    summary: '—',
    objectives: [],
    homeworkMain: '—',
    homeworkReview: [],
    makeEasy: '—',
    makeMedium: '—',
    makeHard: '—',
    quiz: [],
  };
}

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const mk = (label: string, role: Role, track: Track | null = null) =>
    prisma.user.create({ data: { email: uniqueEmail(label), passwordHash, name: `Retrack ${label}`, role, track } });

  const [owner, stranger, student] = await Promise.all([
    mk('owner', Role.TEACHER),
    mk('stranger', Role.TEACHER),
    mk('student', Role.STUDENT, Track.FRONTEND),
  ]);
  studentId = student.id;
  createdUserIds.push(owner.id, stranger.id, student.id);
  ownerCookie = cookieFor(owner.id, owner.role, null);
  strangerCookie = cookieFor(stranger.id, stranger.role, null);
  studentCookie = cookieFor(student.id, student.role, student.track);

  const group = await prisma.classGroup.create({
    data: { title: 'Retrack cohort', track: Track.FRONTEND, teacherId: owner.id },
  });
  classId = group.id;
  createdClassIds.push(group.id);
  await prisma.enrollment.create({ data: { classId: group.id, userId: student.id } });

  // Lesson homework is what syncLessonAssignments() materialises, and it is
  // identified by lessonId — so the fixtures need real lessons behind them.
  // Orders are far past the real curriculum to stay clear of @@unique([track, order]).
  const [lessonA, lessonB] = await Promise.all([
    prisma.lesson.create({ data: lessonFixture('retrack-lesson-a', 9001) }),
    prisma.lesson.create({ data: lessonFixture('retrack-lesson-b', 9002) }),
  ]);
  createdLessonIds.push(lessonA.id, lessonB.id);

  // One lesson assignment nobody has answered, one that already carries a
  // submission, and one hand-written by the teacher (no lessonId).
  const [untouched, graded, teacherMade] = await Promise.all([
    prisma.assignment.create({
      data: {
        title: 'Dars 1: eski trek',
        description: '—',
        track: Track.FRONTEND,
        classId: group.id,
        moduleKey: lessonA.key,
        lessonId: lessonA.id,
        dueDate: new Date('2026-01-01'),
      },
    }),
    prisma.assignment.create({
      data: {
        title: 'Dars 2: topshirilgan',
        description: '—',
        track: Track.FRONTEND,
        classId: group.id,
        moduleKey: lessonB.key,
        lessonId: lessonB.id,
        dueDate: new Date('2026-01-02'),
      },
    }),
    prisma.assignment.create({
      data: {
        title: "O'qituvchining o'z vazifasi",
        description: '—',
        track: Track.FRONTEND,
        classId: group.id,
        dueDate: new Date('2026-01-03'),
      },
    }),
  ]);
  untouchedAssignmentId = untouched.id;
  gradedAssignmentId = graded.id;
  teacherAssignmentId = teacherMade.id;
  await prisma.submission.create({ data: { assignmentId: graded.id, userId: student.id, content: 'ishlandi' } });
});

afterAll(async () => {
  await prisma.submission.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.grade.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.assignment.deleteMany({ where: { classId: { in: createdClassIds } } });
  await prisma.enrollment.deleteMany({ where: { classId: { in: createdClassIds } } });
  await prisma.classGroup.deleteMany({ where: { id: { in: createdClassIds } } });
  await prisma.lesson.deleteMany({ where: { id: { in: createdLessonIds } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
});

describe('PATCH /api/classes/:id track change', () => {
  it('refuses a student', async () => {
    await request(app)
      .patch(`/api/classes/${classId}`)
      .set('Cookie', studentCookie)
      .send({ track: 'backend' })
      .expect(403);
  });

  it('refuses a teacher who does not own the class', async () => {
    await request(app)
      .patch(`/api/classes/${classId}`)
      .set('Cookie', strangerCookie)
      .send({ track: 'backend' })
      .expect(403);
  });

  it('rejects an unknown track', async () => {
    await request(app)
      .patch(`/api/classes/${classId}`)
      .set('Cookie', ownerCookie)
      .send({ track: 'fullstack' })
      .expect(400);
  });

  it('moves the cohort and every enrolled student onto the new track', async () => {
    const res = await request(app)
      .patch(`/api/classes/${classId}`)
      .set('Cookie', ownerCookie)
      .send({ track: 'backend' })
      .expect(200);

    expect(res.body.track).toBe('backend');
    expect(res.body.retrack).toMatchObject({ studentsMoved: 1 });

    const student = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
    expect(student.track).toBe(Track.BACKEND);
  });

  it('drops unanswered old-track homework but keeps anything already submitted', async () => {
    const untouched = await prisma.assignment.findUnique({ where: { id: untouchedAssignmentId } });
    const graded = await prisma.assignment.findUnique({ where: { id: gradedAssignmentId } });

    expect(untouched).toBeNull();
    expect(graded).not.toBeNull();
    expect(graded!.track).toBe(Track.FRONTEND);
  });

  it("carries the teacher's own assignments over to the new track", async () => {
    const teacherMade = await prisma.assignment.findUniqueOrThrow({ where: { id: teacherAssignmentId } });
    expect(teacherMade.track).toBe(Track.BACKEND);
  });

  it('leaves the student track alone when the track is not part of the patch', async () => {
    await prisma.user.update({ where: { id: studentId }, data: { track: Track.OFFICE } });

    await request(app)
      .patch(`/api/classes/${classId}`)
      .set('Cookie', ownerCookie)
      .send({ title: 'Retrack cohort (renamed)' })
      .expect(200);

    const student = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
    expect(student.track).toBe(Track.OFFICE);
  });
});
