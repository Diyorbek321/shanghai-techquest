import React from 'react';
import { motion } from 'motion/react';
import { Circle, Diamond, Square, Triangle, Trophy, WifiOff } from 'lucide-react';
import type { Standing } from '../../server/live/game';
import type { Connection } from './useLiveGame';
import { cn } from '../../lib/utils';

/**
 * Kahoot's colour + shape pairing: the shape lets a student match their phone
 * to the projector without reading, and keeps the choices apart for anyone
 * who can't tell red from green.
 */
export const CHOICE_STYLES = [
  { bg: 'bg-red-500', hover: 'hover:bg-red-400', bar: 'bg-red-500', Icon: Triangle, label: 'Uchburchak' },
  { bg: 'bg-blue-500', hover: 'hover:bg-blue-400', bar: 'bg-blue-500', Icon: Diamond, label: 'Romb' },
  { bg: 'bg-amber-500', hover: 'hover:bg-amber-400', bar: 'bg-amber-500', Icon: Circle, label: 'Doira' },
  { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-500', bar: 'bg-emerald-600', Icon: Square, label: 'Kvadrat' },
] as const;

export function ChoiceIcon({ index, size = 24 }: { index: number; size?: number }) {
  const { Icon } = CHOICE_STYLES[index % CHOICE_STYLES.length];
  return <Icon size={size} className="shrink-0 fill-white text-white" aria-hidden />;
}

export function CountdownBadge({ seconds, large = false }: { seconds: number; large?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-4 font-heading font-bold tabular-nums',
        seconds <= 5 ? 'border-red-500 text-red-400' : 'border-brand-cyan text-brand-cyan',
        large ? 'h-24 w-24 text-4xl' : 'h-14 w-14 text-xl'
      )}
      role="timer"
      aria-label={`${seconds} soniya qoldi`}
    >
      {seconds}
    </div>
  );
}

export function StandingsList({ rows, highlightId }: { rows: Standing[]; highlightId?: string }) {
  if (rows.length === 0) return null;
  return (
    <ol className="space-y-2">
      {rows.map((row) => (
        <motion.li
          layout
          key={row.userId}
          className={cn(
            'flex items-center gap-3 rounded-lg border px-4 py-2',
            row.userId === highlightId ? 'border-brand-cyan bg-brand-cyan/10' : 'border-brand-border bg-brand-card'
          )}
        >
          <span className="w-6 text-center font-mono text-sm text-gray-400">{row.rank}</span>
          <span className="flex-1 truncate font-medium">{row.name}</span>
          <span className="font-mono font-bold tabular-nums text-brand-cyan">{row.score}</span>
        </motion.li>
      ))}
    </ol>
  );
}

const PODIUM = [
  { place: 2, height: 'h-28', color: 'bg-gray-300/80' },
  { place: 1, height: 'h-40', color: 'bg-[#FFD700]' },
  { place: 3, height: 'h-20', color: 'bg-amber-700' },
] as const;

/** Top three on steps, in Kahoot order (2 · 1 · 3). Tied players share a step. */
export function Podium({ standings }: { standings: Standing[] }) {
  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6">
      {PODIUM.map(({ place, height, color }, i) => {
        const names = standings.filter((s) => s.rank === place);
        return (
          <motion.div
            key={place}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (2 - i) * 0.5 }}
            className="flex w-24 flex-col items-center sm:w-36"
          >
            <div className="mb-2 min-h-12 text-center">
              {names.map((s) => (
                <p key={s.userId} className="truncate text-sm font-bold sm:text-base">
                  {s.name}
                </p>
              ))}
              {names[0] && <p className="font-mono text-xs text-gray-400">{names[0].score}</p>}
            </div>
            <div className={cn('flex w-full items-start justify-center rounded-t-lg pt-2', height, color)}>
              {place === 1 ? <Trophy className="text-black/70" /> : <span className="font-heading text-2xl font-bold text-black/60">{place}</span>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function ConnectionBanner({ connection }: { connection: Connection }) {
  if (connection !== 'reconnecting') return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
      <WifiOff size={16} /> Aloqa uzildi, qayta ulanmoqda...
    </div>
  );
}
