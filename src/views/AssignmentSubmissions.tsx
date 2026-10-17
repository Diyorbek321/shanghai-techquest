import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Github, ExternalLink, CheckCircle2, Clock, FileText, Loader2, Sparkles, Star } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';
import { formatRelativeTime } from '../lib/utils';

type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'GRADED' | 'LATE';

interface SubmissionRow {
  id: string;
  githubUrl: string | null;
  demoUrl: string | null;
  fileUrl: string | null;
  fileName: string | null;
  content: string | null;
  status: SubmissionStatus;
  submittedAt: string | null;
  user: { id: string; name: string; avatarUrl: string | null };
  aiReview: AiReview | null;
}

interface AiReview {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}

interface AssignmentSummary {
  id: string;
  title: string;
  description: string;
}

interface AssignmentSubmissionsProps {
  assignmentId: string | null;
  onBack: () => void;
}

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  PENDING: 'Kutilmoqda',
  SUBMITTED: 'Topshirilgan',
  GRADED: 'Baholangan',
  LATE: 'Kechikkan',
};

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  PENDING: 'text-gray-400 border-gray-500/50',
  SUBMITTED: 'text-brand-cyan border-brand-cyan/50',
  GRADED: 'text-brand-green border-brand-green/50',
  LATE: 'text-brand-orange border-brand-orange/50',
};

