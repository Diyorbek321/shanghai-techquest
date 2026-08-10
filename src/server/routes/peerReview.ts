import { Router } from 'express';
import { z } from 'zod';
import { Role, SubmissionStatus } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { assignReviews } from '../peerReview/assign';

export const peerReviewRouter = Router();

peerReviewRouter.use(requireAuth);

/** How many classmates each student reviews per assignment. */
const REVIEWS_PER_STUDENT = 2;

const HANDED_IN: SubmissionStatus[] = [SubmissionStatus.SUBMITTED, SubmissionStatus.GRADED];

/**
 * What this student must review for one assignment.
 *
 * A reviewer must have handed in their own work first. Otherwise the review
 * queue becomes a way to read three worked solutions before writing your own,
 * which is the opposite of the exercise.
 */
peerReviewRouter.get('/assignment/:assignmentId', async (req, res) => {
  if (req.user!.role !== Role.STUDENT) {
    return res.status(403).json({ error: "O'zaro tekshiruv o'quvchilar uchun." });
  }

  const submissions = await prisma.submission.findMany({
    where: { assignmentId: req.params.assignmentId, status: { in: HANDED_IN } },
    select: {
      id: true,
      userId: true,
      partnerId: true,
      githubUrl: true,
      demoUrl: true,
      content: true,
      user: { select: { name: true } },
    },
  });

  const mine = submissions.find((s) => s.userId === req.user!.id);
  if (!mine) {
    return res.status(403).json({
      error: "Avval o'z ishingizni topshiring — shundan keyin sinfdoshlaringiznikini ko'rasiz.",
    });
  }

  const plan = assignReviews(
    submissions.map((s) => ({ submissionId: s.id, userId: s.userId, partnerId: s.partnerId })),
    REVIEWS_PER_STUDENT
  );
  const forMe = plan.filter((a) => a.reviewerId === req.user!.id);
  const byId = new Map(submissions.map((s) => [s.id, s]));

  const written = await prisma.peerReview.findMany({
    where: { reviewerId: req.user!.id, submissionId: { in: forMe.map((a) => a.submissionId) } },
    select: { submissionId: true, strengths: true, suggestions: true },
  });
  const writtenBySubmission = new Map(written.map((r) => [r.submissionId, r]));

  res.json(
    forMe.map((assignment) => {
      const submission = byId.get(assignment.submissionId)!;
      return {
        submissionId: submission.id,
        // The author's name is withheld while reviewing: a review written for a
        // name is a review of the person.
        githubUrl: submission.githubUrl,
        demoUrl: submission.demoUrl,
        content: submission.content,
        myReview: writtenBySubmission.get(submission.id) ?? null,
      };
    })
  );
});

const reviewSchema = z.object({
  strengths: z.string().trim().min(10, { message: "Nima yaxshi bo'lganini kamida 10 belgida yozing." }).max(1000),
  suggestions: z.string().trim().min(10, { message: 'Taklifni kamida 10 belgida yozing.' }).max(1000),
});

peerReviewRouter.post('/:submissionId', async (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  if (req.user!.role !== Role.STUDENT) {
    return res.status(403).json({ error: "O'zaro tekshiruv o'quvchilar uchun." });
  }

  const target = await prisma.submission.findUnique({
    where: { id: req.params.submissionId },
    select: { id: true, userId: true, assignmentId: true, partnerId: true },
  });
  if (!target) {
    return res.status(404).json({ error: 'Topshiriq topilmadi.' });
  }
  if (target.userId === req.user!.id || target.partnerId === req.user!.id) {
    return res.status(403).json({ error: "O'z ishingizni tekshira olmaysiz." });
  }

  // Re-derive the plan rather than trusting the client: a student who guessed a
  // submission id must not be able to review work that was never theirs to see.
  const submissions = await prisma.submission.findMany({
    where: { assignmentId: target.assignmentId, status: { in: HANDED_IN } },
    select: { id: true, userId: true, partnerId: true },
  });
  const plan = assignReviews(
    submissions.map((s) => ({ submissionId: s.id, userId: s.userId, partnerId: s.partnerId })),
    REVIEWS_PER_STUDENT
  );
  const isAssigned = plan.some(
    (a) => a.reviewerId === req.user!.id && a.submissionId === target.id
  );
  if (!isAssigned) {
    return res.status(403).json({ error: 'Bu ish sizga tekshirish uchun berilmagan.' });
  }

  const review = await prisma.peerReview.upsert({
    where: { submissionId_reviewerId: { submissionId: target.id, reviewerId: req.user!.id } },
    update: { strengths: parsed.data.strengths, suggestions: parsed.data.suggestions },
    create: {
      submissionId: target.id,
      reviewerId: req.user!.id,
      strengths: parsed.data.strengths,
      suggestions: parsed.data.suggestions,
    },
    select: { id: true, strengths: true, suggestions: true },
  });

  res.status(201).json(review);
});

/**
 * Reviews of one's own work, or of a student's work for their teacher.
 *
 * The author never learns who wrote which review; staff do. Named criticism
 * between classmates who sit together all week gets polite instead of useful,
 * and accountability for an unkind review belongs with the teacher anyway.
 */
peerReviewRouter.get('/received/:submissionId', async (req, res) => {
  const submission = await prisma.submission.findUnique({
    where: { id: req.params.submissionId },
    select: { id: true, userId: true, partnerId: true },
  });
  if (!submission) {
    return res.status(404).json({ error: 'Topshiriq topilmadi.' });
  }

  const isAuthor = submission.userId === req.user!.id || submission.partnerId === req.user!.id;
  const isStaff = req.user!.role === Role.TEACHER || req.user!.role === Role.ADMIN;
  if (!isAuthor && !isStaff) {
    return res.status(403).json({ error: "Bu tekshiruvlarni ko'rish huquqingiz yo'q." });
  }

  const reviews = await prisma.peerReview.findMany({
    where: { submissionId: submission.id },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      strengths: true,
      suggestions: true,
      createdAt: true,
      reviewer: isStaff ? { select: { id: true, name: true } } : false,
    },
  });

  res.json(reviews);
});
