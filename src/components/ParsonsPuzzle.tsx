import React, { useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, ListOrdered, Loader2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';

interface Block {
  id: string;
  text: string;
}

interface Board {
  problemId: string;
  title: string;
  description: string;
  blocks: Block[];
  points: number;
  alreadySolved: boolean;
}

interface Grade {
  correct: boolean;
  linesCorrect: number;
  linesTotal: number;
  wrongPositions: number[];
  pointsAwarded: number;
  feedback: string;
}

interface Props {
  problemId: string;
  onSolved?: () => void;
}

/**
 * Reordering is done with up/down buttons rather than drag-and-drop.
 *
 * Drag needs a pointer, a steady hand and a mouse; these students work on
 * phones and shared classroom laptops, and a drag that misses drops the card
 * back where it started with no explanation. Buttons are keyboard-reachable,
 * work identically on touch, and can be announced to a screen reader.
 */
export function ParsonsPuzzle({ problemId, onSolved }: Props) {
  const [order, setOrder] = useState<Block[] | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);

  const { data: board, isLoading, error } = useQuery({
    queryKey: ['parsons', problemId],
    queryFn: () => api.get<Board>(`/problems/${problemId}/parsons`),
  });

  // The server deals the cards; the local list is seeded from them once and is
  // the student's working order from then on.
  const blocks = order ?? board?.blocks ?? [];

  const move = (index: number, delta: number) => {
    const next = [...blocks];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    // Last verdict described a different arrangement; keeping it on screen
    // would mark lines the student has already moved.
    setGrade(null);
  };

  const check = useMutation({
    mutationFn: () => api.post<Grade>(`/problems/${problemId}/parsons`, { order: blocks.map((b) => b.id) }),
    onSuccess: (result) => {
      setGrade(result);
      if (result.correct) onSolved?.();
    },
  });

  if (isLoading) {
    return <p className="text-sm text-gray-500">Mashq yuklanmoqda...</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-gray-500">
        {error instanceof ApiError ? error.message : "Mashqni yuklab bo'lmadi."}
      </p>
    );
  }
  if (!board) return null;

  const wrong = new Set(grade?.wrongPositions ?? []);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <ListOrdered className="text-brand-purple" size={18} />
          <div>
            <h3 className="font-semibold text-white">Qatorlarni to'g'ri tartibga joylang</h3>
            <p className="text-xs text-gray-400">
              Kod yozish shart emas — tayyor qatorlarni to'g'ri ketma-ketlikka keltiring.
            </p>
          </div>
        </div>
        <span className="shrink-0 text-xs font-mono bg-brand-purple/20 text-brand-purple px-2 py-1 rounded">
          +{board.points} XP
        </span>
      </div>

      <ol className="space-y-2">
        {blocks.map((block, i) => {
          const isWrong = wrong.has(i + 1);
          return (
            <li
              key={block.id}
              className={`flex items-stretch gap-2 rounded-lg border bg-black/40 ${
                isWrong ? 'border-brand-red/60' : 'border-brand-border'
              }`}
            >
              <span className="w-8 shrink-0 flex items-center justify-center font-mono text-xs text-gray-500 border-r border-brand-border">
                {i + 1}
              </span>
              <code className="flex-1 py-2 font-mono text-sm text-gray-200 whitespace-pre overflow-x-auto">
                {block.text}
              </code>
              <div className="flex flex-col justify-center gap-0.5 pr-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`${i + 1}-qatorni yuqoriga ko'chirish`}
                  className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === blocks.length - 1}
                  aria-label={`${i + 1}-qatorni pastga ko'chirish`}
                  className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => check.mutate()}
          disabled={check.isPending}
          className="px-4 py-2 bg-brand-purple text-white font-bold rounded hover:bg-brand-purple/90 disabled:opacity-50 text-sm flex items-center gap-2"
        >
          {check.isPending && <Loader2 size={14} className="animate-spin" />}
          Tekshirish
        </button>

        {grade && (
          <p
            className={`text-sm flex items-center gap-2 ${
              grade.correct ? 'text-brand-green' : 'text-gray-300'
            }`}
          >
            {grade.correct && <CheckCircle2 size={16} />}
            {grade.feedback}
            {grade.pointsAwarded > 0 && <span className="font-mono">+{grade.pointsAwarded} XP</span>}
          </p>
        )}
      </div>

      {check.isError && (
        <p className="text-sm text-brand-red">
          {check.error instanceof ApiError ? check.error.message : "Tekshirib bo'lmadi."}
        </p>
      )}

      {board.alreadySolved && !grade?.pointsAwarded && (
        <p className="text-xs text-gray-500">
          Bu masalani allaqachon yechgansiz — mashqni takrorlash mumkin, lekin XP qayta berilmaydi.
        </p>
      )}
    </div>
  );
}
