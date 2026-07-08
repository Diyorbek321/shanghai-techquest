import React from 'react';
import { motion } from 'motion/react';
import { Filter, Search, Calendar as CalendarIcon, List, LayoutGrid, Clock } from 'lucide-react';

import { ViewType } from '../types';

export function Assignments({ onNavigate }: { onNavigate: (view: ViewType) => void }) {
  const columns = [
    { id: 'todo', title: 'To Do', count: 3, color: 'text-gray-400', border: 'border-gray-500/50' },
    { id: 'progress', title: 'In Progress', count: 1, color: 'text-brand-cyan', border: 'border-brand-cyan/50' },
    { id: 'submitted', title: 'Submitted', count: 2, color: 'text-brand-purple', border: 'border-brand-purple/50' },
    { id: 'graded', title: 'Graded', count: 12, color: 'text-brand-green', border: 'border-brand-green/50' },
  ];

  const assignments = [
    { id: 1, col: 'todo', title: 'Build a Responsive Navbar with Flexbox', subject: 'Frontend', diff: 3, due: 'Due in 2 days', points: 50, urgent: true },
    { id: 2, col: 'todo', title: 'REST API Authentication', subject: 'Backend', diff: 4, due: 'Due in 5 days', points: 100, urgent: false },
    { id: 3, col: 'progress', title: 'Binary Search Trees Lab', subject: 'Algorithms', diff: 5, due: 'Due tomorrow', points: 150, urgent: true, progress: '3/5 tests' },
    { id: 4, col: 'submitted', title: 'React Hooks Intro', subject: 'Frontend', diff: 2, due: 'Submitted yesterday', points: 30, urgent: false },
  ];

  return (
    <div className="h-full flex flex-col space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1">Assignments Board</h1>
          <p className="text-gray-400">Track and manage your quests across all subjects.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search assignments..." 
              className="bg-black/30 border border-brand-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-cyan transition-colors w-full sm:w-48"
            />
          </div>
          <button className="p-2 bg-black/40 border border-brand-border rounded-lg text-gray-400 hover:text-white transition-colors">
            <Filter size={18} />
          </button>
          <div className="flex bg-black/40 p-1 rounded-lg border border-brand-border ml-2">
            <button className="p-1.5 text-gray-400 hover:text-white rounded"><List size={16} /></button>
            <button className="p-1.5 bg-brand-cyan/20 text-brand-cyan rounded"><LayoutGrid size={16} /></button>
            <button className="p-1.5 text-gray-400 hover:text-white rounded"><CalendarIcon size={16} /></button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {columns.map(col => (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col h-full bg-black/20 rounded-xl border border-brand-border">
            <div className={`p-4 border-b ${col.border} flex justify-between items-center bg-black/40 rounded-t-xl`}>
              <h3 className={`font-semibold ${col.color} flex items-center gap-2`}>
                {col.title}
                <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full">{col.count}</span>
              </h3>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {assignments.filter(a => a.col === col.id).map((task, index) => (
                <motion.div 
                  key={task.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-panel p-4 cursor-grab hover:border-brand-cyan/50 hover:shadow-[0_0_15px_rgba(0,217,255,0.1)] transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      task.subject === 'Frontend' ? 'bg-brand-cyan/20 text-brand-cyan' : 
                      task.subject === 'Backend' ? 'bg-brand-purple/20 text-brand-purple' : 
                      'bg-brand-green/20 text-brand-green'
                    }`}>
                      {task.subject}
                    </span>
                    {task.urgent && <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse"></span>}
                  </div>
                  
                  <h4 className="font-bold text-sm mb-3 leading-snug">{task.title}</h4>
                  
                  <div className="flex justify-between items-center text-xs mb-4">
                    <div className="flex text-[#FFD700]">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < task.diff ? "opacity-100" : "opacity-30"}>★</span>
                      ))}
                    </div>
                    <span className="font-mono font-bold text-brand-purple">{task.points} XP</span>
                  </div>

                  {task.progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{task.progress}</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1">
                        <div className="bg-brand-cyan h-1 rounded-full w-3/5"></div>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-brand-border flex justify-between items-center">
                    <div className={`text-xs flex items-center gap-1 ${task.urgent ? 'text-brand-orange' : 'text-gray-400'}`}>
                      <Clock size={12} />
                      {task.due}
                    </div>
                    {col.id === 'todo' && (
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onNavigate('assignment_detail')}
                        className="text-xs bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 px-2 py-1 rounded transition-colors"
                      >
                        Start
                      </motion.button>
                    )}
                    {col.id === 'progress' && (
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onNavigate('assignment_detail')}
                        className="text-xs bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple border border-brand-purple/30 px-2 py-1 rounded transition-colors"
                      >
                        Continue
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
