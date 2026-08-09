import React from 'react';
import { Target, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';
import { ClassGoal, GoalBar, METRIC_LABEL } from './teacher/ClassGoalsPanel';

/**
 * The student's view of their cohort's shared targets.
 *
 * Renders nothing when there is no goal — an empty "no goals" card on the
 * dashboard is noise for every class whose teacher has not set one.
 */
export function ClassGoalWidget() {
  const { data: goals = [] } = useQuery({
    queryKey: ['class-goals', 'mine'],
    queryFn: () => api.get<ClassGoal[]>('/class-goals/mine'),
  });

  const active = goals.filter((g) => new Date(g.endsAt) >= new Date() || g.reached);
  if (active.length === 0) return null;

  return (
    <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
        <Target size={16} className="text-brand-cyan" /> Sinf maqsadi
      </h3>
      <div className="space-y-5">
        {active.map((goal) => (
          <div key={goal.id}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  {goal.title}
                  {goal.reached && <Trophy size={14} className="text-brand-green" />}
                </p>
                <p className="text-[10px] text-gray-500 font-mono">
                  {METRIC_LABEL[goal.metric]} · {formatDate(goal.endsAt)} gacha
                  {goal.xpReward > 0 && ` · har biringizga +${goal.xpReward} XP`}
                </p>
              </div>
            </div>
            <GoalBar percent={goal.percent} current={goal.current} target={goal.target} reached={goal.reached} />
            {goal.reached && (
              <p className="mt-2 text-xs text-brand-green">Sinf maqsadga erishdi — barakalla! 🎉</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
