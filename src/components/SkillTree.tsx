import React from 'react';
import { motion } from 'motion/react';
import { Lock, Zap, CheckCircle2, Globe, Layout, Palette, Database, Server, Smartphone, Monitor } from 'lucide-react';

interface SkillNodeData {
  id: string;
  label: string;
  status: 'locked' | 'unlocked' | 'completed';
  x: number;
  y: number;
  prerequisites?: string[];
  icon: React.ReactNode;
  desc: string;
  level: number;
}

export function SkillTree() {
  const skills: SkillNodeData[] = [
    { 
      id: 'html', 
      label: 'Semantic HTML', 
      status: 'completed', 
      x: 50, 
      y: 50, 
      icon: <Globe size={24} />, 
      desc: 'Master document structure and accessibility standards.',
      level: 10
    },
    { 
      id: 'css-basics', 
      label: 'CSS Fundamentals', 
      status: 'completed', 
      x: 50, 
      y: 150, 
      prerequisites: ['html'], 
      icon: <Palette size={24} />, 
      desc: 'The box model, selectors, and cascade logic.',
      level: 8
    },
    { 
      id: 'flexbox', 
      label: 'Flexbox Layouts', 
      status: 'completed', 
      x: 30, 
      y: 250, 
      prerequisites: ['css-basics'], 
      icon: <Layout size={24} />, 
      desc: 'One-dimensional dynamic axis alignment.',
      level: 7
    },
    { 
      id: 'grid', 
      label: 'CSS Grid', 
      status: 'unlocked', 
      x: 70, 
      y: 250, 
      prerequisites: ['css-basics'], 
      icon: <Layout size={24} />, 
      desc: 'Complex two-dimensional structural grids.',
      level: 4
    },
    { 
      id: 'responsive', 
      label: 'Responsive Design', 
      status: 'unlocked', 
      x: 50, 
      y: 350, 
      prerequisites: ['flexbox', 'grid'], 
      icon: <Smartphone size={24} />, 
      desc: 'Fluid layouts across all device breakpoints.',
      level: 2
    },
    { 
      id: 'js-core', 
      label: 'JS Logic', 
      status: 'unlocked', 
      x: 20, 
      y: 450, 
      prerequisites: ['responsive'], 
      icon: <Zap size={24} />, 
      desc: 'Variables, loops, and functional programming.',
      level: 1
    },
    { 
      id: 'dom-hack', 
      label: 'DOM Infiltration', 
      status: 'locked', 
      x: 50, 
      y: 450, 
      prerequisites: ['js-core'], 
      icon: <Monitor size={24} />, 
      desc: 'Dynamic node manipulation and events.',
      level: 0
    },
    { 
      id: 'react-nexus', 
      label: 'React Framework', 
      status: 'locked', 
      x: 80, 
      y: 450, 
      prerequisites: ['dom-hack'], 
      icon: <Database size={24} />, 
      desc: 'Component architecture and state nexus.',
      level: 0
    },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto min-h-[700px] glass-panel border border-white/10 rounded-3xl bg-black/40 overflow-hidden p-8 flex justify-center items-center">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />
      
      {/* Connections Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#B026FF" />
          </linearGradient>
        </defs>
        {skills.map(skill => (
          skill.prerequisites?.map(preId => {
            const pre = skills.find(s => s.id === preId);
            if (!pre) return null;
            return (
              <motion.line
                key={`${pre.id}-${skill.id}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                x1={`${pre.x}%`}
                y1={`${pre.y}%`}
                x2={`${skill.x}%`}
                y2={`${skill.y}%`}
                stroke={skill.status === 'locked' ? '#333' : 'url(#lineGrad)'}
                strokeWidth="2"
                strokeDasharray={skill.status === 'locked' ? "5,5" : "none"}
              />
            );
          })
        ))}
      </svg>

      {/* Nodes Layer */}
      <div className="relative z-10 w-full h-full">
        {skills.map((skill) => (
          <SkillTreeNode key={skill.id} skill={skill} />
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-3">
        <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-xl border border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#00D9FF]" />
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Mastered</span>
        </div>
        <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-xl border border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-purple shadow-[0_0_8px_#B026FF]" />
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Unlocked</span>
        </div>
        <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-xl border border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Encrypted</span>
        </div>
      </div>
    </div>
  );
}

function SkillTreeNode({ skill }: { skill: SkillNodeData }) {
  const isLocked = skill.status === 'locked';
  const isCompleted = skill.status === 'completed';

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{ 
        position: 'absolute', 
        left: `${skill.x}%`, 
        top: `${skill.y}%`,
        transform: 'translate(-50%, -50%)' 
      }}
      className="group"
    >
      <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer relative ${
        isCompleted ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-[0_0_15px_rgba(0,217,255,0.2)]' :
        !isLocked ? 'bg-brand-purple/10 border-brand-purple text-brand-purple animate-pulse' :
        'bg-white/5 border-white/5 text-gray-600'
      } hover:scale-110`}>
        {isCompleted ? <CheckCircle2 size={28} /> : isLocked ? <Lock size={24} /> : skill.icon}
        
        {/* Connection Points */}
        {!isLocked && (
          <div className="absolute -inset-1 border border-current rounded-3xl opacity-20 group-hover:opacity-100 transition-opacity animate-spin-slow" />
        )}
      </div>

      {/* Tooltip Card */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 glass-panel p-4 border border-white/10 bg-black/90 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none z-50">
        <div className="flex justify-between items-start mb-2">
          <h4 className={`text-xs font-black uppercase tracking-tighter ${isCompleted ? 'text-brand-cyan' : !isLocked ? 'text-brand-purple' : 'text-gray-500'}`}>
            {skill.label}
          </h4>
          <span className="text-[10px] font-mono text-gray-500">LV.{skill.level}</span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed mb-4">{skill.desc}</p>
        
        {!isLocked && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
              <span>Mastery</span>
              <span>{skill.level * 10}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${isCompleted ? 'bg-brand-cyan' : 'bg-brand-purple'}`} style={{ width: `${skill.level * 10}%` }} />
            </div>
          </div>
        )}

        {isLocked && (
          <div className="flex items-center gap-1.5 text-[8px] font-black text-red-500 uppercase tracking-widest mt-2">
            <Lock size={10} /> Pre-requisites Missing
          </div>
        )}
      </div>
    </motion.div>
  );
}
