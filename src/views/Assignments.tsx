import React from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ViewType, Track, User } from '../types';
import { api } from '../lib/api';
import { formatRelativeTime } from '../lib/utils';

interface Assignment {
  id: string;
  title: string;
  track: Track;
  dueDate: string;
  xpReward: number;
  submission: { status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'LATE' } | null;
}

const TRACK_BADGE: Record<Track, string> = {
  frontend: 'bg-brand-cyan/20 text-brand-cyan',
  robotics: 'bg-brand-purple/20 text-brand-purple',
  office: 'bg-blue-500/20 text-blue-400',
};

const TRACK_LABEL: Record<Track, string> = {
  frontend: 'Frontend',
  robotics: 'Robototexnika',
  office: 'Ofis',
};

type Column = 'todo' | 'submitted' | 'graded';

function columnFor(a: Assignment): Column {
  if (!a.submission) return 'todo';
  if (a.submission.status === 'GRADED') return 'graded';
  return 'submitted';
}

const COLUMNS: { id: Column; title: string; color: string; border: string }[] = [
  { id: 'todo', title: 'Bajarilishi kerak', color: 'text-gray-400', border: 'border-gray-500/50' },
  { id: 'submitted', title: 'Topshirilgan', color: 'text-brand-purple', border: 'border-brand-purple/50' },
  { id: 'graded', title: 'Baholangan', color: 'text-brand-green', border: 'border-brand-green/50' },
];

interface AssignmentsProps {
  user: User;
  onNavigate: (view: ViewType) => void;
  onSelectAssignment: (id: string) => void;
}

export function Assignments({ user, onNavigate, onSelectAssignment }: AssignmentsProps) {
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => api.get<Assignment[]>('/assignments'),
  });

  const isReviewer = user.role === 'teacher' || user.role === 'admin';

  const openDetail = (id: string) => {
    onSelectAssignment(id);
    onNavigate(isReviewer ? 'assignment_submissions' : 'assignment_detail');
  };

  return (
    <div className="h-full flex flex-col space-y-6 max-w-[1600px] mx-auto">
      <div className="shrink-0">
        <h1 className="font-heading text-3xl font-bold tracking-tight mb-1">Vazifalar taxtasi</h1>
        <p className="text-gray-400">Missiyalaringizni kuzating va boshqaring.</p>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Vazifalar yuklanmoqda...</p>}

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {COLUMNS.map(col => {
          const colAssignments = assignments.filter(a => columnFor(a) === col.id);
          return (
            <div key={col.id} className="flex-shrink-0 w-80 flex flex-col h-full bg-black/20 rounded-xl border border-brand-border">
              <div className={`p-4 border-b ${col.border} flex justify-between items-center bg-black/40 rounded-t-xl`}>
                <h3 className={`font-semibold ${col.color} flex items-center gap-2`}>
                  {col.title}
                  <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full">{colAssignments.length}</span>
                </h3>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {colAssignments.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="glass-panel p-4 cursor-pointer hover:border-brand-cyan/50 hover:shadow-[0_0_15px_rgba(0,217,255,0.1)] transition-colors"
                    onClick={() => openDetail(task.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${TRACK_BADGE[task.track]}`}>
                        {TRACK_LABEL[task.track]}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm mb-3 leading-snug">{task.title}</h4>

                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-mono font-bold text-brand-purple">{task.xpReward} XP</span>
                    </div>

                    <div className="pt-3 border-t border-brand-border flex justify-between items-center">
                      <div className="text-xs flex items-center gap-1 text-gray-400">
                        <Clock size={12} />
                        {formatRelativeTime(task.dueDate)}
                      </div>
                      {col.id === 'todo' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); openDetail(task.id); }}
                          className="text-xs bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 px-2 py-1 rounded transition-colors"
                        >
                          Boshlash
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
