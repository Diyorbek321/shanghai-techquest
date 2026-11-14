/**
 * Uzbek date text without relying on the browser's `uz-UZ` locale data, which
 * many browsers lack (they fall back to "M11 13, Fri"). Tashkent is UTC+5 with
 * no daylight saving, so the offset is exact.
 */
const WEEKDAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];
const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000;

/** "Juma, 13-noyabr, 23:59" — the instant as a Tashkent wall clock. */
export function formatTashkentDateTime(value: string | Date): string {
  const local = new Date(new Date(value).getTime() + TASHKENT_OFFSET_MS);
  const hh = String(local.getUTCHours()).padStart(2, '0');
  const mm = String(local.getUTCMinutes()).padStart(2, '0');
  return `${WEEKDAYS[local.getUTCDay()]}, ${local.getUTCDate()}-${MONTHS[local.getUTCMonth()]}, ${hh}:${mm}`;
}
