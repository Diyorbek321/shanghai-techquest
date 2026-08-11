import { Prisma, PrismaClient, Role, Track } from '@prisma/client';

type Db = PrismaClient | Prisma.TransactionClient;

export interface RetrackResult {
  /** Enrolled STUDENT accounts carried onto the new track. */
  studentsMoved: number;
  /** Old-track lesson homework nobody had answered, deleted. */
  curriculumRemoved: number;
  /** Old-track lesson homework kept because it already holds a submission or a grade. */
  curriculumKept: number;
  /** The teacher's own assignments, re-tagged so they follow the cohort. */
  assignmentsMoved: number;
}

/**
 * Moves a cohort onto a different track, carrying its students with it.
 *
 * A student's `track` is what puts a course in their sidebar (Layout.tsx) and
 * what scopes both their class list and their assignment list
 * (utils/trackScope.ts) — and it is written exactly once, when the account is
 * created, from the track of the class they were created in
 * (routes/classes.ts). A cohort filed under the wrong track therefore leaves
 * every one of its students reading someone else's curriculum permanently, with
 * no way back through the UI. Fixing the class without fixing the students would
 * fix nothing they can see, so the two have to move together.
 */
export async function retrackClass(
  db: Db,
  classId: string,
  from: Track,
  to: Track
): Promise<RetrackResult> {
  const enrolled = await db.enrollment.findMany({ where: { classId }, select: { userId: true } });
  const userIds = enrolled.map((row) => row.userId);

  const studentsMoved =
    userIds.length === 0
      ? 0
      : (await db.user.updateMany({ where: { id: { in: userIds }, role: Role.STUDENT }, data: { track: to } }))
          .count;

  // Lesson homework is materialised per track by syncLessonAssignments(), so
  // whatever sits on the old track is curriculum this cohort will now never
  // study. Unanswered copies go. Anything a student has already submitted or
  // been graded on stays: deleting it would cascade their submission away, and a
  // stale assignment is a far smaller problem than a lost piece of work.
  const curriculum = await db.assignment.findMany({
    where: { classId, track: from, lessonId: { not: null } },
    select: { id: true, _count: { select: { submissions: true, grades: true } } },
  });
  const removable = curriculum
    .filter((row) => row._count.submissions === 0 && row._count.grades === 0)
    .map((row) => row.id);
  if (removable.length > 0) {
    await db.assignment.deleteMany({ where: { id: { in: removable } } });
  }

  // The teacher's hand-written assignments are content we cannot judge, so they
  // follow the cohort rather than being deleted. They must move: the list
  // students read is track-filtered, so one left behind becomes invisible to
  // the very cohort it was written for.
  const { count: assignmentsMoved } = await db.assignment.updateMany({
    where: { classId, track: from, lessonId: null },
    data: { track: to },
  });

  return {
    studentsMoved,
    curriculumRemoved: removable.length,
    curriculumKept: curriculum.length - removable.length,
    assignmentsMoved,
  };
}
