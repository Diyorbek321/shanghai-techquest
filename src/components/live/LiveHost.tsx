import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Play, SkipForward, Users, X } from 'lucide-react';
import type { HostView } from '../../server/live/views';
import { api, ApiError } from '../../lib/api';
import { cn } from '../../lib/utils';
import { CHOICE_STYLES, ChoiceIcon, ConnectionBanner, CountdownBadge, Podium, StandingsList } from './shared';
import { useCountdown, useLiveGame } from './useLiveGame';

interface PlayableLesson {
  key: string;
  title: string;
  track: string;
  order: number;
  questionCount: number;
}

const TIME_LIMITS = [10, 20, 30, 60] as const;
const TRACK_LABELS: Record<string, string> = {
  FRONTEND: 'Frontend',
  BACKEND: 'Python Backend',
  OFFICE: 'Ofis',
  ROBOTICS: 'Robototexnika',
};

export function LiveHost() {
  const queryClient = useQueryClient();
  const { data: mine, isLoading } = useQuery({
    queryKey: ['live', 'mine'],
    queryFn: () => api.get<{ pin: string | null }>('/live/mine'),
  });
  const pin = mine?.pin ?? null;
  const setPin = (next: string | null) => queryClient.setQueryData(['live', 'mine'], { pin: next });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <Loader2 className="animate-spin" size={16} /> Yuklanmoqda...
      </div>
    );
  }
  return pin ? <HostGame pin={pin} onClose={() => setPin(null)} /> : <CreateGame onCreated={setPin} />;
}

