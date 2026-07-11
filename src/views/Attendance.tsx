import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  CheckCircle2,
  XCircle,
  BarChart,
  CalendarDays,
  Info,
  Clock3,
  FileQuestion
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';
import { Track, User } from '../types';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
}

const STATUS_STYLE: Record<AttendanceRecord['status'], string> = {
  PRESENT: 'text-brand-green',
  LATE: 'text-brand-orange',
  ABSENT: 'text-brand-red',
  EXCUSED: 'text-gray-400',
};

const STATUS_LABEL: Record<AttendanceRecord['status'], string> = {
  PRESENT: 'Bor',
  LATE: 'Kechikdi',
  ABSENT: "Yo'q",
  EXCUSED: 'Uzrli',
};

export function Attendance({ user }: { user: User }) {
  if (user.role === 'teacher' || user.role === 'admin') {
    return <TeacherAttendancePanel />;
  }
  return <StudentAttendanceView />;
}

function StudentAttendanceView() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => api.get<AttendanceRecord[]>('/attendance'),
  });

  const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const total = logs.length;
  const counts = { PRESENT: 0, LATE: 0, ABSENT: 0, EXCUSED: 0 } as Record<AttendanceRecord['status'], number>;
  logs.forEach((l) => counts[l.status]++);
  const presentRate = total ? Math.round(((counts.PRESENT + counts.LATE) / total) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="glass-panel p-8 border border-white/10 bg-black/40 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-cyan/10 rounded-2xl border border-brand-cyan/20">
            <CalendarDays size={32} className="text-brand-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">Davomat matritsasi</h1>
            <p className="text-xs text-gray-500 font-mono">Aralash qatnashuvni kuzatish</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Davomat darajasi</p>
            <p className="text-3xl font-black text-brand-cyan italic">{total ? `${presentRate}%` : '—'}</p>
          </div>
          <div className="w-px h-10 bg-white/10 self-center"></div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Qayd etilgan darslar</p>
            <p className="text-3xl font-black text-brand-purple italic">{total}</p>
          </div>
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Davomat yuklanmoqda...</p>}

      {!isLoading && total > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Statistics */}
          <div className="space-y-6">
            <div className="glass-panel p-6 border border-white/10 bg-black/40">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <BarChart size={16} className="text-brand-cyan" /> Taqsimot
              </h3>
              <div className="space-y-4">
                <PresenceStat label="Bor" value={Math.round((counts.PRESENT / total) * 100)} color="bg-brand-green" icon={<CheckCircle2 size={12} />} />
                <PresenceStat label="Kechikdi" value={Math.round((counts.LATE / total) * 100)} color="bg-brand-orange" icon={<MapPin size={12} />} />
                <PresenceStat label="Yo'q" value={Math.round((counts.ABSENT / total) * 100)} color="bg-brand-red" icon={<XCircle size={12} />} />
              </div>
            </div>

            <div className="bg-brand-cyan/5 border border-brand-cyan/20 p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-brand-cyan">
                <Info size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider">Qoida haqida eslatma</h4>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Aralash qatnashuv XP hisoblashda teng hisoblanadi. Auditoriyada bo'lish har bir dars uchun qo'shimcha Ijtimoiy XP beradi.
              </p>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="lg:col-span-2 glass-panel border border-white/10 bg-black/40 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">So'nggi faoliyat</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    <th className="px-6 py-4">Sana</th>
                    <th className="px-6 py-4">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sorted.map((log, i) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-white">{formatDate(log.date)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 ${STATUS_STYLE[log.status]}`}>
                          {log.status === 'PRESENT' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          <span className="text-xs font-black uppercase italic">{STATUS_LABEL[log.status]}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PresenceStat({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
        <span className="text-gray-500 flex items-center gap-1.5">{icon} {label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

interface ClassOption {
  id: string;
  title: string;
  track: Track;
}

interface ClassStudent {
  id: string;
  name: string;
  avatar: string | null;
}

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; icon: React.ReactNode; activeClass: string }[] = [
  { value: 'PRESENT', label: 'Bor', icon: <CheckCircle2 size={14} />, activeClass: 'bg-brand-green/20 text-brand-green border-brand-green/50' },
  { value: 'LATE', label: 'Kechikdi', icon: <Clock3 size={14} />, activeClass: 'bg-brand-orange/20 text-brand-orange border-brand-orange/50' },
  { value: 'ABSENT', label: "Yo'q", icon: <XCircle size={14} />, activeClass: 'bg-brand-red/20 text-brand-red border-brand-red/50' },
  { value: 'EXCUSED', label: 'Uzrli', icon: <FileQuestion size={14} />, activeClass: 'bg-gray-500/20 text-gray-300 border-gray-500/50' },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function TeacherAttendancePanel() {
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [date, setDate] = useState(todayIso());

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get<ClassOption[]>('/classes'),
  });

  useEffect(() => {
    if (!selectedClassId && classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['classes', selectedClassId, 'students'],
    queryFn: () => api.get<ClassStudent[]>(`/classes/${selectedClassId}/students`),
    enabled: !!selectedClassId,
  });

  const markMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: AttendanceStatus }) =>
      api.post('/attendance', { userId, classId: selectedClassId, date, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', selectedClassId, date] });
    },
  });

  const { data: existing = [] } = useQuery({
    queryKey: ['attendance', selectedClassId, date],
    queryFn: () => api.get<{ userId: string; status: AttendanceStatus }[]>(`/attendance?classId=${selectedClassId}&date=${date}`),
    enabled: !!selectedClassId,
  });
  const statusByUser = new Map(existing.map((r) => [r.userId, r.status]));

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <div className="glass-panel p-6 border border-white/10 bg-black/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-cyan/10 rounded-2xl border border-brand-cyan/20">
            <CalendarDays size={28} className="text-brand-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">Davomat belgilash</h1>
            <p className="text-xs text-gray-500 font-mono">Sinf va sanani tanlab, har bir o'quvchi uchun holatni belgilang</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedClassId ?? ''}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id} className="bg-brand-bg">{c.title}</option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan"
          />
        </div>
      </div>

      <div className="glass-panel border border-white/10 bg-black/40 overflow-hidden">
        {isLoading && <p className="text-sm text-gray-500 p-6">O'quvchilar yuklanmoqda...</p>}
        {!isLoading && students.length === 0 && (
          <p className="text-sm text-gray-500 p-6">Bu sinfda hali o'quvchi yo'q.</p>
        )}
        <div className="divide-y divide-white/5">
          {students.map((student) => {
            const currentStatus = statusByUser.get(student.id);
            return (
              <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar ?? undefined}
                    alt=""
                    className="w-9 h-9 rounded-full border border-white/10 bg-white/5"
                  />
                  <p className="text-sm font-bold text-white">{student.name}</p>
                </div>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => markMutation.mutate({ userId: student.id, status: opt.value })}
                      disabled={markMutation.isPending}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                        currentStatus === opt.value ? opt.activeClass : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
