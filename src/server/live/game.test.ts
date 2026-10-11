import { describe, expect, it } from 'vitest';
import {
  addPlayer,
  advance,
  allAnswered,
  ANSWER_GRACE_MS,
  createGame,
  GameRuleError,
  MAX_POINTS,
  normalizeGuestName,
  pointsFor,
  removePlayer,
  reveal,
  settled,
  standings,
  streakBonus,
  submitAnswer,
  xpFor,
  type Game,
  type LiveQuestion,
} from './game';
import { hostView, playerView } from './views';

const LIMIT = 20_000;
const T0 = 1_000_000;

const question = (id: string, correctIndex = 1): LiveQuestion => ({
  id,
  prompt: `Savol ${id}`,
  choices: ['a', 'b', 'c', 'd'],
  correctIndex,
  explanation: `Izoh ${id}`,
});

function lobby(questions = [question('q1'), question('q2')]): Game {
  const game = createGame({ pin: '123456', hostId: 'host', lessonId: 'l1', lessonTitle: 'Dars', questions, timeLimitMs: LIMIT });
  return ['ali', 'vali'].reduce((g, id) => addPlayer(g, { userId: id, name: id, avatarUrl: null }), game);
}

const started = (game = lobby()) => advance(game, T0);

describe('scoring', () => {
  it('pays the full 1000 for an instant correct answer and 500 at the buzzer', () => {
    expect(pointsFor(0, LIMIT, true)).toBe(MAX_POINTS);
    expect(pointsFor(LIMIT, LIMIT, true)).toBe(500);
    expect(pointsFor(LIMIT + 400, LIMIT, true)).toBe(500);
  });

  it('pays nothing for a wrong answer, however fast', () => {
    expect(pointsFor(0, LIMIT, false)).toBe(0);
  });

  it('starts the streak bonus on the second correct answer and caps it', () => {
    expect(streakBonus(1)).toBe(0);
    expect(streakBonus(2)).toBe(100);
    expect(streakBonus(50)).toBe(500);
  });
});

describe('lobby', () => {
  it('refuses a lesson without questions', () => {
    expect(() => lobby([])).toThrow(GameRuleError);
  });

  it('cannot start empty', () => {
    const empty = createGame({ pin: '1', hostId: 'h', lessonId: 'l', lessonTitle: 'D', questions: [question('q')], timeLimitMs: LIMIT });
    expect(() => advance(empty, T0)).toThrow("Hali hech kim qo'shilmagan.");
  });

  it('lets a player rejoin mid-game but keeps newcomers out', () => {
    const game = started();
    expect(addPlayer(game, { userId: 'ali', name: 'ali', avatarUrl: null })).toBe(game);
    expect(() => addPlayer(game, { userId: 'new', name: 'new', avatarUrl: null })).toThrow("O'yin allaqachon boshlangan.");
  });

  it('keeps the host out of the player list', () => {
    expect(() => addPlayer(lobby(), { userId: 'host', name: 'h', avatarUrl: null })).toThrow(GameRuleError);
  });
});

describe('answering', () => {
  it('scores a correct answer by speed', () => {
    const game = submitAnswer(started(), 'ali', 0, 1, T0 + LIMIT / 2);
    expect(game.players.ali.score).toBe(750);
    expect(game.players.ali.streak).toBe(1);
  });

  it('accepts one answer per question', () => {
    const game = submitAnswer(started(), 'ali', 0, 0, T0 + 10);
    expect(() => submitAnswer(game, 'ali', 0, 1, T0 + 20)).toThrow('Siz allaqachon javob bergansiz.');
  });

  it('rejects an answer aimed at a different question than the open one', () => {
    expect(() => submitAnswer(started(), 'ali', 1, 1, T0 + 10)).toThrow(GameRuleError);
  });

  it('allows a short network grace after the timer, then closes', () => {
    expect(() => submitAnswer(started(), 'ali', 0, 1, T0 + LIMIT + ANSWER_GRACE_MS)).not.toThrow();
    expect(() => submitAnswer(started(), 'ali', 0, 1, T0 + LIMIT + ANSWER_GRACE_MS + 1)).toThrow('Vaqt tugadi.');
  });

  it('rejects an out-of-range choice and a stranger', () => {
    expect(() => submitAnswer(started(), 'ali', 0, 4, T0)).toThrow("Javob varianti noto'g'ri.");
    expect(() => submitAnswer(started(), 'nobody', 0, 1, T0)).toThrow("Siz bu o'yinda emassiz.");
  });

  it('knows when everyone has answered', () => {
    const one = submitAnswer(started(), 'ali', 0, 1, T0);
    expect(allAnswered(one)).toBe(false);
    expect(allAnswered(submitAnswer(one, 'vali', 0, 2, T0))).toBe(true);
  });

  it('resets the streak of a player who stayed silent', () => {
    let game = submitAnswer(started(), 'ali', 0, 1, T0);
    game = advance(reveal(game), T0 + LIMIT);
    game = reveal(game);
    expect(game.players.ali.streak).toBe(0);
  });
});

