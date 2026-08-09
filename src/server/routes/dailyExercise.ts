import { Router } from 'express';
import { z } from 'zod';
import { Track } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { notify } from '../notifications/notify';
import { eligiblePool, reachedLessonOrder } from '../dailyExercise/progress';

export const dailyExerciseRouter = Router();

dailyExerciseRouter.use(requireAuth);

const completeSchema = z.object({
  fileUrl: z.string().refine((v) => v.startsWith('/api/uploads/'), { message: 'Fayl manzili yaroqsiz.' }).optional(),
  fileName: z.string().min(1).max(255).optional(),
});

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayBefore(dateKey: string): string {
  const d = new Date(`${dateKey}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Everyone on a track gets the same drill on a given day, but the pool is first
 * narrowed to what the student has actually been taught (see progress.ts) — on
 * a 96-lesson course an unfiltered pick would hand a first-week student a
 * lesson-90 exercise.
 */
async function pickTodaysExercise(userId: string, track: Track) {
  const all = await prisma.dailyExercise.findMany({ where: { track }, orderBy: { key: 'asc' } });
  if (all.length === 0) return null;

  const pool = eligiblePool(all, await reachedLessonOrder(userId, track));
  const date = todayKey();
  const exercise = pool[hashSeed(`${date}:${track}`) % pool.length];
  return { date, exercise };
}

dailyExerciseRouter.get('/', async (req, res) => {
  if (!req.user!.track) {
    return res.status(400).json({ error: "Hisobingizga yo'nalish biriktirilmagan." });
  }
  const picked = await pickTodaysExercise(req.user!.id, req.user!.track);
  if (!picked) {
    return res.status(404).json({ error: 'Bugungi mashq topilmadi.' });
  }
  const { date, exercise } = picked;

  const log = await prisma.dailyExerciseLog.findUnique({
    where: { userId_date: { userId: req.user!.id, date } },
  });

  const matchesToday = Boolean(log?.completed && log.exerciseId === exercise.id);
  res.json({
    id: exercise.id,
    prompt: exercise.prompt,
    estMinutes: exercise.estMinutes,
    xpReward: exercise.xpReward,
    date,
    completed: matchesToday,
    fileUrl: matchesToday ? log?.fileUrl ?? null : null,
    fileName: matchesToday ? log?.fileName ?? null : null,
    streak: req.user!.streak,
  });
});

dailyExerciseRouter.post('/complete', async (req, res) => {
  const parsed = completeSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  if (!req.user!.track) {
    return res.status(400).json({ error: "Hisobingizga yo'nalish biriktirilmagan." });
  }
  const picked = await pickTodaysExercise(req.user!.id, req.user!.track);
  if (!picked) {
    return res.status(404).json({ error: 'Bugungi mashq topilmadi.' });
  }
  const { date, exercise } = picked;

  const existing = await prisma.dailyExerciseLog.findUnique({
    where: { userId_date: { userId: req.user!.id, date } },
  });
  if (existing?.completed) {
    return res.status(409).json({ error: 'Bugungi mashq allaqachon bajarilgan.' });
  }

  const yesterdayLog = await prisma.dailyExerciseLog.findUnique({
    where: { userId_date: { userId: req.user!.id, date: dayBefore(date) } },
  });

  // A missed day normally drops the streak back to 1. A freeze bought from the
  // shop absorbs that, but only when there is a real streak to save: a first-day
  // student has nothing at risk and must not have one silently burned.
  const missedYesterday = !yesterdayLog?.completed;
  const streakAtRisk = missedYesterday && req.user!.streak > 0;
  const usesFreeze = streakAtRisk && req.user!.streakFreezes > 0;
  const continuesStreak = !missedYesterday || usesFreeze;

  await prisma.dailyExerciseLog.upsert({
    where: { userId_date: { userId: req.user!.id, date } },
    update: {
      completed: true,
      completedAt: new Date(),
      exerciseId: exercise.id,
      fileUrl: parsed.data.fileUrl ?? null,
      fileName: parsed.data.fileName ?? null,
    },
    create: {
      userId: req.user!.id,
      date,
      exerciseId: exercise.id,
      completed: true,
      completedAt: new Date(),
      fileUrl: parsed.data.fileUrl,
      fileName: parsed.data.fileName,
    },
  });

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      xp: { increment: exercise.xpReward },
      streak: continuesStreak ? { increment: 1 } : 1,
      ...(usesFreeze ? { streakFreezes: { decrement: 1 } } : {}),
    },
  });

  await notify(prisma, {
    userId: user.id,
    type: 'SUCCESS',
    title: 'Kunlik mashq bajarildi!',
    body: usesFreeze
      ? `+${exercise.xpReward} XP. Muzlatish ishlatildi — ketma-ket kunlar saqlanib qoldi: ${user.streak}.`
      : `+${exercise.xpReward} XP. Ketma-ket kunlar: ${user.streak}.`,
  });

  res.json({
    xp: user.xp,
    streak: user.streak,
    xpAwarded: exercise.xpReward,
    streakFreezes: user.streakFreezes,
    usedFreeze: usesFreeze,
  });
});
