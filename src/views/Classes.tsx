import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, Clock, PlayCircle, Plus, Pencil } from 'lucide-react';
import { ViewType, Track, User } from '../types';
import { api } from '../lib/api';
import { TRACK_LABEL, TRACK_STYLE } from '../lib/tracks';
import { ClassFormModal, EditableClass } from '../components/ClassFormModal';

interface ClassGroup {
  id: string;
  title: string;
  track: Track;
  teacherName: string;
  schedule: string | null;
  studentCount: number;
}


export function Classes({ user, onNavigate }: { user: User; onNavigate: (view: ViewType) => void }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<EditableClass | undefined>(undefined);
  const canCreate = user.role === 'teacher' || user.role === 'admin';

  const openCreate = () => {
    setEditing(undefined);
    setIsFormOpen(true);
  };

  const openEdit = (cls: ClassGroup) => {
    setEditing({ id: cls.id, title: cls.title, track: cls.track, schedule: cls.schedule });
    setIsFormOpen(true);
  };

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
            onClick={openCreate}
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
                {canCreate && (
                  <button
                    onClick={() => openEdit(cls)}
                    title="Sinfni tahrirlash"
                    className="absolute top-3 right-3 p-2 bg-black/50 rounded-lg text-gray-300 hover:text-white border border-white/10 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                )}
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

      <ClassFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} editing={editing} />
    </div>
  );
}
