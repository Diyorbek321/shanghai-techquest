import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { runCodeRateLimiter } from '../middleware/rateLimit';
import { askGeminiText } from '../ai/gemini';
import { checkAchievements } from '../achievements/check';
import { notify } from '../notifications/notify';
import { competenceContext, competenceMessage } from '../notifications/competence';
import { executeCode, PistonUnavailableError } from '../code/piston';
import { judgeSubmission, parseTestCases, type JudgeResult, type TestCaseResult } from '../code/judge';
import { buildBoard, gradeOrder, isParsonsSuitable, seedFrom } from '../parsons/blocks';
import { parsonsPoints } from '../parsons/award';

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
    // Lesson-linked practice is Python-only, so the client offers exactly the
    // languages this problem actually ships starter code for.
    languages: (
      [
        ['javascript', problem.starterCodeJs],
        ['python', problem.starterCodePy],
        ['cpp', problem.starterCodeCpp],
      ] as const
    )
      .filter(([, starter]) => starter !== null)
      .map(([language]) => language),
    solved: !!latestSubmission,
    // Whether a line-ordering variant is OFFERED — which is narrower than
    // "a solution exists": a solution too long to shuffle usefully is stored
    // but not offered. A boolean, never the solution itself.
    hasParsons: isParsonsSuitable(problem.solutionPy),
  });
});

const runSchema = z.object({
  code: z.string().min(1).max(20_000),
  language: z.enum(['javascript', 'python', 'cpp']),
  stdin: z.string().max(5_000).optional(),
});

problemsRouter.post('/run', runCodeRateLimiter, async (req, res) => {
  const parsed = runSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri ma'lumot kiritildi." });
  }

  try {
    const result = await executeCode(parsed.data.language, parsed.data.code, parsed.data.stdin ?? '');
    res.json(result);
  } catch (err) {
    if (err instanceof PistonUnavailableError) {
      return res.status(503).json({ error: err.message });
    }
    console.error('Code execution error:', err);
    res.status(500).json({ error: "Kodni ishga tushirib bo'lmadi." });
  }
});

const submitSchema = z.object({
  code: z.string().min(1).max(20_000),
  language: z.enum(['javascript', 'python', 'cpp']),
});

/**
 * Shown when a problem has no stored test cases at all. We deliberately do NOT
 * pass the student in that case: an unverifiable problem must never grant XP,
 * and pretending it was graded would hide the content gap from everyone.
 */
const NO_TEST_CASES_FEEDBACK =
  "Bu masala uchun hali avtomatik tekshiruv testlari qo'shilmagan, shuning uchun yechimingiz baholanmadi va XP berilmadi. Iltimos, o'qituvchingizga xabar bering.";

const MAX_LISTED_FAILURES = 3;

/** Deterministic Uzbek summary — always available, even with Gemini offline. */
function buildDeterministicFeedback(judged: JudgeResult, alreadySolved: boolean): string {
  if (judged.passed) {
    const base = `Barakalla! Barcha ${judged.testsTotal} ta test muvaffaqiyatli o'tdi.`;
    return alreadySolved ? `${base} Bu masalani avval yechganingiz uchun qayta XP berilmadi.` : base;
  }

  const failedLabels = judged.results
    .filter((result) => !result.passed)
    .map((result) => result.label)
    .filter((label) => label.trim().length > 0);

  const listed = failedLabels.slice(0, MAX_LISTED_FAILURES).join(', ');
  const rest = failedLabels.length - MAX_LISTED_FAILURES;
  const detail = listed.length === 0 ? '' : ` O'tmagan testlar: ${listed}${rest > 0 ? ` va yana ${rest} ta` : ''}.`;

  return `${judged.testsPassed}/${judged.testsTotal} ta test o'tdi.${detail} Kodingizni qayta ko'rib chiqing.`;
}

/**
 * Gemini is optional colour only: a short Uzbek hint for a failing run. It can
 * never change the verdict, and any failure (unconfigured key, network, quota)
 * silently degrades to the deterministic summary above.
 */
