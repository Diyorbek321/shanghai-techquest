import { Router, type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import { Role } from '@prisma/client';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { env } from '../env';
import {
  addPlayer,
  advance,
  createGame,
  GameRuleError,
  normalizeGuestName,
  removePlayer,
  reveal,
  submitAnswer,
  type Game,
} from '../live/game';
import { createRegistry, RoomNotFoundError, type Registry } from '../live/registry';
import { persistLiveGame } from '../live/persist';
import { findPack, QUESTION_PACKS } from '../live/packs';

/**
 * Kahoot-style live quiz over lesson questions.
 *
 * Updates reach the browsers over Server-Sent Events (GET /:pin/events), and
 * actions go up as ordinary POSTs. SSE rather than WebSockets: it rides the
 * existing cookie auth, CSRF check and nginx config unchanged (the
 * X-Accel-Buffering header switches off proxy buffering per response).
 *
 * Players are either signed-in users or GUESTS: anyone with the PIN can join
 * under a name, without an account (POST /:pin/guest). A guest is identified
 * by a random token in an httpOnly cookie that only this router reads, and
 * may only watch and answer in their own game — hosting stays staff-only.
 */

export const GUEST_COOKIE_NAME = 'techquest_live_guest';
/** Longer than any game, shorter than a school day. */
const GUEST_COOKIE_MAX_AGE_MS = 4 * 60 * 60 * 1000;
const SWEEP_INTERVAL_MS = 60_000;
const HEARTBEAT_MS = 20_000;
export const DEFAULT_TIME_LIMIT_SEC = 20;

const TOO_MANY = { error: "Juda ko'p so'rov yuborildi. Birozdan so'ng qayta urinib ko'ring." };

/** Who is acting: a signed-in user, or a guest of the game in the URL. */
interface LivePlayerIdentity {
  id: string;
  /** Set for guests only — the one game their token is good for. */
  guestPin: string | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      live?: LivePlayerIdentity;
    }
  }
}

/**
 * A whole class answers from one school IP, so the global per-IP API limit
 * (300 / 15 min) would trip mid-game. This router is mounted outside it and
 * limited per PLAYER instead — generous enough for a game, tight enough to stop
 * a script hammering /answer.
 */
const liveRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.live?.id ?? req.user?.id ?? ipKeyGenerator(req.ip ?? ''),
  message: TOO_MANY,
});

/**
 * Guest sign-up is the one unauthenticated write, so it is limited per IP.
 * Still loose enough for a full class of guests joining from one school NAT.
 */
const guestJoinLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: TOO_MANY,
});

/** A round comes from exactly one source: a lesson's quiz or a question pack. */
const createSchema = z
  .object({
    lessonKey: z.string().min(1).max(100).optional(),
    packKey: z.string().min(1).max(100).optional(),
    timeLimitSec: z.number().int().min(5).max(120).default(DEFAULT_TIME_LIMIT_SEC),
  })
  .refine((b) => (b.lessonKey === undefined) !== (b.packKey === undefined));

const answerSchema = z.object({
  questionIndex: z.number().int().nonnegative(),
  choiceIndex: z.number().int().nonnegative(),
});

const pinSchema = z.string().regex(/^\d{6}$/);

const guestSchema = z.object({ name: z.string().max(100) });
const kickSchema = z.object({ playerId: z.string().min(1).max(100) });

const staffOnly = requireRole(Role.TEACHER, Role.ADMIN);

function sendError(res: Response, err: unknown): Response {
  if (err instanceof RoomNotFoundError) return res.status(404).json({ error: err.message });
  if (err instanceof GameRuleError) return res.status(409).json({ error: err.message });
  throw err;
}

