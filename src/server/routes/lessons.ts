import fs from 'fs';
import { Router } from 'express';
import { Difficulty, Lesson, Role, SubmissionStatus } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { resolveTrackFilter } from '../utils/trackScope';
import { toClientTrack } from '../serializers/track';
import { resolveSlidePath } from '../lessons/assets';

export const lessonsRouter = Router();

lessonsRouter.use(requireAuth);

/** Share of a lesson's quiz questions that must be answered correctly. */
export const QUIZ_MASTERY_RATIO = 0.6;

/** Practice difficulties that gate progression; HARD stays optional bonus work. */
const REQUIRED_DIFFICULTIES: Difficulty[] = [Difficulty.EASY, Difficulty.MEDIUM];

/** Why a lesson is open. `null` means it is still locked. */
export type UnlockedBy = 'first' | 'mastery' | 'deadline';

export interface LessonMastery {
  problemsPassed: number;
  problemsRequired: number;
  quizCorrect: number;
  quizTotal: number;
  mastered: boolean;
}

interface LessonGate {
  unlocked: boolean;
  unlockedBy: UnlockedBy | null;
  behind: boolean;
}

const OPEN_GATE: LessonGate = { unlocked: true, unlockedBy: 'first', behind: false };

interface LessonProgress {
  assignmentId: string | null;
  dueDate: Date | null;
  status: SubmissionStatus | null;
}

function serializeLessonSummary(
  lesson: Lesson,
  progress: LessonProgress | undefined,
  gate: LessonGate,
  mastery: LessonMastery
) {
  return {
    key: lesson.key,
    track: toClientTrack(lesson.track),
    order: lesson.order,
    month: lesson.month,
    week: lesson.week,
    title: lesson.title,
    section: lesson.section,
    summary: lesson.summary,
    kind: lesson.kind,
    xpReward: lesson.xpReward,
    hasSlides: Boolean(lesson.slideFile),
    unlocked: gate.unlocked,
    unlockedBy: gate.unlockedBy,
    behind: gate.behind,
    mastery,
    assignmentId: progress?.assignmentId ?? null,
    dueDate: progress?.dueDate ?? null,
    submissionStatus: progress?.status ?? null,
  };
}

/**
 * Progress for the signed-in student, keyed by lesson key. Staff get an empty
 * map — they see the catalog rather than one student's state.
 */
async function loadProgress(userId: string, role: Role, lessons: Lesson[]): Promise<Map<string, LessonProgress>> {
  if (role !== Role.STUDENT || lessons.length === 0) {
    return new Map();
  }
  const assignments = await prisma.assignment.findMany({
    where: {
      lessonId: { in: lessons.map((lesson) => lesson.id) },
      class: { enrollments: { some: { userId } } },
    },
    select: {
      id: true,
      dueDate: true,
      moduleKey: true,
      submissions: { where: { userId }, select: { status: true } },
    },
  });

  return new Map(
    assignments
      .filter((assignment): assignment is typeof assignment & { moduleKey: string } => Boolean(assignment.moduleKey))
      .map((assignment) => [
        assignment.moduleKey,
        {
          assignmentId: assignment.id,
          dueDate: assignment.dueDate,
          status: assignment.submissions[0]?.status ?? null,
        },
      ])
  );
}

const emptyMastery = (): LessonMastery => ({
  problemsPassed: 0,
  problemsRequired: 0,
  quizCorrect: 0,
  quizTotal: 0,
  mastered: false,
});

/**
 * Mastery for every lesson in one pass: four batched queries regardless of how
 * many lessons are asked for, so the 96-lesson list endpoint never fans out
 * into per-lesson round trips.
 *
 * A lesson is mastered when the student passed both its EASY and MEDIUM
 * practice problems AND answered at least QUIZ_MASTERY_RATIO of its quiz
 * questions correctly. QuizAttempt holds one upserted row per (user, question),
 * so a stored row is by definition that question's most recent attempt; a
 * question with no row counts as not correct.
 *
 * Each half is skipped when the lesson authored nothing for it:
 *  - problemsRequired === 0 → the lesson has no linked EASY/MEDIUM practice, so
 *    it is gated on the quiz alone (today: 10 of the 96 backend lessons).
 *  - quizTotal === 0 → skip the quiz half rather than fail it.
 * A lesson that authored neither is never mastered: with both halves vacuously
 * true it would otherwise unlock the rest of the track for free.
 */
