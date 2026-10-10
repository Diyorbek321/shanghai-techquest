import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { AttendanceStatus, Prisma, PrismaClient, Role, Track } from '@prisma/client';
import { z } from 'zod';
import { TRACK_VALUES, toPrismaTrack } from '../../serializers/track';
import { buildLogin, loginSlug, STUDENT_LOGIN_DOMAIN } from '../../users/credentials';
import { avatarUrlForEmail } from '../../avatar';
import { syncLessonAssignments } from '../../lessons/syncAssignments';

/**
 * Eduly -> TechQuest reconciliation.
 *
 * Eduly sends its WHOLE current picture for the courses linked to TechQuest
 * (every few minutes, and again right before an SSO hand-off), and this module
 * makes TechQuest match it. A full snapshot rather than per-event webhooks
 * means a missed or failed call heals itself on the next run, and there is no
 * ordering problem between "enrolled" and "removed" events.
 *
 * What Eduly owns: who exists, their names, which cohort they are in, whether
 * they may sign in, and attendance. What TechQuest owns and this never touches:
 * passwords, XP, submissions, progress — so a student who leaves and comes back
 * finds everything where they left it.
 */

const edulyId = z.number().int().positive();
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Sana YYYY-MM-DD bo\'lishi kerak');

export const snapshotSchema = z.object({
  dryRun: z.boolean().optional(),
  teachers: z.array(z.object({ id: edulyId, name: z.string().trim().min(1).max(200) })).max(2000),
  groups: z
    .array(
      z.object({
        id: edulyId,
        title: z.string().trim().min(1).max(200),
        track: z.enum(TRACK_VALUES),
        teacherId: edulyId.nullable(),
        schedule: z.string().max(200).nullable().optional(),
        startDate: isoDate.nullable().optional(),
        /// 0 = Sunday, as ClassGroup.lessonDays. Null when Eduly's schedule is
        /// free text it cannot read; TechQuest's default then applies.
        lessonDays: z.array(z.number().int().min(0).max(6)).min(1).max(7).nullable().optional(),
      })
    )
    .max(2000),
  students: z
    .array(z.object({ id: edulyId, name: z.string().trim().min(1).max(200), active: z.boolean() }))
    .max(20000),
  enrollments: z.array(z.object({ studentId: edulyId, groupId: edulyId })).max(40000),
  attendance: z
    .array(
      z.object({
        studentId: edulyId,
        groupId: edulyId,
        date: isoDate,
        status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
      })
    )
    .max(200000),
});

export type Snapshot = z.infer<typeof snapshotSchema>;

export interface SyncReport {
  dryRun: boolean;
  teachers: { created: number; linked: number; renamed: number };
  classes: { created: number; updated: number };
  students: { created: number; linked: number; renamed: number; disabled: number; enabled: number };
  enrollments: { added: number; removed: number };
  attendance: { upserted: number };
  /** Things a person has to look at; the sync carried on past each of them. */
  warnings: string[];
}

type Tx = Prisma.TransactionClient;

class DryRunRollback extends Error {
  constructor(readonly report: SyncReport) {
    super('dry run');
  }
}

function emptyReport(dryRun: boolean): SyncReport {
  return {
    dryRun,
    teachers: { created: 0, linked: 0, renamed: 0 },
    classes: { created: 0, updated: 0 },
    students: { created: 0, linked: 0, renamed: 0, disabled: 0, enabled: 0 },
    enrollments: { added: 0, removed: 0 },
    attendance: { upserted: 0 },
    warnings: [],
  };
}

/**
 * Accounts made here sign in through Eduly, never with a password, so the
 * stored hash is of a random value nobody holds. A teacher can still issue a
 * real password later with the existing reset flow if one is ever needed.
 */
async function unusablePasswordHash(): Promise<string> {
  return bcrypt.hash(randomBytes(24).toString('base64url'), 10);
}

