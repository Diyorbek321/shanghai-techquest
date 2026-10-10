import { PrismaClient, SubmissionStatus, Track } from '@prisma/client';

/**
 * What Eduly shows teachers and managers about each linked student.
 *
 * A lesson counts as done by the same rule the course page and the
 * certificates use (homework handed in) — if Eduly's number and the student's
 * own screen disagreed, both would lose credibility.
 */
const DONE: SubmissionStatus[] = [SubmissionStatus.SUBMITTED, SubmissionStatus.GRADED];

export interface StudentProgress {
  edulyStudentId: number;
  track: string | null;
  lessonsCompleted: number;
  lessonsTotal: number;
  /** First lesson in curriculum order whose homework is not in yet. */
  nextLesson: { order: number; title: string } | null;
  /** Lesson homework past its deadline and still not handed in. */
  overdueHomework: number;
  problemsSolved: number;
  /** Mean of teacher grades as a percentage; null when nothing is graded. */
  averageGrade: number | null;
  xp: number;
  level: number;
  lastSeenAt: string | null;
  disabled: boolean;
}

export async function progressReport(db: PrismaClient, now: Date = new Date()): Promise<StudentProgress[]> {
  const users = await db.user.findMany({
    where: { edulyStudentId: { not: null } },
    select: {
      id: true,
      edulyStudentId: true,
      track: true,
      xp: true,
      level: true,
      lastSeenAt: true,
      disabledAt: true,
      enrollments: { select: { classId: true } },
    },
  });
  if (users.length === 0) return [];
  const userIds = users.map((u) => u.id);

  const lessons = await db.lesson.findMany({
    orderBy: { order: 'asc' },
    select: { id: true, track: true, order: true, title: true },
  });
  const lessonsByTrack = new Map<Track, typeof lessons>();
  for (const lesson of lessons) {
    lessonsByTrack.set(lesson.track, [...(lessonsByTrack.get(lesson.track) ?? []), lesson]);
  }

  const doneSubmissions = await db.submission.findMany({
    where: { userId: { in: userIds }, status: { in: DONE }, assignment: { lessonId: { not: null } } },
    select: { userId: true, assignmentId: true, assignment: { select: { lessonId: true } } },
  });
  const doneLessons = new Map<string, Set<string>>();
  const doneAssignments = new Set<string>();
  for (const s of doneSubmissions) {
    const set = doneLessons.get(s.userId) ?? new Set<string>();
    set.add(s.assignment.lessonId!);
    doneLessons.set(s.userId, set);
    doneAssignments.add(`${s.userId}:${s.assignmentId}`);
  }

  const classIds = [...new Set(users.flatMap((u) => u.enrollments.map((e) => e.classId)))];
  const overdue = classIds.length
    ? await db.assignment.findMany({
        where: { classId: { in: classIds }, lessonId: { not: null }, dueDate: { lt: now } },
        select: { id: true, classId: true },
      })
    : [];
  const overdueByClass = new Map<string, string[]>();
  for (const a of overdue) {
    overdueByClass.set(a.classId!, [...(overdueByClass.get(a.classId!) ?? []), a.id]);
  }

  const solved = await db.problemSubmission.findMany({
    where: { userId: { in: userIds }, passed: true },
    distinct: ['userId', 'problemId'],
    select: { userId: true },
  });
  const solvedCount = new Map<string, number>();
  for (const s of solved) solvedCount.set(s.userId, (solvedCount.get(s.userId) ?? 0) + 1);

  const grades = await db.grade.findMany({
    where: { userId: { in: userIds }, maxScore: { gt: 0 } },
    select: { userId: true, score: true, maxScore: true },
  });
  const gradeSums = new Map<string, { sum: number; n: number }>();
  for (const g of grades) {
    const acc = gradeSums.get(g.userId) ?? { sum: 0, n: 0 };
    acc.sum += (g.score / g.maxScore) * 100;
    acc.n += 1;
    gradeSums.set(g.userId, acc);
  }

  return users.map((u) => {
    const trackLessons = u.track ? lessonsByTrack.get(u.track) ?? [] : [];
    const done = doneLessons.get(u.id) ?? new Set<string>();
    const completed = trackLessons.filter((l) => done.has(l.id)).length;
    const next = trackLessons.find((l) => !done.has(l.id));
    const overdueCount = u.enrollments
      .flatMap((e) => overdueByClass.get(e.classId) ?? [])
      .filter((assignmentId) => !doneAssignments.has(`${u.id}:${assignmentId}`)).length;
    const g = gradeSums.get(u.id);
    return {
      edulyStudentId: u.edulyStudentId!,
      track: u.track ? u.track.toLowerCase() : null,
      lessonsCompleted: completed,
      lessonsTotal: trackLessons.length,
      nextLesson: next ? { order: next.order, title: next.title } : null,
      overdueHomework: overdueCount,
      problemsSolved: solvedCount.get(u.id) ?? 0,
      averageGrade: g ? Math.round((g.sum / g.n) * 10) / 10 : null,
      xp: u.xp,
      level: u.level,
      lastSeenAt: u.lastSeenAt ? u.lastSeenAt.toISOString() : null,
      disabled: u.disabledAt !== null,
    };
  });
}
