import { Prisma, PrismaClient, Track } from '@prisma/client';
import { DEFAULT_LESSON_DAYS, lessonDueDate } from './schedule';

type Db = PrismaClient | Prisma.TransactionClient;

/**
 * Renders a lesson's homework into the assignment description students read.
 * The 60/40 split comes straight from the deck's UY VAZIFASI slide.
 */
export function homeworkDescription(lesson: {
  homeworkMain: string;
  homeworkReview: string[];
  homeworkNote: string;
  makeEasy: string;
  makeMedium: string;
  makeHard: string;
}): string {
  const sections = [
    `**ASOSIY TOPSHIRIQ (60%)**\n${lesson.homeworkMain}`,
    `**TAKRORLASH (40%)**\n${lesson.homeworkReview.map((item) => `- ${item}`).join('\n')}`,
    [
      '**QO\'SHIMCHA MASHQ (ixtiyoriy)**',
      `- Oson: ${lesson.makeEasy}`,
      `- O'rta: ${lesson.makeMedium}`,
      `- Qiyin: ${lesson.makeHard}`,
    ].join('\n'),
  ];
  if (lesson.homeworkNote) {
    sections.push(lesson.homeworkNote);
  }
  return sections.join('\n\n');
}

export interface SyncResult {
  created: number;
  updated: number;
}

/**
 * Materialises one Assignment per lesson for a cohort, with deadlines derived
 * from the class start date.
 *
 * Idempotent: re-running after the start date moves rewrites deadlines in place,
 * so existing submissions and grades stay attached to the same assignment.
 */
export async function syncLessonAssignments(db: Db, classId: string): Promise<SyncResult> {
  const classGroup = await db.classGroup.findUnique({ where: { id: classId } });
  if (!classGroup) {
    throw new Error(`Sinf topilmadi: ${classId}`);
  }
  if (!classGroup.startDate) {
    return { created: 0, updated: 0 };
  }

  const lessons = await db.lesson.findMany({
    where: { track: classGroup.track },
    orderBy: { order: 'asc' },
  });
  if (lessons.length === 0) {
    return { created: 0, updated: 0 };
  }

  const lessonDays = classGroup.lessonDays.length > 0 ? classGroup.lessonDays : DEFAULT_LESSON_DAYS;
  const existing = await db.assignment.findMany({
    where: { classId, moduleKey: { in: lessons.map((lesson) => lesson.key) } },
    select: { id: true, moduleKey: true },
  });
  const byModuleKey = new Map(existing.map((row) => [row.moduleKey, row.id]));

  let created = 0;
  let updated = 0;

  for (const lesson of lessons) {
    const data = {
      title: `Dars ${lesson.order}: ${lesson.title}`,
      description: homeworkDescription(lesson),
      dueDate: lessonDueDate(classGroup.startDate, lessonDays, lesson.order),
      xpReward: lesson.xpReward,
      lessonId: lesson.id,
    };
    const existingId = byModuleKey.get(lesson.key);
    if (existingId) {
      await db.assignment.update({ where: { id: existingId }, data });
      updated++;
    } else {
      await db.assignment.create({
        data: { ...data, track: classGroup.track, classId, moduleKey: lesson.key },
      });
      created++;
    }
  }

  return { created, updated };
}

/** Convenience wrapper for the seed and for backfills. */
export async function syncAllLessonAssignments(db: Db, track: Track): Promise<SyncResult> {
  const classes = await db.classGroup.findMany({
    where: { track, startDate: { not: null } },
    select: { id: true },
  });
  const totals: SyncResult = { created: 0, updated: 0 };
  for (const { id } of classes) {
    const result = await syncLessonAssignments(db, id);
    totals.created += result.created;
    totals.updated += result.updated;
  }
  return totals;
}
