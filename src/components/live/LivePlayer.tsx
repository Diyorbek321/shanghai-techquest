import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Flame, Loader2, LogIn, XCircle } from 'lucide-react';
import type { PlayerView } from '../../server/live/views';
import { api, ApiError } from '../../lib/api';
import { audioManager } from '../../lib/audio';
import { cn } from '../../lib/utils';
import { CHOICE_STYLES, ChoiceIcon, ConnectionBanner, CountdownBadge, Podium, StandingsList } from './shared';
import { useCountdown, useLiveGame } from './useLiveGame';

/** Remembered per tab so a reload drops the student back into the same game. */
const PIN_KEY = 'techquest.livePin';

function readStoredPin(): string | null {
  try {
    return sessionStorage.getItem(PIN_KEY);
  } catch {
    return null;
  }
}

function storePin(pin: string | null): void {
  try {
    if (pin) sessionStorage.setItem(PIN_KEY, pin);
    else sessionStorage.removeItem(PIN_KEY);
  } catch {
    // Storage blocked (private mode): rejoining after a reload just needs the PIN again.
  }
}

export function LivePlayer({ userId }: { userId: string }) {
  const [pin, setPin] = useState<string | null>(readStoredPin);
  const [notice, setNotice] = useState<string | null>(null);

  const leave = (message: string | null) => {
    storePin(null);
    setPin(null);
    setNotice(message);
  };

  if (!pin) {
    return (
      <JoinForm
        notice={notice}
        onJoined={(p) => {
          storePin(p);
          setNotice(null);
          setPin(p);
        }}
      />
    );
  }
  return <PlayerGame pin={pin} userId={userId} onLeave={leave} />;
}

function JoinForm({ notice, onJoined }: { notice: string | null; onJoined: (pin: string) => void }) {
  const [value, setValue] = useState('');
  const join = useMutation({
    mutationFn: (pin: string) => api.post<{ role: 'player' | 'host' }>(`/live/${pin}/join`),
    onSuccess: (_res, pin) => onJoined(pin),
  });
  const valid = /^\d{6}$/.test(value);

  return (
    <div className="mx-auto mt-8 max-w-sm space-y-6 text-center">
      <h1 className="font-heading text-3xl font-bold text-glow">Jonli viktorina</h1>
      <p className="text-gray-400">O'qituvchi ekranidagi 6 xonali PIN'ni kiriting.</p>
      {notice && <p className="rounded-lg border border-brand-border bg-brand-card p-3 text-sm text-gray-300">{notice}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) join.mutate(value);
        }}
        className="space-y-3"
      >
        <input
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
          placeholder="PIN"
          aria-label="O'yin PIN kodi"
          className="w-full rounded-xl border border-brand-border bg-brand-card px-4 py-4 text-center font-mono text-3xl tracking-[0.3em] text-white placeholder:text-gray-600 focus:border-brand-cyan focus:outline-none"
        />
        {join.error && <p className="text-sm text-red-400">{(join.error as ApiError).message}</p>}
        <button
          type="submit"
          disabled={!valid || join.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-cyan py-4 text-lg font-bold text-black disabled:opacity-40"
        >
          {join.isPending ? <Loader2 className="animate-spin" /> : <LogIn />} Kirish
        </button>
      </form>
    </div>
  );
}

