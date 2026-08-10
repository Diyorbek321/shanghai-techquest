/**
 * Install the Python Backend course into a database that already has real data.
 *
 * `npm run db:seed` cannot be used for this. It is a demo seed: alongside the
 * backend lessons it calls plain `prisma.assignment.create` / `quest.create` /
 * `submission.create` for the frontend, robotics and office demo content
 * (prisma/seed.ts lines 430-546). Those calls have no unique key to upsert on,
 * so running the seed against a live database adds ANOTHER copy of every demo
 * assignment, quest and submission each time — the same failure that once left
 * this project with 8 copies of every class (see scripts/dedupeClasses.ts).
 *
 * This script writes only what the backend course needs, and every write is
 * keyed:
 *   - Lesson          upsert on `key`
 *   - Problem         upsert on `key`
 *   - QuizQuestion    upsert on (lessonId, order)
 *   - ProjectRubric   upsert on lessonId, BACKEND project lessons only
 *   - ClassGroup      find-or-create on (track, title)
 *   - Assignment      syncLessonAssignments, which updates in place by moduleKey
 *
 * Re-running it is therefore safe and is the intended way to publish lesson
 * edits. It is deliberately NOT wrapped in one transaction: ~800 upserts would
 * exceed Prisma's interactive-transaction timeout, and because every write is
 * idempotent, re-running after a partial failure converges to the same state.
 *
 * Content is validated BEFORE anything is written — a malformed test case or a
 * quiz answer pointing at the wrong choice aborts the run rather than teaching
 * students the wrong thing.
 *
 * Usage:
 *   npx tsx scripts/seedBackendCourse.ts                      # dry run, writes nothing
 *   npx tsx scripts/seedBackendCourse.ts --apply
 *   npx tsx scripts/seedBackendCourse.ts --apply \
 *       --teacher ustoz@maktab.uz --start 2026-09-01 --days 1,3,5
 */
import { PrismaClient, Prisma, Track, Role, Difficulty } from '@prisma/client';
import { backendLessons } from '../prisma/lessonsData/backend';
import { backendLessonProblems } from '../prisma/lessonsData/backendProblems';
import { backendLessonQuiz } from '../prisma/lessonsData/backendQuiz';
import { syncLessonAssignments } from '../src/server/lessons/syncAssignments';
import { DEFAULT_PROJECT_RUBRIC } from '../src/server/lessons/rubric';
import { DEFAULT_LESSON_DAYS } from '../src/server/lessons/schedule';

const prisma = new PrismaClient();

const APPLY = process.argv.includes('--apply');
const DEFAULT_CLASS_TITLE = 'Python Backend Dasturlash';

function argValue(flag: string): string | null {
  const index = process.argv.indexOf(flag);
  return index === -1 ? null : (process.argv[index + 1] ?? null);
}

/**
 * The cohort's first meeting. Defaults to today rather than the demo seed's
 * "28 days ago": with a start date in the past, syncLessonAssignments would
 * generate a course whose first weeks of homework are already overdue.
 */
function parseStartDate(): Date {
  const raw = argValue('--start');
  if (!raw) {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    throw new Error(`--start sanasi YYYY-MM-DD ko'rinishida bo'lishi kerak, "${raw}" berildi.`);
  }
  const parsed = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) throw new Error(`--start sanasi noto'g'ri: "${raw}".`);
  return parsed;
}

/** Weekday numbers, 0=Yakshanba .. 6=Shanba, matching Date#getUTCDay. */
function parseLessonDays(): number[] {
  const raw = argValue('--days');
  if (!raw) return [...DEFAULT_LESSON_DAYS];
  const days = raw.split(',').map((part) => Number(part.trim()));
  if (days.some((day) => !Number.isInteger(day) || day < 0 || day > 6)) {
    throw new Error(`--days 0..6 oralig'idagi sonlar bo'lishi kerak (masalan 1,3,5), "${raw}" berildi.`);
  }
  if (days.length === 0) throw new Error('--days kamida bitta kun talab qiladi.');
  return [...new Set(days)].sort((a, b) => a - b);
}

/**
 * Same checks the demo seed runs. A test case without `expectedStdout` would
 * grade every submission against `undefined`, and a problem whose cases are all
 * hidden gives the student nothing to check against before submitting.
 */
