import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
  Paperclip,
  FileText
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PeerReviewPanel } from '../components/PeerReviewPanel';
import { api } from '../lib/api';
import { formatRelativeTime } from '../lib/utils';
import { trackLabel } from '../lib/tracks';

interface AssignmentDetailData {
  id: string;
  title: string;
  description: string;
  track: string;
  dueDate: string;
  xpReward: number;
  moduleKey: string | null;
  submission: {
    id: string;
    githubUrl: string | null;
    demoUrl: string | null;
    fileUrl: string | null;
    fileName: string | null;
    content: string | null;
    status: string;
  } | null;
}

interface AssignmentDetailProps {
  assignmentId: string | null;
  onBack: () => void;
  onTriggerSuccess: () => void;
}


export function AssignmentDetail({ assignmentId, onBack, onTriggerSuccess }: AssignmentDetailProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [comments, setComments] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: assignment, isLoading } = useQuery({
    queryKey: ['assignments', assignmentId],
    queryFn: () => api.get<AssignmentDetailData>(`/assignments/${assignmentId}`),
    enabled: !!assignmentId,
  });

  const submit = useMutation({
    mutationFn: async (payload: { githubUrl?: string; demoUrl?: string; content?: string; file: File | null }) => {
      let fileUrl: string | undefined;
      let fileName: string | undefined;
      if (payload.file) {
        const uploaded = await api.upload<{ url: string; fileName: string }>('/uploads', payload.file);
        fileUrl = uploaded.url;
        fileName = uploaded.fileName;
      }
      return api.post(`/assignments/${assignmentId}/submissions`, {
        githubUrl: payload.githubUrl,
        demoUrl: payload.demoUrl,
        content: payload.content,
        fileUrl,
        fileName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      onTriggerSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl && !file) {
      setSubmitError("GitHub havolasi yoki fayl biriktirilishi shart.");
      return;
    }
    setSubmitError(null);
    submit.mutate({
      githubUrl: repoUrl || undefined,
      demoUrl: demoUrl || undefined,
      content: comments || undefined,
      file,
    });
  };

  if (!assignmentId) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Missiyalarga qaytish
        </button>
        <p className="text-gray-500 mt-8">Vazifa tanlanmagan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
      >
        <ArrowLeft size={16} /> Missiyalarga qaytish
      </button>

      {isLoading && <p className="text-sm text-gray-500">Vazifa yuklanmoqda...</p>}

      {assignment && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-8 border border-white/10 bg-black/40 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">{assignment.title}</h1>
                  <p className="text-brand-purple font-bold text-sm uppercase">{trackLabel(assignment.track)} yo'nalishi</p>
                </div>
                <div className="px-3 py-1 bg-brand-orange/20 border border-brand-orange/50 text-brand-orange text-[10px] font-black rounded-full whitespace-nowrap">
                  {assignment.moduleKey ? "O'z tezligingizda" : formatRelativeTime(assignment.dueDate)}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Maqsad va topshiriq</h3>
                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{assignment.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">XP mukofoti</p>
                  <p className="text-xl font-black text-white italic">+{assignment.xpReward} XP</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Holati</p>
                  <p className="text-xl font-black text-brand-cyan italic">{assignment.submission?.status ?? 'PENDING'}</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 border border-white/10 bg-black/40">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Sizning topshiriqingiz</h3>

              {assignment.submission ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-brand-green/10 border border-brand-green/30 rounded-2xl flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center text-brand-green">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-3 w-full">
                    <h4 className="text-white font-bold">Missiya yuborildi!</h4>
                    <div className="flex flex-col items-center gap-2">
                      {assignment.submission.githubUrl && (
                        <a
                          href={assignment.submission.githubUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center gap-2 text-xs text-brand-cyan hover:underline"
                        >
                          <Github size={14} /> {assignment.submission.githubUrl}
                        </a>
                      )}
                      {assignment.submission.demoUrl && (
                        <a
                          href={assignment.submission.demoUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center gap-2 text-xs text-brand-cyan hover:underline"
                        >
                          <ExternalLink size={14} /> {assignment.submission.demoUrl}
                        </a>
                      )}
                      {assignment.submission.fileUrl && (
                        <a
                          href={assignment.submission.fileUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center gap-2 text-xs text-brand-cyan hover:underline"
                        >
                          <FileText size={14} /> {assignment.submission.fileName ?? 'Yuklangan fayl'}
                        </a>
                      )}
                    </div>
                    {assignment.submission.content && (
                      <p className="text-gray-400 text-xs mt-1 whitespace-pre-line">{assignment.submission.content}</p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="url"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="https://github.com/username/repo (yoki quyida fayl biriktiring)"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-all"
                      />
                    </div>
                    <div className="relative">
                      <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="url"
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                        placeholder="Jonli demo URL (Vercel/Netlify)"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-all"
                      />
                    </div>
                    <label className="flex items-center gap-3 w-full bg-black/40 border border-dashed border-white/20 rounded-xl py-3 px-4 text-sm text-gray-400 cursor-pointer hover:border-brand-purple transition-all">
                      <Paperclip size={18} className="text-gray-500 shrink-0" />
                      <span className="flex-1 truncate">{file ? file.name : 'Fayl biriktirish (docx, xlsx, pptx, pdf, rasm...)'}</span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.xlsx,.pptx,.png,.jpg,.jpeg,.zip"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">O'qituvchiga izoh</label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Arxitektura tanlovlaringizni qisqacha tushuntiring..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-all min-h-[100px]"
                    />
                  </div>

                  {(submitError || submit.isError) && (
                    <p className="text-xs text-red-400">
                      {submitError ?? (submit.error instanceof Error ? submit.error.message : "Xatolik yuz berdi.")}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submit.isPending}
                    className="w-full py-4 bg-brand-purple text-white font-black rounded-xl hover:bg-brand-purple/80 disabled:opacity-60 transition-all shadow-[0_0_30px_rgba(176,38,255,0.3)] uppercase text-sm flex items-center justify-center gap-2"
                  >
                    <Send size={18} /> {submit.isPending ? 'Yuborilmoqda...' : 'Missiyani yakunlash'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 border border-white/10 bg-black/40">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">O'qituvchi fikri</h3>
              <div className="flex items-center gap-3 text-gray-500">
                <Clock size={20} />
                <p className="text-xs italic">Hozircha fikr yo'q. Topshirgandan so'ng qayta tekshiring.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Peer review opens only once this student has handed in — otherwise the
          queue is a way to read worked solutions before writing your own. The
          server enforces this too; this just avoids showing a locked panel. */}
      {assignment?.submission && (
        <div className="glass-panel p-6">
          <PeerReviewPanel assignmentId={assignment.id} />
        </div>
      )}
    </div>
  );
}
