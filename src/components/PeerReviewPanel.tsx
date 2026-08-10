import React, { useState } from 'react';
import { ExternalLink, Github, Loader2, MessagesSquare, ThumbsUp } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';

interface AssignedReview {
  submissionId: string;
  githubUrl: string | null;
  demoUrl: string | null;
  content: string | null;
  myReview: { strengths: string; suggestions: string } | null;
}

interface Props {
  assignmentId: string;
}

/**
 * The two classmates' work a student must review after handing in their own.
 *
 * The author's name is not shown. Between teenagers who sit together every
 * week, a named review turns into a polite one, and a polite review carries no
 * information — the teacher still sees who wrote what, so the accountability
 * that matters is kept.
 *
 * "What worked" is asked first and is required. A review that opens with faults
 * reads as an attack to the person who wrote the code, and the barrier this
 * feature has to clear is engagement, not thoroughness.
 */
export function PeerReviewPanel({ assignmentId }: Props) {
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, { strengths: string; suggestions: string }>>({});

  const { data: assigned = [], isLoading, error } = useQuery({
    queryKey: ['peer-review', assignmentId],
    queryFn: () => api.get<AssignedReview[]>(`/peer-review/assignment/${assignmentId}`),
  });

  const submit = useMutation({
    mutationFn: (vars: { submissionId: string; strengths: string; suggestions: string }) =>
      api.post(`/peer-review/${vars.submissionId}`, {
        strengths: vars.strengths,
        suggestions: vars.suggestions,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['peer-review', assignmentId] }),
  });

  if (isLoading) return <p className="text-sm text-gray-500">Yuklanmoqda...</p>;
  if (error) {
    return (
      <p className="text-sm text-gray-400">
        {error instanceof ApiError ? error.message : "Tekshiruvlarni yuklab bo'lmadi."}
      </p>
    );
  }
  if (assigned.length === 0) {
    return <p className="text-sm text-gray-500">Hozircha tekshirish uchun ish yo'q.</p>;
  }

  const draftFor = (item: AssignedReview) =>
    drafts[item.submissionId] ?? {
      strengths: item.myReview?.strengths ?? '',
      suggestions: item.myReview?.suggestions ?? '',
    };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessagesSquare className="text-brand-purple" size={18} />
        <div>
          <h3 className="font-semibold text-white">Sinfdoshlar ishini tekshirish</h3>
          <p className="text-xs text-gray-400">
            Ismlar ko'rsatilmaydi — kodga qarab yozing. O'qituvchi kim yozganini ko'radi.
          </p>
        </div>
      </div>

      {assigned.map((item, index) => {
        const draft = draftFor(item);
        const ready = draft.strengths.trim().length >= 10 && draft.suggestions.trim().length >= 10;
        return (
          <article key={item.submissionId} className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-medium text-sm text-gray-300">{index + 1}-ish</h4>
              {item.myReview && (
                <span className="text-[10px] uppercase tracking-widest text-brand-green">Yuborilgan</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {item.githubUrl && (
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white"
                >
                  <Github size={14} /> Kod
                </a>
              )}
              {item.demoUrl && (
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-brand-cyan hover:underline"
                >
                  <ExternalLink size={14} /> Demo
                </a>
              )}
            </div>

            {item.content && (
              <p className="text-sm text-gray-400 bg-black/30 rounded p-3 whitespace-pre-wrap">{item.content}</p>
            )}

            <label className="block">
              <span className="text-xs text-gray-400 flex items-center gap-1.5 mb-1">
                <ThumbsUp size={12} /> Nima yaxshi bajarilgan?
              </span>
              <textarea
                value={draft.strengths}
                onChange={(e) =>
                  setDrafts((d) => ({ ...d, [item.submissionId]: { ...draft, strengths: e.target.value } }))
                }
                rows={2}
                className="w-full bg-black/40 border border-brand-border rounded p-2 text-sm focus:border-brand-purple outline-none"
                placeholder="Masalan: o'zgaruvchi nomlari tushunarli, kod bo'limlarga ajratilgan."
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-400 mb-1 block">Bitta aniq taklif</span>
              <textarea
                value={draft.suggestions}
                onChange={(e) =>
                  setDrafts((d) => ({ ...d, [item.submissionId]: { ...draft, suggestions: e.target.value } }))
                }
                rows={2}
                className="w-full bg-black/40 border border-brand-border rounded p-2 text-sm focus:border-brand-purple outline-none"
                placeholder="Masalan: takrorlanayotgan qismni funksiyaga chiqarsa bo'lardi."
              />
            </label>

            <button
              type="button"
              onClick={() =>
                submit.mutate({
                  submissionId: item.submissionId,
                  strengths: draft.strengths,
                  suggestions: draft.suggestions,
                })
              }
              disabled={!ready || submit.isPending}
              className="px-4 py-2 bg-brand-purple text-white font-bold rounded hover:bg-brand-purple/90 disabled:opacity-40 text-sm flex items-center gap-2"
            >
              {submit.isPending && <Loader2 size={14} className="animate-spin" />}
              {item.myReview ? 'Yangilash' : 'Yuborish'}
            </button>
          </article>
        );
      })}
    </div>
  );
}
