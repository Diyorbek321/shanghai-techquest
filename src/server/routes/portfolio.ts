import { Router } from 'express';
import { z } from 'zod';
import { Prisma, Role, SubmissionStatus } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import {
  parseRubricCriteria,
  parseRubricScores,
  rubricMaxPoints,
  scoreFromRubric,
  type RubricCriterion,
  type RubricScore,
} from '../lessons/rubric';

export const portfolioRouter = Router();

portfolioRouter.use(requireAuth);

const DEFENSE_MAX_CHARS = 2000;

const defenseSchema = z.object({
  defense: z
    .string()
    .trim()
    .min(1, 'Himoya matni bo‘sh bo‘lmasligi kerak.')
    .max(DEFENSE_MAX_CHARS, `Himoya matni ${DEFENSE_MAX_CHARS} belgidan oshmasligi kerak.`),
});

const rubricSchema = z.object({
  scores: z
    .array(
      z.object({
        label: z.string().min(1),
        points: z.number().finite().min(0),
        note: z.string().max(500).optional(),
      }),
    )
    .min(1, 'Kamida bitta mezon baholanishi kerak.'),
});

/** Only these count as portfolio-worthy: a PENDING row is an unstarted stub. */
const SHOWCASED_STATUSES: SubmissionStatus[] = [
  SubmissionStatus.SUBMITTED,
  SubmissionStatus.GRADED,
  SubmissionStatus.LATE,
];

const STAFF_ROLES: Role[] = [Role.TEACHER, Role.ADMIN];

function isStaff(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}

/**
 * Loads a project submission with everything needed to grade or defend it.
 * `null` when the id is unknown or the submission is not attached to a
 * `kind = 'project'` lesson — plain homework has no rubric and no defense.
 */
async function loadProjectSubmission(submissionId: string) {
  return prisma.submission.findFirst({
    where: { id: submissionId, assignment: { lesson: { kind: 'project' } } },
    include: { assignment: { include: { lesson: { include: { projectRubric: true } } } } },
  });
}

function criteriaForLesson(rubricCriteria: unknown): RubricCriterion[] {
  return parseRubricCriteria(rubricCriteria);
}

/**
 * GET /api/portfolio/:userId
 *
 * The public-facing record of what a student has actually built. Privacy is
 * enforced with 404 rather than 403 on purpose: a stranger must not be able to
 * probe which user ids exist by reading the status code.
 */
portfolioRouter.get('/:userId', async (req, res) => {
  const viewer = req.user;
  if (!viewer) {
    return res.status(401).json({ error: 'Autentifikatsiya talab qilinadi.' });
  }

  try {
    const owner = await prisma.user.findUnique({ where: { id: req.params.userId } });
    const isOwner = owner !== null && owner.id === viewer.id;
    if (!owner || (!owner.profilePublic && !isOwner && !isStaff(viewer.role))) {
      return res.status(404).json({ error: 'Portfolio topilmadi.' });
    }

    const [solvedSubmissions, projectSubmissions] = await Promise.all([
      prisma.problemSubmission.findMany({
        where: { userId: owner.id, passed: true },
        distinct: ['problemId'],
        orderBy: [{ problemId: 'asc' }, { submittedAt: 'desc' }],
        include: { problem: { select: { id: true, title: true, difficulty: true, points: true, tags: true } } },
      }),
      prisma.submission.findMany({
        where: {
          userId: owner.id,
          status: { in: SHOWCASED_STATUSES },
          assignment: { lesson: { kind: 'project' } },
        },
        include: { assignment: { include: { lesson: { include: { projectRubric: true } } } } },
        orderBy: { submittedAt: 'desc' },
      }),
    ]);

    // Never spread the raw rows into the response: they carry `code` (problem
    // submissions), `content`/`fileUrl` (project submissions) and the owner's
    // email. The portfolio is a public surface, so every field is opt-in.
    const solved = solvedSubmissions.map((submission) => ({
      problemId: submission.problem.id,
      title: submission.problem.title,
      difficulty: submission.problem.difficulty,
      points: submission.problem.points,
      tags: submission.problem.tags,
      solvedAt: submission.submittedAt,
    }));

    const projects = projectSubmissions.map((submission) => {
      const criteria = criteriaForLesson(submission.assignment.lesson?.projectRubric?.criteria);
      const scores = parseRubricScores(submission.rubricScores);
      return {
        submissionId: submission.id,
        lessonKey: submission.assignment.lesson?.key ?? null,
        title: submission.assignment.lesson?.title ?? submission.assignment.title,
        status: submission.status,
        submittedAt: submission.submittedAt,
        githubUrl: submission.githubUrl,
        demoUrl: submission.demoUrl,
        defense: submission.defense,
        rubricTotal: scores.length > 0 ? scoreFromRubric(scores, criteria) : null,
        rubricMax: rubricMaxPoints(criteria),
        rubricScores: scores,
      };
    });

    return res.json({
      user: {
        id: owner.id,
        name: owner.name,
        avatarUrl: owner.avatarUrl,
        level: owner.level,
        xp: owner.xp,
        title: owner.title,
        track: owner.track,
        profilePublic: owner.profilePublic,
      },
      solvedCount: solved.length,
      solved,
      projects,
    });
  } catch (error) {
    console.error('Failed to build portfolio', error);
    return res.status(500).json({ error: "Portfolioni yuklashda xatolik yuz berdi." });
  }
});

