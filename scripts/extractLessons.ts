/**
 * Offline ETL: turns the 96 Python Backend `.pptx` decks into structured lesson
 * data plus a copy of each deck under `lesson-assets/backend/`.
 *
 *   npx tsx scripts/extractLessons.ts [sourceDir]
 *
 * The decks follow one pedagogical template, so every field below is read from a
 * labelled block rather than a fixed slide index (deck length varies 17..20).
 * Anything missing is a hard error — a silently empty homework field would ship
 * an empty assignment to students.
 */
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import type { LessonRecord } from '../prisma/lessonsData/types';

const DEFAULT_SOURCE_DIR = '/home/diyorbek/python/taqdimotlar';
const ASSET_DIR = path.join(process.cwd(), 'lesson-assets', 'backend');
const OUTPUT_FILE = path.join(process.cwd(), 'prisma', 'lessonsData', 'backend.ts');

const LESSONS_PER_MONTH = 12;
const LESSONS_PER_WEEK = 3;
const TOTAL_LESSONS = 96;

class ExtractionError extends Error {
  constructor(deck: string, message: string) {
    super(`${deck}: ${message}`);
  }
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&');
}

/**
 * Flattens a slide into its paragraphs, in document order. PowerPoint splits a
 * single visual line across several `<a:t>` runs (one per formatting change), so
 * runs are joined per `<a:p>` before anything else looks at the text.
 */
function slideParagraphs(xml: string): string[] {
  return Array.from(xml.matchAll(/<a:p>([\s\S]*?)<\/a:p>/g))
    .map(([, paragraph]) =>
      Array.from(paragraph.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g))
        .map(([, run]) => decodeXmlEntities(run))
        .join('')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter((text) => text.length > 0);
}

function readSlides(deckPath: string): string[][] {
  const zip = new AdmZip(deckPath);
  return zip
    .getEntries()
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry.entryName))
    .sort((a, b) => slideNumber(a.entryName) - slideNumber(b.entryName))
    .map((entry) => slideParagraphs(entry.getData().toString('utf8')));
}

function slideNumber(entryName: string): number {
  return Number(entryName.match(/slide(\d+)\.xml$/)![1]);
}

/** The first slide whose text contains `marker` anywhere. */
function findSlide(slides: string[][], marker: string): string[] | null {
  return slides.find((blocks) => blocks.some((block) => block.includes(marker))) ?? null;
}

function requireSlide(slides: string[][], marker: string, deck: string): string[] {
  const slide = findSlide(slides, marker);
  if (!slide) {
    throw new ExtractionError(deck, `"${marker}" slaydi topilmadi.`);
  }
  return slide;
}

/** The block immediately after the first block matching `label`. */
function blockAfter(blocks: string[], label: string | RegExp): string | null {
  const index = blocks.findIndex((block) =>
    typeof label === 'string' ? block === label : label.test(block)
  );
  return index >= 0 ? blocks[index + 1] ?? null : null;
}

function requireBlockAfter(blocks: string[], label: string | RegExp, deck: string, field: string): string {
  const value = blockAfter(blocks, label);
  if (!value) {
    throw new ExtractionError(deck, `"${field}" maydoni bo'sh (${String(label)}).`);
  }
  return value;
}

function parseCover(blocks: string[], deck: string) {
  const orderIndex = blocks.findIndex((block) => /^DARS \d+$/.test(block));
  if (orderIndex < 0) {
    throw new ExtractionError(deck, 'Sarlavha slaydida "DARS NN" topilmadi.');
  }
  const order = Number(blocks[orderIndex].slice('DARS '.length));
  const title = blocks[orderIndex + 1];
  const section = blocks[orderIndex + 2];
  const month = Number(blocks.find((b) => /^\d+-oy$/.test(b))?.split('-')[0]);
  const week = Number(blocks.find((b) => /^\d+-hafta$/.test(b))?.split('-')[0]);
  const summary = blocks[blocks.length - 1];

  if (!title || !section || !month || !week || !summary) {
    throw new ExtractionError(deck, 'Sarlavha slaydi metadatasi to\'liq emas.');
  }
  return { order, title, section, month, week, summary };
}

function parseObjectives(slides: string[][], deck: string): string[] {
  const blocks = requireSlide(slides, 'XULOSA', deck);
  const objectives = ['01', '02', '03']
    .map((label) => blockAfter(blocks, label))
    .filter((value): value is string => Boolean(value));
  if (objectives.length === 0) {
    throw new ExtractionError(deck, 'XULOSA slaydidan xulosalar ajratilmadi.');
  }
  return objectives;
}

function parseQuiz(slides: string[][], deck: string): string[] {
  const blocks = requireSlide(slides, 'TEKSHIRUV', deck);
  const questions: string[] = [];
  for (let i = 0; i < blocks.length; i++) {
    if (/^[1-9]$/.test(blocks[i]) && blocks[i + 1] && !/^[1-9]$/.test(blocks[i + 1])) {
      questions.push(blocks[i + 1]);
    }
  }
  if (questions.length === 0) {
    throw new ExtractionError(deck, 'TEKSHIRUV slaydidan savollar ajratilmadi.');
  }
  return questions;
}

function parseMake(slides: string[][], deck: string) {
  const blocks = requireSlide(slides, 'M — MAKE', deck);
  return {
    makeEasy: requireBlockAfter(blocks, 'OSON', deck, 'makeEasy'),
    makeMedium: requireBlockAfter(blocks, "O'RTA", deck, 'makeMedium'),
    makeHard: requireBlockAfter(blocks, 'QIYIN', deck, 'makeHard'),
  };
}

