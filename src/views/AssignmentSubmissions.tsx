import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Github, ExternalLink, CheckCircle2, Clock, FileText, Star } from 'lucide-react';
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

function GradeControl({
  submissionId,
  onGrade,
  isPending,
  error,
}: {
  submissionId: string;
  onGrade: (score: number) => void;
  isPending: boolean;
  error: unknown;
}) {
  const [score, setScore] = useState('');

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
