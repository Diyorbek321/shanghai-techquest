import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Table, 
  Presentation, 
  Check, 
  Lock, 
  ChevronRight, 
  Zap, 
  Trophy, 
  Target,
  Download,
  PlayCircle,
  Users,
  Search,
  Settings as SettingsIcon,
  PieChart,
  Grid3X3
} from 'lucide-react';
import { ViewType } from '../types';

export function OfficeCourse({ onNavigate }: { onNavigate: (view: ViewType) => void }) {
  const [activeTab, setActiveTab] = useState<'modules' | 'skills' | 'projects'>('modules');

  const officeModules = [
    { 
      id: 1, 
      title: 'Word: Professional Document Design', 
      desc: 'Master styles, sections, and automated tables.', 
      status: 'completed', 
      icon: <FileText className="text-blue-500" />,
      xp: 250,
      type: 'word'
    },
    { 
      id: 2, 
      title: 'Excel: Data Mastery & Logic', 
      desc: 'Formulas, VLOOKUP, and logical functions.', 
      status: 'active', 
      icon: <Table className="text-green-500" />,
      xp: 400,
      type: 'excel'
    },
    { 
      id: 3, 
      title: 'PowerPoint: Narrative & Design', 
      desc: 'Create high-impact executive presentations.', 
      status: 'locked', 
      icon: <Presentation className="text-orange-500" />,
      xp: 300,
      type: 'ppt'
    },
    { 
      id: 4, 
      title: 'Excel: Advanced Data Analytics', 
      desc: 'Pivot tables, Power Query, and Dashboards.', 
      status: 'locked', 
      icon: <PieChart className="text-green-400" />,
      xp: 600,
      type: 'excel_boss'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-8 border-0 relative overflow-hidden bg-gradient-to-br from-blue-900/20 to-green-900/10 rounded-3xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Grid3X3 size={160} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-brand-cyan shadow-2xl">
              <Presentation size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Office Productivity</h1>
              <p className="text-gray-400 max-w-md text-sm">Master the essential tools of the modern workplace. Transition from beginner to power user across the Microsoft 365 suite.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center p-4 bg-black/40 rounded-2xl border border-white/10 min-w-[100px]">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Rank</p>
              <p className="text-xl font-black text-brand-cyan uppercase">Analyst</p>
            </div>
            <div className="text-center p-4 bg-black/40 rounded-2xl border border-white/10 min-w-[100px]">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Completion</p>
              <p className="text-xl font-black text-brand-purple uppercase">35%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
        {[
          { id: 'modules', label: 'Curriculum', icon: Target },
          { id: 'skills', label: 'Skill Tree', icon: Zap },
          { id: 'projects', label: 'Final Projects', icon: Trophy },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officeModules.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-panel p-6 border transition-all group ${
                mod.status === 'locked' ? 'border-white/5 opacity-50 bg-black/20' : 
                mod.status === 'active' ? 'border-blue-500/50 bg-blue-500/5' : 
                'border-green-500/50 bg-green-500/5'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${mod.status === 'locked' ? 'text-gray-600' : ''}`}>
                    {React.cloneElement(mod.icon as React.ReactElement<any>, { size: 28 })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Level {mod.id}</span>
                      {mod.status === 'completed' && <Check size={12} className="text-green-500" />}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{mod.title}</h3>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/20">
                  +{mod.xp} XP
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-8 leading-relaxed">{mod.desc}</p>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(j => (
                    <img key={j} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mod.id + j}`} className="w-6 h-6 rounded-full border-2 border-black" alt="" />
                  ))}
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[8px] text-gray-500 border-2 border-black font-bold">
                    +42
                  </div>
                </div>
                
                {mod.status === 'locked' ? (
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase">
                    <Lock size={14} /> Prerequisite Required
                  </div>
                ) : (
                  <button className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${
                    mod.status === 'completed' ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-blue-600 text-white shadow-xl shadow-blue-900/20'
                  }`}>
                    {mod.status === 'completed' ? 'Replay' : 'Resume Mission'}
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-8">
          <div className="glass-panel p-8 border border-white/10 bg-black/40">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                  <Zap size={24} className="text-blue-500" /> Office Mastery Tree
                </h3>
                <p className="text-gray-500 text-xs mt-1">Unlock technical proficiencies as you progress through the modules.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Word</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Excel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">PPT</span>
                </div>
              </div>
            </div>

            <div className="relative min-h-[500px] flex justify-center py-12">
              {/* Central Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center z-10">
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-500 uppercase">Total Power</p>
                  <p className="text-2xl font-black text-white italic">LV.12</p>
                </div>
              </div>

              {/* Connecting Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 800 500">
                <line x1="400" y1="250" x2="200" y2="100" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="400" y1="250" x2="600" y2="100" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="400" y1="250" x2="400" y2="400" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="400" cy="250" r="150" fill="none" stroke="white" strokeWidth="1" strokeDasharray="8 8" />
              </svg>

              {/* Skill Nodes */}
              <div className="relative w-full h-full max-w-4xl">
                <SkillNode 
                  title="Pivot Logic" 
                  level={4} 
                  color="green" 
                  pos="top-[10%] left-[20%]" 
                  icon={<Table size={16} />}
                  desc="Dynamic data summarization & grouping."
                />
                <SkillNode 
                  title="Formula Pro" 
                  level={7} 
                  color="green" 
                  pos="top-[40%] left-[5%]" 
                  icon={<Zap size={16} />}
                  desc="Complex nested functions & logic."
                />
                <SkillNode 
                  title="Macro Bot" 
                  level={1} 
                  color="green" 
                  pos="bottom-[10%] left-[20%]" 
                  locked
                  icon={<Lock size={16} />}
                  desc="VBA & basic automation scripts."
                />

                <SkillNode 
                  title="Style Master" 
                  level={5} 
                  color="blue" 
                  pos="top-[10%] right-[20%]" 
                  icon={<FileText size={16} />}
                  desc="Global document styles & themes."
                />
                <SkillNode 
                  title="Review Flow" 
                  level={3} 
                  color="blue" 
                  pos="top-[40%] right-[5%]" 
                  icon={<Users size={16} />}
                  desc="Track changes & collaborative editing."
                />
                <SkillNode 
                  title="Mail Merge" 
                  level={0} 
                  color="blue" 
                  pos="bottom-[10%] right-[20%]" 
                  locked
                  icon={<Lock size={16} />}
                  desc="Mass document generation."
                />

                <SkillNode 
                  title="Motion Craft" 
                  level={2} 
                  color="orange" 
                  pos="bottom-[5%] left-[50%] -translate-x-1/2" 
                  icon={<PlayCircle size={16} />}
                  desc="Morph transitions & advanced animations."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border border-white/10 bg-blue-600/5">
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-tighter">Current Training: <span className="text-blue-400 italic">VLOOKUP Mastery</span></h4>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>
              <p className="text-[10px] text-gray-500 font-mono text-right uppercase">65% Complete &bull; 2.4k XP until Level up</p>
            </div>
            <div className="glass-panel p-6 border border-white/10 bg-green-600/5">
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-tighter">Next Milestone: <span className="text-green-400 italic">Data Architect Rank</span></h4>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-500">
                      <Trophy size={14} />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 italic">"You're only 2 boss modules away from professional certification."</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border border-white/10 bg-blue-600/5 flex flex-col justify-between group cursor-pointer hover:border-blue-500/50 transition-all">
          <div className="flex items-center gap-3 text-blue-400 mb-4">
            <Download size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Templates</span>
          </div>
          <h4 className="text-white font-bold mb-2">Enterprise Report Pack</h4>
          <p className="text-xs text-gray-500">24 Professional Word & Excel templates for business use.</p>
        </div>
        <div className="glass-panel p-6 border border-white/10 bg-green-600/5 flex flex-col justify-between group cursor-pointer hover:border-green-500/50 transition-all">
          <div className="flex items-center gap-3 text-green-400 mb-4">
            <PlayCircle size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Tutorials</span>
          </div>
          <h4 className="text-white font-bold mb-2">The Pivot Table Secret</h4>
          <p className="text-xs text-gray-500">Video: Mastering dynamic data summaries in under 10 minutes.</p>
        </div>
        <div className="glass-panel p-6 border border-white/10 bg-orange-600/5 flex flex-col justify-between group cursor-pointer hover:border-orange-500/50 transition-all">
          <div className="flex items-center gap-3 text-orange-400 mb-4">
            <Users size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Community</span>
          </div>
          <h4 className="text-white font-bold mb-2">Formatting Guild</h4>
          <p className="text-xs text-gray-500">Join 400+ students sharing their best document designs.</p>
        </div>
      </div>
    </div>
  );
}

function SkillNode({ title, level, color, pos, icon, desc, locked }: any) {
  const colors: any = {
    blue: 'border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    green: 'border-green-500/50 bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]',
    orange: 'border-orange-500/50 bg-orange-500/10 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
  };

  return (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`absolute ${pos} group z-20`}
    >
      <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${
        locked ? 'border-white/5 bg-white/5 text-gray-600' : colors[color] + ' hover:scale-110'
      }`}>
        {icon}
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 p-3 glass-panel border border-white/10 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
        <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-tighter">{title}</h4>
        <p className="text-[10px] text-gray-500 leading-tight mb-2">{desc}</p>
        {!locked && (
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-current opacity-40" style={{ width: `${level * 10}%` }} />
          </div>
        )}
        {locked && (
          <p className="text-[8px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
            <Lock size={8} /> LOCKED
          </p>
        )}
      </div>
    </motion.div>
  );
}

function SkillCard({ title, level, color }: any) {
  const colors: any = {
    blue: 'from-blue-500 to-blue-700 shadow-blue-900/40',
    green: 'from-green-500 to-green-700 shadow-green-900/40',
    orange: 'from-orange-500 to-orange-700 shadow-orange-900/40'
  };

  return (
    <div className="space-y-3">
      <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${colors[color]} shadow-xl flex items-center justify-center text-3xl font-black text-white italic`}>
        {level}
      </div>
      <div>
        <p className="text-[10px] font-bold text-white uppercase tracking-tight">{title}</p>
        <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
          <div className="h-full bg-white/40" style={{ width: `${level * 20}%` }} />
        </div>
      </div>
    </div>
  );
}
