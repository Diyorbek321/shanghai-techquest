import { Router } from 'express';
import { Role, Track } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { nextReview, selectReviewQuestions, type DueCandidate } from '../quiz/schedule';

export const quizRouter = Router();

quizRouter.use(requireAuth);

/**
 * XP for a quiz question, paid ONCE per question in a student's lifetime — the
 * first time they ever answer it correctly. Spaced repetition brings the same
 * question back many times by design, so paying on every correct answer would
 * turn the review queue into an XP farm.
 */
export const QUIZ_XP_REWARD = 5;

/** Mirrors the 403 message used by src/server/routes/lessons.ts. */
const WRONG_TRACK_ERROR = "Bu dars sizning yo'nalishingizga tegishli emas.";

/**
 * What a student is allowed to see BEFORE answering. `correctIndex` and
 * `explanation` are the answer key and are deliberately absent — the choices
 * array is visible in devtools, so leaking the index would make the quiz
 * pointless. Same redaction principle as hidden test cases in judge.ts.
 */
export interface PublicQuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  lessonKey: string;
  isReview: boolean;
}

interface QuestionRow {
  id: string;
  prompt: string;
  choices: string[];
  lesson: { key: string };
}

const toPublicQuestion = (row: QuestionRow, isReview: boolean): PublicQuizQuestion => ({
  id: row.id,
  prompt: row.prompt,
  choices: row.choices,
  lessonKey: row.lesson.key,
  isReview,
});

function isWrongTrack(role: Role, userTrack: Track | null, lessonTrack: Track): boolean {
  return role === Role.STUDENT && userTrack !== lessonTrack;
}

/**
 * Due questions from EARLIER lessons of the same track. Only questions that
 * already have an attempt row can be due, so this is a single indexed read on
 * QuizAttempt (userId, dueAt) rather than a scan over the whole question bank.
 */
async function loadDueCandidates(
  userId: string,
  track: Track,
  beforeOrder: number,
  now: Date
): Promise<DueCandidate<QuestionRow>[]> {
  const attempts = await prisma.quizAttempt.findMany({
    where: {
      userId,
      dueAt: { lte: now },
      question: { lesson: { track, order: { lt: beforeOrder } } },
    },
    select: {
      dueAt: true,
      question: {
        select: { id: true, prompt: true, choices: true, lesson: { select: { key: true } } },
      },
    },
    orderBy: { dueAt: 'asc' },
  });

  return attempts.map((attempt) => ({ item: attempt.question, dueAt: attempt.dueAt }));
}

/**
 * GET /api/quiz/due/count — badge counter for the dashboard.
 *
 * Registered before `/:lessonKey` so "due" is never swallowed as a lesson key.
 */
quizRouter.get('/due/count', async (req, res) => {
  const user = req.user!;
  const trackFilter = user.role === Role.STUDENT && user.track ? { lesson: { track: user.track } } : undefined;

  const count = await prisma.quizAttempt.count({
    where: { userId: user.id, dueAt: { lte: new Date() }, ...(trackFilter ? { question: trackFilter } : {}) },
  });

  res.json({ count });
});

/** GET /api/quiz/:lessonKey — the question set for one study session. */
quizRouter.get('/:lessonKey', async (req, res) => {
  const user = req.user!;
  const lesson = await prisma.lesson.findUnique({
    where: { key: req.params.lessonKey },
    select: { id: true, key: true, track: true, order: true },
  });
  if (!lesson) {
    return res.status(404).json({ error: 'Dars topilmadi.' });
  }
  if (isWrongTrack(user.role, user.track, lesson.track)) {
    return res.status(403).json({ error: WRONG_TRACK_ERROR });
  }

  const now = new Date();
  const [currentRows, dueCandidates] = await Promise.all([
    prisma.quizQuestion.findMany({
      where: { lessonId: lesson.id },
      select: { id: true, prompt: true, choices: true, lesson: { select: { key: true } } },
      orderBy: { order: 'asc' },
    }),
    loadDueCandidates(user.id, lesson.track, lesson.order, now),
  ]);

  const reviewIds = new Set(dueCandidates.map((candidate) => candidate.item.id));
  const selected = selectReviewQuestions<QuestionRow>({
    currentLessonQuestions: currentRows,
    previousLessonCandidates: dueCandidates,
    now,
  });

  // Lessons 13..96 have no authored questions yet: an empty list is a valid,
  // non-error answer — the UI hides the quiz card rather than showing a failure.
  res.json({
    lessonKey: lesson.key,
    questions: selected.map((row) => toPublicQuestion(row, reviewIds.has(row.id))),
  });
});

const answerBodySchema = z.object({
  choiceIndex: z.number().int().nonnegative(),
});

/** POST /api/quiz/:questionId/answer — grade one answer, server-side only. */
quizRouter.post('/:questionId/answer', async (req, res) => {
  const user = req.user!;
  const parsed = answerBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Javob varianti noto'g'ri." });
  }

  const question = await prisma.quizQuestion.findUnique({
    where: { id: req.params.questionId },
    select: {
      id: true,
      choices: true,
      correctIndex: true,
      explanation: true,
      lesson: { select: { track: true } },
    },
  });
  if (!question) {
    return res.status(404).json({ error: 'Savol topilmadi.' });
  }
  if (isWrongTrack(user.role, user.track, question.lesson.track)) {
    return res.status(403).json({ error: WRONG_TRACK_ERROR });
  }

  // Bound the choice against THIS question's options, not a hardcoded 4.
  const { choiceIndex } = parsed.data;
  if (choiceIndex >= question.choices.length) {
    return res.status(400).json({ error: "Javob varianti noto'g'ri." });
  }

  const correct = choiceIndex === question.correctIndex;
  const now = new Date();
  const existing = await prisma.quizAttempt.findUnique({
    where: { userId_questionId: { userId: user.id, questionId: question.id } },
    select: { streak: true, timesSeen: true, timesCorrect: true, dueAt: true },
  });

  const schedule = nextReview(
    { streak: existing?.streak ?? 0, dueAt: existing?.dueAt },
    correct,
    now
  );

  // XP is paid only on the FIRST-EVER correct answer: timesCorrect is read
  // before the update, so any later re-review (timesCorrect > 0) awards 0.
  const firstEverCorrect = correct && (existing?.timesCorrect ?? 0) === 0;
  const xpAwarded = firstEverCorrect ? QUIZ_XP_REWARD : 0;

  await prisma.$transaction([
    prisma.quizAttempt.upsert({
      where: { userId_questionId: { userId: user.id, questionId: question.id } },
      create: {
        userId: user.id,
        questionId: question.id,
        correct,
        streak: schedule.streak,
        timesSeen: 1,
        timesCorrect: correct ? 1 : 0,
        answeredAt: now,
        dueAt: schedule.dueAt,
      },
      update: {
        correct,
        streak: schedule.streak,
        timesSeen: { increment: 1 },
        ...(correct ? { timesCorrect: { increment: 1 } } : {}),
        answeredAt: now,
        dueAt: schedule.dueAt,
      },
    }),
    ...(xpAwarded > 0
      ? [prisma.user.update({ where: { id: user.id }, data: { xp: { increment: xpAwarded } } })]
      : []),
  ]);

  // The answer key is revealed only here, after the student has committed.
  res.json({
    correct,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    xpAwarded,
    streak: schedule.streak,
    dueAt: schedule.dueAt,
  });
});