function validateProblems(): void {
  for (const problem of backendLessonProblems) {
    if (!Array.isArray(problem.testCases) || problem.testCases.length === 0) {
      throw new Error(`Masala "${problem.key}": kamida bitta test case bo'lishi kerak.`);
    }
    problem.testCases.forEach((testCase, index) => {
      const where = `Masala "${problem.key}" test #${index + 1}`;
      if (typeof testCase.stdin !== 'string') throw new Error(`${where}: "stdin" matn bo'lishi kerak.`);
      if (typeof testCase.expectedStdout !== 'string') {
        throw new Error(`${where}: "expectedStdout" matn bo'lishi kerak.`);
      }
      if (typeof testCase.hidden !== 'boolean') throw new Error(`${where}: "hidden" true yoki false bo'lishi kerak.`);
      if (typeof testCase.label !== 'string' || testCase.label.trim() === '') {
        throw new Error(`${where}: "label" bo'sh bo'lmagan matn bo'lishi kerak.`);
      }
    });
    if (!problem.testCases.some((testCase) => !testCase.hidden)) {
      throw new Error(`Masala "${problem.key}": kamida bitta ochiq (hidden: false) test case bo'lishi kerak.`);
    }
  }
}

function validateQuiz(lessonKeys: Set<string>): void {
  for (const question of backendLessonQuiz) {
    const where = `${question.lessonKey} #${question.order}`;
    if (question.choices.length !== 4) {
      throw new Error(`Quiz savoli ${where}: 4 ta variant kutilgan, ${question.choices.length} ta topildi.`);
    }
    if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
      throw new Error(`Quiz savoli ${where}: correctIndex 0..3 oralig'ida bo'lishi kerak.`);
    }
    if (!lessonKeys.has(question.lessonKey)) {
      throw new Error(`Quiz savoli ${where}: "${question.lessonKey}" darsi dars ro'yxatida yo'q.`);
    }
  }
}

async function resolveTeacher(): Promise<{ id: string; name: string; email: string }> {
  const email = argValue('--teacher');
  if (email) {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true, role: true } });
    if (!user) throw new Error(`O'qituvchi topilmadi: ${email}`);
    if (user.role !== Role.TEACHER && user.role !== Role.ADMIN) {
      throw new Error(`${email} roli ${user.role} — sinf egasi TEACHER yoki ADMIN bo'lishi kerak.`);
    }
    return user;
  }
  const fallback = await prisma.user.findFirst({
    where: { role: Role.TEACHER },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true },
  });
  if (!fallback) throw new Error("Bazada bitta ham TEACHER yo'q. --teacher <email> bilan ko'rsating.");
  return fallback;
}

async function writeLessons(): Promise<void> {
  for (const lesson of backendLessons) {
    const { key, ...fields } = lesson;
    const data = { ...fields, track: Track.BACKEND };
    await prisma.lesson.upsert({ where: { key }, update: data, create: { key, ...data } });
  }
}

async function writeProblems(): Promise<number> {
  const lessonIdByKey = new Map(
    (await prisma.lesson.findMany({ where: { track: Track.BACKEND }, select: { id: true, key: true } })).map(
      (lesson) => [lesson.key, lesson.id] as const
    )
  );
  let synced = 0;
  for (const problem of backendLessonProblems) {
    const lessonId = lessonIdByKey.get(problem.lessonKey);
    if (!lessonId) {
      console.warn(`  ogohlantirish: "${problem.key}" noma'lum darsga ("${problem.lessonKey}") bog'langan — o'tkazib yuborildi.`);
      continue;
    }
    const data = {
      lessonId,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty as Difficulty,
      points: problem.points,
      tags: problem.tags,
      starterCodePy: problem.starterCodePy,
      starterCodeJs: null,
      starterCodeCpp: null,
      testCases: problem.testCases as unknown as Prisma.InputJsonValue,
    };
    await prisma.problem.upsert({ where: { key: problem.key }, update: data, create: { key: problem.key, ...data } });
    synced += 1;
  }
  return synced;
}

