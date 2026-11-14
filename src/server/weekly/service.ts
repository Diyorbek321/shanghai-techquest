/**
 * "Hafta vazifasi" — the cohort's homework set, read and graded from the DB.
 *
 * The set is created the first time anyone needs it (a student opening the
 * dashboard, an answer arriving, the teacher opening the report), keyed on the
 * block's first lesson, so every path converges on the same row. Grading is
 * always recomputed from first answers and passed submissions — nothing about
 * a score is stored, so it cannot drift from what the student actually did.
 */
import { Prisma, Track, type WeeklySet } from '@prisma/client';
import { prisma } from '../db';
import { DEFAULT_LESSON_DAYS } from '../lessons/schedule';
import { calendarDate, todayKey } from '../utils/dayKey';
import { findCohort } from '../dailyPlan/service';
import { blockContaining, homeworkBlock, type HomeworkBlock } from './block';
import { scoreSet, type FirstAnswer, type SetScore } from './score';

/** Ordering given lines is scaffolding; only code the student wrote counts. */
const PARSONS_LANGUAGE = 'parsons';

export interface SetItems {
  readonly questionIds: string[];
  readonly problems: { id: string; key: string; title: string; difficulty: string; lessonOrder: number }[];
}

const isUniqueViolation = (err: unknown): boolean =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';

/**
 * The set row for a block, created if missing. Read first so the common case
 * writes nothing; a create that loses a race to another request (two students
 * opening the set the same minute) re-reads the winner's row instead of
 * failing. A timetable edit that moves the block's end or deadline is applied
 * to the existing row.
 */
async function ensureSet(classId: string, block: HomeworkBlock): Promise<WeeklySet> {
  const where = { classId_fromOrder: { classId, fromOrder: block.from } };
  const fields = { toOrder: block.to, opensOn: block.opensOn, dueAt: block.dueAt };
  const existing = await prisma.weeklySet.findUnique({ where });
  if (existing) {
    const stale =
      existing.toOrder !== fields.toOrder ||
      existing.opensOn !== fields.opensOn ||
      existing.dueAt.getTime() !== fields.dueAt.getTime();
    return stale ? prisma.weeklySet.update({ where, data: fields }) : existing;
  }
  try {
    return await prisma.weeklySet.create({ data: { classId, fromOrder: block.from, ...fields } });
  } catch (err) {
    if (!isUniqueViolation(err)) throw err;
    const winner = await prisma.weeklySet.findUnique({ where });
    if (!winner) throw err;
    return winner;
  }
}

const cohortDays = (lessonDays: number[]): number[] => (lessonDays.length > 0 ? lessonDays : DEFAULT_LESSON_DAYS);

/** The class's set in force today, created on first need; null before its first block ends. */
export async function currentSetForClass(classId: string): Promise<(WeeklySet & { track: Track }) | null> {
  const group = await prisma.classGroup.findUnique({
    where: { id: classId },
    select: { startDate: true, lessonDays: true, track: true },
  });
  if (!group?.startDate) return null;
  const totalLessons = await prisma.lesson.count({ where: { track: group.track } });
  const block = homeworkBlock(group.startDate, cohortDays(group.lessonDays), calendarDate(todayKey()), totalLessons);
  if (!block) return null;
  return { ...(await ensureSet(classId, block)), track: group.track };
}

export async function setItems(set: Pick<WeeklySet, 'fromOrder' | 'toOrder'>, track: Track): Promise<SetItems> {
  const lessons = { track, order: { gte: set.fromOrder, lte: set.toOrder } };
  const [questions, problems] = await Promise.all([
    prisma.quizQuestion.findMany({
      where: { lesson: lessons },
      select: { id: true },
      orderBy: [{ lesson: { order: 'asc' } }, { order: 'asc' }],
    }),
    prisma.problem.findMany({
      where: { lesson: lessons },
      select: { id: true, key: true, title: true, difficulty: true, lesson: { select: { order: true } } },
      orderBy: [{ lesson: { order: 'asc' } }, { points: 'asc' }],
    }),
  ]);
  return {
    questionIds: questions.map((q) => q.id),
    problems: problems.map((p) => ({
      id: p.id,
      key: p.key,
      title: p.title,
      difficulty: p.difficulty,
      lessonOrder: p.lesson?.order ?? set.fromOrder,
    })),
  };
}