function parseHomework(slides: string[][], deck: string) {
  const blocks = requireSlide(slides, 'UY VAZIFASI', deck);
  const homeworkMain = requireBlockAfter(blocks, /^ASOSIY TOPSHIRIQ/, deck, 'homeworkMain');

  const reviewStart = blocks.findIndex((block) => /^TAKRORLASH/.test(block));
  const homeworkReview = (reviewStart >= 0 ? blocks.slice(reviewStart + 1) : [])
    .filter((block) => block.startsWith('▢'))
    .map((block) => block.replace(/^▢\s*/, '').trim())
    .filter(Boolean);

  // The closing paragraph tells students where to submit; it is the last block
  // and never starts with a checkbox.
  const last = blocks[blocks.length - 1];
  const homeworkNote = last && !last.startsWith('▢') && last !== homeworkMain ? last : '';

  if (homeworkReview.length === 0) {
    throw new ExtractionError(deck, 'TAKRORLASH punktlari topilmadi.');
  }
  return { homeworkMain, homeworkReview, homeworkNote };
}

function parseNext(slides: string[][]) {
  const blocks = findSlide(slides, 'KEYINGI DARS');
  if (!blocks) return { nextTopic: null, nextPrompt: null };
  return {
    nextTopic: blockAfter(blocks, 'KEYINGI DARS'),
    nextPrompt: blockAfter(blocks, "O'YLAB KELING"),
  };
}

function xpFor(month: number, kind: 'lesson' | 'project'): number {
  const base = 120 + (month - 1) * 20;
  return kind === 'project' ? base * 3 : base;
}

function extractDeck(deckPath: string): LessonRecord {
  const deck = path.basename(deckPath);
  const slides = readSlides(deckPath);
  if (slides.length === 0) {
    throw new ExtractionError(deck, 'Slayd topilmadi.');
  }

  const cover = parseCover(slides[0], deck);
  const kind: 'lesson' | 'project' = cover.order % LESSONS_PER_MONTH === 0 ? 'project' : 'lesson';

  const expectedMonth = Math.ceil(cover.order / LESSONS_PER_MONTH);
  if (cover.month !== expectedMonth) {
    throw new ExtractionError(deck, `Oy mos emas: slaydda ${cover.month}, tartibdan ${expectedMonth}.`);
  }

  return {
    key: `backend-dars-${String(cover.order).padStart(2, '0')}`,
    order: cover.order,
    month: cover.month,
    week: cover.week,
    title: cover.title,
    section: cover.section,
    summary: cover.summary,
    objectives: parseObjectives(slides, deck),
    ...parseHomework(slides, deck),
    ...parseMake(slides, deck),
    quiz: parseQuiz(slides, deck),
    ...parseNext(slides),
    slideFile: deck,
    kind,
    xpReward: xpFor(cover.month, kind),
  };
}

export function extractAllLessons(sourceDir: string = DEFAULT_SOURCE_DIR): LessonRecord[] {
  const decks = fs
    .readdirSync(sourceDir)
    .filter((name) => /^Oy-\d+$/.test(name))
    .sort((a, b) => Number(a.slice(3)) - Number(b.slice(3)))
    .flatMap((monthDir) =>
      fs
        .readdirSync(path.join(sourceDir, monthDir))
        .filter((name) => name.endsWith('.pptx'))
        .map((name) => path.join(sourceDir, monthDir, name))
    );

  const lessons = decks.map(extractDeck).sort((a, b) => a.order - b.order);

  lessons.forEach((lesson, index) => {
    if (lesson.order !== index + 1) {
      throw new Error(`Dars tartibida uzilish: ${index + 1} kutilgan, ${lesson.order} topildi.`);
    }
  });
  if (lessons.length !== TOTAL_LESSONS) {
    throw new Error(`${TOTAL_LESSONS} ta dars kutilgan, ${lessons.length} ta topildi.`);
  }
  return lessons;
}

function copyAssets(sourceDir: string, lessons: LessonRecord[]): void {
  fs.mkdirSync(ASSET_DIR, { recursive: true });
  for (const lesson of lessons) {
    const monthDir = `Oy-${lesson.month}`;
    fs.copyFileSync(
      path.join(sourceDir, monthDir, lesson.slideFile),
      path.join(ASSET_DIR, lesson.slideFile)
    );
  }
}

function render(lessons: LessonRecord[]): string {
  return [
    '// GENERATED by scripts/extractLessons.ts — do not edit by hand.',
    '// Source: 96 Python Backend .pptx decks (Oy-1..Oy-8).',
    "import type { LessonRecord } from './types';",
    '',
    `export const backendLessons: LessonRecord[] = ${JSON.stringify(lessons, null, 2)};`,
    '',
  ].join('\n');
}

function main(): void {
  const sourceDir = process.argv[2] ?? DEFAULT_SOURCE_DIR;
  const lessons = extractAllLessons(sourceDir);
  copyAssets(sourceDir, lessons);
  fs.writeFileSync(OUTPUT_FILE, render(lessons), 'utf8');

  const weeks = Math.ceil(lessons.length / LESSONS_PER_WEEK);
  console.log(`${lessons.length} ta dars ajratildi (${weeks} hafta, haftasiga ${LESSONS_PER_WEEK} dars).`);
  console.log(`Ma'lumot: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
  console.log(`Taqdimotlar: ${path.relative(process.cwd(), ASSET_DIR)} (${lessons.length} fayl)`);
}

// Only run when invoked directly, so the test can import extractAllLessons().
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  main();
}
