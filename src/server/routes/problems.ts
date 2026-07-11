import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { askGeminiJson, GeminiNotConfiguredError } from '../ai/gemini';
import { checkAchievements } from '../achievements/check';
import { notify } from '../notifications/notify';

export const problemsRouter = Router();

problemsRouter.use(requireAuth);

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD', 'EXPERT', 'MASTER'] as const;

const listQuerySchema = z.object({
  difficulty: z.enum(DIFFICULTIES).optional(),
  search: z.string().trim().min(1).optional(),
  tag: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

problemsRouter.get('/', async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri so'rov parametrlari." });
  }
  const { difficulty, search, tag, page, pageSize } = parsed.data;

  const where = {
    ...(difficulty ? { difficulty } : {}),
    ...(tag ? { tags: { has: tag } } : {}),
    ...(search ? { title: { contains: search, mode: 'insensitive' as const } } : {}),
  };

  const [total, problems, submissions] = await Promise.all([
    prisma.problem.count({ where }),
    prisma.problem.findMany({
      where,
      orderBy: [{ difficulty: 'asc' }, { points: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, key: true, title: true, difficulty: true, points: true, tags: true },
    }),
    prisma.problemSubmission.findMany({
      where: { userId: req.user!.id, passed: true },
      select: { problemId: true },
    }),
  ]);

  const solvedIds = new Set(submissions.map((s) => s.problemId));

  res.json({
    items: problems.map((p) => ({ ...p, solved: solvedIds.has(p.id) })),
    total,
    page,
    pageSize,
  });
});

problemsRouter.get('/:id', async (req, res) => {
  const [problem, latestSubmission] = await Promise.all([
    prisma.problem.findUnique({ where: { id: req.params.id } }),
    prisma.problemSubmission.findFirst({
      where: { problemId: req.params.id, userId: req.user!.id, passed: true },
    }),
  ]);
  if (!problem) {
    return res.status(404).json({ error: 'Masala topilmadi.' });
  }

  res.json({
    id: problem.id,
    key: problem.key,
    title: problem.title,
    difficulty: problem.difficulty,
    points: problem.points,
    tags: problem.tags,
    description: problem.description,
    starterCode: { javascript: problem.starterCodeJs, python: problem.starterCodePy, cpp: problem.starterCodeCpp },
    solved: !!latestSubmission,
  });
});

interface JudgeResult {
  passed: boolean;
  feedback: string;
}

const submitSchema = z.object({
  code: z.string().min(1),
  language: z.enum(['javascript', 'python', 'cpp']),
});

problemsRouter.post('/:id/submit', async (req, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri ma'lumot kiritildi." });
  }
  const problem = await prisma.problem.findUnique({ where: { id: req.params.id } });
  if (!problem) {
    return res.status(404).json({ error: 'Masala topilmadi.' });
  }

  const prompt = `
    Siz qattiqqo'l lekin adolatli dasturlash o'qituvchisisiz. Quyidagi ${parsed.data.language} kodi berilgan masalani to'g'ri yechayotganini baholang.

    Masala: ${problem.title}
    ${problem.description}

    Talabaning kodi:
    \`\`\`${parsed.data.language}
    ${parsed.data.code}
    \`\`\`

    Javobni quyidagi JSON formatida bering:
    {
      "passed": boolean,
      "feedback": string (o'zbek tilida, qisqa va tushunarli, nima uchun o'tgani yoki o'tmaganini tushuntiring)
    }
  `;

  let judgement: JudgeResult;
  try {
    judgement = await askGeminiJson<JudgeResult>(prompt, {
      passed: false,
      feedback: "AI javobini tahlil qilib bo'lmadi. Qaytadan urinib ko'ring.",
    });
  } catch (err) {
    if (err instanceof GeminiNotConfiguredError) {
      return res.status(500).json({ error: 'GEMINI_API_KEY sozlanmagan.' });
    }
    console.error('Problem judging error:', err);
    return res.status(500).json({ error: "AI tekshiruvini bajarib bo'lmadi." });
  }

  const pointsAwarded = judgement.passed ? problem.points : 0;

  await prisma.$transaction([
    prisma.problemSubmission.create({
      data: {
        problemId: problem.id,
        userId: req.user!.id,
        code: parsed.data.code,
        language: parsed.data.language,
        passed: judgement.passed,
        feedback: judgement.feedback,
        pointsAwarded,
      },
    }),
    ...(pointsAwarded > 0
      ? [prisma.user.update({ where: { id: req.user!.id }, data: { xp: { increment: pointsAwarded } } })]
      : []),
  ]);

  if (judgement.passed) {
    await notify(prisma, {
      userId: req.user!.id,
      type: 'SUCCESS',
      title: 'Masala yechildi!',
      body: `"${problem.title}" masalasi uchun +${pointsAwarded} XP oldingiz.`,
    });
  }

  await checkAchievements(req.user!.id);

  res.status(201).json({ passed: judgement.passed, feedback: judgement.feedback, pointsAwarded });
});
