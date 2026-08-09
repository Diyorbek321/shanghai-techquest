/**
 * Merge duplicate ClassGroup rows left behind by older seed runs.
 *
 * Before the seed guarded class creation with a findFirst, every `npm run
 * db:seed` created a fresh copy of each demo cohort — this database ended up
 * with 8 copies of three classes (25 rows for 4 real cohorts), which makes the
 * teacher's class picker unusable.
 *
 * The survivor of each (track, title) group is the OLDEST row, because it
 * carries the fullest history; the rest are merged into it and deleted.
 *
 * Deleting a ClassGroup is not enough on its own: Assignment.classId and
 * Attendance.classId are `onDelete: SetNull`, so a plain delete would leave
 * orphaned assignments with classId = null — and a null classId means
 * "self-paced task visible to the whole track", so the junk would become MORE
 * visible, not less. Everything attached is therefore removed explicitly.
 *
 * Run with `--apply` to write; without it the script only reports.
 */
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

interface Plan {
  keep: string[];
  drop: string[];
}

async function buildPlan(): Promise<Plan> {
  const classes = await prisma.classGroup.findMany({ orderBy: { createdAt: 'asc' } });
  const groups = new Map<string, typeof classes>();
  for (const c of classes) {
    const key = `${c.track}|${c.title}`;
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }

  const keep: string[] = [];
  const drop: string[] = [];
  for (const list of groups.values()) {
    keep.push(list[0].id);
    drop.push(...list.slice(1).map((c) => c.id));
  }
  return { keep, drop };
}

/**
 * Re-point enrollments at the surviving cohort so nobody loses their class.
 * (userId, classId) is unique, so a student already in the survivor is simply
 * dropped from the duplicate rather than moved onto a colliding row.
 */
async function moveEnrollments(tx: Prisma.TransactionClient, keep: string[], drop: string[]): Promise<number> {
  const survivorByKey = new Map<string, string>();
  for (const id of keep) {
    const c = await tx.classGroup.findUniqueOrThrow({ where: { id } });
    survivorByKey.set(`${c.track}|${c.title}`, c.id);
  }

  let moved = 0;
  for (const classId of drop) {
    const doomed = await tx.classGroup.findUniqueOrThrow({ where: { id: classId } });
    const survivorId = survivorByKey.get(`${doomed.track}|${doomed.title}`);
    if (!survivorId) continue;

    const enrollments = await tx.enrollment.findMany({ where: { classId } });
    for (const e of enrollments) {
      const already = await tx.enrollment.findUnique({
        where: { userId_classId: { userId: e.userId, classId: survivorId } },
      });
      if (already) continue;
      await tx.enrollment.update({ where: { id: e.id }, data: { classId: survivorId } });
      moved += 1;
    }
  }
  return moved;
}

async function main() {
  const { keep, drop } = await buildPlan();
  console.log(`sinflar -> saqlanadi: ${keep.length} | o'chiriladi: ${drop.length}`);
  if (drop.length === 0) {
    console.log('dublikat yo\'q, hech narsa qilinmadi.');
    return;
  }

  const doomed = await prisma.assignment.findMany({ where: { classId: { in: drop } }, select: { id: true } });
  const assignmentIds = doomed.map((a) => a.id);
  const [subs, grades, att, ev] = await Promise.all([
    prisma.submission.count({ where: { assignmentId: { in: assignmentIds } } }),
    prisma.grade.count({ where: { assignmentId: { in: assignmentIds } } }),
    prisma.attendance.count({ where: { classId: { in: drop } } }),
    prisma.calendarEvent.count({ where: { classId: { in: drop } } }),
  ]);
  console.log(
    `birga o'chadi -> vazifa: ${assignmentIds.length}, topshiriq: ${subs}, baho: ${grades}, davomat: ${att}, tadbir: ${ev}`
  );

  if (!APPLY) {
    console.log('\n(quruq ishga tushirish — yozilmadi. Yozish uchun: --apply)');
    return;
  }

  const moved = await prisma.$transaction(async (tx) => {
    const movedCount = await moveEnrollments(tx, keep, drop);
    // Explicit, in dependency order: submissions/grades cascade off Assignment,
    // but Assignment and Attendance would only be detached from the class.
    await tx.assignment.deleteMany({ where: { id: { in: assignmentIds } } });
    await tx.attendance.deleteMany({ where: { classId: { in: drop } } });
    await tx.calendarEvent.deleteMany({ where: { classId: { in: drop } } });
    await tx.homework.deleteMany({ where: { classId: { in: drop } } });
    await tx.classGroup.deleteMany({ where: { id: { in: drop } } });
    return movedCount;
  });

  const remaining = await prisma.classGroup.count();
  const orphanAssignments = await prisma.assignment.count({ where: { classId: null, moduleKey: null } });
  console.log(`\nbajarildi. ko'chirilgan ro'yxat: ${moved} | qolgan sinflar: ${remaining}`);
  console.log(`sinfsiz va moduleKey'siz yetim vazifalar: ${orphanAssignments} (0 bo'lishi kerak)`);
}

main()
  .catch((e) => {
    console.error('XATO:', e.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