async function writeQuiz(): Promise<number> {
  const lessonIdByKey = new Map(
    (await prisma.lesson.findMany({ where: { track: Track.BACKEND }, select: { id: true, key: true } })).map(
      (lesson) => [lesson.key, lesson.id] as const
    )
  );
  let synced = 0;
  for (const question of backendLessonQuiz) {
    const lessonId = lessonIdByKey.get(question.lessonKey);
    if (!lessonId) continue; // validated above
    const data = {
      lessonId,
      order: question.order,
      prompt: question.prompt,
      choices: [...question.choices],
      correctIndex: question.correctIndex,
      explanation: question.explanation,
    };
    await prisma.quizQuestion.upsert({
      where: { lessonId_order: { lessonId, order: question.order } },
      update: data,
      create: data,
    });
    synced += 1;
  }
  return synced;
}

/** Scoped to BACKEND, unlike the demo seed — this must not rewrite other tracks' rubrics. */
async function writeRubrics(): Promise<number> {
  const projectLessons = await prisma.lesson.findMany({
    where: { kind: 'project', track: Track.BACKEND },
    select: { id: true },
  });
  const criteria = DEFAULT_PROJECT_RUBRIC.map((c) => ({ ...c })) as unknown as Prisma.InputJsonValue;
  for (const lesson of projectLessons) {
    await prisma.projectRubric.upsert({
      where: { lessonId: lesson.id },
      update: { criteria },
      create: { lessonId: lesson.id, criteria },
    });
  }
  return projectLessons.length;
}

async function main() {
  const title = argValue('--title') ?? DEFAULT_CLASS_TITLE;
  const startDate = parseStartDate();
  const lessonDays = parseLessonDays();

  validateProblems();
  validateQuiz(new Set(backendLessons.map((lesson) => lesson.key)));
  console.log(`Mazmun tekshirildi: ${backendLessons.length} dars, ${backendLessonProblems.length} masala, ${backendLessonQuiz.length} quiz savoli — xato yo'q.`);

  const teacher = await resolveTeacher();
  const existingClass = await prisma.classGroup.findFirst({ where: { track: Track.BACKEND, title } });
  const existingLessons = await prisma.lesson.count({ where: { track: Track.BACKEND } });

  console.log(`\nO'qituvchi:  ${teacher.name} <${teacher.email}>`);
  console.log(`Sinf:        "${title}" — ${existingClass ? `mavjud (${existingClass.id})` : 'yangi yaratiladi'}`);
  console.log(`Boshlanish:  ${startDate.toISOString().slice(0, 10)}, dars kunlari: ${lessonDays.join(', ')} (0=Yak .. 6=Sha)`);
  console.log(`Bazadagi BACKEND darslari hozir: ${existingLessons} ta`);

  if (!APPLY) {
    console.log('\n(quruq ishga tushirish — hech narsa yozilmadi. Yozish uchun: --apply)');
    return;
  }

  console.log('\nYozilmoqda...');
  await writeLessons();
  console.log(`  darslar:    ${backendLessons.length}`);
  console.log(`  masalalar:  ${await writeProblems()}`);
  console.log(`  quiz:       ${await writeQuiz()}`);
  console.log(`  rubrikalar: ${await writeRubrics()}`);

  const classGroup =
    existingClass ??
    (await prisma.classGroup.create({
      data: {
        title,
        track: Track.BACKEND,
        teacherId: teacher.id,
        schedule: 'Dush/Chor/Juma soat 16:00',
        startDate,
        lessonDays,
      },
    }));

  const sync = await syncLessonAssignments(prisma, classGroup.id);
  console.log(`  uy vazifasi: ${sync.created} yangi / ${sync.updated} yangilandi`);

  const [lessons, problems, quiz, assignments] = await Promise.all([
    prisma.lesson.count({ where: { track: Track.BACKEND } }),
    prisma.problem.count({ where: { lesson: { track: Track.BACKEND } } }),
    prisma.quizQuestion.count({ where: { lesson: { track: Track.BACKEND } } }),
    prisma.assignment.count({ where: { classId: classGroup.id } }),
  ]);
  console.log(`\nTekshiruv — darslar: ${lessons}, masalalar: ${problems}, quiz: ${quiz}, vazifalar: ${assignments}`);
  console.log(`Sinf ID: ${classGroup.id}`);
}

main()
  .catch((e) => {
    console.error('XATO:', e.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
