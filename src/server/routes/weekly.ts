import { Router } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { teacherOwnsClass } from '../utils/teacherScope';
import { findCohort } from '../dailyPlan/service';
import { PUBLIC_QUESTION_SELECT, toPublicQuestion } from '../quiz/publicQuestion';
import { classSetReport, currentSetForClass, setItems, studentSetView } from '../weekly/service';

/**
 * "Hafta vazifasi": the cohort's homework set for the lessons just taught —
 * every quiz question and practice problem, graded by the server alone.
 * Answers go through POST /api/quiz/:questionId/answer like any other quiz;
 * that route records the first one against the set.
 */
export const weeklyRouter = Router();

weeklyRouter.use(requireAuth);

const NO_TRACK_ERROR = "Yo'nalishingiz belgilanmagan.";

/** GET /api/weekly/current — the student's set, progress and grade; { set: null } when none is open. */
weeklyRouter.get('/current', requireRole(Role.STUDENT), async (req, res) => {
  const user = req.user!;
  if (!user.track) return res.status(400).json({ error: NO_TRACK_ERROR });
  try {
    const view = await studentSetView(user.id, user.track);
    res.json(view ?? { set: null });
  } catch (err) {
    console.error('Weekly set load failed:', err);
    res.status(500).json({ error: "Hafta vazifasini yuklab bo'lmadi." });
  }
});

/**
 * GET /api/weekly/current/quiz — the set's questions the student has not
 * answered yet, in lesson order, in the same redacted shape as /api/quiz so
 * the same player runs them.
 */
weeklyRouter.get('/current/quiz', requireRole(Role.STUDENT), async (req, res) => {
  const user = req.user!;
  if (!user.track) return res.status(400).json({ error: NO_TRACK_ERROR });
  try {
    const cohort = await findCohort(user.id, user.track);
    const set = cohort ? await currentSetForClass(cohort.classId) : null;
    if (!set) return res.status(404).json({ error: "Hozircha hafta vazifasi yo'q." });

    const items = await setItems(set, set.track);
    const answered = await prisma.weeklyAnswer.findMany({
      where: { setId: set.id, userId: user.id },
      select: { questionId: true },
    });
    const done = new Set(answered.map((a) => a.questionId));
    const remaining = items.questionIds.filter((id) => !done.has(id));
    const rows = await prisma.quizQuestion.findMany({ where: { id: { in: remaining } }, select: PUBLIC_QUESTION_SELECT });
    const byId = new Map(rows.map((row) => [row.id, row]));

    res.json({
      lessonKey: `weekly-${set.id}`,
      questions: remaining.flatMap((id) => {
        const row = byId.get(id);
        return row ? [toPublicQuestion(row, false)] : [];
      }),
    });
  } catch (err) {
    console.error('Weekly quiz load failed:', err);
    res.status(500).json({ error: "Savollarni yuklab bo'lmadi." });
  }
});

/** GET /api/weekly/class/:classId — every student's grade for the current set, plus the most-missed questions. */
weeklyRouter.get('/class/:classId', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  if (!(await teacherOwnsClass(req.user!, req.params.classId))) {
    return res.status(403).json({ error: "Bu sinfga kirish huquqingiz yo'q." });
  }
  try {
    const report = await classSetReport(req.params.classId);
    res.json(report ?? { set: null });
  } catch (err) {
    console.error('Weekly class report failed:', err);
    res.status(500).json({ error: "Hisobotni yuklab bo'lmadi." });
  }
});