function CreateGame({ onCreated }: { onCreated: (pin: string) => void }) {
  const [lessonKey, setLessonKey] = useState('');
  const [timeLimitSec, setTimeLimitSec] = useState<number>(20);
  const { data, isLoading, error } = useQuery({
    queryKey: ['live', 'lessons'],
    queryFn: () => api.get<{ lessons: PlayableLesson[] }>('/live/lessons'),
  });
  const create = useMutation({
    mutationFn: () => api.post<{ pin: string }>('/live', { lessonKey, timeLimitSec }),
    onSuccess: ({ pin }) => onCreated(pin),
  });

  const byTrack = (data?.lessons ?? []).reduce<Record<string, PlayableLesson[]>>(
    (acc, l) => ({ ...acc, [l.track]: [...(acc[l.track] ?? []), l] }),
    {}
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-heading text-3xl font-bold text-glow">Jonli viktorina</h1>
        <p className="mt-1 text-gray-400">
          Dars savollaridan o'yin oching. O'quvchilar telefondan PIN bilan qo'shiladi, savollar esa proyektorda ko'rinadi.
        </p>
      </header>

      <div className="space-y-4 rounded-xl border border-brand-border bg-brand-card p-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-300">Dars</span>
          {isLoading ? (
            <p className="mt-2 text-sm text-gray-500">Darslar yuklanmoqda...</p>
          ) : error ? (
            <p className="mt-2 text-sm text-red-400">Darslarni yuklab bo'lmadi.</p>
          ) : (
            <select
              value={lessonKey}
              onChange={(e) => setLessonKey(e.target.value)}
              className="mt-2 w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2 text-white"
            >
              <option value="">— Darsni tanlang —</option>
              {Object.entries(byTrack).map(([track, lessons]) => (
                <optgroup key={track} label={TRACK_LABELS[track] ?? track}>
                  {lessons.map((l) => (
                    <option key={l.key} value={l.key}>
                      {l.order}. {l.title} ({l.questionCount} savol)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}
        </label>

        <fieldset>
          <legend className="text-sm font-medium text-gray-300">Har bir savolga vaqt</legend>
          <div className="mt-2 flex gap-2">
            {TIME_LIMITS.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setTimeLimitSec(sec)}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  timeLimitSec === sec
                    ? 'border-brand-cyan bg-brand-cyan/15 text-brand-cyan'
                    : 'border-brand-border text-gray-300 hover:bg-brand-card-hover'
                )}
              >
                {sec} s
              </button>
            ))}
          </div>
        </fieldset>

        {create.error && <p className="text-sm text-red-400">{(create.error as ApiError).message}</p>}

        <button
          type="button"
          disabled={!lessonKey || create.isPending}
          onClick={() => create.mutate()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-cyan px-4 py-3 font-bold text-black transition-opacity disabled:opacity-40"
        >
          {create.isPending ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
          O'yin ochish
        </button>
      </div>
    </div>
  );
}

function HostGame({ pin, onClose }: { pin: string; onClose: () => void }) {
  const { view, connection, clockOffset } = useLiveGame<HostView>(pin);
  const seconds = useCountdown(view?.phase === 'question' ? view.question?.endsAt ?? null : null, clockOffset);
  const [actionError, setActionError] = useState<string | null>(null);

  const kick = useMutation({
    mutationFn: (playerId: string) => api.post(`/live/${pin}/kick`, { playerId }),
    onMutate: () => setActionError(null),
    onError: (err) => setActionError((err as ApiError).message),
  });
  const act = useMutation({
    mutationFn: (action: 'next' | 'skip' | 'end') => api.post(`/live/${pin}/${action}`),
    onMutate: () => setActionError(null),
    onError: (err) => setActionError((err as ApiError).message),
  });

  if (connection === 'closed') {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <p className="text-gray-300">O'yin yopilgan yoki topilmadi.</p>
        <button type="button" onClick={onClose} className="rounded-lg bg-brand-cyan px-4 py-2 font-bold text-black">
          Yangi o'yin
        </button>
      </div>
    );
  }
  if (!view) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <Loader2 className="animate-spin" size={16} /> Ulanmoqda...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-xl font-bold">{view.lessonTitle}</h1>
        <span className="rounded bg-brand-card px-2 py-1 font-mono text-sm text-gray-400">PIN {view.pin}</span>
        <span className="flex items-center gap-1 text-sm text-gray-400">
          <Users size={16} /> {view.players.length}
        </span>
        {view.phase !== 'finished' && (
          <button
            type="button"
            onClick={() => window.confirm("O'yinni tugatasizmi? Hozirgacha to'plangan ballar saqlanadi.") && act.mutate('end')}
            className="ml-auto flex items-center gap-1 rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
          >
            <X size={16} /> Tugatish
          </button>
        )}
      </div>

      <ConnectionBanner connection={connection} />
      {actionError && <p className="text-sm text-red-400">{actionError}</p>}

      <AnimatePresence mode="wait">
        <motion.div key={`${view.phase}-${view.question?.index ?? -1}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {view.phase === 'lobby' && (
            <Lobby view={view} onStart={() => act.mutate('next')} starting={act.isPending} onKick={(id) => kick.mutate(id)} />
          )}
          {view.phase === 'question' && <OpenQuestion view={view} seconds={seconds} onSkip={() => act.mutate('skip')} />}
          {view.phase === 'reveal' && <Reveal view={view} onNext={() => act.mutate('next')} busy={act.isPending} />}
          {view.phase === 'finished' && <Finished view={view} onNew={onClose} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface LobbyProps {
  view: HostView;
  onStart: () => void;
  starting: boolean;
  onKick: (playerId: string) => void;
}

function Lobby({ view, onStart, starting, onKick }: LobbyProps) {
  const joinUrl = `${window.location.host}/play`;
  return (
    <div className="space-y-8 text-center">
      <div className="rounded-2xl border border-brand-border bg-brand-card p-8">
        <p className="text-gray-400">
          Telefonda oching: <b className="text-white">{joinUrl}</b>
        </p>
        <p className="mt-1 text-xs text-gray-500">Akkaunt shart emas — PIN va ism yetarli. O'quvchilar o'z akkauntidan ham kira oladi.</p>
        <p className="mt-4 font-heading text-7xl font-bold tracking-[0.2em] text-brand-cyan text-glow sm:text-8xl">{view.pin}</p>
        <p className="mt-4 text-sm text-gray-500">
          {view.questionCount} savol · har biriga {view.timeLimitMs / 1000} soniya
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {view.players.length === 0 && <p className="text-gray-500">O'quvchilar kutilmoqda...</p>}
        <AnimatePresence>
          {view.players.map((p) => (
            <motion.span
              key={p.userId}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 rounded-full border border-brand-border bg-brand-card py-2 pl-4 pr-2 font-medium"
            >
              {p.name}
              {p.guest && <span className="rounded bg-white/10 px-1.5 text-[10px] uppercase tracking-wider text-gray-400">mehmon</span>}
              <button
                type="button"
                onClick={() => window.confirm(`${p.name} o'yindan chiqarilsinmi?`) && onKick(p.userId)}
                className="rounded-full p-1 text-gray-500 hover:bg-red-500/20 hover:text-red-400"
                aria-label={`${p.name}ni chiqarish`}
              >
                <X size={14} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <button
        type="button"
        disabled={view.players.length === 0 || starting}
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-8 py-3 text-lg font-bold text-black disabled:opacity-40"
      >
        <Play size={20} /> Boshlash
      </button>
    </div>
  );
}

function OpenQuestion({ view, seconds, onSkip }: { view: HostView; seconds: number; onSkip: () => void }) {
  const q = view.question!;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          Savol {q.index + 1} / {q.total}
        </span>
        <button type="button" onClick={onSkip} className="flex items-center gap-1 hover:text-white">
          <SkipForward size={16} /> O'tkazib yuborish
        </button>
      </div>
      <h2 className="rounded-xl bg-white px-6 py-8 text-center text-2xl font-bold text-black sm:text-3xl">{q.prompt}</h2>
      <div className="flex items-center justify-between">
        <CountdownBadge seconds={seconds} large />
        <div className="text-center">
          <p className="font-heading text-4xl font-bold">{view.answeredCount}</p>
          <p className="text-sm text-gray-400">javob berdi</p>
        </div>
      </div>
      <ChoiceGrid choices={q.choices} />
    </div>
  );
}

function ChoiceGrid({ choices, correctIndex }: { choices: readonly string[]; correctIndex?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {choices.map((choice, i) => {
        const dim = correctIndex !== undefined && i !== correctIndex;
        return (
          <div
            key={i}
            className={cn(
              'flex items-center gap-4 rounded-xl px-5 py-5 text-lg font-bold text-white transition-opacity',
              CHOICE_STYLES[i].bg,
              dim && 'opacity-30'
            )}
          >
            <ChoiceIcon index={i} size={28} />
            <span className="flex-1">{choice}</span>
            {correctIndex === i && <CheckCircle2 size={28} aria-label="To'g'ri javob" />}
          </div>
        );
      })}
    </div>
  );
}

function Reveal({ view, onNext, busy }: { view: HostView; onNext: () => void; busy: boolean }) {
  const q = view.question!;
  const r = view.reveal!;
  const max = Math.max(1, ...r.distribution);
  const isLast = q.index + 1 >= q.total;
  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold">{q.prompt}</h2>

      <div className="flex h-40 items-end justify-center gap-4">
        {r.distribution.map((count, i) => (
          <div key={i} className="flex w-16 flex-col items-center gap-1 sm:w-24">
            <span className="font-bold">{count}</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(count / max) * 100}%` }}
              className={cn('w-full min-h-1 rounded-t', CHOICE_STYLES[i].bar, i !== r.correctIndex && 'opacity-40')}
            />
            <ChoiceIcon index={i} size={18} />
          </div>
        ))}
      </div>

      <ChoiceGrid choices={q.choices} correctIndex={r.correctIndex} />
      {r.explanation && <p className="rounded-lg border border-brand-border bg-brand-card p-4 text-gray-300">{r.explanation}</p>}

      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
        <StandingsList rows={view.standings.slice(0, 5)} />
        <button
          type="button"
          onClick={onNext}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-cyan px-6 py-3 font-bold text-black disabled:opacity-40"
        >
          {isLast ? 'Natijalar' : 'Keyingi savol'} <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
}

function Finished({ view, onNew }: { view: HostView; onNew: () => void }) {
  return (
    <div className="space-y-8 text-center">
      <h2 className="font-heading text-4xl font-bold text-glow">G'oliblar</h2>
      <Podium standings={view.standings} />
      <div className="mx-auto max-w-lg text-left">
        <StandingsList rows={view.standings.slice(3)} />
      </div>
      <p className="text-sm text-gray-500">Natijalar saqlandi, XP ishtirokchilarga berildi.</p>
      <button type="button" onClick={onNew} className="rounded-lg bg-brand-cyan px-6 py-3 font-bold text-black">
        Yangi o'yin
      </button>
    </div>
  );
}
