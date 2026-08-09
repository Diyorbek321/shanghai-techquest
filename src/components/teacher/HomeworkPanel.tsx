import React, { useState } from 'react';
import { BookText, Check, Loader2, Plus, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/utils';
import { Track } from '../../types';

/** One assignment rolled up across the class — mirrors GET /api/homework/overview. */
interface HomeworkBatch {
  batchId: string | null;
  title: string;
  course: string;
  dueDate: string;
  total: number;
  completed: number;
  students: { id: string; name: string; avatar: string | null; completed: boolean }[];
}

interface Props {
  classId: string | null;
  track: Track | null;
}

export function HomeworkPanel({ classId, track }: Props) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ['homework', 'overview', classId],
    queryFn: () => api.get<HomeworkBatch[]>(`/homework/overview?classId=${classId}`),
    enabled: !!classId,
  });

  const assign = useMutation({
    mutationFn: () => api.post('/homework', { title, course, track, classId, dueDate: new Date(dueDate).toISOString() }),
    onSuccess: () => {
      setTitle('');
      setCourse('');
      setDueDate('');
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['homework'] });
    },
    onError: (err: Error) => setError(err.message),
  });

  if (!classId) {
    return <p className="text-sm text-gray-500">Avval sinf tanlang.</p>;
  }

  const ready = title.trim() && course.trim() && dueDate;

  return (
    <div className="space-y-6">
      {/* Assign */}
      <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <Plus size={16} className="text-brand-orange" /> Uy vazifasi berish
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Vazifa nomi"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange"
          />
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Fan / mavzu"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">Faqat shu sinf o'quvchilariga yuboriladi.</span>
          <button
            type="button"
            disabled={!ready || assign.isPending}
            onClick={() => assign.mutate()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-orange text-black disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >
            {assign.isPending ? <Loader2 size={14} className="animate-spin" /> : <BookText size={14} />}
            Yuborish
          </button>
        </div>
        {error && <p className="mt-3 text-xs text-brand-red">{error}</p>}
      </div>

      {/* Completion tracking */}
      <div className="glass-panel border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest p-6 pb-4 flex items-center gap-2">
          <BookText size={16} className="text-brand-purple" /> Bajarilganlik nazorati
        </h3>
        {isLoading && <p className="px-6 pb-6 text-sm text-gray-500">Yuklanmoqda...</p>}
        {!isLoading && batches.length === 0 && (
          <p className="px-6 pb-6 text-sm text-gray-500">Bu sinfga hali uy vazifasi berilmagan.</p>
        )}
        <div className="divide-y divide-white/5">
          {batches.map((batch) => {
            const key = batch.batchId ?? `${batch.title}|${batch.dueDate}`;
            const percent = batch.total > 0 ? Math.round((batch.completed / batch.total) * 100) : 0;
            const isOpen = expanded === key;
            return (
              <div key={key}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : key)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{batch.title}</p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {batch.course} · Muddat: {formatDate(batch.dueDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${percent === 100 ? 'bg-brand-green' : 'bg-brand-orange'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs font-black font-mono text-white whitespace-nowrap">
                      {batch.completed}/{batch.total}
                    </span>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {batch.students.map((s) => (
                      <div
                        key={s.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                          s.completed ? 'bg-brand-green/10 text-brand-green' : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        {s.completed ? <Check size={14} /> : <X size={14} />}
                        <span className="truncate">{s.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
