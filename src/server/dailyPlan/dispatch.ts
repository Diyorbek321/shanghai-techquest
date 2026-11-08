/**
 * When the daily-plan scheduler acts, and what it tells the student.
 *
 * Pure functions only, like planner.ts: the scheduler passes `now` in, so the
 * clock never has to be faked in tests.
 */
import { TASHKENT_UTC_OFFSET_MINUTES, dayStart } from '../utils/dayKey';
import type { EvaluatedItem } from './planner';

/** Tashkent hour the "today's work is ready" notice goes out. */
export const MORNING_HOUR = 7;
/**
 * The morning notice is not sent from this hour on: after a mid-day restart a
 * late "your work is ready" would land just before the evening reminder.
 */
export const MORNING_CUTOFF_HOUR = 12;
/** Tashkent hour unfinished plans get a reminder, with the evening still left. */
export const EVENING_HOUR = 19;

/**
 * A plan the student was never told about and that only appeared late in the
 * day (the server came up in the evening, or it was just deployed) gets no
 * reminder: "you haven't finished" about work nobody announced is noise.
 */
export const REMIND_IF_CREATED_BEFORE_HOUR = EVENING_HOUR - 3;

export function shouldRemind(plan: { date: string; createdAt: Date; notifiedAt: Date | null }): boolean {
  if (plan.notifiedAt !== null) return true;
  const cutoff = dayStart(plan.date).getTime() + REMIND_IF_CREATED_BEFORE_HOUR * 60 * 60_000;
  return plan.createdAt.getTime() < cutoff;
}

export function tashkentHour(now: Date): number {
  return new Date(now.getTime() + TASHKENT_UTC_OFFSET_MINUTES * 60_000).getUTCHours();
}

export type NoticePhase = 'none' | 'morning' | 'evening';

/**
 * Which notice is due. Plans themselves are issued at any hour (from
 * midnight on); only the messages wait for a decent time. Once evening has
 * come the morning notice is skipped — a server that was down all day should
 * send one reminder, not "your work is ready" followed by "you haven't done it".
 */
export function noticePhase(now: Date): NoticePhase {
  const hour = tashkentHour(now);
  if (hour >= EVENING_HOUR) return 'evening';
  if (hour >= MORNING_HOUR && hour < MORNING_CUTOFF_HOUR) return 'morning';
  return 'none';
}

function describeItems(items: readonly EvaluatedItem[]): string {
  const problems = items.filter((item) => item.kind === 'problem').length;
  const questions = items.reduce((sum, item) => (item.kind === 'quiz' ? sum + item.total : sum), 0);
  const parts = [
    problems > 0 ? `${problems} ta masala` : null,
    questions > 0 ? `${questions} savollik test` : null,
  ].filter((part): part is string => part !== null);
  return parts.join(' va ');
}

export interface Notice {
  readonly title: string;
  readonly body: string;
}

export function morningNotice(items: readonly EvaluatedItem[], lessonDay: boolean, xp: number): Notice {
  const what = describeItems(items);
  return {
    title: 'Bugungi vazifangiz tayyor',
    body: lessonDay
      ? `Bugun dars kuni — qisqa vazifa: ${what}. Bajarsangiz +${xp} XP.`
      : `Bugun: ${what}. Bajarsangiz +${xp} XP va ketma-ket kunlar davom etadi.`,
  };
}

export function eveningNotice(items: readonly EvaluatedItem[], streak: number): Notice {
  const done = items.filter((item) => item.done).length;
  const progress = done > 0 ? `${items.length} tadan ${done} tasi bajarildi. ` : '';
  const stake =
    streak > 0
      ? `Yarim tungacha yoping, aks holda ${streak} kunlik ketma-ketlik uziladi.`
      : 'Yarim tungacha yoping — bugundan yangi ketma-ketlik boshlang.';
  return { title: 'Bugungi vazifa hali tugamagan', body: `${progress}${stake}` };
}