async function buildFailureHint(
  problemTitle: string,
  language: string,
  code: string,
  judged: JudgeResult,
  fallback: string
): Promise<string> {
  const visibleFailure = judged.results.find((result) => !result.passed && !result.hidden);
  if (!visibleFailure) {
    return fallback;
  }

  const prompt = `Siz o'zbek tilida gapiradigan dasturlash o'qituvchisisiz. Talaba "${problemTitle}" masalasini ${language} tilida yechdi, lekin test o'tmadi.
Kod:
\`\`\`${language}
${code}
\`\`\`
Test "${visibleFailure.label}": kutilgan natija ${JSON.stringify(visibleFailure.expected ?? '')}, olingan natija ${JSON.stringify(visibleFailure.actual ?? '')}.
Faqat 1-2 gapdan iborat o'zbekcha maslahat bering. Tayyor yechimni yozmang.`;

  try {
    const hint = (await askGeminiText(prompt)).trim();
    return hint.length > 0 ? `${fallback} ${hint}` : fallback;
  } catch (err) {
    // Unconfigured or failing Gemini is expected here — log and move on.
    console.warn('Gemini hint unavailable, using deterministic feedback:', err);
    return fallback;
  }
}

problemsRouter.post('/:id/submit', async (req, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri ma'lumot kiritildi." });
  }
  const problem = await prisma.problem.findUnique({ where: { id: req.params.id } });
  if (!problem) {
    return res.status(404).json({ error: 'Masala topilmadi.' });
  }

  const testCases = parseTestCases(problem.testCases);

  // XP is granted once per problem. Without this check a student could resubmit
  // the same accepted solution forever and farm unlimited XP.
  const previousPass = await prisma.problemSubmission.findFirst({
    where: { problemId: problem.id, userId: req.user!.id, passed: true },
    select: { id: true },
  });
  const alreadySolved = previousPass !== null;

  let judged: JudgeResult;
  if (testCases.length === 0) {
    // Honest failure path: no automatic check exists for this problem yet.
    // Logged so the content gap is visible in server logs instead of silently
    // turning into free XP for every student who submits anything.
    console.warn(`Problem ${problem.key} (${problem.id}) has no test cases — submission cannot be graded.`);
    judged = { passed: false, testsPassed: 0, testsTotal: 0, results: [] };
  } else {
    try {
      judged = await judgeSubmission(parsed.data.language, parsed.data.code, testCases);
    } catch (err) {
      if (err instanceof PistonUnavailableError) {
        return res
          .status(503)
          .json({ error: "Kod ishga tushirish xizmati mavjud emas. Birozdan keyin qayta urinib ko'ring." });
      }
      console.error('Problem judging error:', err);
      return res.status(500).json({ error: "Yechimni tekshirib bo'lmadi." });
    }
  }

  const deterministicFeedback =
    testCases.length === 0 ? NO_TEST_CASES_FEEDBACK : buildDeterministicFeedback(judged, alreadySolved);

  // Gemini only ever decorates a failure message; the verdict above is final.
  const feedback =
    judged.passed || testCases.length === 0
      ? deterministicFeedback
      : await buildFailureHint(problem.title, parsed.data.language, parsed.data.code, judged, deterministicFeedback);

  // Full points or nothing — no partial credit, and nothing for a re-solve.
  const pointsAwarded = judged.passed && !alreadySolved ? problem.points : 0;

  await prisma.$transaction([
    prisma.problemSubmission.create({
      data: {
        problemId: problem.id,
        userId: req.user!.id,
        code: parsed.data.code,
        language: parsed.data.language,
        passed: judged.passed,
        feedback,
        pointsAwarded,
        testsPassed: judged.testsPassed,
        testsTotal: judged.testsTotal,
      },
    }),
    ...(pointsAwarded > 0
      ? [prisma.user.update({ where: { id: req.user!.id }, data: { xp: { increment: pointsAwarded } } })]
      : []),
  ]);

  if (judged.passed && pointsAwarded > 0) {
    // Read AFTER the submission is written, so the count the student is shown
    // includes the problem they just solved.
    const context = await competenceContext(prisma, req.user!.id, problem.tags);
    await notify(prisma, {
      userId: req.user!.id,
      type: 'SUCCESS',
      title: 'Masala yechildi',
      body: competenceMessage(problem.title, pointsAwarded, context),
    });
  }

  await checkAchievements(req.user!.id);

  const results: TestCaseResult[] = judged.results;

  res.status(201).json({
    passed: judged.passed,
    testsPassed: judged.testsPassed,
    testsTotal: judged.testsTotal,
    pointsAwarded,
    feedback,
    results,
  });
});

const parsonsSubmitSchema = z.object({
  /** Block ids, in the order the student arranged them. */
  order: z.array(z.string().min(1)).min(1).max(200),
});

