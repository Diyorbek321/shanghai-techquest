import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ViewType, Track, User } from '../types';
import { api, ApiError } from '../lib/api';
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
  const [isFormOpen, setIsFormOpen] = useState(false);
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
      <div className="shrink-0 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1">Vazifalar taxtasi</h1>
          <p className="text-gray-400">Missiyalaringizni kuzating va boshqaring.</p>
        </div>
        {isReviewer && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple border border-brand-purple/50 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} /> Yangi vazifa
          </motion.button>
        )}
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

      <CreateAssignmentModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}

interface ClassOption {
  id: string;
  title: string;
  track: Track;
}

function CreateAssignmentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [track, setTrack] = useState<Track>('frontend');
  const [classId, setClassId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [xpReward, setXpReward] = useState(50);
  const [error, setError] = useState<string | null>(null);

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get<ClassOption[]>('/classes'),
    enabled: isOpen,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      api.post('/assignments', {
        title,
        description,
        track,
        classId: classId || undefined,
        dueDate,
        xpReward,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setTitle('');
      setDescription('');
      setTrack('frontend');
      setClassId('');
      setDueDate('');
      setXpReward(50);
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Xatolik yuz berdi.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    createMutation.mutate();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg glass-panel p-8 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-heading font-bold text-white">Yangi vazifa yaratish</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white p-2">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Sarlavha</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tavsif</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Yo'nalish</label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value as Track)}
                    className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                  >
                    <option value="frontend" className="bg-brand-bg">Frontend</option>
                    <option value="robotics" className="bg-brand-bg">Robototexnika</option>
                    <option value="office" className="bg-brand-bg">Ofis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Sinf (ixtiyoriy)</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                  >
                    <option value="" className="bg-brand-bg">—</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id} className="bg-brand-bg">{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Muddat</label>
                  <input
                    required
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">XP mukofot</label>
                  <input
                    type="number"
                    min={0}
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-brand-red">{error}</p>}

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple border border-brand-purple/50 font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Yaratilmoqda...' : 'Vazifa yaratish'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
