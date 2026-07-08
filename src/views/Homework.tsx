import React from 'react';
import { motion } from 'motion/react';
import { 
  BookText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Plus,
  Filter,
  FileCode,
  FileText
} from 'lucide-react';

export function Homework() {
  const homeworkItems = [
    { id: 1, title: 'Semantic HTML Practice', course: 'Frontend Foundation', due: 'Today, 6:00 PM', status: 'pending', type: 'code', xp: 100 },
    { id: 2, title: 'Flexbox Layout Challenge', course: 'CSS Mastery', due: 'Tomorrow', status: 'submitted', type: 'code', xp: 150 },
    { id: 3, title: 'User Persona Research', course: 'UX/UI Design', due: 'Oct 28', status: 'pending', type: 'doc', xp: 200 },
    { id: 4, title: 'Responsive Navbar Bugfix', course: 'Frontend Foundation', due: 'Done', status: 'completed', type: 'code', xp: 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-orange/10 rounded-2xl border border-brand-orange/20">
            <BookText size={32} className="text-brand-orange" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">Daily Homework</h1>
            <p className="text-xs text-gray-500 font-mono">Micro-Tasks & Knowledge Reinforcement</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
            <Filter size={18} />
          </button>
          <button className="px-6 py-2 bg-brand-orange text-black font-black rounded-xl hover:bg-brand-orange/80 transition-all shadow-[0_0_20px_rgba(255,149,0,0.3)] uppercase text-xs flex items-center gap-2">
            <Plus size={16} /> Add Custom Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusFilter label="All Tasks" count={12} active />
        <StatusFilter label="Pending" count={4} />
        <StatusFilter label="Submitted" count={3} />
        <StatusFilter label="Completed" count={5} />
      </div>

      <div className="space-y-4">
        {homeworkItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-panel p-5 border border-white/10 bg-black/40 group hover:border-brand-orange/40 transition-all flex flex-col md:flex-row items-center gap-6 ${
              item.status === 'completed' ? 'opacity-60' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              item.type === 'code' ? 'bg-brand-cyan/10 text-brand-cyan' : 'bg-brand-purple/10 text-brand-purple'
            }`}>
              {item.type === 'code' ? <FileCode size={24} /> : <FileText size={24} />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-white text-lg group-hover:text-brand-orange transition-colors">{item.title}</h3>
                <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10 font-mono">{item.course}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock size={12} /> {item.due}</span>
                <span className="flex items-center gap-1 text-brand-orange/70 font-bold uppercase tracking-widest text-[9px]">+{item.xp} XP</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  item.status === 'pending' ? 'text-brand-orange' : 
                  item.status === 'submitted' ? 'text-brand-cyan' : 
                  'text-brand-green'
                }`}>
                  {item.status}
                </span>
                {item.status === 'pending' && <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-brand-orange w-1/3" />
                </div>}
              </div>
              
              <button className={`p-3 rounded-xl transition-all ${
                item.status === 'completed' 
                  ? 'bg-brand-green/20 text-brand-green' 
                  : 'bg-white/5 text-gray-400 group-hover:bg-brand-orange group-hover:text-black'
              }`}>
                {item.status === 'completed' ? <CheckCircle2 size={20} /> : <ChevronRight size={20} />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatusFilter({ label, count, active }: any) {
  return (
    <button className={`p-4 rounded-2xl border transition-all text-left ${
      active ? 'bg-brand-orange/10 border-brand-orange/50' : 'bg-black/40 border-white/10 hover:border-white/20'
    }`}>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black italic ${active ? 'text-brand-orange' : 'text-white'}`}>{count}</p>
    </button>
  );
}
