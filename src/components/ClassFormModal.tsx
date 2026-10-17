import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { Track } from '../types';
import { api, ApiError } from '../lib/api';
import { TRACK_LABEL } from '../lib/tracks';
import {
  MAX_LESSONS_PER_DAY,
  WEEKDAYS,
  countsFromLessonDays,
  describeLessonDays,
  lessonDaysFromCounts,
} from '../lib/lessonDays';

const DEFAULT_LESSON_DAYS = [1, 3, 5];

export interface EditableClass {
  id: string;
  title: string;
  track: Track;
  schedule: string | null;
  /** ISO date-time or null; only the date part is edited. */
  startDate: string | null;
  lessonDays: number[];
}

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Omit to create a new cohort; pass a class to edit that one. */
  editing?: EditableClass;
}

interface RetrackSummary {
  studentsMoved: number;
  curriculumRemoved: number;
  curriculumKept: number;
  assignmentsMoved: number;
}

/**
 * Create/edit form for a cohort.
 *
 * The track has no default on create. It used to default to 'frontend', and a
 * teacher who never opened the dropdown produced a frontend cohort whose
 * students inherited a frontend track and then saw the frontend course forever
 * (src/server/routes/classes.ts creates them from the class track). Forcing the
 * choice is what stops that happening again; the edit mode is what repairs the
 * cohorts where it already did.
 */
export function ClassFormModal({ isOpen, onClose, editing }: ClassFormModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [track, setTrack] = useState<Track | ''>('');
  const [schedule, setSchedule] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dayCounts, setDayCounts] = useState<number[]>(() => countsFromLessonDays(DEFAULT_LESSON_DAYS));
  const [error, setError] = useState<string | null>(null);

  // Reopening on a different class must not show the previous one's values.
  useEffect(() => {
    if (!isOpen) return;
    setTitle(editing?.title ?? '');
    setTrack(editing?.track ?? '');
    setSchedule(editing?.schedule ?? '');
    setStartDate(editing?.startDate ? editing.startDate.slice(0, 10) : '');
    setDayCounts(countsFromLessonDays(editing?.lessonDays?.length ? editing.lessonDays : DEFAULT_LESSON_DAYS));
    setError(null);
  }, [isOpen, editing]);

  const trackChanged = Boolean(editing && track && track !== editing.track);
  const lessonDays = lessonDaysFromCounts(dayCounts);
  // Either one moves every homework deadline of the cohort, so it is said out loud.
  const timetableChanged = Boolean(
    editing &&
      ((editing.startDate?.slice(0, 10) ?? '') !== startDate ||
        lessonDaysFromCounts(countsFromLessonDays(editing.lessonDays)).join() !== lessonDays.join())
  );

  const setDayCount = (day: number, count: number) =>
    setDayCounts((prev) => prev.map((value, index) => (index === day ? count : value)));

  const saveMutation = useMutation({
    mutationFn: () => {
      // Editing sends null for an emptied schedule so it can actually be
      // cleared; creating omits it, since the field is not nullable there.
      const body = {
        title,
        track,
        schedule: editing ? schedule || null : schedule || undefined,
        startDate: editing ? startDate || null : startDate || undefined,
        lessonDays,
      };
      return editing
        ? api.patch<{ retrack: RetrackSummary | null }>(`/classes/${editing.id}`, body)
        : api.post<{ retrack: RetrackSummary | null }>('/classes', body);
    },
    onSuccess: (result) => {
      // A track move rewrites the student's own track, their class list and
      // their assignment list, so the whole cached view is stale — a rename
      // only touches the class list.
      if (result?.retrack) {
        queryClient.invalidateQueries();
      } else {
        queryClient.invalidateQueries({ queryKey: ['classes'] });
      }
      if (result?.retrack) {
        const { studentsMoved, curriculumRemoved } = result.retrack;
        window.alert(
          `Sinf yo'nalishi o'zgartirildi.\n` +
            `${studentsMoved} ta o'quvchi yangi yo'nalishga ko'chirildi.\n` +
            `${curriculumRemoved} ta topshirilmagan eski dars vazifasi olib tashlandi.`
        );
      }
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Xatolik yuz berdi.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!track) {
      return setError("Yo'nalishni tanlang.");
    }
    if (lessonDays.length === 0) {
      return setError('Kamida bitta dars kunini belgilang.');
    }
    if (trackChanged && !window.confirm("Sinfdagi barcha o'quvchilar yangi yo'nalishga ko'chiriladi. Davom etilsinmi?")) {
      return;
    }
    saveMutation.mutate();
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
              <h2 className="text-xl font-heading font-bold text-white">
                {editing ? 'Sinfni tahrirlash' : 'Yangi sinf yaratish'}
              </h2>
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
                  required
                  value={track}
                  onChange={(e) => setTrack(e.target.value as Track)}
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                >
                  <option value="" disabled className="bg-brand-bg">Yo'nalishni tanlang</option>
                  {Object.entries(TRACK_LABEL).map(([value, label]) => (
                    <option key={value} value={value} className="bg-brand-bg">{label}</option>
                  ))}
                </select>
              </div>

              {trackChanged && (
                <div className="flex gap-2 text-xs text-brand-orange bg-brand-orange/10 border border-brand-orange/30 rounded-lg p-3">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>
                    Bu sinfdagi barcha o'quvchilarning yo'nalishi ham o'zgaradi va ular yangi kursni ko'radi.
                    Topshirilmagan eski dars vazifalari olib tashlanadi; topshirilganlari saqlanib qoladi.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-400 mb-1">Birinchi dars sanasi</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Vazifa muddatlari va o'quvchilarning kunlik rejasi shu sanadan hisoblanadi.
                </p>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Har kuni nechta dars</label>
                <div className="grid grid-cols-7 gap-1">
                  {WEEKDAYS.map(({ day, short }) => (
                    <label key={day} className="flex flex-col items-center gap-1">
                      <span className="text-[11px] text-gray-400">{short}</span>
                      <select
                        value={dayCounts[day]}
                        onChange={(e) => setDayCount(day, Number(e.target.value))}
                        aria-label={`${short} kuni darslar soni`}
                        className={`w-full bg-black/30 border rounded px-1 py-1 text-sm text-center focus:outline-none focus:border-brand-cyan ${
                          dayCounts[day] > 0 ? 'border-brand-cyan/60 text-brand-cyan' : 'border-brand-border text-gray-500'
                        }`}
                      >
                        {Array.from({ length: MAX_LESSONS_PER_DAY + 1 }, (_, count) => (
                          <option key={count} value={count} className="bg-brand-bg">{count}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  {lessonDays.length > 0 ? describeLessonDays(lessonDays) : 'Dars kuni tanlanmagan'}. 1 dars ≈ 1,5 soat —
                  3 soatlik kun = 2 dars.
                </p>
              </div>

              {timetableChanged && (
                <div className="flex gap-2 text-xs text-brand-orange bg-brand-orange/10 border border-brand-orange/30 rounded-lg p-3">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>Jadval o'zgarsa, barcha dars vazifalarining muddati qayta hisoblanadi.</span>
                </div>
              )}

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
                disabled={saveMutation.isPending}
                className="w-full bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan border border-brand-cyan/50 font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {saveMutation.isPending ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Sinf yaratish'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
