import { Router } from 'express';
import { z } from 'zod';
import { Role, SubmissionStatus, Track } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { galleryTrackFilter, isGalleryEligible } from '../gallery/visibility';
import { toClientTrack } from '../serializers/track';

export const galleryRouter = Router();

galleryRouter.use(requireAuth);

const MAX_ITEMS = 60;

galleryRouter.get('/', async (req, res) => {
  const filter = galleryTrackFilter({ role: req.user!.role, track: req.user!.track });
  if (filter === 'none') return res.json([]);

  const submissions = await prisma.submission.findMany({
    where: {
      showcased: true,
      status: { in: [SubmissionStatus.SUBMITTED, SubmissionStatus.GRADED] },
      ...(filter === 'all' ? {} : { assignment: { track: filter.track as Track } }),
    },
    orderBy: { submittedAt: 'desc' },
    take: MAX_ITEMS,
    select: {
      id: true,
      githubUrl: true,
      demoUrl: true,
      fileUrl: true,
      status: true,
      showcased: true,
      showcaseNote: true,
      submittedAt: true,
      user: { select: { id: true, name: true, avatarUrl: true } },
      partner: { select: { id: true, name: true } },
      assignment: { select: { title: true, track: true } },
    },
  });

  res.json(
    submissions.filter(isGalleryEligible).map((s) => ({
      id: s.id,
      title: s.assignment.title,
      track: toClientTrack(s.assignment.track),
      note: s.showcaseNote,
      githubUrl: s.githubUrl,
      demoUrl: s.demoUrl,
      submittedAt: s.submittedAt,
      author: { id: s.user.id, name: s.user.name, avatar: s.user.avatarUrl },
      // Pair work carries both names — the gallery must not quietly credit one.
      partner: s.partner,
      isMine: s.user.id === req.user!.id,
    }))
  );
});

const showcaseSchema = z.object({
  showcased: z.boolean(),
  note: z.string().max(200).optional(),
});

/**
 * Publish or withdraw one's own work. Only the author can do this — not their
 * partner, and not a teacher: a child's work going public is the child's call,
 * and withdrawing it has to work the same way.
 */
galleryRouter.patch('/:submissionId', async (req, res) => {
  const parsed = showcaseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri ma'lumot kiritildi." });
  }

  const submission = await prisma.submission.findUnique({
    where: { id: req.params.submissionId },
    select: { id: true, userId: true, status: true, githubUrl: true, demoUrl: true, fileUrl: true },
  });
  if (!submission) {
    return res.status(404).json({ error: 'Topshiriq topilmadi.' });
  }
  if (submission.userId !== req.user!.id) {
    return res.status(403).json({ error: "Faqat o'z ishingizni ko'rgazmaga qo'ya olasiz." });
  }
  if (req.user!.role !== Role.STUDENT) {
    return res.status(403).json({ error: "Ko'rgazma o'quvchilar ishlari uchun." });
  }

  if (
    parsed.data.showcased &&
    !isGalleryEligible({ ...submission, showcased: true, status: submission.status })
  ) {
    return res.status(400).json({
      error: "Ko'rgazmaga qo'yish uchun ish topshirilgan va havola yoki fayl biriktirilgan bo'lishi kerak.",
    });
  }

  const updated = await prisma.submission.update({
    where: { id: submission.id },
    data: {
      showcased: parsed.data.showcased,
      // Withdrawing clears the note too: leaving the author's description behind
      // on a hidden row is a small surprise nobody asked for.
      showcaseNote: parsed.data.showcased ? parsed.data.note ?? '' : '',
    },
    select: { id: true, showcased: true, showcaseNote: true },
  });

  res.json(updated);
});
