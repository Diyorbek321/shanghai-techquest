import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookText,
  Clock,
  CheckCircle2,
  ChevronRight,
  FileText
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatRelativeTime } from '../lib/utils';

interface HomeworkItem {
  id: string;
  title: string;
  course: string;
  track: string;
  dueDate: string;
  completed: boolean;
}

type Filter = 'all' | 'pending' | 'completed';

export function Homework() {
  const [filter, setFilter] = useState<Filter>('all');
  const queryClient = useQueryClient();

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
    </div>
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
