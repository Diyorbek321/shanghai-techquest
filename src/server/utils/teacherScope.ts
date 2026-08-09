import { Role } from '@prisma/client';
import { prisma } from '../db';

/**
 * The subset of the authenticated user these checks need. Taking a structural
 * type rather than the full Prisma `User` keeps the helpers callable from tests
 * without building a whole row.
 */
export interface ScopedActor {
  id: string;
  role: Role;
}

/**
 * Whether `actor` may act on the class.
 *
 * Admins bypass ownership but still fail on a class that does not exist, so a
 * caller can treat `false` as "404 or 403" and never operate on a missing row.
 */
export async function teacherOwnsClass(actor: ScopedActor, classId: string): Promise<boolean> {
  const group = await prisma.classGroup.findUnique({
    where: { id: classId },
    select: { teacherId: true },
  });
  if (!group) return false;
  if (actor.role === Role.ADMIN) return true;
  return group.teacherId === actor.id;
}

/**
 * Whether `actor` may act on the student — issue credentials, reset a password,
 * read their record.
 *
 * The target must actually be a STUDENT: without that check a teacher could
 * pass a colleague's or an admin's id to a student-scoped route and take over
 * the account. For teachers the student must also be enrolled in one of their
 * own classes.
 */
export async function teacherManagesStudent(actor: ScopedActor, studentId: string): Promise<boolean> {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { role: true },
  });
  if (student?.role !== Role.STUDENT) return false;
  if (actor.role === Role.ADMIN) return true;

  const shared = await prisma.enrollment.count({
    where: { userId: studentId, class: { teacherId: actor.id } },
  });
  return shared > 0;
}

/** Ids of every student in the actor's classes; `undefined` for an admin (= no filter). */
export async function managedStudentIds(actor: ScopedActor): Promise<string[] | undefined> {
  if (actor.role === Role.ADMIN) return undefined;
  const enrollments = await prisma.enrollment.findMany({
    where: { class: { teacherId: actor.id } },
    select: { userId: true },
  });
  return [...new Set(enrollments.map((e) => e.userId))];
}
