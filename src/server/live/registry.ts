/**
 * Live games in server memory, plus the connections watching them.
 *
 * A game lasts minutes and is worthless once over, so it never touches the
 * database until it finishes — then the outcome is written once (persist).
 * This is only correct while the app runs as ONE process, which
 * docker-compose.yml guarantees today; a second replica would need the rooms
 * moved to Redis.
 */
import { randomInt } from 'node:crypto';
import { ANSWER_GRACE_MS, allAnswered, finish, questionEndsAt, reveal, standings, type Game, type Standing } from './game';
import { hostView, playerView, type LiveView } from './views';

/** One open SSE stream. `send` is injected so the registry never sees Express. */
export interface Subscriber {
  userId: string;
  send: (view: LiveView) => void;
  close: () => void;
}

interface Room {
  game: Game;
  createdAt: number;
  finishedAt: number | null;
  subscribers: Set<Subscriber>;
  timer: ReturnType<typeof setTimeout> | null;
}

export type PersistFn = (game: Game, table: Standing[]) => Promise<void>;

/** Rooms are swept after this long no matter what — a forgotten lobby must not live forever. */
export const ROOM_MAX_AGE_MS = 3 * 60 * 60 * 1000;
/** A finished room stays a while so the podium survives a reload. */
export const FINISHED_ROOM_TTL_MS = 15 * 60 * 1000;

export function createRegistry(deps: { persist: PersistFn; now?: () => number }) {
  const now = deps.now ?? Date.now;
  const rooms = new Map<string, Room>();

  function viewFor(game: Game, userId: string): LiveView {
    return userId === game.hostId ? hostView(game, now()) : playerView(game, userId, now());
  }

  function broadcast(room: Room): void {
    for (const sub of room.subscribers) {
      try {
        sub.send(viewFor(room.game, sub.userId));
      } catch {
        room.subscribers.delete(sub);
      }
    }
  }

  function clearTimer(room: Room): void {
    if (room.timer) clearTimeout(room.timer);
    room.timer = null;
  }

  function onFinished(room: Room): void {
    room.finishedAt = now();
    const { game } = room;
    if (game.startedAt === null || Object.keys(game.players).length === 0) return;
    deps.persist(game, standings(game)).catch((err: unknown) => {
      console.error(`[live] failed to save results for game ${game.pin}:`, err);
    });
  }

  /** Every state change goes through here: store, re-arm the timer, notify. */
  function commit(room: Room, next: Game): void {
    const prevPhase = room.game.phase;
    const prevIndex = room.game.index;
    room.game = next;

    if (next.phase === 'question' && (prevPhase !== 'question' || prevIndex !== next.index)) {
      clearTimer(room);
      const delay = Math.max(questionEndsAt(next) + ANSWER_GRACE_MS - now(), 0);
      room.timer = setTimeout(() => commit(room, reveal(room.game)), delay);
      room.timer.unref?.();
    } else if (next.phase !== 'question') {
      clearTimer(room);
    }

    // Everyone answered: no reason to make the class stare at a countdown.
    if (allAnswered(next)) {
      commit(room, reveal(next));
      return;
    }
    if (next.phase === 'finished' && prevPhase !== 'finished') onFinished(room);
    broadcast(room);
  }

  function generatePin(): string {
    for (;;) {
      const pin = String(randomInt(100_000, 1_000_000));
      if (!rooms.has(pin)) return pin;
    }
  }

  function closeRoom(pin: string): void {
    const room = rooms.get(pin);
    if (!room) return;
    clearTimer(room);
    for (const sub of room.subscribers) sub.close();
    rooms.delete(pin);
  }

  return {
    generatePin,

    /** A host runs one game at a time; opening a new one closes the old. */
    open(game: Game): void {
      for (const [pin, room] of rooms) {
        if (room.game.hostId === game.hostId) closeRoom(pin);
      }
      rooms.set(game.pin, { game, createdAt: now(), finishedAt: null, subscribers: new Set(), timer: null });
    },

    get(pin: string): Game | undefined {
      return rooms.get(pin)?.game;
    },

    findByHost(hostId: string): Game | undefined {
      for (const room of rooms.values()) {
        if (room.game.hostId === hostId && room.game.phase !== 'finished') return room.game;
      }
      return undefined;
    },

    /** Apply a rule from ./game. Throws whatever the rule throws, before any state changes. */
    update(pin: string, change: (game: Game, at: number) => Game): Game {
      const room = rooms.get(pin);
      if (!room) throw new RoomNotFoundError();
      const next = change(room.game, now());
      if (next !== room.game) commit(room, next);
      return room.game;
    },

    end(pin: string): void {
      const room = rooms.get(pin);
      if (!room || room.game.phase === 'finished') return;
      commit(room, finish(room.game));
    },

    subscribe(pin: string, sub: Subscriber): () => void {
      const room = rooms.get(pin);
      if (!room) throw new RoomNotFoundError();
      room.subscribers.add(sub);
      sub.send(viewFor(room.game, sub.userId));
      return () => room.subscribers.delete(sub);
    },

    sweep(): void {
      const at = now();
      for (const [pin, room] of rooms) {
        const expired = at - room.createdAt > ROOM_MAX_AGE_MS;
        const stale = room.finishedAt !== null && at - room.finishedAt > FINISHED_ROOM_TTL_MS;
        if (expired || stale) closeRoom(pin);
      }
    },

    size(): number {
      return rooms.size;
    },
  };
}

export type Registry = ReturnType<typeof createRegistry>;

export class RoomNotFoundError extends Error {
  constructor() {
    super("Bunday PIN bilan o'yin topilmadi.");
  }
}
