import React, { useState } from 'react';
import { Loader2, Plus, Target, Trash2, Trophy } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/utils';

export interface ClassGoal {
  id: string;
  classId: string;
  title: string;
  metric: 'PROBLEMS_SOLVED' | 'DAILY_EXERCISES' | 'HOMEWORK_DONE';
  startsAt: string;
  endsAt: string;
  current: number;
  target: number;
  percent: number;
  reached: boolean;
  xpReward: number;
  rewarded: boolean;
}

export const METRIC_LABEL: Record<ClassGoal['metric'], string> = {
  PROBLEMS_SOLVED: 'Yechilgan masalalar',
  DAILY_EXERCISES: 'Kundalik mashqlar',
  HOMEWORK_DONE: 'Bajarilgan uy vazifasi',
};

/** Monday-to-Monday, the natural unit for a school week. */
function defaultWindow(): { startsAt: string; endsAt: string } {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const next = new Date(monday);
  next.setDate(monday.getDate() + 7);
  return { startsAt: monday.toISOString().slice(0, 10), endsAt: next.toISOString().slice(0, 10) };
}

export function ClassGoalsPanel({ classId }: { classId: string | null }) {
  const initial = defaultWindow();
  const [title, setTitle] = useState('');
  const [metric, setMetric] = useState<ClassGoal['metric']>('PROBLEMS_SOLVED');
  const [target, setTarget] = useState('50');
  const [xpReward, setXpReward] = useState('100');
  const [startsAt, setStartsAt] = useState(initial.startsAt);
  const [endsAt, setEndsAt] = useState(initial.endsAt);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['class-goals', classId],
    queryFn: () => api.get<ClassGoal[]>(`/class-goals?classId=${classId}`),
    enabled: !!classId,
  });

  const create = useMutation({
    mutationFn: () =>
      api.post('/class-goals', {
        classId,
        title: title.trim(),
        metric,
        target: Number(target),
        xpReward: Number(xpReward),
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
      }),
    onSuccess: () => {
      setTitle('');
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['class-goals'] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/class-goals/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['class-goals'] }),
  });

  if (!classId) return <p className="text-sm text-gray-500">Avval sinf tanlang.</p>;

  const ready = title.trim() && Number(target) > 0 && startsAt && endsAt;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
          <Target size={16} className="text-brand-cyan" /> Sinf maqsadi qo'yish
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Butun sinf birgalikda erishadigan maqsad. Bajarilganda har bir o'quvchi XP oladi.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Maqsad nomi (masalan: Shu hafta 50 ta masala)"
            className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan"
          />
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as ClassGoal['metric'])}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan"
          >
            {Object.entries(METRIC_LABEL).map(([value, label]) => (
              <option key={value} value={value} className="bg-brand-bg">{label}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Nishon"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan"
          />
          <input
            type="date"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan"
          />
          <input
            type="date"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan"
          />
          <input
            type="number"
            min={0}
            value={xpReward}
            onChange={(e) => setXpReward(e.target.value)}
            placeholder="Har bir o'quvchiga XP"
            className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            disabled={!ready || create.isPending}
            onClick={() => create.mutate()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-cyan text-black disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >
            {create.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Maqsad qo'yish
          </button>
        </div>
        {error && <p className="mt-3 text-xs text-brand-red">{error}</p>}
      </div>

      <div className="glass-panel border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest p-6 pb-4 flex items-center gap-2">
          <Trophy size={16} className="text-brand-orange" /> Joriy maqsadlar
        </h3>
        {isLoading && <p className="px-6 pb-6 text-sm text-gray-500">Yuklanmoqda...</p>}
        {!isLoading && goals.length === 0 && <p className="px-6 pb-6 text-sm text-gray-500">Hali maqsad qo'yilmagan.</p>}
        <div className="divide-y divide-white/5">
          {goals.map((goal) => (
            <div key={goal.id} className="px-6 py-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    {goal.title}
                    {goal.reached && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-green/20 text-brand-green">Bajarildi</span>}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {METRIC_LABEL[goal.metric]} · {formatDate(goal.startsAt)} — {formatDate(goal.endsAt)}
                    {goal.xpReward > 0 && ` · +${goal.xpReward} XP`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove.mutate(goal.id)}
                  className="p-2 rounded-lg text-gray-500 hover:text-brand-red transition-colors"
                  title="O'chirish"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <GoalBar percent={goal.percent} current={goal.current} target={goal.target} reached={goal.reached} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GoalBar({ percent, current, target, reached }: { percent: number; current: number; target: number; reached: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${reached ? 'bg-brand-green' : 'bg-brand-cyan'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs font-black font-mono text-white whitespace-nowrap">
        {current}/{target}
      </span>
    </div>
  );
}
