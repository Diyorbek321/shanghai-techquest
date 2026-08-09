import { Router } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { askGeminiJson, askGeminiText, GeminiNotConfiguredError } from '../ai/gemini';
import { notify } from '../notifications/notify';
import { checkAchievements } from '../achievements/check';
import { areFriends } from './social';

export const battlesRouter = Router();

battlesRouter.use(requireAuth);

const WIN_XP = 200;
const WIN_COINS = 100;
const LOSE_XP = 50;

async function pickRandomProblem() {
  const problems = await prisma.problem.findMany({ select: { id: true } });
  if (problems.length === 0) return null;
  const chosen = problems[Math.floor(Math.random() * problems.length)];
  return prisma.problem.findUnique({ where: { id: chosen.id } });
}
const WIN_ELO = 15;
const LOSE_ELO = 10;

const battleInclude = {
  problem: true,
  challenger: { select: { id: true, name: true, avatarUrl: true, level: true } },
  opponent: { select: { id: true, name: true, avatarUrl: true, level: true } },
} as const;

type BattleWithRelations = Awaited<ReturnType<typeof prisma.battleChallenge.findFirstOrThrow<{ include: typeof battleInclude }>>>;

function serializeBattle(b: BattleWithRelations) {
  return {
    id: b.id,
    challengerId: b.challengerId,
    opponentId: b.opponentId,
    challenger: { id: b.challenger.id, name: b.challenger.name, avatar: b.challenger.avatarUrl, level: b.challenger.level },
    opponent: b.isAI
      ? { id: 'ai', name: 'Deep_Net_AI', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI', level: 40 }
      : b.opponent
        ? { id: b.opponent.id, name: b.opponent.name, avatar: b.opponent.avatarUrl, level: b.opponent.level }
        : null,
    isAI: b.isAI,
    language: b.language,
    status: b.status,
    challengerCode: b.challengerCode,
    opponentCode: b.opponentCode,
    challengerScore: b.challengerScore,
    opponentScore: b.opponentScore,
    winnerId: b.winnerId,
    feedback: b.feedback,
    createdAt: b.createdAt,
    resolvedAt: b.resolvedAt,
    problem: b.problem,
  };
}

battlesRouter.get('/', async (req, res) => {
  const battles = await prisma.battleChallenge.findMany({
    where: { OR: [{ challengerId: req.user!.id }, { opponentId: req.user!.id }] },
    include: battleInclude,
    orderBy: { createdAt: 'desc' },
  });
  res.json(battles.map(serializeBattle));
});

battlesRouter.get('/:id', async (req, res) => {
  const battle = await prisma.battleChallenge.findUnique({ where: { id: req.params.id }, include: battleInclude });
  if (!battle || (battle.challengerId !== req.user!.id && battle.opponentId !== req.user!.id)) {
    return res.status(404).json({ error: 'Jang topilmadi.' });
  }
  res.json(serializeBattle(battle));
});

const createSchema = z.object({
  isAI: z.boolean().default(false),
  problemId: z.string().optional(),
  opponentId: z.string().optional(),
});

battlesRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri ma'lumot kiritildi." });
  }

  const problem = parsed.data.problemId
    ? await prisma.problem.findUnique({ where: { id: parsed.data.problemId } })
    : await pickRandomProblem();
  if (!problem) {
    return res.status(404).json({ error: 'Masala topilmadi.' });
  }

  let opponentId: string | null = null;
  if (!parsed.data.isAI && parsed.data.opponentId) {
    if (parsed.data.opponentId === req.user!.id) {
      return res.status(400).json({ error: "O'zingizni jangga chaqira olmaysiz." });
    }
    if (!(await areFriends(req.user!.id, parsed.data.opponentId))) {
      return res.status(403).json({ error: 'Faqat do\'stlaringizni jangga chaqira olasiz.' });
    }
    opponentId = parsed.data.opponentId;
  } else if (!parsed.data.isAI) {
    // Matchmaking used to draw from every student on the platform, so a
    // first-month backend student could be paired against someone on the office
    // track over a problem neither has covered — a guaranteed bad match. Prefer
    // classmates, then anyone on the same track, and only then fall back to the
    // whole pool so a lone student can still find a game.
    const classmates = await prisma.user.findMany({
      where: {
        role: Role.STUDENT,
        id: { not: req.user!.id },
        enrollments: { some: { class: { enrollments: { some: { userId: req.user!.id } } } } },
      },
      select: { id: true },
    });

    const sameTrack = classmates.length
      ? classmates
      : await prisma.user.findMany({
          where: { role: Role.STUDENT, id: { not: req.user!.id }, track: req.user!.track },
          select: { id: true },
        });

    const candidates = sameTrack.length
      ? sameTrack
      : await prisma.user.findMany({
          where: { role: Role.STUDENT, id: { not: req.user!.id } },
          select: { id: true },
        });

    if (candidates.length === 0) {
      return res.status(409).json({ error: 'Hozircha boshqa raqib topilmadi. AI bilan janjal qiling.' });
    }
    opponentId = candidates[Math.floor(Math.random() * candidates.length)].id;
  }

  const battle = await prisma.battleChallenge.create({
    data: {
      challengerId: req.user!.id,
      opponentId,
      isAI: parsed.data.isAI,
      problemId: problem.id,
      status: 'AWAITING_OPPONENT',
    },
    include: battleInclude,
  });

  if (opponentId) {
    await notify(prisma, {
      userId: opponentId,
      type: 'INFO',
      title: 'Yangi kod jangi taklifi!',
      body: `${req.user!.name} sizni "${problem.title}" masalasi bo'yicha jangga chaqirdi.`,
    });
  }

  res.status(201).json(serializeBattle(battle));
});