/**
 * The shuffled board.
 *
 * The seed is fixed per (problem, student), so refreshing the page does not
 * reshuffle a half-finished attempt — and two students never get boards that
 * can be copied from each other by position.
 */
problemsRouter.get('/:id/parsons', async (req, res) => {
  const problem = await prisma.problem.findUnique({ where: { id: req.params.id } });
  if (!problem) {
    return res.status(404).json({ error: 'Masala topilmadi.' });
  }
  if (!isParsonsSuitable(problem.solutionPy)) {
    return res.status(404).json({ error: "Bu masala uchun qatorlarni tartiblash mashqi tayyorlanmagan." });
  }

  const solved = await prisma.problemSubmission.findFirst({
    where: { problemId: problem.id, userId: req.user!.id, passed: true },
    select: { id: true },
  });

  const board = buildBoard(problem.solutionPy, seedFrom(`${problem.id}:${req.user!.id}`));
  res.json({
    problemId: problem.id,
    title: problem.title,
    description: problem.description,
    // Only ever the shuffled cards. The ordered solution stays on the server.
    blocks: board,
    points: parsonsPoints(problem.points),
    alreadySolved: Boolean(solved),
  });
});

problemsRouter.post('/:id/parsons', async (req, res) => {
  const parsed = parsonsSubmitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Noto'g'ri ma'lumot kiritildi." });
  }
  const problem = await prisma.problem.findUnique({ where: { id: req.params.id } });
  if (!problem) {
    return res.status(404).json({ error: 'Masala topilmadi.' });
  }
  if (!isParsonsSuitable(problem.solutionPy)) {
    return res.status(404).json({ error: "Bu masala uchun qatorlarni tartiblash mashqi tayyorlanmagan." });
  }

  // The board is rebuilt from the same seed rather than trusted from the
  // client, so a submission can only ever be made of the cards this student was
  // actually dealt.
  const board = buildBoard(problem.solutionPy, seedFrom(`${problem.id}:${req.user!.id}`));
  const textById = new Map(board.map((block) => [block.id, block.text]));
  const unknown = parsed.data.order.find((id) => !textById.has(id));
  if (unknown) {
    return res.status(400).json({ error: 'Yuborilgan qatorlar bu mashqqa tegishli emas.' });
  }

  const submittedText = parsed.data.order.map((id) => textById.get(id)!);
  const grade = gradeOrder(problem.solutionPy, submittedText);

  // Ordering given lines is scaffolding, so it pays less than writing the code —
  // and never twice, nor on top of a problem the student already solved outright.
  const alreadySolved = await prisma.problemSubmission.findFirst({
    where: { problemId: problem.id, userId: req.user!.id, passed: true },
    select: { id: true },
  });
  const pointsAwarded = grade.correct && !alreadySolved ? parsonsPoints(problem.points) : 0;

  const feedback = grade.correct
    ? "Tartib to'g'ri — dastur to'liq ishlaydi."
    : `${grade.linesCorrect}/${grade.linesTotal} qator o'z o'rnida. Noto'g'ri joydagi qatorlar belgilandi.`;

  await prisma.$transaction([
    prisma.problemSubmission.create({
      data: {
        problemId: problem.id,
        userId: req.user!.id,
        code: submittedText.join('\n'),
        // Marks the row as a line-ordering attempt rather than written code, so
        // the two modes stay distinguishable in a student's history.
        language: 'parsons',
        passed: grade.correct,
        feedback,
        pointsAwarded,
        testsPassed: grade.linesCorrect,
        testsTotal: grade.linesTotal,
      },
    }),
    ...(pointsAwarded > 0
      ? [prisma.user.update({ where: { id: req.user!.id }, data: { xp: { increment: pointsAwarded } } })]
      : []),
  ]);

  if (pointsAwarded > 0) {
    const context = await competenceContext(prisma, req.user!.id, problem.tags);
    await notify(prisma, {
      userId: req.user!.id,
      type: 'SUCCESS',
      title: 'Qatorlar tartibi to\'g\'ri',
      body: competenceMessage(problem.title, pointsAwarded, context),
    });
  }

  await checkAchievements(req.user!.id);

  res.status(201).json({
    correct: grade.correct,
    linesCorrect: grade.linesCorrect,
    linesTotal: grade.linesTotal,
    // Positions only — never the expected text, which would hand over the answer.
    wrongPositions: grade.wrongPositions,
    pointsAwarded,
    feedback,
  });
});
