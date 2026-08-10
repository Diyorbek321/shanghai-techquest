import { randomInt } from 'crypto';

/**
 * The number printed on a certificate so the school can confirm it later.
 *
 * Not derived from the student id or the issue date: a serial that encodes who
 * earned it lets anyone holding one certificate compute another student's, and
 * a serial that encodes a timestamp leaks how many were issued that day. The
 * random part is what makes it a lookup key rather than a claim in itself —
 * verification is a database read, not arithmetic on the number.
 */

/** Confusion-free alphabet: no 0/O, no 1/I, since these get read aloud and retyped. */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const RANDOM_LENGTH = 8;

export function generateSerial(track: string, year: number): string {
  let tail = '';
  for (let i = 0; i < RANDOM_LENGTH; i += 1) {
    tail += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `TQ-${track.toUpperCase()}-${year}-${tail}`;
}
