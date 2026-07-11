import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Target, BarChart2, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';

interface Grade {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  gradedAt: string;
}

function toLetterGrade(pct: number): string {
  if (pct >= 97) return 'A+';
  if (pct >= 93) return 'A';
  if (pct >= 90) return 'A-';
  if (pct >= 87) return 'B+';
  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B-';
  if (pct >= 70) return 'C';
  if (pct >= 60) return 'D';
  return 'F';
}

export function Grades() {
  const { data: grades = [], isLoading } = useQuery({
    queryKey: ['grades'],
    queryFn: () => api.get<Grade[]>('/grades'),
  });

  const overallPct = grades.length
    ? grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length
    : 0;

  const bySubject = new Map<string, number[]>();
  grades.forEach((g) => {
    const list = bySubject.get(g.subject) ?? [];
    list.push((g.score / g.maxScore) * 100);
    bySubject.set(g.subject, list);
  });
  const subjectAverages = Array.from(bySubject.entries()).map(([name, pcts]) => ({
    name,
    percentage: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
  }));

  const recent = [...grades].sort((a, b) => new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime());

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header Summary */}
      <div className="glass-panel p-8 border border-white/10 bg-black/40 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-cyan/10 rounded-2xl border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shadow-xl">
            <Trophy size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Akademik holat</h1>
            <p className="text-xs text-gray-500 font-mono">
              {grades.length} ta baholangan topshiriq
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Umumiy o'rtacha</p>
            <p className="text-3xl font-black text-white italic">{overallPct ? `${overallPct.toFixed(1)}%` : '—'}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Umumiy baho</p>
            <p className="text-3xl font-black text-brand-cyan italic">{grades.length ? toLetterGrade(overallPct) : '—'}</p>
          </div>
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Baholar yuklanmoqda...</p>}
      {!isLoading && grades.length === 0 && <p className="text-sm text-gray-500">Hozircha baholar yo'q.</p>}

      {grades.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance by subject */}
          <div className="glass-panel p-6 border border-white/10 bg-black/40">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <BarChart2 size={16} className="text-brand-cyan" /> Taraqqiyot matritsasi
            </h3>
            <div className="space-y-6">
              {subjectAverages.map((sub, i) => (
                <div key={sub.name} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-gray-400">{sub.name}</span>
                    <span className="text-white">{sub.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sub.percentage}%` }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className="h-full bg-brand-cyan shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Evaluations */}
          <div className="lg:col-span-2 glass-panel border border-white/10 bg-black/40 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={14} className="text-brand-orange" /> So'nggi baholashlar
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {recent.map((g, i) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-brand-orange transition-colors">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-orange transition-colors">{g.subject}</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{formatDate(g.gradedAt)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-black text-white italic tracking-tighter">{toLetterGrade((g.score / g.maxScore) * 100)}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{g.score}/{g.maxScore}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
