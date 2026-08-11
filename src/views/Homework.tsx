import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookText,
  Clock,
  CheckCircle2,
  ChevronRight,
  FileText,
  Plus
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';
import { TRACK_LABEL } from '../lib/tracks';
import { formatRelativeTime } from '../lib/utils';
import { Track, User } from '../types';

interface HomeworkItem {
  id: string;
  title: string;
  course: string;
  track: string;
  dueDate: string;
  completed: boolean;
}

type Filter = 'all' | 'pending' | 'completed';

export function Homework({ user }: { user: User }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();
  const canCreate = user.role === 'teacher' || user.role === 'admin';

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['homework'],
    queryFn: () => api.get<HomeworkItem[]>('/homework'),
  });

  const toggleComplete = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      api.patch(`/homework/${id}`, { completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['homework'] }),
  });

  const pendingCount = items.filter((i) => !i.completed).length;
  const completedCount = items.filter((i) => i.completed).length;
  const visibleItems = items.filter((i) => {
    if (filter === 'pending') return !i.completed;
    if (filter === 'completed') return i.completed;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-orange/10 rounded-2xl border border-brand-orange/20">
            <BookText size={32} className="text-brand-orange" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">Kunlik uy vazifasi</h1>
            <p className="text-xs text-gray-500 font-mono">Kichik topshiriqlar va bilimlarni mustahkamlash</p>
          </div>
        </div>
        {canCreate && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-brand-orange/20 hover:bg-brand-orange/30 text-brand-orange border border-brand-orange/50 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} /> Yangi uy vazifasi
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusFilter label="Barcha vazifalar" count={items.length} active={filter === 'all'} onClick={() => setFilter('all')} />
        <StatusFilter label="Kutilmoqda" count={pendingCount} active={filter === 'pending'} onClick={() => setFilter('pending')} />
        <StatusFilter label="Bajarilgan" count={completedCount} active={filter === 'completed'} onClick={() => setFilter('completed')} />
      </div>

      {isLoading && <p className="text-sm text-gray-500">Uy vazifalari yuklanmoqda...</p>}
      {!isLoading && visibleItems.length === 0 && <p className="text-sm text-gray-500">Bu yerda uy vazifasi yo'q.</p>}

      <div className="space-y-4">
        {visibleItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-panel p-5 border border-white/10 bg-black/40 group hover:border-brand-orange/40 transition-all flex flex-col md:flex-row items-center gap-6 ${
              item.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-brand-cyan/10 text-brand-cyan">
              <FileText size={24} />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-white text-lg group-hover:text-brand-orange transition-colors">{item.title}</h3>
                <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10 font-mono">{item.course}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock size={12} /> {formatRelativeTime(item.dueDate)}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className={`text-[10px] font-black uppercase tracking-widest ${item.completed ? 'text-brand-green' : 'text-brand-orange'}`}>
                {item.completed ? 'bajarildi' : 'kutilmoqda'}
              </span>

              <button
                onClick={() => toggleComplete.mutate({ id: item.id, completed: !item.completed })}
                className={`p-3 rounded-xl transition-all ${
                  item.completed
                    ? 'bg-brand-green/20 text-brand-green'
                    : 'bg-white/5 text-gray-400 group-hover:bg-brand-orange group-hover:text-black'
                }`}
              >
                {item.completed ? <CheckCircle2 size={20} /> : <ChevronRight size={20} />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {canCreate && <CreateHomeworkModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}

function CreateHomeworkModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  // No default: a pre-selected track is how work kept landing on 'frontend'
  // when the teacher never opened the dropdown.
  const [track, setTrack] = useState<Track | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => api.post('/homework', { title, course, track, dueDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homework'] });
      setTitle('');
      setCourse('');
      setTrack('');
      setDueDate('');
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
              <h2 className="text-xl font-heading font-bold text-white">Yangi uy vazifasi yaratish</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white p-2">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Vazifa nomi</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Kurs</label>
                <input
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="Masalan: JavaScript asoslari"
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Yo'nalish</label>
                <select
                  required
                  value={track}
                  onChange={(e) => setTrack(e.target.value as Track)}
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange"
                >
                  <option value="" disabled className="bg-brand-bg">Yo'nalishni tanlang</option>
                  {Object.entries(TRACK_LABEL).map(([value, label]) => (
                    <option key={value} value={value} className="bg-brand-bg">{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Topshirish muddati</label>
                <input
                  required
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              {error && <p className="text-xs text-brand-red">{error}</p>}

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-brand-orange/20 hover:bg-brand-orange/30 text-brand-orange border border-brand-orange/50 font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
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

function StatusFilter({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all text-left ${
        active ? 'bg-brand-orange/10 border-brand-orange/50' : 'bg-black/40 border-white/10 hover:border-white/20'
      }`}
    >
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black italic ${active ? 'text-brand-orange' : 'text-white'}`}>{count}</p>
    </button>
  );
}