export function AssignmentSubmissions({ assignmentId, onBack }: AssignmentSubmissionsProps) {
  const queryClient = useQueryClient();

  const { data: assignment } = useQuery({
    queryKey: ['assignments', assignmentId],
    queryFn: () => api.get<AssignmentSummary>(`/assignments/${assignmentId}`),
    enabled: !!assignmentId,
  });

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['assignments', assignmentId, 'submissions'],
    queryFn: () => api.get<SubmissionRow[]>(`/assignments/${assignmentId}/submissions`),
    enabled: !!assignmentId,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SubmissionStatus }) =>
      api.patch(`/submissions/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', assignmentId, 'submissions'] });
    },
  });

  const gradeSubmission = useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) =>
      api.patch(`/submissions/${id}`, { status: 'GRADED', score, maxScore: 100 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', assignmentId, 'submissions'] });
    },
  });

  // Scores the teacher chose to copy from the AI panel into the grade box.
  const [applied, setApplied] = useState<Record<string, number>>({});

  const aiReview = useMutation({
    mutationFn: (id: string) => api.post<{ aiReview: AiReview }>(`/submissions/${id}/ai-review`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', assignmentId, 'submissions'] });
    },
  });

  if (!assignmentId) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Vazifalarga qaytish
        </button>
        <p className="text-gray-500 mt-8">Vazifa tanlanmagan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
      >
        <ArrowLeft size={16} /> Vazifalarga qaytish
      </button>

      {assignment && (
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">{assignment.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{assignment.description}</p>
        </div>
      )}

      {isLoading && <p className="text-sm text-gray-500">Topshiriqlar yuklanmoqda...</p>}
      {!isLoading && submissions.length === 0 && (
        <p className="text-sm text-gray-500">Bu vazifa uchun hali topshiriqlar yo'q.</p>
      )}

      <div className="space-y-4">
        {submissions.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 border border-white/10 bg-black/40 space-y-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={s.user.avatarUrl ?? undefined}
                  alt=""
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5"
                />
                <div>
                  <p className="text-sm font-bold text-white">{s.user.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                    <Clock size={10} />
                    {s.submittedAt ? formatRelativeTime(s.submittedAt) : "Hali topshirilmagan"}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${STATUS_COLORS[s.status]}`}>
                {STATUS_LABELS[s.status]}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              {s.githubUrl && (
                <a
                  href={s.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 text-xs text-brand-cyan hover:underline"
                >
                  <Github size={14} /> Repozitoriy
                </a>
              )}
              {s.demoUrl && (
                <a
                  href={s.demoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 text-xs text-brand-cyan hover:underline"
                >
                  <ExternalLink size={14} /> Jonli demo
                </a>
              )}
              {s.fileUrl && (
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 text-xs text-brand-cyan hover:underline"
                >
                  <FileText size={14} /> {s.fileName ?? 'Yuklangan fayl'}
                </a>
              )}
            </div>

            {s.content && (
              <p className="text-gray-400 text-xs whitespace-pre-line border-t border-white/5 pt-3">{s.content}</p>
            )}

            {s.content && (
              <AiReviewPanel
                review={s.aiReview}
                isPending={aiReview.isPending && aiReview.variables === s.id}
                error={aiReview.isError && aiReview.variables === s.id ? aiReview.error : null}
                onRequest={() => aiReview.mutate(s.id)}
                onApply={(score) => setApplied((prev) => ({ ...prev, [s.id]: score }))}
              />
            )}

            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Holat:</label>
                <select
                  value={s.status}
                  onChange={(e) => updateStatus.mutate({ id: s.id, status: e.target.value as SubmissionStatus })}
                  disabled={updateStatus.isPending}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple"
                >
                  {(Object.keys(STATUS_LABELS) as SubmissionStatus[])
                    .filter((status) => status !== 'GRADED')
                    .map((status) => (
                      <option key={status} value={status} className="bg-brand-bg">{STATUS_LABELS[status]}</option>
                    ))}
                </select>
                {s.status === 'GRADED' && <CheckCircle2 size={16} className="text-brand-green" />}
              </div>

              <GradeControl
                key={`${s.id}-${applied[s.id] ?? ''}`}
                suggestedScore={applied[s.id] ?? null}
                submissionId={s.id}
                onGrade={(score) => gradeSubmission.mutate({ id: s.id, score })}
                isPending={gradeSubmission.isPending}
                error={gradeSubmission.isError && gradeSubmission.variables?.id === s.id ? gradeSubmission.error : null}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * Gemini's suggestion, shown as a starting point. The score reaches the grade
 * box only when the teacher copies it there, and is never submitted for them:
 * the mark a student sees is always the teacher's.
 */
function AiReviewPanel({
  review,
  isPending,
  error,
  onRequest,
  onApply,
}: {
  review: AiReview | null;
  isPending: boolean;
  error: unknown;
  onRequest: () => void;
  onApply: (score: number) => void;
}) {
  return (
    <div className="rounded-lg border border-brand-purple/30 bg-brand-purple/5 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase font-bold tracking-widest text-brand-purple flex items-center gap-1">
          <Sparkles size={12} /> AI tavsiyasi{review ? `: ${review.score}/100` : ''}
        </p>
        <button
          onClick={onRequest}
          disabled={isPending}
          className="text-[10px] text-brand-purple hover:underline disabled:opacity-50 flex items-center gap-1"
        >
          {isPending && <Loader2 size={10} className="animate-spin" />}
          {review ? 'Qayta tekshirish' : 'AI bilan tekshirish'}
        </button>
      </div>
      {review ? (
        <>
          <p className="text-xs text-gray-300">{review.summary}</p>
          {review.strengths.length > 0 && (
            <ul className="text-[11px] text-brand-green list-disc list-inside">
              {review.strengths.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
          {review.improvements.length > 0 && (
            <ul className="text-[11px] text-brand-orange list-disc list-inside">
              {review.improvements.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onApply(review.score)}
              className="text-[10px] bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple border border-brand-purple/40 px-2 py-1 rounded"
            >
              Ballni qo'yish ({review.score})
            </button>
            <span className="text-[10px] text-gray-500">Ishni o'zingiz ko'rib, keyin tasdiqlang.</span>
          </div>
        </>
      ) : (
        <p className="text-[11px] text-gray-500">Hali tekshirilmagan.</p>
      )}
      {Boolean(error) && (
        <p className="text-[10px] text-brand-red">{error instanceof ApiError ? error.message : 'Xatolik.'}</p>
      )}
    </div>
  );
}

function GradeControl({
  submissionId,
  suggestedScore,
  onGrade,
  isPending,
  error,
}: {
  submissionId: string;
  suggestedScore: number | null;
  onGrade: (score: number) => void;
  isPending: boolean;
  error: unknown;
}) {
  const [score, setScore] = useState(suggestedScore === null ? '' : String(suggestedScore));

  const handleSubmit = () => {
    const value = Number(score);
    if (Number.isFinite(value) && value >= 0) {
      onGrade(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={`score-${submissionId}`} className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
        Ball (100 dan):
      </label>
      <input
        id={`score-${submissionId}`}
        type="number"
        min={0}
        max={100}
        value={score}
        onChange={(e) => setScore(e.target.value)}
        className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-green"
      />
      <button
        onClick={handleSubmit}
        disabled={isPending || score === ''}
        className="flex items-center gap-1 text-xs bg-brand-green/10 hover:bg-brand-green/20 text-brand-green border border-brand-green/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        <Star size={12} /> Baholash
      </button>
      {Boolean(error) && (
        <span className="text-[10px] text-brand-red">{error instanceof ApiError ? error.message : 'Xatolik.'}</span>
      )}
    </div>
  );
}
