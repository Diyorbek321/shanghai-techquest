/**
 * What each screen is allowed to see. The answer key (correctIndex,
 * explanation) leaves the server only in the `reveal` phase — during a
 * question it would be one devtools tab away from every student's phone.
 */
import { answerDistribution, questionEndsAt, settled, standings, type Game, type Phase, type Standing } from './game';

export interface PublicQuestion {
  index: number;
  total: number;
  prompt: string;
  choices: readonly string[];
  endsAt: number;
}

export interface RevealInfo {
  correctIndex: number;
  explanation: string;
  distribution: number[];
}

interface BaseView {
  pin: string;
  lessonTitle: string;
  phase: Phase;
  questionCount: number;
  timeLimitMs: number;
  /** Server clock, so clients can correct the countdown for skew. */
  serverNow: number;
  question: PublicQuestion | null;
  reveal: RevealInfo | null;
}

export interface HostView extends BaseView {
  role: 'host';
  players: { userId: string; name: string; avatarUrl: string | null }[];
  answeredCount: number;
  standings: Standing[];
}

export interface PlayerView extends BaseView {
  role: 'player';
  me: {
    score: number;
    streak: number;
    rank: number;
    /** This player's answer to the current question, if any. */
    answer: { choiceIndex: number; correct: boolean | null; points: number | null } | null;
  };
  playerCount: number;
  /** Top 5 — shown between questions and at the end. Hidden while a question is open. */
  top: Standing[];
}

export type LiveView = HostView | PlayerView;

function baseView(game: Game, now: number): BaseView {
  const q = game.questions[game.index];
  const showQuestion = q && (game.phase === 'question' || game.phase === 'reveal');
  return {
    pin: game.pin,
    lessonTitle: game.lessonTitle,
    phase: game.phase,
    questionCount: game.questions.length,
    timeLimitMs: game.timeLimitMs,
    serverNow: now,
    question: showQuestion
      ? { index: game.index, total: game.questions.length, prompt: q.prompt, choices: q.choices, endsAt: questionEndsAt(game) }
      : null,
    reveal:
      q && game.phase === 'reveal'
        ? { correctIndex: q.correctIndex, explanation: q.explanation, distribution: answerDistribution(game) }
        : null,
  };
}

export function hostView(game: Game, now: number): HostView {
  const players = Object.values(game.players);
  return {
    ...baseView(game, now),
    role: 'host',
    players: players.map(({ userId, name, avatarUrl }) => ({ userId, name, avatarUrl })),
    answeredCount: game.phase === 'question' ? players.filter((p) => p.answers[game.index]).length : 0,
    standings: game.phase === 'lobby' ? [] : standings(settled(game)),
  };
}

export function playerView(game: Game, userId: string, now: number): PlayerView {
  const answer = game.players[userId]?.answers[game.index];
  const before = settled(game);
  const player = before.players[userId];
  const table = standings(before);
  const revealed = game.phase !== 'question';
  return {
    ...baseView(game, now),
    role: 'player',
    me: {
      score: player?.score ?? 0,
      streak: player?.streak ?? 0,
      rank: table.find((s) => s.userId === userId)?.rank ?? 0,
      // Correctness is withheld until reveal so a student can't signal the
      // answer to a neighbour who hasn't tapped yet.
      answer: answer
        ? { choiceIndex: answer.choiceIndex, correct: revealed ? answer.correct : null, points: revealed ? answer.points : null }
        : null,
    },
    playerCount: table.length,
    top: game.phase === 'reveal' || game.phase === 'finished' ? table.slice(0, 5) : [],
  };
}