function PlayerGame({ pin, userId, onLeave }: { pin: string; userId: string; onLeave: (message: string | null) => void }) {
  const { view, connection, clockOffset } = useLiveGame<PlayerView>(pin);
  const seconds = useCountdown(view?.phase === 'question' ? view.question?.endsAt ?? null : null, clockOffset);

  useEffect(() => {
    // Stream refused or room swept: the PIN is dead, go back to the join form.
    if (connection === 'closed') onLeave("O'yin tugagan yoki topilmadi.");
  }, [connection, onLeave]);

  if (!view) {
    return (
      <div className="flex items-center justify-center gap-2 pt-16 text-gray-400">
        <Loader2 className="animate-spin" size={16} /> Ulanmoqda...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span className="truncate">{view.lessonTitle}</span>
        <span className="font-mono font-bold text-brand-cyan">{view.me.score}</span>
      </div>
      <ConnectionBanner connection={connection} />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${view.phase}-${view.question?.index ?? -1}`}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          {view.phase === 'lobby' && <Waiting view={view} />}
          {view.phase === 'question' && <Answering view={view} pin={pin} seconds={seconds} />}
          {view.phase === 'reveal' && <Result view={view} userId={userId} />}
          {view.phase === 'finished' && <Final view={view} userId={userId} onLeave={() => onLeave(null)} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Waiting({ view }: { view: PlayerView }) {
  return (
    <div className="space-y-4 pt-12 text-center">
      <CheckCircle2 className="mx-auto text-brand-green" size={56} />
      <h2 className="text-2xl font-bold">Siz o'yindasiz!</h2>
      <p className="text-gray-400">O'qituvchi boshlashini kuting...</p>
      <p className="text-sm text-gray-500">{view.playerCount} ishtirokchi</p>
    </div>
  );
}

function Answering({ view, pin, seconds }: { view: PlayerView; pin: string; seconds: number }) {
  const q = view.question!;
  const [pending, setPending] = useState<number | null>(null);
  const submit = useMutation({
    mutationFn: (choiceIndex: number) => api.post(`/live/${pin}/answer`, { questionIndex: q.index, choiceIndex }),
    onError: () => setPending(null),
  });

  const chosen = view.me.answer?.choiceIndex ?? pending;
  if (chosen !== null) {
    return (
      <div className="space-y-4 pt-12 text-center">
        <div className={cn('mx-auto flex h-24 w-24 items-center justify-center rounded-2xl', CHOICE_STYLES[chosen].bg)}>
          <ChoiceIcon index={chosen} size={48} />
        </div>
        <h2 className="text-2xl font-bold">Javob qabul qilindi</h2>
        <p className="text-gray-400">Boshqalar kutilmoqda...</p>
      </div>
    );
  }

  const closed = seconds === 0;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <CountdownBadge seconds={seconds} />
        <div className="flex-1">
          <p className="text-xs text-gray-500">
            Savol {q.index + 1} / {q.total}
          </p>
          <p className="font-medium">{q.prompt}</p>
        </div>
      </div>
      {submit.error && <p className="text-sm text-red-400">{(submit.error as ApiError).message}</p>}
      <div className="grid grid-cols-2 gap-3">
        {q.choices.map((choice, i) => (
          <button
            key={i}
            type="button"
            disabled={closed || submit.isPending}
            onClick={() => {
              audioManager.playClick();
              setPending(i);
              submit.mutate(i);
            }}
            className={cn(
              'flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl p-3 text-center font-bold text-white transition-transform active:scale-95 disabled:opacity-50',
              CHOICE_STYLES[i].bg,
              CHOICE_STYLES[i].hover
            )}
          >
            <ChoiceIcon index={i} size={36} />
            <span className="text-sm leading-tight">{choice}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Result({ view, userId }: { view: PlayerView; userId: string }) {
  const answer = view.me.answer;
  const correct = answer?.correct === true;
  const r = view.reveal!;
  const q = view.question!;

  useEffect(() => {
    if (correct) audioManager.playNotification();
  }, [correct]);

  return (
    <div className="space-y-5">
      <div className={cn('rounded-2xl p-6 text-center', correct ? 'bg-emerald-600' : 'bg-red-600')}>
        {correct ? <CheckCircle2 className="mx-auto" size={56} /> : <XCircle className="mx-auto" size={56} />}
        <h2 className="mt-2 text-3xl font-bold">{correct ? "To'g'ri!" : answer ? "Noto'g'ri" : 'Vaqt tugadi'}</h2>
        {correct && <p className="mt-1 font-mono text-xl">+{answer?.points}</p>}
        {view.me.streak >= 2 && (
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-sm">
            <Flame size={16} className="text-orange-300" /> {view.me.streak} ketma-ket
          </p>
        )}
      </div>
      {!correct && (
        <p className="flex items-center gap-2 rounded-lg border border-brand-border bg-brand-card p-3 text-sm">
          <ChoiceIcon index={r.correctIndex} size={18} />
          <span>
            To'g'ri javob: <b>{q.choices[r.correctIndex]}</b>
          </span>
        </p>
      )}
      {r.explanation && <p className="text-sm text-gray-400">{r.explanation}</p>}
      <p className="text-center text-gray-300">
        Siz <b className="text-brand-cyan">{view.me.rank}</b>-o'rindasiz
      </p>
      <StandingsList rows={view.top} highlightId={userId} />
    </div>
  );
}

function Final({ view, userId, onLeave }: { view: PlayerView; userId: string; onLeave: () => void }) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="font-heading text-3xl font-bold text-glow">O'yin tugadi</h2>
      <Podium standings={view.top} />
      <p className="text-lg">
        Siz <b className="text-brand-cyan">{view.me.rank}</b>-o'rin · <span className="font-mono">{view.me.score}</span> ball
      </p>
      <p className="text-sm text-gray-500">XP hisobingizga qo'shildi.</p>
      <div className="text-left">
        <StandingsList rows={view.top} highlightId={userId} />
      </div>
      <button type="button" onClick={onLeave} className="rounded-lg border border-brand-border px-6 py-2 hover:bg-brand-card-hover">
        Chiqish
      </button>
    </div>
  );
}
