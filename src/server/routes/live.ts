import { Router, type Request, type Response } from 'express';
import { Role } from '@prisma/client';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { addPlayer, advance, createGame, GameRuleError, reveal, submitAnswer, type Game } from '../live/game';
import { createRegistry, RoomNotFoundError, type Registry } from '../live/registry';
import { persistLiveGame } from '../live/persist';

/**
 * Kahoot-style live quiz over lesson questions.
 *
 * Updates reach the browsers over Server-Sent Events (GET /:pin/events), and
 * actions go up as ordinary POSTs. SSE rather than WebSockets: it rides the
 * existing cookie auth, CSRF check and nginx config unchanged (the
 * X-Accel-Buffering header switches off proxy buffering per response).
 */

const SWEEP_INTERVAL_MS = 60_000;
const HEARTBEAT_MS = 20_000;
export const DEFAULT_TIME_LIMIT_SEC = 20;

/**
 * A whole class answers from one school IP, so the global per-IP API limit
 * (300 / 15 min) would trip mid-game. This router is mounted outside it and
 * limited per USER instead — generous enough for a game, tight enough to stop
 * a script hammering /answer.
 */
const liveRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user!.id,
  message: { error: "Juda ko'p so'rov yuborildi. Birozdan so'ng qayta urinib ko'ring." },
});

const createSchema = z.object({
  lessonKey: z.string().min(1).max(100),
  timeLimitSec: z.number().int().min(5).max(120).default(DEFAULT_TIME_LIMIT_SEC),
});

const answerSchema = z.object({
  questionIndex: z.number().int().nonnegative(),
  choiceIndex: z.number().int().nonnegative(),
});

const pinSchema = z.string().regex(/^\d{6}$/);

const staffOnly = requireRole(Role.TEACHER, Role.ADMIN);

function sendError(res: Response, err: unknown): Response {
  if (err instanceof RoomNotFoundError) return res.status(404).json({ error: err.message });
  if (err instanceof GameRuleError) return res.status(409).json({ error: err.message });
  throw err;
}

export function createLiveRouter(registry: Registry): Router {
  const router = Router();
  router.use(requireAuth, liveRateLimiter);

  /** Loads the room from :pin, or answers 404 and returns null. */
  function roomFor(req: Request, res: Response): Game | null {
    const pin = pinSchema.safeParse(req.params.pin);
    const game = pin.success ? registry.get(pin.data) : undefined;
    if (!game) {
      res.status(404).json({ error: "Bunday PIN bilan o'yin topilmadi." });
      return null;
    }
    return game;
  }

  function hostedRoom(req: Request, res: Response): Game | null {
    const game = roomFor(req, res);
    if (game && game.hostId !== req.user!.id) {
      res.status(403).json({ error: "Faqat o'yin boshlovchisi buni qila oladi." });
      return null;
    }
    return game;
  }

  /** GET /api/live/lessons — lessons that have questions to play. */
  router.get('/lessons', staffOnly, async (_req, res) => {
    const lessons = await prisma.lesson.findMany({
      where: { quizQuestions: { some: {} } },
      select: { key: true, title: true, track: true, order: true, _count: { select: { quizQuestions: true } } },
      orderBy: [{ track: 'asc' }, { order: 'asc' }],
    });
    res.json({
      lessons: lessons.map(({ _count, ...l }) => ({ ...l, questionCount: _count.quizQuestions })),
    });
  });

  /** GET /api/live/mine — the host's running game, so a reload returns to it. */
  router.get('/mine', staffOnly, (req, res) => {
    const game = registry.findByHost(req.user!.id);
    res.json({ pin: game?.pin ?? null });
  });

  /** POST /api/live — open a lobby for one lesson's questions. */
  router.post('/', staffOnly, async (req, res) => {
    const parsed = createSchema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ error: "Ma'lumotlar noto'g'ri." });

    const lesson = await prisma.lesson.findUnique({
      where: { key: parsed.data.lessonKey },
      select: {
        id: true,
        title: true,
        quizQuestions: {
          select: { id: true, prompt: true, choices: true, correctIndex: true, explanation: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!lesson) return res.status(404).json({ error: 'Dars topilmadi.' });

    try {
      const game = createGame({
        pin: registry.generatePin(),
        hostId: req.user!.id,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        questions: lesson.quizQuestions,
        timeLimitMs: parsed.data.timeLimitSec * 1000,
      });
      registry.open(game);
      return res.status(201).json({ pin: game.pin });
    } catch (err) {
      return sendError(res, err);
    }
  });

  /** POST /api/live/:pin/join — enter the lobby (or rejoin after a reload). */
  router.post('/:pin/join', (req, res) => {
    const game = roomFor(req, res);
    if (!game) return;
    const user = req.user!;
    if (user.id === game.hostId) return res.json({ role: 'host' });
    try {
      registry.update(game.pin, (g) => addPlayer(g, { userId: user.id, name: user.name, avatarUrl: user.avatarUrl }));
      return res.json({ role: 'player' });
    } catch (err) {
      return sendError(res, err);
    }
  });

  /** GET /api/live/:pin/events — SSE stream of this viewer's view of the game. */
  router.get('/:pin/events', (req, res) => {
    const game = roomFor(req, res);
    if (!game) return;
    const userId = req.user!.id;
    if (userId !== game.hostId && !game.players[userId]) {
      return res.status(403).json({ error: "Avval o'yinga qo'shiling." });
    }

    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    const unsubscribe = registry.subscribe(game.pin, {
      userId,
      send: (view) => res.write(`data: ${JSON.stringify(view)}\n\n`),
      close: () => res.end(),
    });
    // Comment lines keep nginx (proxy_read_timeout, 60s by default) from
    // dropping a connection that is quiet while the class reads a question.
    const heartbeat = setInterval(() => res.write(': ping\n\n'), HEARTBEAT_MS);
    req.on('close', () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  });

  /** POST /api/live/:pin/next — start the game, or move past a revealed question. */
  router.post('/:pin/next', (req, res) => {
    const game = hostedRoom(req, res);
    if (!game) return;
    try {
      const next = registry.update(game.pin, advance);
      return res.json({ phase: next.phase });
    } catch (err) {
      return sendError(res, err);
    }
  });

  /** POST /api/live/:pin/skip — close the open question before the timer does. */
  router.post('/:pin/skip', (req, res) => {
    const game = hostedRoom(req, res);
    if (!game) return;
    const next = registry.update(game.pin, reveal);
    return res.json({ phase: next.phase });
  });

  /** POST /api/live/:pin/end — stop early; results so far are still saved. */
  router.post('/:pin/end', (req, res) => {
    const game = hostedRoom(req, res);
    if (!game) return;
    registry.end(game.pin);
    return res.status(204).end();
  });

  /** POST /api/live/:pin/answer — graded on the server, result withheld until reveal. */
  router.post('/:pin/answer', (req, res) => {
    const game = roomFor(req, res);
    if (!game) return;
    const parsed = answerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Javob varianti noto'g'ri." });
    try {
      const { questionIndex, choiceIndex } = parsed.data;
      registry.update(game.pin, (g, at) => submitAnswer(g, req.user!.id, questionIndex, choiceIndex, at));
      return res.status(202).json({ accepted: true });
    } catch (err) {
      return sendError(res, err);
    }
  });

  return router;
}

const registry = createRegistry({ persist: persistLiveGame });
setInterval(() => registry.sweep(), SWEEP_INTERVAL_MS).unref();

export const liveRouter = createLiveRouter(registry);
