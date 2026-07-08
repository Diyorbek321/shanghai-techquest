import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, Clock, PlayCircle } from 'lucide-react';
import { ViewType } from '../types';

export function Classes({ onNavigate }: { onNavigate: (view: ViewType) => void }) {
  const classes = [
    { id: 1, name: 'Frontend Development 2026 - Grp A', instructor: 'Dr. Sarah Chen', progress: 37, nextClass: 'Tomorrow, 10:00 AM', assignments: 2, type: 'Frontend' },
    { id: 2, name: 'Data Structures & Algorithms', instructor: 'Prof. James Smith', progress: 15, nextClass: 'Wed, 2:00 PM', assignments: 1, type: 'Algorithms' },
    { id: 3, name: 'Introduction to AI Models', instructor: 'Dr. Alan Turing', progress: 85, nextClass: 'Completed', assignments: 0, type: 'AI' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1">My Classes</h1>
          <p className="text-gray-400">Manage your active courses and upcoming lectures.</p>
        </div>
        <button className="bg-brand-cyan text-brand-bg font-semibold px-4 py-2 rounded flex items-center gap-2 hover:bg-brand-cyan/90 transition-all neon-glow-cyan">
          + Join New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {classes.map((cls) => (
          <div key={cls.id} className="glass-panel overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className={`h-32 bg-black flex items-center justify-center border-b border-brand-border relative ${
              cls.type === 'Frontend' ? 'bg-brand-cyan/10' : 
              cls.type === 'Algorithms' ? 'bg-brand-purple/10' : 'bg-brand-green/10'
            }`}>
              <BookOpen size={48} className={`opacity-50 ${
                cls.type === 'Frontend' ? 'text-brand-cyan' : 
                cls.type === 'Algorithms' ? 'text-brand-purple' : 'text-brand-green'
              }`} />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                {cls.assignments > 0 && <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>}
                {cls.assignments} Pending
              </div>
            </div>
            
            <div className="p-5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block ${
                cls.type === 'Frontend' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30' : 
                cls.type === 'Algorithms' ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30' : 
                'bg-brand-green/20 text-brand-green border border-brand-green/30'
              }`}>
                {cls.type}
              </span>
              <h3 className="font-bold text-lg leading-tight mb-1">{cls.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <Users size={14} />
                <span>{cls.instructor}</span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>Progress</span>
                  <span>{cls.progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-brand-cyan to-brand-purple h-1.5 rounded-full" style={{ width: `${cls.progress}%` }}></div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 bg-black/30 p-2 rounded border border-brand-border">
                <Clock size={14} className="text-brand-orange" />
                Next class: {cls.nextClass}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded text-sm transition-colors border border-brand-border">
                  Materials
                </button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => cls.type === 'Frontend' ? onNavigate('frontend_course') : {}}
                  className="flex-1 bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan border border-brand-cyan/50 font-medium py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <PlayCircle size={16} /> Resume
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
