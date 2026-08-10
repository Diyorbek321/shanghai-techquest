/**
 * Who has earned which certificate.
 *
 * Pure functions: no Prisma, no clock, no randomness. Issuing a certificate is
 * the one action here a student will show to a parent or an employer, so the
 * rule that grants it has to be readable in one place and testable without a
 * database.
 *
 * Local evidence for bothering at all: One Million Uzbek Coders issued
 * 1 175 933 completion certificates to a population that was 90% schoolchildren.
 * In this context a certificate is the artefact a student and their family
 * recognise as the result of the work.
 */

/** A lesson, reduced to what the rule actually depends on. */
export interface LessonCompletion {
  key: string;
  month: number;
  /** Section heading, used to name a month's certificate. */
  section: string;
  completed: boolean;
}

export interface EarnedCertificate {
  kind: 'month' | 'course';
  /** Null for the whole-course certificate. */
  month: number | null;
  title: string;
  lessonsCompleted: number;
  lessonsTotal: number;
}

/**
 * Every lesson in the scope must be done. A certificate issued at 80% would
 * quietly redefine what the document says on its face, and the student is the
 * one who would have to explain the gap later.
 */
function allDone(lessons: readonly LessonCompletion[]): boolean {
  return lessons.length > 0 && lessons.every((lesson) => lesson.completed);
}

/** The most common section in a month, which is what that block was about. */
function monthTitle(lessons: readonly LessonCompletion[]): string {
  const counts = new Map<string, number>();
  for (const lesson of lessons) {
    counts.set(lesson.section, (counts.get(lesson.section) ?? 0) + 1);
  }
  let best = lessons[0]?.section ?? '';
  let bestCount = 0;
  for (const [section, count] of counts) {
    if (count > bestCount) {
      best = section;
      bestCount = count;
    }
  }
  return best;
}

export function earnedCertificates(lessons: readonly LessonCompletion[]): EarnedCertificate[] {
  if (lessons.length === 0) return [];

  const byMonth = new Map<number, LessonCompletion[]>();
  for (const lesson of lessons) {
    byMonth.set(lesson.month, [...(byMonth.get(lesson.month) ?? []), lesson]);
  }

  const earned: EarnedCertificate[] = [];
  for (const [month, monthLessons] of [...byMonth.entries()].sort(([a], [b]) => a - b)) {
    if (!allDone(monthLessons)) continue;
    earned.push({
      kind: 'month',
      month,
      title: `${month}-oy: ${monthTitle(monthLessons)}`,
      lessonsCompleted: monthLessons.length,
      lessonsTotal: monthLessons.length,
    });
  }

  if (allDone(lessons)) {
    earned.push({
      kind: 'course',
      month: null,
      title: 'Kursni toʻliq tamomlagani uchun',
      lessonsCompleted: lessons.length,
      lessonsTotal: lessons.length,
    });
  }

  return earned;
}

/** Progress toward the next unearned month, for the "almost there" line in the UI. */
export function nextMilestone(
  lessons: readonly LessonCompletion[]
): { month: number; completed: number; total: number } | null {
  const byMonth = new Map<number, LessonCompletion[]>();
  for (const lesson of lessons) {
    byMonth.set(lesson.month, [...(byMonth.get(lesson.month) ?? []), lesson]);
  }
  for (const [month, monthLessons] of [...byMonth.entries()].sort(([a], [b]) => a - b)) {
    if (allDone(monthLessons)) continue;
    return {
      month,
      completed: monthLessons.filter((l) => l.completed).length,
      total: monthLessons.length,
    };
  }
  return null;
}