const submitSchema = z.object({
  code: z.string().min(1),
  language: z.enum(['javascript', 'python', 'cpp']).default('javascript'),
});

async function judgeBattle(battleId: string) {
  const battle = await prisma.battleChallenge.findUniqueOrThrow({
    where: { id: battleId },
    include: { problem: true },
  });

  const prompt = `
    Siz adolatli dasturlash hakamisiz. Ikkita talaba quyidagi masalani yechishga harakat qildi. Ularning kodlarini to'g'rilik, samaradorlik va sifat bo'yicha solishtirib, har biriga 0-100 ball bering.

    Masala: ${battle.problem.title}
    ${battle.problem.description}

    1-talaba kodi (${battle.language}):
    \`\`\`${battle.language}
    ${battle.challengerCode}
    \`\`\`

    2-talaba kodi (${battle.language}):
    \`\`\`${battle.language}
    ${battle.opponentCode}
    \`\`\`

    Javobni quyidagi JSON formatida bering:
    {
      "challengerScore": number (0-100),
      "opponentScore": number (0-100),
      "feedback": string (o'zbek tilida, ikkala kodni qisqacha solishtiring)
    }
  `;

  const judgement = await askGeminiJson<{ challengerScore: number; opponentScore: number; feedback: string }>(prompt, {
    challengerScore: 50,
    opponentScore: 50,
    feedback: "AI hakam javobini tahlil qilib bo'lmadi.",
  });

  const winnerId =
    judgement.challengerScore > judgement.opponentScore
      ? battle.challengerId
      : judgement.opponentScore > judgement.challengerScore
        ? battle.opponentId
        : null;
  const loserId = winnerId === battle.challengerId ? battle.opponentId : winnerId === battle.opponentId ? battle.challengerId : null;

  await prisma.battleChallenge.update({
    where: { id: battle.id },
    data: {
      status: 'JUDGED',
      challengerScore: judgement.challengerScore,
      opponentScore: judgement.opponentScore,
      winnerId,
      feedback: judgement.feedback,
      resolvedAt: new Date(),
    },
  });

  if (winnerId) {
    await prisma.user.update({
      where: { id: winnerId },
      data: { xp: { increment: WIN_XP }, coins: { increment: WIN_COINS }, eloRating: { increment: WIN_ELO } },
    });
    await notify(prisma, {
      userId: winnerId,
      type: 'SUCCESS',
      title: 'Jangda g\'alaba!',
      body: `"${battle.problem.title}" jangida g'alaba qozondingiz! +${WIN_XP} XP, +${WIN_COINS} tanga.`,
    });
  }
  if (loserId) {
    await prisma.user.update({
      where: { id: loserId },
      data: { xp: { increment: LOSE_XP }, eloRating: { decrement: LOSE_ELO } },
    });
    await notify(prisma, {
      userId: loserId,
      type: 'INFO',
      title: 'Jang yakunlandi',
      body: `"${battle.problem.title}" jangida mag'lub bo'ldingiz, lekin +${LOSE_XP} XP oldingiz.`,
    });
  }

  if (winnerId) await checkAchievements(winnerId);
  if (loserId) await checkAchievements(loserId);
}

battlesRouter.post('/:id/submit', async (req, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri ma'lumot kiritildi." });
  }
  const battle = await prisma.battleChallenge.findUnique({ where: { id: req.params.id } });
  if (!battle) {
    return res.status(404).json({ error: 'Jang topilmadi.' });
  }
  if (battle.status === 'JUDGED') {
    return res.status(409).json({ error: 'Bu jang allaqachon yakunlangan.' });
  }

  const isChallenger = battle.challengerId === req.user!.id;
  const isOpponent = battle.opponentId === req.user!.id;
  if (!isChallenger && !isOpponent) {
    return res.status(403).json({ error: 'Bu jangda ishtirokchi emassiz.' });
  }
  if ((isChallenger && battle.challengerCode) || (isOpponent && battle.opponentCode)) {
    return res.status(409).json({ error: 'Siz allaqachon yubordingiz.' });
  }

  await prisma.battleChallenge.update({
    where: { id: battle.id },
    data: isChallenger
      ? { challengerCode: parsed.data.code, language: parsed.data.language }
      : { opponentCode: parsed.data.code },
  });

  try {
    if (battle.isAI && isChallenger) {
      const problem = await prisma.problem.findUniqueOrThrow({ where: { id: battle.problemId } });
      const aiCode = await askGeminiText(
        `Quyidagi masalani ${parsed.data.language} tilida yeching, faqat kodni qaytaring, boshqa izoh bermang:\n\n${problem.title}\n${problem.description}`
      );
      await prisma.battleChallenge.update({ where: { id: battle.id }, data: { opponentCode: aiCode, status: 'JUDGING' } });
      await judgeBattle(battle.id);
    } else {
      const updated = await prisma.battleChallenge.findUniqueOrThrow({ where: { id: battle.id } });
      if (updated.challengerCode && updated.opponentCode) {
        await prisma.battleChallenge.update({ where: { id: battle.id }, data: { status: 'JUDGING' } });
        await judgeBattle(battle.id);
      }
    }
  } catch (err) {
    if (err instanceof GeminiNotConfiguredError) {
      return res.status(500).json({ error: 'GEMINI_API_KEY sozlanmagan.' });
    }
    console.error('Battle judging error:', err);
    return res.status(500).json({ error: "AI hakamlik qilishni bajarib bo'lmadi." });
  }

  const finalBattle = await prisma.battleChallenge.findUniqueOrThrow({ where: { id: battle.id }, include: battleInclude });
  res.json(serializeBattle(finalBattle));
});
