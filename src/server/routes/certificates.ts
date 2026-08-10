import { Router } from 'express';
import { Prisma, Role, SubmissionStatus, Track } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { earnedCertificates, nextMilestone, type LessonCompletion } from '../certificates/eligibility';
import { generateSerial } from '../certificates/serial';
import { notify } from '../notifications/notify';

export const certificatesRouter = Router();

certificatesRouter.use(requireAuth);

/**
 * A lesson counts as done when its homework has been handed in — the same test
 * the course view already uses for its month progress bars (routes/lessons.ts).
 * Using a different rule here would let the certificate page and the course
 * page disagree about the same lesson, and the student would believe whichever
 * one is wrong.
 */
const DONE: SubmissionStatus[] = [SubmissionStatus.SUBMITTED, SubmissionStatus.GRADED];

async function loadCompletion(userId: string, track: Track): Promise<LessonCompletion[]> {
  const lessons = await prisma.lesson.findMany({
    where: { track },
    orderBy: { order: 'asc' },
    select: {
      key: true,
      month: true,
      section: true,
      assignments: {
        select: { submissions: { where: { userId, status: { in: DONE } }, select: { id: true }, take: 1 } },
      },
    },
  });

  return lessons.map((lesson) => ({
    key: lesson.key,
    month: lesson.month,
    section: lesson.section,
    completed: lesson.assignments.some((a) => a.submissions.length > 0),
  }));
}

certificatesRouter.get('/', async (req, res) => {
  const issued = await prisma.certificate.findMany({
    where: { userId: req.user!.id },
    orderBy: { issuedAt: 'desc' },
  });

  if (!req.user!.track) {
    return res.json({ issued, claimable: [], next: null });
  }

  const completion = await loadCompletion(req.user!.id, req.user!.track);
  const earned = earnedCertificates(completion);
  const have = new Set(issued.map((c) => `${c.kind}:${c.month ?? 'all'}`));

  res.json({
    issued,
    claimable: earned.filter((c) => !have.has(`${c.kind}:${c.month ?? 'all'}`)),
    next: nextMilestone(completion),
  });
});

/**
 * Issue every certificate the student has earned but does not hold yet.
 *
 * Students only. A teacher browsing the page has no track and no homework of
 * their own, so there is nothing to issue and a certificate in their name would
 * be meaningless.
 */
certificatesRouter.post('/', async (req, res) => {
  if (req.user!.role !== Role.STUDENT) {
    return res.status(403).json({ error: "Sertifikat faqat o'quvchilarga beriladi." });
  }
  const track = req.user!.track;
  if (!track) {
    return res.status(400).json({ error: "Hisobingizga yo'nalish biriktirilmagan." });
  }

  const completion = await loadCompletion(req.user!.id, track);
  const earned = earnedCertificates(completion);
  if (earned.length === 0) {
    return res.status(400).json({ error: "Hali sertifikat uchun shart bajarilmagan." });
  }

  const year = new Date().getUTCFullYear();
  const created: unknown[] = [];

  for (const certificate of earned) {
    try {
      created.push(
        await prisma.certificate.create({
          data: {
            userId: req.user!.id,
            track,
            kind: certificate.kind,
            month: certificate.month,
            title: certificate.title,
            serial: generateSerial(track, year),
            lessonsCompleted: certificate.lessonsCompleted,
            lessonsTotal: certificate.lessonsTotal,
          },
        })
      );
    } catch (err) {
      // P2002 on (userId, track, kind, month) means it was already issued —
      // two clicks on the button must not become two certificates. Any other
      // failure is real and must not be hidden behind an empty list.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') continue;
      throw err;
    }
  }

  if (created.length > 0) {
    await notify(prisma, {
      userId: req.user!.id,
      type: 'SUCCESS',
      title: created.length === 1 ? 'Sertifikat berildi' : `${created.length} ta sertifikat berildi`,
      body: earned.map((c) => c.title).join(', '),
    });
  }

  res.status(201).json({ created });
});

/**
 * Public verification: anyone holding the printed serial can confirm it.
 * Deliberately outside the auth middleware mounted above — a certificate a
 * third party cannot check is not evidence of anything. Only the facts printed
 * on the document are returned, never the student's contact details.
 */
export const certificateVerifyRouter = Router();

certificateVerifyRouter.get('/:serial', async (req, res) => {
  const certificate = await prisma.certificate.findUnique({
    where: { serial: req.params.serial },
    select: {
      serial: true,
      title: true,
      track: true,
      issuedAt: true,
      lessonsCompleted: true,
      lessonsTotal: true,
      user: { select: { name: true } },
    },
  });
  if (!certificate) {
    return res.status(404).json({ error: 'Bunday raqamli sertifikat topilmadi.' });
  }
  res.json({ ...certificate, name: certificate.user.name, user: undefined });
});
