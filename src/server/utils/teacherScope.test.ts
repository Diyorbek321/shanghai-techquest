import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import bcrypt from 'bcryptjs';
import { Role, Track } from '@prisma/client';
import { prisma } from '../db';
import { teacherManagesStudent, teacherOwnsClass } from './teacherScope';

const uniqueEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@vitest.local`;

let ownerId: string;
let strangerId: string;
let adminId: string;
let enrolledStudentId: string;
let outsideStudentId: string;
let classId: string;

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const mk = (label: string, role: Role, track: Track | null = null) =>
    prisma.user.create({ data: { email: uniqueEmail(label), passwordHash, name: `Scope ${label}`, role, track } });

  const [owner, stranger, admin, enrolled, outside] = await Promise.all([
    mk('owner', Role.TEACHER),
    mk('stranger', Role.TEACHER),
    mk('admin', Role.ADMIN),
    mk('enrolled', Role.STUDENT, Track.BACKEND),
    mk('outside', Role.STUDENT, Track.BACKEND),
  ]);
  ownerId = owner.id;
  strangerId = stranger.id;
  adminId = admin.id;
  enrolledStudentId = enrolled.id;
  outsideStudentId = outside.id;

  const group = await prisma.classGroup.create({
    data: { title: 'Scope test class', track: Track.BACKEND, teacherId: owner.id },
  });
  classId = group.id;
  await prisma.enrollment.create({ data: { userId: enrolled.id, classId: group.id } });
});

afterAll(async () => {
  await prisma.enrollment.deleteMany({ where: { classId } });
  await prisma.classGroup.delete({ where: { id: classId } });
  await prisma.user.deleteMany({
    where: { id: { in: [ownerId, strangerId, adminId, enrolledStudentId, outsideStudentId] } },
  });
});

describe('teacherOwnsClass', () => {
  it('lets the owning teacher through', async () => {
    await expect(teacherOwnsClass({ id: ownerId, role: Role.TEACHER }, classId)).resolves.toBe(true);
  });

  it('keeps another teacher out of a class they do not own', async () => {
    await expect(teacherOwnsClass({ id: strangerId, role: Role.TEACHER }, classId)).resolves.toBe(false);
  });

  it('lets an admin through regardless of owner', async () => {
    await expect(teacherOwnsClass({ id: adminId, role: Role.ADMIN }, classId)).resolves.toBe(true);
  });

  it('returns false for a class that does not exist', async () => {
    await expect(teacherOwnsClass({ id: ownerId, role: Role.TEACHER }, 'no-such-class')).resolves.toBe(false);
  });

  it('returns false for an admin when the class does not exist', async () => {
    // Admins bypass ownership, but must not be told a missing class is fine —
    // the route would then act on a null class.
    await expect(teacherOwnsClass({ id: adminId, role: Role.ADMIN }, 'no-such-class')).resolves.toBe(false);
  });
});

describe('teacherManagesStudent', () => {
  it('accepts a student enrolled in the teacher\'s class', async () => {
    await expect(teacherManagesStudent({ id: ownerId, role: Role.TEACHER }, enrolledStudentId)).resolves.toBe(true);
  });

  it('rejects a student who is in no class of theirs', async () => {
    await expect(teacherManagesStudent({ id: ownerId, role: Role.TEACHER }, outsideStudentId)).resolves.toBe(false);
  });

  it('rejects a student of another teacher', async () => {
    await expect(teacherManagesStudent({ id: strangerId, role: Role.TEACHER }, enrolledStudentId)).resolves.toBe(false);
  });

  it('lets an admin manage any student', async () => {
    await expect(teacherManagesStudent({ id: adminId, role: Role.ADMIN }, outsideStudentId)).resolves.toBe(true);
  });

  it('refuses a target that is not a student', async () => {
    // A teacher must never be able to reset a colleague's or an admin's password
    // by passing their id to a student-scoped route.
    await expect(teacherManagesStudent({ id: adminId, role: Role.ADMIN }, strangerId)).resolves.toBe(false);
  });
});