/** Midnight UTC, the same instant the attendance screen stores for a date. */
function dateOnly(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

async function takenLogins(tx: Tx): Promise<Set<string>> {
  const rows = await tx.user.findMany({
    where: { email: { endsWith: `@${STUDENT_LOGIN_DOMAIN}` } },
    select: { email: true },
  });
  return new Set(rows.map((r) => r.email));
}

async function syncTeachers(tx: Tx, snapshot: Snapshot, report: SyncReport, taken: Set<string>) {
  const byEdulyId = new Map<number, string>();
  if (snapshot.teachers.length === 0) return byEdulyId;

  const linked = await tx.user.findMany({
    where: { edulyTeacherId: { in: snapshot.teachers.map((t) => t.id) } },
  });
  const linkedById = new Map(linked.map((u) => [u.edulyTeacherId!, u]));

  // Teachers who used TechQuest before the integration already have accounts.
  // A unique name match is taken as the same person; two candidates with the
  // same name are left for a human, because guessing would hand one teacher
  // another's classes.
  const unlinkedTeachers = await tx.user.findMany({
    where: { role: Role.TEACHER, edulyTeacherId: null },
    select: { id: true, name: true },
  });

  for (const teacher of snapshot.teachers) {
    let user = linkedById.get(teacher.id);
    if (!user) {
      const candidates = unlinkedTeachers.filter((u) => loginSlug(u.name) === loginSlug(teacher.name));
      if (candidates.length === 1) {
        user = await tx.user.update({ where: { id: candidates[0].id }, data: { edulyTeacherId: teacher.id } });
        unlinkedTeachers.splice(unlinkedTeachers.indexOf(candidates[0]), 1);
        report.teachers.linked += 1;
      } else {
        if (candidates.length > 1) {
          report.warnings.push(
            `Ustoz "${teacher.name}" (eduly #${teacher.id}): TechQuest'da ${candidates.length} ta bir xil ismli ustoz bor — yangi hisob ochildi, kerak bo'lsa qo'lda bog'lang.`
          );
        }
        const login = buildLogin(teacher.name, taken);
        taken.add(login);
        user = await tx.user.create({
          data: {
            email: login,
            passwordHash: await unusablePasswordHash(),
            name: teacher.name,
            role: Role.TEACHER,
            title: 'Mentor',
            avatarUrl: avatarUrlForEmail(login),
            edulyTeacherId: teacher.id,
          },
        });
        report.teachers.created += 1;
      }
    } else if (user.name !== teacher.name) {
      await tx.user.update({ where: { id: user.id }, data: { name: teacher.name } });
      report.teachers.renamed += 1;
    }
    byEdulyId.set(teacher.id, user.id);
  }
  return byEdulyId;
}

async function syncClasses(tx: Tx, snapshot: Snapshot, teacherIds: Map<number, string>, report: SyncReport) {
  const byEdulyId = new Map<number, { id: string; track: Track }>();
  const existing = await tx.classGroup.findMany({
    where: { edulyGroupId: { in: snapshot.groups.map((g) => g.id) } },
  });
  const existingById = new Map(existing.map((c) => [c.edulyGroupId!, c]));

  for (const group of snapshot.groups) {
    const teacherId = group.teacherId ? teacherIds.get(group.teacherId) : undefined;
    const track = toPrismaTrack(group.track);
    const startDate = group.startDate ? dateOnly(group.startDate) : null;
    const current = existingById.get(group.id);

    if (!current) {
      if (!teacherId) {
        report.warnings.push(`Guruh "${group.title}" (eduly #${group.id}): ustoz biriktirilmagan — o'tkazib yuborildi.`);
        continue;
      }
      const created = await tx.classGroup.create({
        data: {
          title: group.title,
          track,
          teacherId,
          schedule: group.schedule ?? null,
          startDate,
          ...(group.lessonDays ? { lessonDays: group.lessonDays } : {}),
          edulyGroupId: group.id,
        },
      });
      // Lays the curriculum's homework out against the cohort's start date,
      // exactly as creating the class by hand does.
      await syncLessonAssignments(tx, created.id);
      report.classes.created += 1;
      byEdulyId.set(group.id, { id: created.id, track });
      continue;
    }

    if (current.track !== track) {
      // Re-tracking drags every student's homework with it (classes/retrack.ts);
      // that is a deliberate act for a person, not something a sync should do
      // because a course setting was flipped.
      report.warnings.push(
        `Guruh "${group.title}" (eduly #${group.id}): Eduly'da yo'nalish ${group.track}, TechQuest'da ${current.track.toLowerCase()} — o'zgartirilmadi.`
      );
    }

    const data: Prisma.ClassGroupUpdateInput = {};
    if (current.title !== group.title) data.title = group.title;
    if ((current.schedule ?? null) !== (group.schedule ?? null)) data.schedule = group.schedule ?? null;
    if (teacherId && current.teacherId !== teacherId) data.teacher = { connect: { id: teacherId } };
    // Only fill a missing start date. Moving an existing one would shift every
    // homework deadline the cohort has already been working to.
    // Lesson days are filled together with it, for the same reason.
    const fillStartDate = !current.startDate && startDate;
    if (fillStartDate) {
      data.startDate = startDate;
      if (group.lessonDays) data.lessonDays = group.lessonDays;
    }
    if (Object.keys(data).length > 0) {
      await tx.classGroup.update({ where: { id: current.id }, data });
      if (fillStartDate) await syncLessonAssignments(tx, current.id);
      report.classes.updated += 1;
    }
    byEdulyId.set(group.id, { id: current.id, track: current.track });
  }
  return byEdulyId;
}

async function syncStudents(
  tx: Tx,
  snapshot: Snapshot,
  classIds: Map<number, { id: string; track: Track }>,
  report: SyncReport,
  taken: Set<string>
) {
  const byEdulyId = new Map<number, string>();
  const groupsOf = new Map<number, number[]>();
  for (const e of snapshot.enrollments) {
    groupsOf.set(e.studentId, [...(groupsOf.get(e.studentId) ?? []), e.groupId]);
  }

  const linked = await tx.user.findMany({
    where: { edulyStudentId: { in: snapshot.students.map((s) => s.id) } },
  });
  const linkedById = new Map(linked.map((u) => [u.edulyStudentId!, u]));
  const now = new Date();

  for (const student of snapshot.students) {
    const classes = (groupsOf.get(student.id) ?? []).map((g) => classIds.get(g)).filter((c) => c !== undefined);
    let user = linkedById.get(student.id);

    if (!user) {
      // A student a teacher enrolled by hand before the integration: same
      // name, already in the cohort this Eduly group maps to, and the only
      // such person there. Anything looser could merge two different children.
      const candidates = classes.length
        ? await tx.user.findMany({
            where: {
              role: Role.STUDENT,
              edulyStudentId: null,
              enrollments: { some: { classId: { in: classes.map((c) => c.id) } } },
            },
          })
        : [];
      const matches = candidates.filter((u) => loginSlug(u.name) === loginSlug(student.name));
      if (matches.length === 1) {
        user = await tx.user.update({ where: { id: matches[0].id }, data: { edulyStudentId: student.id } });
        report.students.linked += 1;
      } else {
        if (matches.length > 1) {
          report.warnings.push(
            `O'quvchi "${student.name}" (eduly #${student.id}): guruhda ${matches.length} ta bir xil ismli o'quvchi — yangi hisob ochildi.`
          );
        }
        const login = buildLogin(student.name, taken);
        taken.add(login);
        user = await tx.user.create({
          data: {
            email: login,
            passwordHash: await unusablePasswordHash(),
            name: student.name,
            role: Role.STUDENT,
            // Same rule as enrolling by hand: the cohort's track is what puts
            // the right course in the student's menu.
            track: classes[0]?.track ?? null,
            title: 'New Recruit',
            avatarUrl: avatarUrlForEmail(login),
            edulyStudentId: student.id,
            disabledAt: student.active ? null : now,
          },
        });
        report.students.created += 1;
        byEdulyId.set(student.id, user.id);
        continue;
      }
    }

    const data: Prisma.UserUpdateInput = {};
    if (user.name !== student.name) {
      data.name = student.name;
      report.students.renamed += 1;
    }
    if (!user.track && classes[0]) data.track = classes[0].track;
    if (student.active && user.disabledAt) {
      data.disabledAt = null;
      report.students.enabled += 1;
    } else if (!student.active && !user.disabledAt) {
      data.disabledAt = now;
      report.students.disabled += 1;
    }
    if (Object.keys(data).length > 0) {
      await tx.user.update({ where: { id: user.id }, data });
    }
    byEdulyId.set(student.id, user.id);
  }

  // A snapshot with no groups at all is far more likely to be a misconfigured
  // Eduly (course unlinked, wrong centre) than every cohort ending at once.
  // Locking every student out on that evidence would be the worst outcome.
  if (snapshot.groups.length === 0) {
    report.warnings.push("Snapshot'da birorta guruh yo'q — o'quvchilar bloklanmadi.");
    return byEdulyId;
  }

  // Linked to Eduly but no longer in any linked group there (removed, moved to
  // a non-programming course, group finished): sign-in stops, data stays.
  const gone = await tx.user.updateMany({
    where: {
      edulyStudentId: { not: null, notIn: snapshot.students.map((s) => s.id) },
      disabledAt: null,
    },
    data: { disabledAt: now },
  });
  report.students.disabled += gone.count;

  return byEdulyId;
}

async function syncEnrollments(
  tx: Tx,
  snapshot: Snapshot,
  classIds: Map<number, { id: string }>,
  studentIds: Map<number, string>,
  report: SyncReport
) {
  const desired = new Map<string, Set<string>>();
  for (const { id } of classIds.values()) desired.set(id, new Set());
  for (const e of snapshot.enrollments) {
    const cls = classIds.get(e.groupId);
    const userId = studentIds.get(e.studentId);
    if (cls && userId) desired.get(cls.id)!.add(userId);
  }

  const classIdList = [...desired.keys()];
  if (classIdList.length === 0) return;
  const current = await tx.enrollment.findMany({
    where: { classId: { in: classIdList } },
    select: { id: true, classId: true, userId: true, user: { select: { edulyStudentId: true } } },
  });

  const have = new Set(current.map((e) => `${e.classId}:${e.userId}`));
  const toCreate: Prisma.EnrollmentCreateManyInput[] = [];
  for (const [classId, users] of desired) {
    for (const userId of users) {
      if (!have.has(`${classId}:${userId}`)) toCreate.push({ classId, userId });
    }
  }
  if (toCreate.length) {
    await tx.enrollment.createMany({ data: toCreate, skipDuplicates: true });
    report.enrollments.added += toCreate.length;
  }

  // Only Eduly-linked students are removed. Someone a teacher added by hand
  // who has no Eduly record is not Eduly's to take out.
  const toRemove = current.filter(
    (e) => e.user.edulyStudentId !== null && !desired.get(e.classId)!.has(e.userId)
  );
  if (toRemove.length) {
    await tx.enrollment.deleteMany({ where: { id: { in: toRemove.map((e) => e.id) } } });
    report.enrollments.removed += toRemove.length;
  }
}

async function syncAttendance(
  tx: Tx,
  snapshot: Snapshot,
  classIds: Map<number, { id: string }>,
  studentIds: Map<number, string>,
  report: SyncReport
) {
  for (const row of snapshot.attendance) {
    const cls = classIds.get(row.groupId);
    const userId = studentIds.get(row.studentId);
    if (!cls || !userId) continue;
    const date = dateOnly(row.date);
    const status = row.status as AttendanceStatus;
    await tx.attendance.upsert({
      where: { userId_classId_date: { userId, classId: cls.id, date } },
      update: { status },
      create: { userId, classId: cls.id, date, status },
    });
    report.attendance.upserted += 1;
  }
}

export async function applySnapshot(db: PrismaClient, snapshot: Snapshot): Promise<SyncReport> {
  const dryRun = snapshot.dryRun ?? false;
  try {
    return await db.$transaction(
      async (tx) => {
        const report = emptyReport(dryRun);
        const taken = await takenLogins(tx);
        const teacherIds = await syncTeachers(tx, snapshot, report, taken);
        const classIds = await syncClasses(tx, snapshot, teacherIds, report);
        const studentIds = await syncStudents(tx, snapshot, classIds, report, taken);
        await syncEnrollments(tx, snapshot, classIds, studentIds, report);
        await syncAttendance(tx, snapshot, classIds, studentIds, report);
        // A dry run does all the work for real and then rolls it back, so the
        // report it returns is exactly what a real run would have done.
        if (dryRun) throw new DryRunRollback(report);
        return report;
      },
      { timeout: 120_000, maxWait: 10_000 }
    );
  } catch (error) {
    if (error instanceof DryRunRollback) return error.report;
    throw error;
  }
}
