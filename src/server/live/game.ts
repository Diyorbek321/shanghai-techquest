/**
 * Kahoot-style live quiz — the rules, as pure functions over immutable state.
 *
 * Nothing here touches the clock, the database or the network: every function
 * takes `now` and returns a new Game. The registry (./registry.ts) owns timers
 * and connections and calls into this module, which keeps the rules testable
 * without fake timers or sockets.
 */

export type Phase = 'lobby' | 'question' | 'reveal' | 'finished';

export interface LiveQuestion {
  id: string;
  prompt: string;
  choices: readonly string[];
  correctIndex: number;
  explanation: string;
}

export interface PlayerAnswer {
  choiceIndex: number;
  correct: boolean;
  points: number;
  /** Streak before this answer, so the answer can be hidden until reveal. */
  prevStreak: number;
}

export interface Player {
  userId: string;
  name: string;
  avatarUrl: string | null;
  /** Joined with a PIN and a name only — no account, so no XP and no saved result. */
  guest: boolean;
  score: number;
  /** Consecutive correct answers; resets on a wrong or missing answer. */
  streak: number;
  correctCount: number;
  /** Keyed by question index. */
  answers: Readonly<Record<number, PlayerAnswer>>;
}

export interface Game {
  pin: string;
  hostId: string;
  /** Exactly one of lessonId / packKey is set: the round comes from a lesson or a question pack. */
  lessonId: string | null;
  packKey: string | null;
  /** Shown on the projector and phones — the lesson or pack title. */
  lessonTitle: string;
  questions: readonly LiveQuestion[];
  timeLimitMs: number;
  phase: Phase;
  /** -1 in the lobby, then the index of the current/last question. */
  index: number;
  questionStartedAt: number;
  startedAt: number | null;
  players: Readonly<Record<string, Player>>;
}

export const MAX_POINTS = 1000;
/** Bonus per question on a streak of 2+, capped so one lucky run can't decide the game. */
export const STREAK_BONUS = 100;
export const MAX_STREAK_BONUS = 500;
export const MAX_PLAYERS = 100;
/** A tap in the last instant still has to cross the network; don't reject it. */
export const ANSWER_GRACE_MS = 500;

export class GameRuleError extends Error {}

export function createGame(input: {
  pin: string;
  hostId: string;
  lessonId?: string | null;
  packKey?: string | null;
  lessonTitle: string;
  questions: readonly LiveQuestion[];
  timeLimitMs: number;
}): Game {
  if (input.questions.length === 0) {
    throw new GameRuleError("Bu darsda savollar yo'q.");
  }
  return {
    ...input,
    lessonId: input.lessonId ?? null,
    packKey: input.packKey ?? null,
    phase: 'lobby',
    index: -1,
    questionStartedAt: 0,
    startedAt: null,
    players: {},
  };
}

/**
 * Joining is open only in the lobby, like Kahoot: a late joiner would land on
 * a leaderboard they can never catch up on. Re-joining (a reload, a dropped
 * connection) is always allowed and keeps the player's score.
 */
export interface NewPlayer {
  userId: string;
  name: string;
  avatarUrl: string | null;
  guest?: boolean;
}

export const MAX_GUEST_NAME_LENGTH = 24;

/** Trims and collapses whitespace; returns null when nothing usable is left. */
export function normalizeGuestName(raw: string): string | null {
  const name = raw.replace(/\s+/g, ' ').trim();
  if (name.length < 2 || name.length > MAX_GUEST_NAME_LENGTH) return null;
  return name;
}

export function addPlayer(game: Game, player: NewPlayer): Game {
  if (game.players[player.userId]) return game;
  if (player.userId === game.hostId) {
    throw new GameRuleError("O'yin boshlovchisi ishtirokchi bo'la olmaydi.");
  }
  if (game.phase !== 'lobby') {
    throw new GameRuleError("O'yin allaqachon boshlangan.");
  }
  if (Object.keys(game.players).length >= MAX_PLAYERS) {
    throw new GameRuleError("O'yin to'lgan.");
  }
  // Two guests called "Ali" would be indistinguishable on the projector, and a
  // guest copying a registered student's name could pass as them.
  if (player.guest) {
    const taken = Object.values(game.players).some((p) => p.name.toLowerCase() === player.name.toLowerCase());
    if (taken) throw new GameRuleError("Bu ism band. Boshqa ism tanlang.");
  }
  const fresh: Player = { ...player, guest: player.guest ?? false, score: 0, streak: 0, correctCount: 0, answers: {} };
  return { ...game, players: { ...game.players, [player.userId]: fresh } };
}

/** Host removes a player — only in the lobby, where nobody has scored yet. */
export function removePlayer(game: Game, userId: string): Game {
  if (!game.players[userId]) return game;
  if (game.phase !== 'lobby') throw new GameRuleError("O'yin boshlangach ishtirokchini chiqarib bo'lmaydi.");
  const { [userId]: _removed, ...rest } = game.players;
  return { ...game, players: rest };
}

/** Moves lobby → first question, or reveal → next question / finished. */
export function advance(game: Game, now: number): Game {
  if (game.phase === 'lobby') {
    if (Object.keys(game.players).length === 0) {
      throw new GameRuleError("Hali hech kim qo'shilmagan.");
    }
    return { ...game, phase: 'question', index: 0, questionStartedAt: now, startedAt: now };
  }
  if (game.phase === 'reveal') {
    const next = game.index + 1;
    if (next >= game.questions.length) return { ...game, phase: 'finished' };
    return { ...game, phase: 'question', index: next, questionStartedAt: now };
  }
  throw new GameRuleError("Hozir keyingi bosqichga o'tib bo'lmaydi.");
}

