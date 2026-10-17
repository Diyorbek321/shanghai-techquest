/**
 * Calendar days as YYYY-MM-DD strings, on Tashkent time: a student's day turns
 * over at their own midnight, not at 05:00 when UTC does. Uzbekistan has no
 * daylight saving, so a fixed offset is exact all year.
 */
export const TASHKENT_UTC_OFFSET_MINUTES = 5 * 60;

const OFFSET_MS = TASHKENT_UTC_OFFSET_MINUTES * 60_000;

/** The Tashkent calendar day an instant falls on. */
export function dayKey(date: Date): string {
  return new Date(date.getTime() + OFFSET_MS).toISOString().slice(0, 10);
}

export function todayKey(): string {
  return dayKey(new Date());
}

export function dayBefore(key: string): string {
  const d = calendarDate(key);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * The day as a calendar date — midnight UTC carrying that date — for weekday
 * and timetable arithmetic (lessons/schedule.ts works on these).
 */
export function calendarDate(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

/** The real instant the day begins: Tashkent midnight. For comparing timestamps. */
export function dayStart(key: string): Date {
  return new Date(calendarDate(key).getTime() - OFFSET_MS);
}
