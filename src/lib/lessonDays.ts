/**
 * The class timetable as the server stores it — a list of weekdays, 0 = Sunday,
 * one entry per lesson, so [6, 0, 0] is Saturday once and Sunday twice — and
 * as the form edits it: a lesson count per weekday.
 */

/** Monday-first, the way the week is read in Uzbekistan. */
export const WEEKDAYS: { day: number; short: string }[] = [
  { day: 1, short: 'Du' },
  { day: 2, short: 'Se' },
  { day: 3, short: 'Ch' },
  { day: 4, short: 'Pa' },
  { day: 5, short: 'Ju' },
  { day: 6, short: 'Sh' },
  { day: 0, short: 'Ya' },
];

export const MAX_LESSONS_PER_DAY = 3;

/** Lesson count per weekday, indexed by weekday (0 = Sunday). */
export function countsFromLessonDays(lessonDays: readonly number[]): number[] {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const day of lessonDays) {
    if (day >= 0 && day <= 6) counts[day] = Math.min(counts[day] + 1, MAX_LESSONS_PER_DAY);
  }
  return counts;
}

export function lessonDaysFromCounts(counts: readonly number[]): number[] {
  return counts.flatMap((count, day) => Array.from({ length: count }, () => day));
}

/** "Sh 1 · Ya 2 — haftasiga 3 dars" */
export function describeLessonDays(lessonDays: readonly number[]): string {
  const counts = countsFromLessonDays(lessonDays);
  const parts = WEEKDAYS.filter(({ day }) => counts[day] > 0).map(({ day, short }) =>
    counts[day] > 1 ? `${short} ×${counts[day]}` : short
  );
  return `${parts.join(' · ')} — haftasiga ${lessonDays.length} dars`;
}
