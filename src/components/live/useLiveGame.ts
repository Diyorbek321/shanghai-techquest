import { useEffect, useState } from 'react';
import type { LiveView } from '../../server/live/views';

export type Connection = 'connecting' | 'open' | 'reconnecting' | 'closed';

interface LiveGameState<V extends LiveView> {
  view: V | null;
  connection: Connection;
  /** serverNow − Date.now() at the last update; corrects countdowns for clock skew. */
  clockOffset: number;
}

/**
 * Subscribes to a game's SSE stream. EventSource retries on its own after a
 * network blip; a non-200 answer (room gone, not joined) closes it for good,
 * which surfaces as connection === 'closed'.
 */
export function useLiveGame<V extends LiveView>(pin: string | null): LiveGameState<V> {
  const [state, setState] = useState<LiveGameState<V>>({ view: null, connection: 'connecting', clockOffset: 0 });

  useEffect(() => {
    if (!pin) return;
    setState({ view: null, connection: 'connecting', clockOffset: 0 });
    const source = new EventSource(`/api/live/${pin}/events`, { withCredentials: true });

    source.onopen = () => setState((s) => ({ ...s, connection: 'open' }));
    source.onmessage = (event) => {
      try {
        const view = JSON.parse(event.data) as V;
        setState({ view, connection: 'open', clockOffset: view.serverNow - Date.now() });
      } catch {
        // A malformed frame is skipped; the next update carries the full state anyway.
      }
    };
    source.onerror = () => {
      setState((s) => ({ ...s, connection: source.readyState === EventSource.CLOSED ? 'closed' : 'reconnecting' }));
    };

    return () => source.close();
  }, [pin]);

  return state;
}

/** Whole seconds left on the open question, ticking locally between server updates. */
export function useCountdown(endsAt: number | null, clockOffset: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (endsAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [endsAt]);
  if (endsAt === null) return 0;
  return Math.max(0, Math.ceil((endsAt - (now + clockOffset)) / 1000));
}