export function createLiveRouter(registry: Registry): Router {
  const router = Router();

  /**
   * A guest token for THIS game identifies its holder; otherwise the normal
   * session does. Checking the guest first matters on shared school computers:
   * a stale, expired login cookie must not lock a guest out of their game.
   */
  function identify(req: Request, res: Response, next: NextFunction): void {
    const guest = registry.resolveGuest(req.cookies?.[GUEST_COOKIE_NAME] ?? '');
    if (guest && guest.pin === req.params.pin) {
      req.live = { id: guest.playerId, guestPin: guest.pin };
      next();
      return;
    }
    if (!req.cookies?.[AUTH_COOKIE_NAME]) {
      res.status(401).json({ error: "Avval o'yinga qo'shiling." });
      return;
    }
    requireAuth(req, res, () => {
      req.live = { id: req.user!.id, guestPin: null };
      next();
    });
  }

  const user: RequestHandler[] = [requireAuth, liveRateLimiter];
  const staff: RequestHandler[] = [...user, staffOnly];
  const player: RequestHandler[] = [identify, liveRateLimiter];

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

  /** GET /api/live/lessons — lessons that have questions to play, plus the question packs. */
  router.get('/lessons', ...staff, async (_req, res) => {
    const lessons = await prisma.lesson.findMany({
      where: { quizQuestions: { some: {} } },
      select: { key: true, title: true, track: true, order: true, _count: { select: { quizQuestions: true } } },
      orderBy: [{ track: 'asc' }, { order: 'asc' }],
    });
    res.json({
      lessons: lessons.map(({ _count, ...l }) => ({ ...l, questionCount: _count.quizQuestions })),
      packs: QUESTION_PACKS.map((p) => ({ key: p.key, title: p.title, section: p.section, questionCount: p.questions.length })),
    });
  });

  /** GET /api/live/mine — the host's running game, so a reload returns to it. */
  router.get('/mine', ...staff, (req, res) => {
    const game = registry.findByHost(req.user!.id);
    res.json({ pin: game?.pin ?? null });
  });

  /** Questions and title for the requested round, or null when it does not exist. */
  async function roundSource(body: z.infer<typeof createSchema>) {
    if (body.packKey !== undefined) {
      const pack = findPack(body.packKey);
      return pack && { lessonId: null, packKey: pack.key, lessonTitle: pack.title, questions: pack.questions };
    }
    const lesson = await prisma.lesson.findUnique({
      where: { key: body.lessonKey },
      select: {
        id: true,
        title: true,
        quizQuestions: {
          select: { id: true, prompt: true, choices: true, correctIndex: true, explanation: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    return lesson && { lessonId: lesson.id, packKey: null, lessonTitle: lesson.title, questions: lesson.quizQuestions };
  }

  /** POST /api/live — open a lobby for one lesson's questions or one question pack. */
  router.post('/', ...staff, async (req, res) => {
    const parsed = createSchema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ error: "Ma'lumotlar noto'g'ri." });

    const source = await roundSource(parsed.data);
    if (!source) return res.status(404).json({ error: "Dars yoki to'plam topilmadi." });

    try {
      const game = createGame({
        pin: registry.generatePin(),
        hostId: req.user!.id,
        ...source,
        timeLimitMs: parsed.data.timeLimitSec * 1000,
      });
      registry.open(game);
      return res.status(201).json({ pin: game.pin });
    } catch (err) {
      return sendError(res, err);
    }
  });

  /** POST /api/live/:pin/join — enter the lobby (or rejoin after a reload). */
  router.post('/:pin/join', ...user, (req, res) => {
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

  /**
   * POST /api/live/:pin/guest — join without an account. Repeating it with the
   * cookie already set for this PIN is a no-op, so a reload does not create a
   * second player under a new name.
   */
  router.post('/:pin/guest', guestJoinLimiter, (req, res) => {
    const game = roomFor(req, res);
    if (!game) return;
    const existing = registry.resolveGuest(req.cookies?.[GUEST_COOKIE_NAME] ?? '');
    if (existing && existing.pin === game.pin && game.players[existing.playerId]) {
      return res.json({ playerId: existing.playerId });
    }
    const parsed = guestSchema.safeParse(req.body ?? {});
    const name = parsed.success ? normalizeGuestName(parsed.data.name) : null;
    if (!name) return res.status(400).json({ error: "Ism 2 dan 24 tagacha belgidan iborat bo'lsin." });
    try {
      const { token, playerId } = registry.joinAsGuest(game.pin, name);
      res.cookie(GUEST_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.cookieSecure,
        maxAge: GUEST_COOKIE_MAX_AGE_MS,
        path: '/api/live',
      });
      return res.status(201).json({ playerId });
    } catch (err) {
      return sendError(res, err);
    }
  });

  /** POST /api/live/:pin/kick — host removes a player from the lobby (e.g. a rude guest name). */
  router.post('/:pin/kick', ...user, (req: Request, res: Response) => {
    const game = hostedRoom(req, res);
    if (!game) return;
    const parsed = kickSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Ma'lumotlar noto'g'ri." });
    try {
      registry.update(game.pin, (g) => removePlayer(g, parsed.data.playerId));
      return res.status(204).end();
    } catch (err) {
      return sendError(res, err);
    }
  });

  /** GET /api/live/:pin/events — SSE stream of this viewer's view of the game. */
  router.get('/:pin/events', ...player, (req: Request, res: Response) => {
    const game = roomFor(req, res);
    if (!game) return;
    const userId = req.live!.id;
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
  router.post('/:pin/next', ...user, (req, res) => {
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
  router.post('/:pin/skip', ...user, (req, res) => {
    const game = hostedRoom(req, res);
    if (!game) return;
    const next = registry.update(game.pin, reveal);
    return res.json({ phase: next.phase });
  });

  /** POST /api/live/:pin/end — stop early; results so far are still saved. */
  router.post('/:pin/end', ...user, (req, res) => {
    const game = hostedRoom(req, res);
    if (!game) return;
    registry.end(game.pin);
    return res.status(204).end();
  });

  /** POST /api/live/:pin/answer — graded on the server, result withheld until reveal. */
  router.post('/:pin/answer', ...player, (req: Request, res: Response) => {
    const game = roomFor(req, res);
    if (!game) return;
    const parsed = answerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Javob varianti noto'g'ri." });
    try {
      const { questionIndex, choiceIndex } = parsed.data;
      registry.update(game.pin, (g, at) => submitAnswer(g, req.live!.id, questionIndex, choiceIndex, at));
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