async function loadMastery(userId: string, role: Role, lessons: Lesson[]): Promise<Map<string, LessonMastery>> {
  const mastery = new Map<string, LessonMastery>(lessons.map((lesson) => [lesson.key, emptyMastery()]));
  if (lessons.length === 0) {
    return mastery;
  }

  const lessonKeyById = new Map(lessons.map((lesson) => [lesson.id, lesson.key]));
  const lessonIds = [...lessonKeyById.keys()];

  const [problems, questions] = await Promise.all([
    prisma.problem.findMany({
      where: { lessonId: { in: lessonIds }, difficulty: { in: REQUIRED_DIFFICULTIES } },
      select: { id: true, lessonId: true },
    }),
    prisma.quizQuestion.findMany({
      where: { lessonId: { in: lessonIds } },
      select: { id: true, lessonId: true },
    }),
  ]);

  const lessonKeyOfProblem = new Map<string, string>();
  problems.forEach((problem) => {
    const key = problem.lessonId ? lessonKeyById.get(problem.lessonId) : undefined;
    if (!key) return;
    lessonKeyOfProblem.set(problem.id, key);
    mastery.get(key)!.problemsRequired += 1;
  });

  const lessonKeyOfQuestion = new Map<string, string>();
  questions.forEach((question) => {
    const key = lessonKeyById.get(question.lessonId);
    if (!key) return;
    lessonKeyOfQuestion.set(question.id, key);
    mastery.get(key)!.quizTotal += 1;
  });

  // Staff have no personal practice record; they only need the requirement counts.
  if (role !== Role.STUDENT) {
    return mastery;
  }

  const [passedSubmissions, correctAttempts] = await Promise.all([
    lessonKeyOfProblem.size === 0
      ? Promise.resolve([] as { problemId: string }[])
      : prisma.problemSubmission.findMany({
          where: { userId, passed: true, problemId: { in: [...lessonKeyOfProblem.keys()] } },
          select: { problemId: true },
          distinct: ['problemId'],
        }),
    lessonKeyOfQuestion.size === 0
      ? Promise.resolve([] as { questionId: string }[])
      : prisma.quizAttempt.findMany({
          where: { userId, correct: true, questionId: { in: [...lessonKeyOfQuestion.keys()] } },
          select: { questionId: true },
        }),
  ]);

  passedSubmissions.forEach(({ problemId }) => {
    const key = lessonKeyOfProblem.get(problemId);
    if (key) mastery.get(key)!.problemsPassed += 1;
  });
  correctAttempts.forEach(({ questionId }) => {
    const key = lessonKeyOfQuestion.get(questionId);
    if (key) mastery.get(key)!.quizCorrect += 1;
  });

  mastery.forEach((row) => {
    // Each half is vacuously true when the lesson authored nothing for it, so a
    // lesson with only a quiz is gated on the quiz and vice versa. `hasWork`
    // keeps the degenerate lesson — no problems AND no quiz — unmastered instead
    // of instantly mastered.
    const hasWork = row.problemsRequired > 0 || row.quizTotal > 0;
    const practiceDone = row.problemsRequired === 0 || row.problemsPassed >= row.problemsRequired;
    const quizDone = row.quizTotal === 0 || row.quizCorrect >= row.quizTotal * QUIZ_MASTERY_RATIO;
    row.mastered = hasWork && practiceDone && quizDone;
  });

  return mastery;
}

/**
 * A lesson opens once the previous one is mastered. The cohort deadline stays a
 * safety valve so a stuck student is never permanently blocked — but a lesson
 * opened that way reports `unlockedBy: 'deadline'` and `behind: true` so staff
 * can spot who is coasting. Without a cohort (staff, or a student not enrolled
 * yet) the whole catalog is open.
 */
function computeGates(
  lessons: Lesson[],
  progress: Map<string, LessonProgress>,
  mastery: Map<string, LessonMastery>,
  now: Date
): LessonGate[] {
  if (progress.size === 0) {
    return lessons.map(() => OPEN_GATE);
  }
  let previous: { cleared: boolean; dueDate: Date | null } | null = null;

  return lessons.map((lesson, index) => {
    const gate = resolveGate(index, previous, now);

    const row = progress.get(lesson.key);
    // Mastery is the only way to clear a lesson. Handing in the assignment is
    // not enough on its own: a lesson with no linked practice is still gated on
    // its quiz, and one with neither is only ever opened by its deadline.
    const cleared = (mastery.get(lesson.key) ?? emptyMastery()).mastered;
    previous = { cleared, dueDate: row?.dueDate ?? null };
    return gate;
  });
}