/**
 * POST /api/portfolio/projects/:submissionId/defense
 *
 * The student's own short written defense of the project. Owner only — a
 * defense written by anyone else is worthless to an employer.
 */
portfolioRouter.post('/projects/:submissionId/defense', async (req, res) => {
  const viewer = req.user;
  if (!viewer) {
    return res.status(401).json({ error: 'Autentifikatsiya talab qilinadi.' });
  }

  const parsed = defenseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto‘g‘ri ma‘lumot kiritildi." });
  }

  try {
    const submission = await loadProjectSubmission(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Loyiha topshirig‘i topilmadi.' });
    }
    if (submission.userId !== viewer.id) {
      return res.status(403).json({ error: "Faqat loyiha muallifi himoya matnini yozishi mumkin." });
    }

    const updated = await prisma.submission.update({
      where: { id: submission.id },
      data: { defense: parsed.data.defense },
      select: { id: true, defense: true },
    });

    return res.json(updated);
  } catch (error) {
    console.error('Failed to save project defense', error);
    return res.status(500).json({ error: "Himoya matnini saqlashda xatolik yuz berdi." });
  }
});

/**
 * POST /api/portfolio/projects/:submissionId/rubric
 *
 * Teacher/admin scoring. Marks are matched against the lesson's rubric criteria
 * (or the default rubric when the lesson has none); unknown labels are dropped
 * and points are clamped per criterion, so the stored Json can never encode a
 * total above the rubric maximum.
 *
 * The resulting total is written through the SAME Grade row that
 * `PATCH /api/submissions/:id` maintains (findFirst on userId+assignmentId, then
 * update-or-create), so a project has exactly one grade of record.
 */
portfolioRouter.post('/projects/:submissionId/rubric', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const parsed = rubricSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto‘g‘ri ma‘lumot kiritildi." });
  }

  try {
    const submission = await loadProjectSubmission(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Loyiha topshirig‘i topilmadi.' });
    }

    const criteria = criteriaForLesson(submission.assignment.lesson?.projectRubric?.criteria);
    const maxByLabel = new Map(criteria.map((criterion) => [criterion.label, criterion.maxPoints]));

    const seen = new Set<string>();
    const scores: RubricScore[] = [];
    for (const score of parsed.data.scores) {
      const max = maxByLabel.get(score.label);
      if (max === undefined || seen.has(score.label)) {
        continue;
      }
      seen.add(score.label);
      scores.push({
        label: score.label,
        points: Math.min(Math.max(score.points, 0), max),
        note: score.note ?? '',
      });
    }

    if (scores.length === 0) {
      return res.status(400).json({ error: "Yuborilgan mezonlar bu loyihaning rubrikasiga mos kelmadi." });
    }

    const maxScore = rubricMaxPoints(criteria);
    const total = scoreFromRubric(scores, criteria);

    const updated = await prisma.submission.update({
      where: { id: submission.id },
      // Prisma's InputJsonValue does not accept a bare interface array (no index
      // signature); the shape is already validated above, so widening is safe.
      data: { rubricScores: scores as unknown as Prisma.InputJsonValue, status: SubmissionStatus.GRADED },
      select: { id: true, rubricScores: true, status: true },
    });

    const existingGrade = await prisma.grade.findFirst({
      where: { userId: submission.userId, assignmentId: submission.assignmentId },
    });
    if (existingGrade) {
      await prisma.grade.update({
        where: { id: existingGrade.id },
        data: { score: total, maxScore, gradedAt: new Date() },
      });
    } else {
      await prisma.grade.create({
        data: {
          userId: submission.userId,
          assignmentId: submission.assignmentId,
          subject: submission.assignment.lesson?.title ?? submission.assignment.title,
          score: total,
          maxScore,
        },
      });
    }

    return res.json({
      submissionId: updated.id,
      status: updated.status,
      rubricScores: scores,
      total,
      maxScore,
      criteria,
    });
  } catch (error) {
    console.error('Failed to save project rubric', error);
    return res.status(500).json({ error: "Rubrikani saqlashda xatolik yuz berdi." });
  }
});
