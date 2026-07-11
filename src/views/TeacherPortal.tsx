import React, { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  Search,
  ChevronRight,
  AlertCircle,
  Mail,
  GraduationCap,
  LayoutDashboard
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatRelativeTime } from '../lib/utils';
import { Track } from '../types';

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

export function TeacherPortal() {
  const [activeTab, setActiveTab] = useState<'overview' | 'students'>('overview');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

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
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'students')}
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
                <div key={student.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-white/10 transition-all">
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
                </div>
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
                  <tr key={student.id} className="hover:bg-white/5 transition-colors group">
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
                      <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Xabar yuborish">
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
