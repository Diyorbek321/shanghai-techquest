import { Router } from 'express';
import { Prisma, Role, Track } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { teacherOwnsClass } from '../utils/teacherScope';
import { findContentIssues, type ProblemStats, type QuestionStats } from '../quality/contentHealth';

export const qualityRouter = Router();

qualityRouter.use(requireAuth);

/** Same rule as dailyPlan/service.ts: line ordering is not written code. */
const PARSONS_LANGUAGE = 'parsons';

interface ProblemRow {
  id: string;
  title: string;
  difficulty: string;
  lessonOrder: number;
  lessonTitle: string;
  testCount: number;
  attempted: bigint;
  solved: bigint;
  submissions: bigint;
}

interface QuestionRow {
  id: string;
  prompt: string;
  lessonOrder: number;
  lessonTitle: string;
  students: bigint;
  timesSeen: bigint | null;
  timesCorrect: bigint | null;
}

/** Only students count: a teacher trying a problem out is not evidence about it. */
async function problemStats(track: Track): Promise<ProblemStats[]> {
  const rows = await prisma.$queryRaw<ProblemRow[]>(Prisma.sql`
    SELECT p.id, p.title, p.difficulty::text AS difficulty,
           l."order" AS "lessonOrder", l.title AS "lessonTitle",
           CASE WHEN jsonb_typeof(p."testCases") = 'array' THEN jsonb_array_length(p."testCases") ELSE 0 END AS "testCount",
           COUNT(DISTINCT s."userId") AS attempted,
           COUNT(DISTINCT s."userId") FILTER (WHERE s.passed) AS solved,
           COUNT(s.id) AS submissions
    FROM "Problem" p
    JOIN "Lesson" l ON l.id = p."lessonId"
    LEFT JOIN "ProblemSubmission" s
      ON s."problemId" = p.id
     AND s.language <> ${PARSONS_LANGUAGE}
     AND s."userId" IN (SELECT id FROM "User" WHERE role = 'STUDENT')
    WHERE l.track = ${track}::"Track"
    GROUP BY p.id, l."order", l.title
  `);
  return rows.map((r) => ({
    ...r,
    testCount: Number(r.testCount),
    attempted: Number(r.attempted),
    solved: Number(r.solved),
    submissions: Number(r.submissions),
  }));
}

async function questionStats(track: Track): Promise<QuestionStats[]> {
  const rows = await prisma.$queryRaw<QuestionRow[]>(Prisma.sql`
    SELECT q.id, q.prompt, l."order" AS "lessonOrder", l.title AS "lessonTitle",
           COUNT(a.id) AS students,
           SUM(a."timesSeen") AS "timesSeen",
           SUM(a."timesCorrect") AS "timesCorrect"
    FROM "QuizQuestion" q
    JOIN "Lesson" l ON l.id = q."lessonId"
    LEFT JOIN "QuizAttempt" a
      ON a."questionId" = q.id
     AND a."userId" IN (SELECT id FROM "User" WHERE role = 'STUDENT')
    WHERE l.track = ${track}::"Track"
    GROUP BY q.id, l."order", l.title
  `);
  return rows.map((r) => ({
    ...r,
    students: Number(r.students),
    timesSeen: Number(r.timesSeen ?? 0),
    timesCorrect: Number(r.timesCorrect ?? 0),
  }));
}

/**
 * GET /api/quality/class/:classId — lesson problems and quiz questions on the
 * class's track whose results point at broken content. Counted across every
 * student on the track: one class rarely has enough answers to tell a wrong
 * key from a hard question, and the content is shared by all of them.
 */
qualityRouter.get('/class/:classId', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  if (!(await teacherOwnsClass(req.user!, req.params.classId))) {
    return res.status(403).json({ error: "Bu sinfga kirish huquqingiz yo'q." });
  }
  const group = await prisma.classGroup.findUnique({ where: { id: req.params.classId }, select: { track: true } });
  if (!group) return res.status(404).json({ error: 'Sinf topilmadi.' });

  try {
    const [problems, questions] = await Promise.all([problemStats(group.track), questionStats(group.track)]);
    res.json({
      track: group.track,
      checked: { problems: problems.length, questions: questions.length },
      issues: findContentIssues(problems, questions),
    });
  } catch (err) {
    console.error('Content health query failed:', err);
    res.status(500).json({ error: "Kontent tahlilini yuklab bo'lmadi." });
  }
});
