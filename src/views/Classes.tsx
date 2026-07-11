import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Users, Clock, PlayCircle, Plus } from 'lucide-react';
import { ViewType, Track, User } from '../types';
import { api, ApiError } from '../lib/api';

interface ClassGroup {
  id: string;
  title: string;
  track: Track;
  teacherName: string;
  schedule: string | null;
  studentCount: number;
}

const TRACK_STYLE: Record<Track, { bg: string; text: string; badge: string; view: ViewType }> = {
  frontend: { bg: 'bg-brand-cyan/10', text: 'text-brand-cyan', badge: 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30', view: 'frontend_course' },
  robotics: { bg: 'bg-brand-purple/10', text: 'text-brand-purple', badge: 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30', view: 'robotics_lab' },
  office: { bg: 'bg-blue-500/10', text: 'text-blue-500', badge: 'bg-blue-500/20 text-blue-500 border border-blue-500/30', view: 'office_course' },
};

const TRACK_LABEL: Record<Track, string> = {
  frontend: 'Frontend',
  robotics: 'Robototexnika',
  office: 'Ofis',
};

export function Classes({ user, onNavigate }: { user: User; onNavigate: (view: ViewType) => void }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const canCreate = user.role === 'teacher' || user.role === 'admin';

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get<ClassGroup[]>('/classes'),
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1">Mening Sinflarim</h1>
          <p className="text-gray-400">Faol kurslaringiz va yaqinlashib kelayotgan darslarni boshqaring.</p>
        </div>
        {canCreate && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan border border-brand-cyan/50 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} /> Yangi sinf
          </motion.button>
        )}
      </div>

      {isLoading && <p className="text-sm text-gray-500 mt-8">Sinflar yuklanmoqda...</p>}
      {!isLoading && classes.length === 0 && <p className="text-sm text-gray-500 mt-8">Siz hali birorta sinfga yozilmagansiz.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {classes.map((cls) => {
          const style = TRACK_STYLE[cls.track];
          return (
            <div key={cls.id} className="glass-panel overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className={`h-32 flex items-center justify-center border-b border-brand-border relative ${style.bg}`}>
                <BookOpen size={48} className={`opacity-50 ${style.text}`} />
              </div>

              <div className="p-5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block ${style.badge}`}>
                  {TRACK_LABEL[cls.track]}
                </span>
                <h3 className="font-bold text-lg leading-tight mb-1">{cls.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <Users size={14} />
                  <span>{cls.teacherName} &bull; {cls.studentCount} o'quvchi</span>
                </div>

                {cls.schedule && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 bg-black/30 p-2 rounded border border-brand-border">
                    <Clock size={14} className="text-brand-orange" />
                    {cls.schedule}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate(style.view)}
                  className="w-full bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan border border-brand-cyan/50 font-medium py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <PlayCircle size={16} /> Davom ettirish
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>

      <CreateClassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}

function CreateClassModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [track, setTrack] = useState<Track>('frontend');
  const [schedule, setSchedule] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => api.post('/classes', { title, track, schedule: schedule || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setTitle('');
      setTrack('frontend');
      setSchedule('');
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
            className="relative w-full max-w-md glass-panel p-8 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-heading font-bold text-white">Yangi sinf yaratish</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white p-2">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Sinf nomi</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                />
              </div>
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
                <label className="block text-xs text-gray-400 mb-1">Jadval (ixtiyoriy)</label>
                <input
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="Masalan: Dush/Chor/Juma 16:00"
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                />
              </div>

              {error && <p className="text-xs text-brand-red">{error}</p>}

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan border border-brand-cyan/50 font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Yaratilmoqda...' : 'Sinf yaratish'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
