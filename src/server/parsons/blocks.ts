/**
 * Parsons problems: the student orders shuffled lines of a correct solution
 * instead of writing code from scratch.
 *
 * Evidence: novices reach the same learning gains from Parsons problems as from
 * writing or fixing code, in significantly less time, because the syntax errors
 * that dominate a beginner's session are removed and only the program's
 * structure is left. For a student who is stuck — the one most likely to
 * abandon a 96-lesson course — this is the difference between "I can't do this"
 * and a task they can finish.
 *
 * Pure functions only: no Prisma, no IO, no Date.now(), no Math.random(). The
 * shuffle is seeded by the caller, which is what makes a student's board stable
 * across refreshes and makes every case here testable.
 */

export interface ParsonsBlock {
  /** Opaque handle. Deliberately not the position in the solution. */
  id: string;
  /** One line of the solution, indentation preserved. */
  text: string;
}

export interface ParsonsGrade {
  correct: boolean;
  /** Lines that ended up in the right place. */
  linesCorrect: number;
  linesTotal: number;
  /** 1-based positions that are wrong, so the UI can mark them without giving the answer away. */
  wrongPositions: number[];
}

/**
 * Solution text -> the lines a student will order.
 *
 * Blank lines are dropped: they carry no ordering information and an empty card
 * is nothing but a slot to guess at. Comment lines are KEPT — in these lessons a
 * comment is often the step label that makes the structure readable, which is
 * exactly the scaffolding a Parsons problem is supposed to provide.
 */
export function toLines(solution: string): string[] {
  return solution
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .filter((line) => line.trim() !== '');
}

/** Deterministic 32-bit hash, so one (problem, student) pair always gets one board. */
export function seedFrom(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mulberry32 — small, seeded, and good enough to shuffle a dozen cards. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The shuffled board.
 *
 * Block ids are derived from the seed rather than from the line's position, so
 * the payload the browser receives carries no trace of the correct order — an
 * id of "3" for the third line would hand the answer to anyone reading the
 * network tab.
 *
 * A shuffle that happens to reproduce the original order is re-rolled: handing a
 * student an already-solved board reads as a bug and teaches nothing. Solutions
 * of one line cannot be shuffled at all and are returned as-is; callers decide
 * whether such a problem is worth offering.
 */
export function buildBoard(solution: string, seed: number): ParsonsBlock[] {
  const lines = toLines(solution);
  const blocks = lines.map((text, i) => ({ id: `b${seedFrom(`${seed}:${i}:${text}`).toString(36)}`, text }));
  if (blocks.length < 2) return blocks;

  const next = rng(seed);
  const shuffled = [...blocks];
  for (let attempt = 0; attempt < 8; attempt += 1) {
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(next() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Compare by text: when a solution repeats a line, an ordering that differs
    // by id but reads identically is still the solved board.
    if (shuffled.map((b) => b.text).join('\n') !== lines.join('\n')) return shuffled;
  }
  // Degenerate input (every line identical) — any order is already correct.
  return shuffled;
}

/**
 * Grade a submitted ordering against the solution.
 *
 * Compares TEXT, not ids. Two identical lines are interchangeable: an ordering
 * that produces the right program must be accepted even if the student happened
 * to place the "wrong" duplicate card, because the program they built is right.
 */
export function gradeOrder(solution: string, submitted: readonly string[]): ParsonsGrade {
  const expected = toLines(solution);
  const wrongPositions: number[] = [];
  let linesCorrect = 0;

  for (let i = 0; i < expected.length; i += 1) {
    if (submitted[i] === expected[i]) linesCorrect += 1;
    else wrongPositions.push(i + 1);
  }
  // Extra cards left on the board are wrong positions too, otherwise a student
  // who submits every line plus a duplicate would be told they were perfect.
  for (let i = expected.length; i < submitted.length; i += 1) wrongPositions.push(i + 1);

  return {
    correct: submitted.length === expected.length && wrongPositions.length === 0,
    linesCorrect,
    linesTotal: expected.length,
    wrongPositions,
  };
}
