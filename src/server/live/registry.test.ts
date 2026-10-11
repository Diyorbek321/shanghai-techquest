import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addPlayer, advance, createGame, submitAnswer, type Game } from './game';
import { createRegistry, FINISHED_ROOM_TTL_MS, RoomNotFoundError, type PersistFn } from './registry';
import type { LiveView } from './views';

const LIMIT = 10_000;

function newGame(pin = '111111', hostId = 'host'): Game {
  return createGame({
    pin,
    hostId,
    lessonId: 'l1',
    lessonTitle: 'Dars',
    questions: [
      { id: 'q1', prompt: 'p1', choices: ['a', 'b', 'c', 'd'], correctIndex: 0, explanation: '' },
      { id: 'q2', prompt: 'p2', choices: ['a', 'b', 'c', 'd'], correctIndex: 0, explanation: '' },
    ],
    timeLimitMs: LIMIT,
  });
}

describe('live registry', () => {
  let persist: ReturnType<typeof vi.fn<PersistFn>>;
  let registry: ReturnType<typeof createRegistry>;

  beforeEach(() => {
    vi.useFakeTimers();
    persist = vi.fn<PersistFn>().mockResolvedValue(undefined);
    registry = createRegistry({ persist, now: () => Date.now() });
    registry.open(newGame());
    registry.update('111111', (g) => addPlayer(g, { userId: 'ali', name: 'Ali', avatarUrl: null }));
    registry.update('111111', (g) => addPlayer(g, { userId: 'vali', name: 'Vali', avatarUrl: null }));
  });

  afterEach(() => vi.useRealTimers());

  it('pushes each subscriber its own view on every change', () => {
    const hostSeen: LiveView[] = [];
    const aliSeen: LiveView[] = [];
    registry.subscribe('111111', { userId: 'host', send: (v) => hostSeen.push(v), close: () => {} });
    registry.subscribe('111111', { userId: 'ali', send: (v) => aliSeen.push(v), close: () => {} });
    registry.update('111111', advance);

    expect(hostSeen.at(-1)?.role).toBe('host');
    expect(aliSeen.at(-1)?.role).toBe('player');
    expect(aliSeen.at(-1)?.phase).toBe('question');
  });

  it('reveals on its own when the timer runs out', () => {
    registry.update('111111', advance);
    vi.advanceTimersByTime(LIMIT - 1);
    expect(registry.get('111111')?.phase).toBe('question');
    vi.advanceTimersByTime(1000);
    expect(registry.get('111111')?.phase).toBe('reveal');
  });

  it('reveals at once when the last player answers', () => {
    registry.update('111111', advance);
    registry.update('111111', (g, at) => submitAnswer(g, 'ali', 0, 0, at));
    expect(registry.get('111111')?.phase).toBe('question');
    registry.update('111111', (g, at) => submitAnswer(g, 'vali', 0, 1, at));
    expect(registry.get('111111')?.phase).toBe('reveal');
  });

  it('leaves state untouched when a rule throws', () => {
    expect(() => registry.update('111111', (g, at) => submitAnswer(g, 'ali', 0, 0, at))).toThrow();
    expect(registry.get('111111')?.phase).toBe('lobby');
  });

  it('saves the result exactly once when the game finishes', () => {
    registry.update('111111', advance);
    vi.advanceTimersByTime(LIMIT + 1000);
    registry.update('111111', advance);
    vi.advanceTimersByTime(LIMIT + 1000);
    registry.update('111111', advance);
    registry.end('111111');

    expect(registry.get('111111')?.phase).toBe('finished');
    expect(persist).toHaveBeenCalledTimes(1);
    expect(persist.mock.calls[0][1]).toHaveLength(2);
  });

  it('saves nothing for a game ended in the lobby', () => {
    registry.end('111111');
    expect(persist).not.toHaveBeenCalled();
  });

  it('closes the old room when the same host opens a new one', () => {
    const close = vi.fn();
    registry.subscribe('111111', { userId: 'ali', send: () => {}, close });
    registry.open(newGame('222222'));
    expect(registry.get('111111')).toBeUndefined();
    expect(close).toHaveBeenCalled();
    expect(registry.findByHost('host')?.pin).toBe('222222');
  });

  it('sweeps finished rooms after their grace period', () => {
    registry.end('111111');
    vi.advanceTimersByTime(FINISHED_ROOM_TTL_MS + 1);
    registry.sweep();
    expect(registry.size()).toBe(0);
    expect(() => registry.update('111111', advance)).toThrow(RoomNotFoundError);
  });
});

describe('live registry — kicked players', () => {
  it('closes the stream of a player the host removed', async () => {
    const { removePlayer } = await import('./game');
    const registry = createRegistry({ persist: vi.fn<PersistFn>().mockResolvedValue(undefined) });
    registry.open(newGame());
    registry.update('111111', (g) => addPlayer(g, { userId: 'ali', name: 'Ali', avatarUrl: null }));
    const close = vi.fn();
    registry.subscribe('111111', { userId: 'ali', send: () => {}, close });
    registry.update('111111', (g) => removePlayer(g, 'ali'));
    expect(close).toHaveBeenCalledTimes(1);
  });
});
