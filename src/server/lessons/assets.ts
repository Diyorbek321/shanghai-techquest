import path from 'path';
import { Track } from '@prisma/client';

/** Slide decks ship with the repo (uploads/ is gitignored and empty on deploy). */
export const LESSON_ASSETS_DIR = path.join(process.cwd(), 'lesson-assets');

/**
 * Absolute path of a lesson's deck, or null if the name escapes the track's
 * asset directory. `slideFile` comes from the database, but treating it as
 * untrusted keeps a bad row from turning into an arbitrary file read.
 */
export function resolveSlidePath(track: Track, slideFile: string): string | null {
  const trackDir = path.join(LESSON_ASSETS_DIR, track.toLowerCase());
  const resolved = path.join(trackDir, path.basename(slideFile));
  return resolved.startsWith(trackDir + path.sep) ? resolved : null;
}
