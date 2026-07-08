import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Target, 
  BarChart2, 
  TrendingUp, 
  Download, 
  Star,
  CheckCircle2,
  PieChart as PieChartIcon
} from 'lucide-react';

export function Grades() {
  const subjects = [
    { name: 'Frontend Foundation', grade: 'A', percentage: 94, color: 'bg-brand-cyan', assignments: 12 },
    { name: 'CSS Mastery', grade: 'A-', percentage: 89, color: 'bg-brand-purple', assignments: 8 },
    { name: 'UX/UI Design', grade: 'B+', percentage: 82, color: 'bg-brand-orange', assignments: 5 },
    { name: 'Robotics 101', grade: 'A', percentage: 97, color: 'bg-brand-green', assignments: 15 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header Summary */}
      <div className="glass-panel p-8 border border-white/10 bg-black/40 flex flex-col lg:row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-cyan/10 rounded-2xl border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shadow-xl">
            <Trophy size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Academic Status</h1>
            <p className="text-xs text-gray-500 font-mono">Current Standing: <span className="text-brand-green uppercase font-black italic">Distinguished</span></p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">GPA Equivalent</p>
            <p className="text-3xl font-black text-white italic">3.88</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">XP Bonus</p>
            <p className="text-3xl font-black text-brand-purple italic">+15%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Rank</p>
            <p className="text-3xl font-black text-brand-cyan italic">TOP 5%</p>
          </div>
        </div>

        <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase text-gray-400 hover:text-white transition-all flex items-center gap-2">
          <Download size={16} /> Official Transcript
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Trends */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border border-white/10 bg-black/40">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <BarChart2 size={16} className="text-brand-cyan" /> Progress Matrix
            </h3>
            <div className="space-y-6">
              {subjects.map((sub, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-gray-400">{sub.name}</span>
                    <span className="text-white">{sub.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sub.percentage}%` }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className={`h-full ${sub.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 border border-white/10 bg-black/40">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-purple" /> Monthly Trend
            </h3>
            <div className="flex items-end justify-between h-32 pt-4 px-2">
              {[45, 60, 55, 80, 75, 95].map((h, i) => (
                <div key={i} className="w-4 bg-brand-purple/20 rounded-t-sm relative group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="absolute bottom-0 left-0 w-full bg-brand-purple transition-all group-hover:bg-brand-cyan"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[8px] text-gray-500 font-black uppercase tracking-widest">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>
        </div>

        {/* Recent Evaluations */}
        <div className="lg:col-span-2 glass-panel border border-white/10 bg-black/40 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <PieChartIcon size={14} className="text-brand-orange" /> Recent Evaluations
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { name: 'Boss Battle: Hydra UI', type: 'Project', date: 'Oct 20', grade: 'A+', score: '98/100', xp: 1500 },
              { name: 'Unit 4: CSS Variables', type: 'Quiz', date: 'Oct 18', grade: 'A', score: '10/10', xp: 500 },
              { name: 'User Flow Diagram', type: 'Assignment', date: 'Oct 15', grade: 'B', score: '85/100', xp: 300 },
              { name: 'Robotics Lab 04', type: 'Lab', date: 'Oct 12', grade: 'A', score: '95/100', xp: 800 },
              { name: 'Responsive Layouts', type: 'Quiz', date: 'Oct 10', grade: 'A-', score: '9/10', xp: 450 },
            ].map((evalItem, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-brand-orange transition-colors">
                    {evalItem.type === 'Quiz' ? <CheckCircle2 size={20} /> : <Target size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-brand-orange transition-colors">{evalItem.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{evalItem.type} &bull; {evalItem.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-lg font-black text-white italic tracking-tighter">{evalItem.grade}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{evalItem.score}</p>
                  </div>
                  <div className="w-px h-8 bg-white/5" />
                  <div className="text-right min-w-[60px]">
                    <p className="text-xs font-black text-brand-cyan italic">+{evalItem.xp}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-black">XP GAINED</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
