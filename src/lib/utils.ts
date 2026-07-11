import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31536000000],
  ['month', 2592000000],
  ['day', 86400000],
  ['hour', 3600000],
  ['minute', 60000],
];

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** Formats a date relative to now, e.g. "2 hours ago" or "in 3 days". */
export function formatRelativeTime(date: string | Date): string {
  const diff = new Date(date).getTime() - Date.now();
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) {
      return rtf.format(Math.round(diff / ms), unit);
    }
  }
  return diff >= 0 ? 'in a moment' : 'just now';
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
