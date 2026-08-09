import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  BookOpen,
  Search,
  ChevronRight,
  AlertCircle,
  Mail,
  GraduationCap,
  LayoutDashboard,
  Send,
  Star,
  CalendarCheck,
  BookText,
  KeyRound,
  Award,
  Target
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatRelativeTime, formatDate } from '../lib/utils';
import { Track } from '../types';
import { StudentAccountsPanel } from '../components/teacher/StudentAccountsPanel';
import { HomeworkPanel } from '../components/teacher/HomeworkPanel';
import { ClassGoalsPanel } from '../components/teacher/ClassGoalsPanel';

interface ClassGroup {
  id: string;
  title: string;
  track: Track;
  studentCount: number;
}

interface StudentRow {
  id: string;
  name: string;
  avatar: string | null;
  xp: number;
  level: number;
  averageScore: number | null;
  lastSubmittedAt: string | null;
}

type TeacherTab = 'overview' | 'students' | 'accounts' | 'homework' | 'goals';

export function TeacherPortal() {
  const [activeTab, setActiveTab] = useState<TeacherTab>('overview');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [detailStudent, setDetailStudent] = useState<StudentRow | null>(null);

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get<ClassGroup[]>('/classes'),
  });

  useEffect(() => {
    if (!selectedClassId && classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['classes', selectedClassId, 'students'],
    queryFn: () => api.get<StudentRow[]>(`/classes/${selectedClassId}/students`),
    enabled: !!selectedClassId,
  });

  const visibleStudents = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const gradedScores = students.map((s) => s.averageScore).filter((s): s is number => s !== null);
  const averageGrade = gradedScores.length ? Math.round(gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length) : null;

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-purple/10 rounded-xl border border-brand-purple/20">
            <GraduationCap size={32} className="text-brand-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">O'qituvchi paneli</h1>
            <p className="text-xs text-gray-500 font-mono">Gibrid ta'lim boshqaruv tizimi</p>
          </div>
        </div>
        {classes.length > 0 && (
          <select
            value={selectedClassId ?? ''}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-purple"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id} className="bg-brand-bg">{c.title}</option>
            ))}
          </select>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Umumiy ko\'rinish', icon: LayoutDashboard },
          { id: 'students', label: 'O\'quvchilar', icon: Users },
          { id: 'accounts', label: 'Login/parol', icon: KeyRound },
          { id: 'homework', label: 'Uy vazifasi', icon: BookText },
          { id: 'goals', label: 'Sinf maqsadi', icon: Target },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TeacherTab)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Ro'yxatdagi o'quvchilar" value={String(students.length)} icon={Users} color="text-brand-cyan" />
          <StatCard title="O'rtacha baho" value={averageGrade !== null ? `${averageGrade}%` : '—'} icon={GraduationCap} color="text-brand-purple" />
          <StatCard title="Faol sinflar" value={String(classes.length)} icon={BookOpen} color="text-brand-orange" />

          <div className="md:col-span-3 glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertCircle size={16} className="text-brand-purple" /> So'nggi o'quvchilar faolligi
            </h3>
            {studentsLoading && <p className="text-sm text-gray-500">Yuklanmoqda...</p>}
            <div className="space-y-4">
              {students.slice(0, 5).map((student) => (
                <button
                  key={student.id}
                  onClick={() => setDetailStudent(student)}
                  className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-white/10 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <img src={student.avatar ?? undefined} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                    <div>
                      <p className="text-sm font-bold text-white">{student.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        {student.lastSubmittedAt ? `Oxirgi topshiriq: ${formatRelativeTime(student.lastSubmittedAt)}` : 'Hali topshiriqlar yo\'q'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="glass-panel border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="O'quvchilarni qidirish..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                  <th className="px-6 py-4 font-bold">O'quvchi</th>
                  <th className="px-6 py-4 font-bold">Daraja</th>
                  <th className="px-6 py-4 font-bold">O'rtacha baho</th>
                  <th className="px-6 py-4 font-bold">Oxirgi topshiriq</th>
                  <th className="px-6 py-4 font-bold">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visibleStudents.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => setDetailStudent(student)}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={student.avatar ?? undefined} alt="" className="w-8 h-8 rounded-full border border-white/10" />
                        <p className="text-sm font-bold text-white">{student.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-300 font-mono">Daraja {student.level}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-black font-mono ${
                        student.averageScore === null ? 'text-gray-500' : student.averageScore >= 90 ? 'text-brand-green' : student.averageScore >= 75 ? 'text-brand-cyan' : 'text-brand-orange'
                      }`}>
                        {student.averageScore !== null ? `${Math.round(student.averageScore)}%` : 'Mavjud emas'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                      {student.lastSubmittedAt ? formatRelativeTime(student.lastSubmittedAt) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); setDetailStudent(student); }}
                        className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Xabar yuborish"
                      >
                        <Mail size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'accounts' && <StudentAccountsPanel classId={selectedClassId} />}

      {activeTab === 'goals' && <ClassGoalsPanel classId={selectedClassId} />}

      {activeTab === 'homework' && (
        <HomeworkPanel
          classId={selectedClassId}
          track={classes.find((c) => c.id === selectedClassId)?.track ?? null}
        />
      )}

      <StudentDetailModal student={detailStudent} onClose={() => setDetailStudent(null)} />
    </div>
  );
}

interface GradeRow {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  gradedAt: string;
}

interface AttendanceRow {
  id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

const ATTENDANCE_LABEL: Record<AttendanceRow['status'], string> = {
  PRESENT: 'Bor',
  LATE: 'Kechikdi',
  ABSENT: "Yo'q",
  EXCUSED: 'Uzrli',
};

function StudentDetailModal({ student, onClose }: { student: StudentRow | null; onClose: () => void }) {
  const [message, setMessage] = useState('');

  const { data: grades = [] } = useQuery({
    queryKey: ['grades', student?.id],
    queryFn: () => api.get<GradeRow[]>(`/grades?userId=${student!.id}`),
    enabled: !!student,
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ['attendance', 'user', student?.id],
    queryFn: () => api.get<AttendanceRow[]>(`/attendance?userId=${student!.id}`),
    enabled: !!student,
  });

  const sendMessage = useMutation({
    mutationFn: () => api.post('/notifications', { userId: student!.id, body: message }),
    onSuccess: () => setMessage(''),
  });

  return (
    <AnimatePresence>
      {student && (
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
              <div className="flex items-center gap-3">
                <img src={student.avatar ?? undefined} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                <div>
                  <h2 className="text-lg font-heading font-bold text-white">{student.name}</h2>
                  <p className="text-xs text-gray-500">Daraja {student.level}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white p-2">&times;</button>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Star size={12} /> Baholar
              </h3>
              {grades.length === 0 && <p className="text-xs text-gray-500">Hali baho qo'yilmagan.</p>}
              {grades.slice(0, 5).map((g) => (
                <div key={g.id} className="flex justify-between items-center text-xs bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-gray-300">{g.subject}</span>
                  <span className="font-mono font-bold text-brand-green">{g.score}/{g.maxScore}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <CalendarCheck size={12} /> Davomat
              </h3>
              {attendance.length === 0 && <p className="text-xs text-gray-500">Hali davomat qayd etilmagan.</p>}
              {attendance.slice(0, 5).map((a) => (
                <div key={a.id} className="flex justify-between items-center text-xs bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-gray-300">{formatDate(a.date)}</span>
                  <span className="font-mono font-bold text-gray-300">{ATTENDANCE_LABEL[a.status]}</span>
                </div>
              ))}
            </div>

            <RewardBox studentId={student.id} />

            <div className="space-y-2 pt-4 border-t border-white/10">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} /> Xabar yuborish
              </h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Xabar matnini kiriting..."
                className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-purple resize-none"
              />
              <button
                onClick={() => sendMessage.mutate()}
                disabled={sendMessage.isPending || !message.trim()}
                className="flex items-center gap-2 bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple border border-brand-purple/50 font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                <Send size={14} /> {sendMessage.isPending ? 'Yuborilmoqda...' : 'Yuborish'}
              </button>
              {sendMessage.isSuccess && <p className="text-xs text-brand-green">Xabar yuborildi.</p>}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Preset awards, so recognising a student is one click rather than a form. */
const REWARD_PRESETS = [
  { label: 'Faol qatnashdi', xp: 50, coins: 25 },
  { label: 'Uy vazifasi a\'lo', xp: 100, coins: 50 },
  { label: 'Sinf yulduzi', xp: 200, coins: 100 },
];

function RewardBox({ studentId }: { studentId: string }) {
  const [message, setMessage] = useState('');
  const [preset, setPreset] = useState(REWARD_PRESETS[0]);
  const queryClient = useQueryClient();

  const reward = useMutation({
    mutationFn: () => api.post(`/users/${studentId}/reward`, { xp: preset.xp, coins: preset.coins, message: message.trim() || preset.label }),
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  return (
    <div className="space-y-2 pt-4 border-t border-white/10">
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
        <Award size={12} /> Mukofotlash
      </h3>
      <div className="flex flex-wrap gap-2">
        {REWARD_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setPreset(p)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              preset.label === p.label
                ? 'bg-brand-orange text-black'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {p.label} · +{p.xp} XP
          </button>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Maqtov matni (bo'sh qolsa: "${preset.label}")`}
        className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange"
      />
      <button
        onClick={() => reward.mutate()}
        disabled={reward.isPending}
        className="flex items-center gap-2 bg-brand-orange/20 hover:bg-brand-orange/30 text-brand-orange border border-brand-orange/50 font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
      >
        <Award size={14} /> {reward.isPending ? 'Yuborilmoqda...' : `+${preset.xp} XP, +${preset.coins} tanga berish`}
      </button>
      {reward.isSuccess && <p className="text-xs text-brand-green">Mukofot yuborildi.</p>}
      {reward.isError && <p className="text-xs text-brand-red">{(reward.error as Error).message}</p>}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: React.ComponentType<{ size?: number }>; color: string }) {
  return (
    <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 bg-white/5 rounded-xl ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
  );
}