describe('secrecy until reveal', () => {
  it('shows neither the key nor the outcome to a player while the question is open', () => {
    const game = submitAnswer(started(), 'ali', 0, 1, T0);
    const view = playerView(game, 'ali', T0);
    expect(view.reveal).toBeNull();
    expect(JSON.stringify(view.question)).not.toContain('correctIndex');
    expect(view.me.answer).toEqual({ choiceIndex: 1, correct: null, points: null });
    expect(view.me.score).toBe(0);
    expect(view.me.streak).toBe(0);
  });

  it('keeps live scores off the projector until reveal', () => {
    const game = submitAnswer(started(), 'ali', 0, 1, T0);
    expect(hostView(game, T0).standings.every((s) => s.score === 0)).toBe(true);
    expect(hostView(game, T0).answeredCount).toBe(1);
  });

  it('settled() rolls back exactly the open answers', () => {
    let game = submitAnswer(started(), 'ali', 0, 1, T0);
    game = advance(reveal(game), T0 + 1);
    game = submitAnswer(game, 'ali', 1, 1, T0 + 1);
    const before = settled(game).players.ali;
    expect(before.score).toBe(MAX_POINTS);
    expect(before.streak).toBe(1);
    expect(before.correctCount).toBe(1);
  });

  it('reveals the key, the distribution and the outcome after the question closes', () => {
    const game = reveal(submitAnswer(started(), 'ali', 0, 1, T0));
    const view = playerView(game, 'ali', T0);
    expect(view.reveal).toEqual({ correctIndex: 1, explanation: 'Izoh q1', distribution: [0, 1, 0, 0] });
    expect(view.me.answer).toEqual({ choiceIndex: 1, correct: true, points: MAX_POINTS, });
  });
});

describe('end of game', () => {
  it('finishes after the last question', () => {
    const game = advance(reveal(advance(reveal(started()), T0)), T0);
    expect(game.phase).toBe('finished');
  });

  it('ranks ties equally', () => {
    let game = submitAnswer(started(), 'ali', 0, 1, T0);
    game = submitAnswer(game, 'vali', 0, 1, T0);
    expect(standings(game).map((s) => s.rank)).toEqual([1, 1]);
  });

  it('pays participation, score and podium XP — but no podium for zero', () => {
    expect(xpFor({ userId: 'a', name: 'a', avatarUrl: null, guest: false, score: 1950, correctCount: 2, rank: 1 })).toBe(10 + 19 + 50);
    expect(xpFor({ userId: 'b', name: 'b', avatarUrl: null, guest: false, score: 0, correctCount: 0, rank: 1 })).toBe(10);
  });
});

describe('guests', () => {
  const guest = (userId: string, name: string) => ({ userId, name, avatarUrl: null, guest: true });

  it('normalizes and bounds guest names', () => {
    expect(normalizeGuestName('  Ali   Valiyev ')).toBe('Ali Valiyev');
    expect(normalizeGuestName('A')).toBeNull();
    expect(normalizeGuestName('x'.repeat(25))).toBeNull();
  });

  it('refuses a guest name already in the game, ignoring case', () => {
    expect(() => addPlayer(lobby(), guest('g1', 'ALI'))).toThrow('Bu ism band. Boshqa ism tanlang.');
    const game = addPlayer(lobby(), guest('g1', 'Sardor'));
    expect(game.players.g1.guest).toBe(true);
  });

  it('marks guests in the standings so persistence can skip them', () => {
    const game = addPlayer(lobby(), guest('g1', 'Mehmon'));
    expect(standings(game).find((s) => s.userId === 'g1')?.guest).toBe(true);
    expect(standings(game).find((s) => s.userId === 'ali')?.guest).toBe(false);
  });

  it('lets the host remove a player only before the game starts', () => {
    expect(removePlayer(lobby(), 'ali').players.ali).toBeUndefined();
    expect(() => removePlayer(started(), 'ali')).toThrow(GameRuleError);
  });
});