/**
 * Called after every quiz answer. Keeps only the FIRST answer to a question,
 * against the set its lesson belongs to — from the moment the lesson is held,
 * not from when the set opens, so seeing the key over the weekend (daily plan,
 * lesson page) cannot be turned into a perfect Monday. `skipDuplicates` on the
 * unique key makes a retry, or two answers racing, a no-op.
 *
 * Recorded for every same-track class the student is in, so no teacher's
 * report shows them as not started. Questions from sets older than the one in
 * force are spaced-repetition review, not homework, and are skipped.
 */
export async function recordWeeklyAnswer(
  userId: string,
  track: Track,
  questionId: string,
  correct: boolean,
  answeredAt: Date
): Promise<void> {
  const question = await prisma.quizQuestion.findUnique({
    where: { id: questionId },
    select: { lesson: { select: { order: true, track: true } } },
  });
  if (!question || question.lesson.track !== track) return;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId, class: { track, startDate: { not: null } } },
    select: { class: { select: { id: true, startDate: true, lessonDays: true } } },
  });
  if (enrollments.length === 0) return;
  const totalLessons = await prisma.lesson.count({ where: { track } });
  const today = calendarDate(todayKey());

  for (const { class: group } of enrollments) {
    if (!group.startDate) continue;
    const days = cohortDays(group.lessonDays);
    const block = blockContaining(group.startDate, days, question.lesson.order, totalLessons);
    if (!block) continue;
    const current = homeworkBlock(group.startDate, days, today, totalLessons);
    if (current && block.from < current.from) continue;
    const set = await ensureSet(group.id, block);
    await prisma.weeklyAnswer.createMany({
      data: [{ setId: set.id, userId, questionId, correct, answeredAt }],
      skipDuplicates: true,
    });
  }
}

/** First passed submission per (student, problem), Parsons excluded. */
async function passedAt(userIds: string[], problemIds: string[]): Promise<Map<string, Map<string, Date>>> {
  const byUser = new Map<string, Map<string, Date>>();
  if (userIds.length === 0 || problemIds.length === 0) return byUser;
  const rows = await prisma.problemSubmission.groupBy({
    by: ['userId', 'problemId'],
    where: { userId: { in: userIds }, problemId: { in: problemIds }, passed: true, language: { not: PARSONS_LANGUAGE } },
    _min: { submittedAt: true },
  });
  for (const row of rows) {
    if (!row._min.submittedAt) continue;
    const map = byUser.get(row.userId) ?? new Map<string, Date>();
    map.set(row.problemId, row._min.submittedAt);
    byUser.set(row.userId, map);
  }
  return byUser;
}

async function firstAnswers(setId: string, userIds: string[]): Promise<Map<string, Map<string, FirstAnswer>>> {
  const rows = await prisma.weeklyAnswer.findMany({
    where: { setId, userId: { in: userIds } },
    select: { userId: true, questionId: true, correct: true, answeredAt: true },
  });
  const byUser = new Map<string, Map<string, FirstAnswer>>();
  for (const row of rows) {
    const map = byUser.get(row.userId) ?? new Map<string, FirstAnswer>();
    map.set(row.questionId, { correct: row.correct, answeredAt: row.answeredAt });
    byUser.set(row.userId, map);
  }
  return byUser;
}

export interface StudentSetView {
  set: { id: string; fromOrder: number; toOrder: number; opensOn: string; dueAt: Date };
  lessons: { order: number; title: string }[];
  score: SetScore;
  quiz: { total: number; answered: number };
  problems: (SetItems['problems'][number] & { solved: boolean })[];
}

