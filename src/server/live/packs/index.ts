import type { LiveQuestion } from '../game';
import { SO_NEITHER, USED_TO, type RawPackQuestion } from './englishSoNeitherUsedTo';

/**
 * Question packs: ready-made live-quiz rounds that belong to no lesson (e.g. an
 * English grammar set for a class). They live in code rather than the database
 * because they are hand-authored content, like the lesson quizzes in prisma/lessonsData,
 * but nothing else (the lesson page, spaced repetition) should ever show them.
 *
 * Adding a pack: write its questions as RawPackQuestion (correct option first) and
 * append a definePack(...) entry below. Keys are stored in LiveGame.packKey — never rename one.
 */
export interface QuestionPack {
  key: string;
  title: string;
  /** Group label in the host's picker. */
  section: string;
  questions: readonly LiveQuestion[];
}

/** mulberry32 — tiny deterministic PRNG, so a pack's answer order is the same on every boot. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedOf(text: string): number {
  return [...text].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261);
}

/** Shuffles the four choices (correct one listed first in the source) and records where it landed. */
export function toLiveQuestion(id: string, [prompt, choices, explanation]: RawPackQuestion): LiveQuestion {
  const random = seededRandom(seedOf(id));
  const order = [0, 1, 2, 3].reduce<number[]>((acc, i) => {
    const j = Math.floor(random() * (i + 1));
    return [...acc.slice(0, j), i, ...acc.slice(j)];
  }, []);
  return {
    id,
    prompt,
    choices: order.map((i) => choices[i]),
    correctIndex: order.indexOf(0),
    explanation,
  };
}

function definePack(key: string, title: string, section: string, raw: readonly RawPackQuestion[]): QuestionPack {
  return { key, title, section, questions: raw.map((q, i) => toLiveQuestion(`pack:${key}:${i + 1}`, q)) };
}

const ENGLISH = 'Ingliz tili';

export const QUESTION_PACKS: readonly QuestionPack[] = [
  definePack('en-so-neither', 'So / Neither', ENGLISH, SO_NEITHER),
  definePack('en-used-to', 'Used to / Be used to / Get used to', ENGLISH, USED_TO),
  definePack('en-so-neither-used-to', 'So / Neither va Used to — hammasi', ENGLISH, [...SO_NEITHER, ...USED_TO]),
];

export function findPack(key: string): QuestionPack | undefined {
  return QUESTION_PACKS.find((p) => p.key === key);
}