export function questionEndsAt(game: Game): number {
  return game.questionStartedAt + game.timeLimitMs;
}

/**
 * Faster correct answers earn more: the full 1000 at the instant the question
 * opens, sliding linearly to 500 at the buzzer. A wrong answer earns 0, never
 * negative — guessing should not be punished harder than silence.
 */
export function pointsFor(elapsedMs: number, timeLimitMs: number, correct: boolean): number {
  if (!correct) return 0;
  const fraction = Math.min(Math.max(elapsedMs / timeLimitMs, 0), 1);
  return Math.round(MAX_POINTS * (1 - fraction / 2));
}

export function streakBonus(streak: number): number {
  if (streak < 2) return 0;
  return Math.min((streak - 1) * STREAK_BONUS, MAX_STREAK_BONUS);
}

export function submitAnswer(
  game: Game,
  userId: string,
  questionIndex: number,
  choiceIndex: number,
  now: number
): Game {
  const player = game.players[userId];
  if (!player) throw new GameRuleError("Siz bu o'yinda emassiz.");
  // The client says which question it is answering, so a tap that lands just
  // after the host moved on can't be scored against the NEXT question.
  if (game.phase !== 'question' || questionIndex !== game.index) {
    throw new GameRuleError('Bu savolga javob berish vaqti tugagan.');
  }
  if (now > questionEndsAt(game) + ANSWER_GRACE_MS) {
    throw new GameRuleError('Vaqt tugadi.');
  }
  if (player.answers[game.index]) {
    throw new GameRuleError('Siz allaqachon javob bergansiz.');
  }
  const question = game.questions[game.index];
  if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex >= question.choices.length) {
    throw new GameRuleError("Javob varianti noto'g'ri.");
  }

  const correct = choiceIndex === question.correctIndex;
  const streak = correct ? player.streak + 1 : 0;
  const points = pointsFor(now - game.questionStartedAt, game.timeLimitMs, correct) + (correct ? streakBonus(streak) : 0);
  const updated: Player = {
    ...player,
    score: player.score + points,
    streak,
    correctCount: player.correctCount + (correct ? 1 : 0),
    answers: { ...player.answers, [game.index]: { choiceIndex, correct, points, prevStreak: player.streak } },
  };
  return { ...game, players: { ...game.players, [userId]: updated } };
}

export function allAnswered(game: Game): boolean {
  const players = Object.values(game.players);
  return game.phase === 'question' && players.length > 0 && players.every((p) => p.answers[game.index]);
}

/** Closes the current question. Anyone who didn't answer loses their streak. */
export function reveal(game: Game): Game {
  if (game.phase !== 'question') return game;
  const players = Object.fromEntries(
    Object.entries(game.players).map(([id, p]) => [id, p.answers[game.index] ? p : { ...p, streak: 0 }])
  );
  return { ...game, phase: 'reveal', players };
}

/**
 * The game as it stood before the open question — scores, streaks and ranks
 * without the answers given so far. Showing the live numbers mid-question
 * would tell a student (and whoever looks at their phone) whether they were
 * right before the reveal.
 */
export function settled(game: Game): Game {
  if (game.phase !== 'question') return game;
  const players = Object.fromEntries(
    Object.entries(game.players).map(([id, p]) => {
      const a = p.answers[game.index];
      if (!a) return [id, p];
      const { [game.index]: _open, ...answers } = p.answers;
      return [
        id,
        { ...p, score: p.score - a.points, streak: a.prevStreak, correctCount: p.correctCount - (a.correct ? 1 : 0), answers },
      ];
    })
  );
  return { ...game, players };
}

export function finish(game: Game): Game {
  return { ...game, phase: 'finished' };
}

export interface Standing {
  userId: string;
  name: string;
  avatarUrl: string | null;
  guest: boolean;
  score: number;
  correctCount: number;
  rank: number;
}

/** Ties share a rank (1, 2, 2, 4) so equal scores are never split arbitrarily. */
export function standings(game: Game): Standing[] {
  const sorted = Object.values(game.players)
    .map(({ userId, name, avatarUrl, guest, score, correctCount }) => ({ userId, name, avatarUrl, guest, score, correctCount }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return sorted.map((p, i) => ({
    ...p,
    rank: sorted.findIndex((q) => q.score === p.score) + 1,
  }));
}

/** Count of each choice picked for the current question — the host's bar chart. */
export function answerDistribution(game: Game): number[] {
  const question = game.questions[game.index];
  if (!question) return [];
  const counts = question.choices.map(() => 0);
  for (const p of Object.values(game.players)) {
    const a = p.answers[game.index];
    if (a) counts[a.choiceIndex] += 1;
  }
  return counts;
}

/** XP at the end: participation, one point per 100 score, and a podium bonus. */
export const PARTICIPATION_XP = 10;
export const PODIUM_XP: Readonly<Record<number, number>> = { 1: 50, 2: 30, 3: 20 };

export function xpFor(standing: Standing): number {
  return PARTICIPATION_XP + Math.floor(standing.score / 100) + (standing.score > 0 ? PODIUM_XP[standing.rank] ?? 0 : 0);
}