export async function studentSetView(userId: string, track: Track): Promise<StudentSetView | null> {
  const cohort = await findCohort(userId, track);
  if (!cohort) return null;
  const set = await currentSetForClass(cohort.classId);
  if (!set) return null;

  const [items, lessons, answers] = await Promise.all([
    setItems(set, set.track),
    prisma.lesson.findMany({
      where: { track: set.track, order: { gte: set.fromOrder, lte: set.toOrder } },
      select: { order: true, title: true },
      orderBy: { order: 'asc' },
    }),
    firstAnswers(set.id, [userId]),
  ]);
  const passed = (await passedAt([userId], items.problems.map((p) => p.id))).get(userId) ?? new Map<string, Date>();
  const mine = answers.get(userId) ?? new Map<string, FirstAnswer>();

  return {
    set: { id: set.id, fromOrder: set.fromOrder, toOrder: set.toOrder, opensOn: set.opensOn, dueAt: set.dueAt },
    lessons,
    score: scoreSet({
      questionIds: items.questionIds,
      problemIds: items.problems.map((p) => p.id),
      answers: mine,
      passed,
      dueAt: set.dueAt,
    }),
    quiz: { total: items.questionIds.length, answered: items.questionIds.filter((id) => mine.has(id)).length },
    problems: items.problems.map((p) => ({ ...p, solved: passed.has(p.id) })),
  };
}

/** How many of the most-missed questions the teacher report lists. */
export const MISSED_QUESTIONS_SHOWN = 5;
/** A question is only "most missed" once enough students answered it to mean something. */
export const MISSED_MIN_ANSWERS = 3;

export interface ClassSetReport {
  set: StudentSetView['set'];
  lessons: { order: number; title: string }[];
  total: number;
  students: { id: string; name: string; score: SetScore }[];
  missed: { id: string; prompt: string; lessonOrder: number; wrong: number; answered: number }[];
}

export async function classSetReport(classId: string): Promise<ClassSetReport | null> {
  const set = await currentSetForClass(classId);
  if (!set) return null;

  const [items, lessons, enrollments] = await Promise.all([
    setItems(set, set.track),
    prisma.lesson.findMany({
      where: { track: set.track, order: { gte: set.fromOrder, lte: set.toOrder } },
      select: { order: true, title: true },
      orderBy: { order: 'asc' },
    }),
    prisma.enrollment.findMany({
      where: { classId, user: { role: 'STUDENT' } },
      select: { user: { select: { id: true, name: true } } },
      orderBy: { user: { name: 'asc' } },
    }),
  ]);
  const studentIds = enrollments.map((e) => e.user.id);
  const problemIds = items.problems.map((p) => p.id);
  const [answers, passed] = await Promise.all([firstAnswers(set.id, studentIds), passedAt(studentIds, problemIds)]);

  const students = enrollments.map(({ user }) => ({
    id: user.id,
    name: user.name,
    score: scoreSet({
      questionIds: items.questionIds,
      problemIds,
      answers: answers.get(user.id) ?? new Map<string, FirstAnswer>(),
      passed: passed.get(user.id) ?? new Map<string, Date>(),
      dueAt: set.dueAt,
    }),
  }));

  // Most-missed questions: what to go over at the start of the next class.
  const tally = new Map<string, { wrong: number; answered: number }>();
  for (const perUser of answers.values()) {
    for (const [questionId, answer] of perUser) {
      const row = tally.get(questionId) ?? { wrong: 0, answered: 0 };
      tally.set(questionId, { wrong: row.wrong + (answer.correct ? 0 : 1), answered: row.answered + 1 });
    }
  }
  const missedIds = [...tally.entries()]
    .filter(([, t]) => t.answered >= MISSED_MIN_ANSWERS && t.wrong > 0)
    .sort((a, b) => b[1].wrong / b[1].answered - a[1].wrong / a[1].answered || b[1].wrong - a[1].wrong)
    .slice(0, MISSED_QUESTIONS_SHOWN)
    .map(([id]) => id);
  const missedRows = await prisma.quizQuestion.findMany({
    where: { id: { in: missedIds } },
    select: { id: true, kind: true, prompt: true, code: true, lesson: { select: { order: true } } },
  });
  const byId = new Map(missedRows.map((q) => [q.id, q]));
  const missed = missedIds.flatMap((id) => {
    const q = byId.get(id);
    const t = tally.get(id);
    if (!q || !t) return [];
    const prompt = q.kind === 'output' && q.code ? `Kod: ${q.code.split('\n')[0]} …` : q.prompt;
    return [{ id, prompt, lessonOrder: q.lesson.order, wrong: t.wrong, answered: t.answered }];
  });

  return {
    set: { id: set.id, fromOrder: set.fromOrder, toOrder: set.toOrder, opensOn: set.opensOn, dueAt: set.dueAt },
    lessons,
    total: items.questionIds.length + problemIds.length,
    students,
    missed,
  };
}