function resolveGate(index: number, previous: { cleared: boolean; dueDate: Date | null } | null, now: Date): LessonGate {
  if (index === 0 || previous === null) {
    return OPEN_GATE;
  }
  if (previous.cleared) {
    return { unlocked: true, unlockedBy: 'mastery', behind: false };
  }
  if (previous.dueDate !== null && previous.dueDate.getTime() <= now.getTime()) {
    return { unlocked: true, unlockedBy: 'deadline', behind: true };
  }
  return { unlocked: false, unlockedBy: null, behind: false };
}

lessonsRouter.get('/', async (req, res) => {
  const track = resolveTrackFilter(req);
  const lessons = await prisma.lesson.findMany({
    where: track ? { track } : undefined,
    orderBy: { order: 'asc' },
  });

  const [progress, mastery] = await Promise.all([
    loadProgress(req.user!.id, req.user!.role, lessons),
    loadMastery(req.user!.id, req.user!.role, lessons),
  ]);
  const gates = computeGates(lessons, progress, mastery, new Date());

  const months = new Map<number, ReturnType<typeof serializeLessonSummary>[]>();
  lessons.forEach((lesson, index) => {
    const list = months.get(lesson.month) ?? [];
    list.push(
      serializeLessonSummary(lesson, progress.get(lesson.key), gates[index], mastery.get(lesson.key) ?? emptyMastery())
    );
    months.set(lesson.month, list);
  });

  res.json({
    months: [...months.entries()]
      .sort(([a], [b]) => a - b)
      .map(([month, monthLessons]) => ({
        month,
        title: monthTitle(monthLessons.map((l) => l.section)),
        lessons: monthLessons,
        completed: monthLessons.filter((l) => l.submissionStatus === 'GRADED' || l.submissionStatus === 'SUBMITTED')
          .length,
        total: monthLessons.length,
      })),
  });
});

const MAX_TITLE_SECTIONS = 3;

/**
 * A month's heading: its distinct sections in curriculum order. The closing
 * project lesson is skipped so "MINI-LOYIHA" never becomes the month's theme.
 */
function monthTitle(sections: string[]): string {
  const distinct = [...new Set(sections.filter((section) => section !== 'MINI-LOYIHA'))];
  const shown = distinct.slice(0, MAX_TITLE_SECTIONS).join(' · ');
  return distinct.length > MAX_TITLE_SECTIONS ? `${shown}…` : shown;
}

lessonsRouter.get('/:key', async (req, res) => {
  const lesson = await prisma.lesson.findUnique({
    where: { key: req.params.key },
    include: {
      problems: {
        select: { id: true, key: true, title: true, difficulty: true, points: true, tags: true },
        orderBy: { points: 'asc' },
      },
    },
  });
  if (!lesson) {
    return res.status(404).json({ error: 'Dars topilmadi.' });
  }
  if (req.user!.role === Role.STUDENT && req.user!.track !== lesson.track) {
    return res.status(403).json({ error: "Bu dars sizning yo'nalishingizga tegishli emas." });
  }

  const [progress, mastery] = await Promise.all([
    loadProgress(req.user!.id, req.user!.role, [lesson]),
    loadMastery(req.user!.id, req.user!.role, [lesson]),
  ]);
  const row = progress.get(lesson.key);

  res.json({
    ...serializeLessonSummary(lesson, row, OPEN_GATE, mastery.get(lesson.key) ?? emptyMastery()),
    objectives: lesson.objectives,
    homeworkMain: lesson.homeworkMain,
    homeworkReview: lesson.homeworkReview,
    homeworkNote: lesson.homeworkNote,
    make: { easy: lesson.makeEasy, medium: lesson.makeMedium, hard: lesson.makeHard },
    quiz: lesson.quiz,
    nextTopic: lesson.nextTopic,
    nextPrompt: lesson.nextPrompt,
    problems: lesson.problems,
  });
});

lessonsRouter.get('/:key/slides', async (req, res) => {
  const lesson = await prisma.lesson.findUnique({ where: { key: req.params.key } });
  if (!lesson?.slideFile) {
    return res.status(404).json({ error: 'Taqdimot topilmadi.' });
  }
  if (req.user!.role === Role.STUDENT && req.user!.track !== lesson.track) {
    return res.status(403).json({ error: "Bu dars sizning yo'nalishingizga tegishli emas." });
  }

  const filePath = resolveSlidePath(lesson.track, lesson.slideFile);
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Taqdimot topilmadi.' });
  }
  res.download(filePath, lesson.slideFile);
});
