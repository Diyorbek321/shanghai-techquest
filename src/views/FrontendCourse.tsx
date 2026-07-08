import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Code, 
  Terminal, 
  Zap, 
  ShieldAlert, 
  Check, 
  Lock, 
  ChevronRight, 
  PlayCircle, 
  FileText, 
  Download, 
  ExternalLink,
  Users,
  Monitor,
  MapPin,
  Mic,
  MessageSquare,
  Calendar,
  Clock,
  QrCode,
  Hand,
  Info
} from 'lucide-react';
import { User, ViewType } from '../types';
import { SkillTree } from '../components/SkillTree';

export function FrontendCourse({ onNavigate, onTriggerSuccess }: { onNavigate: (view: ViewType) => void, onTriggerSuccess: () => void }) {
  const [activeTab, setActiveTab] = React.useState<'path' | 'skills' | 'gallery' | 'roadmap' | 'resources' | 'hybrid'>('path');

  const modules = [
    { 
      id: 1, 
      title: 'HTML Foundations', 
      desc: 'Construct the structural grid.', 
      status: 'completed', 
      icon: BookOpen,
      xp: 150,
      type: 'lesson',
      isHybrid: true
    },
    { 
      id: 2, 
      title: 'CSS Cyber-Styling', 
      desc: 'Inject neon aesthetics and flex layouts.', 
      status: 'completed', 
      icon: Code,
      xp: 200,
      type: 'lesson',
      isHybrid: true
    },
    { 
      id: 3, 
      title: 'JS Logic Gates', 
      desc: 'Hack the DOM and wire up interactivity.', 
      status: 'active', 
      icon: Terminal,
      xp: 350,
      type: 'lesson',
      isHybrid: false
    },
    { 
      id: 4, 
      title: 'BOSS: The Responsive Hydra', 
      desc: 'Defeat the layout bugs across 3 device breakpoints.', 
      status: 'locked', 
      icon: ShieldAlert,
      xp: 1000,
      type: 'boss',
      reward: 'Neon Plasma Glass (Material)'
    },
    { 
      id: 5, 
      title: 'React Components', 
      desc: 'Build modular UI components.', 
      status: 'locked', 
      icon: Zap,
      xp: 400,
      type: 'lesson'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-brand-cyan/20 to-transparent p-6 rounded-2xl border border-brand-cyan/30 shadow-[0_0_20px_rgba(0,217,255,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="relative z-10">
          <button 
            onClick={() => onNavigate('classes')}
            className="text-brand-cyan text-sm flex items-center gap-1 hover:underline mb-2"
          >
            &lt; Back to Classes
          </button>
          <div className="inline-block px-2 py-1 bg-brand-cyan/20 text-brand-cyan text-xs font-bold uppercase tracking-wider rounded border border-brand-cyan/50 mb-2">
            Active Campaign
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-2 text-white drop-shadow-md">
            Frontend Web Mastery
          </h1>
          <p className="text-gray-300 max-w-xl">
            Infiltrate the frontend architecture. Master HTML, CSS, and JavaScript to build immersive digital experiences and defeat the layout bosses.
          </p>
        </div>

        <div className="relative z-10 bg-black/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm flex items-center gap-4 min-w-[200px]">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Campaign Progress</div>
            <div className="text-2xl font-bold text-brand-cyan font-mono">40%</div>
          </div>
          <div className="flex-1">
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '40%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple shadow-[0_0_10px_rgba(0,217,255,0.8)]"
              ></motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto hide-scrollbar">
        {[
          { id: 'path', label: 'Campaign Path' },
          { id: 'roadmap', label: 'Interactive Roadmap' },
          { id: 'hybrid', label: 'Hybrid Live Hub' },
          { id: 'skills', label: 'Skill Tree' },
          { id: 'resources', label: 'Lesson Resources' },
          { id: 'gallery', label: 'Student Gallery' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-brand-cyan text-brand-cyan' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Roadmap Visualization */}
      {activeTab === 'roadmap' && (
        <div className="py-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              { id: 'm1', title: 'Phase 1: Foundations', milestones: [
                { name: 'HTML Structure', progress: 100, dep: null },
                { name: 'CSS Selectors', progress: 100, dep: 'HTML Structure' },
                { name: 'Box Model', progress: 100, dep: 'CSS Selectors' }
              ]},
              { id: 'm2', title: 'Phase 2: Logic & Interactivity', milestones: [
                { name: 'JS Basics', progress: 40, dep: 'Box Model' },
                { name: 'DOM Manipulation', progress: 10, dep: 'JS Basics' },
                { name: 'Event Listeners', progress: 0, dep: 'DOM Manipulation' }
              ]},
              { id: 'm3', title: 'Phase 3: Frameworks', milestones: [
                { name: 'React Intro', progress: 0, dep: 'JS Basics' },
                { name: 'Hooks & State', progress: 0, dep: 'React Intro' },
                { name: 'Advanced API', progress: 0, dep: 'Hooks & State' }
              ]}
            ].map((phase, i) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 border border-white/10 flex flex-col gap-4"
              >
                <h3 className="font-bold text-lg text-brand-cyan">{phase.title}</h3>
                <div className="space-y-6">
                  {phase.milestones.map((ms, j) => (
                    <div key={j} className="relative">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white font-medium flex items-center gap-2">
                          {ms.progress === 100 ? <Check size={14} className="text-brand-green" /> : <ChevronRight size={14} />}
                          {ms.name}
                        </span>
                        <span className="text-gray-500">{ms.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${ms.progress}%` }}
                          transition={{ duration: 1, delay: i * 0.1 + j * 0.1 }}
                          className={`h-full ${ms.progress === 100 ? 'bg-brand-green' : 'bg-brand-cyan shadow-[0_0_8px_rgba(0,217,255,0.5)]'}`}
                        />
                      </div>
                      {ms.dep && (
                        <div className="text-[10px] text-gray-500 mt-1 italic flex items-center gap-1">
                          <Lock size={10} /> Requires: {ms.dep}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-brand-purple/10 border border-brand-purple/30 p-6 rounded-xl flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple border border-brand-purple/50">
              <Zap size={32} />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1 text-lg">Next Critical Milestone: Master JavaScript Basics</h4>
              <p className="text-gray-400 text-sm">You are currently 40% through Phase 2. Complete the remaining challenges to unlock the React Framework track.</p>
            </div>
            <button 
              onClick={() => onNavigate('codelab')}
              className="ml-auto px-6 py-2 bg-brand-purple text-white font-bold rounded-lg hover:bg-brand-purple/80 transition-colors shadow-[0_0_15px_rgba(176,38,255,0.4)]"
            >
              Continue Project
            </button>
          </div>
        </div>
      )}

      {/* Interactive Path */}
      {activeTab === 'path' && (
      <div className="relative py-8">
        {/* Connecting Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-800 -translate-x-1/2 rounded-full z-0">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '55%' }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
            className="w-full bg-gradient-to-b from-brand-cyan via-brand-purple to-transparent shadow-[0_0_15px_rgba(0,217,255,0.5)]"
          ></motion.div>
        </div>

        <div className="space-y-12 relative z-10">
          {modules.map((mod, index) => {
            const isEven = index % 2 === 0;
            const isCompleted = mod.status === 'completed';
            const isActive = mod.status === 'active';
            const isLocked = mod.status === 'locked';
            const isBoss = mod.type === 'boss';

            return (
              <div key={mod.id} className={`flex flex-col md:flex-row items-center gap-6 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Node Spacer for Desktop */}
                <div className="hidden md:block md:flex-1"></div>

                {/* Node Icon/Avatar */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center border-4 relative z-10 ${
                    isCompleted ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-[0_0_20px_rgba(0,217,255,0.4)]' :
                    isActive ? 'bg-brand-purple/20 border-brand-purple text-brand-purple shadow-[0_0_20px_rgba(176,38,255,0.6)] animate-pulse' :
                    isBoss ? 'bg-red-500/10 border-red-500/50 text-red-500/50' :
                    'bg-gray-900 border-gray-700 text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check size={24} /> : isLocked ? <Lock size={24} /> : <mod.icon size={28} />}
                </motion.div>

                {/* Node Content Card */}
                <motion.div 
                  initial={{ x: isEven ? 50 : -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.2 }}
                  className={`flex-1 w-full max-w-md glass-panel p-5 relative group ${
                    isActive ? 'border-brand-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.1)]' : 
                    isBoss && !isLocked ? 'border-red-500/50 bg-red-500/5' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      <div className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isBoss ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-300'
                      }`}>
                        {isBoss ? 'Boss Battle' : `Module ${mod.id}`}
                      </div>
                      {mod.isHybrid && (
                        <div className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded border border-brand-cyan/30 flex items-center gap-1 font-bold">
                          <Users size={10} /> HYBRID
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-mono text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/20">
                      +{mod.xp} XP
                    </div>
                  </div>
                  
                  <h3 className={`font-bold text-xl mb-2 ${isBoss ? 'text-red-400' : 'text-white'}`}>
                    {mod.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {mod.desc}
                  </p>

                  {isBoss && mod.reward && (
                    <div className="mb-4 text-xs bg-brand-green/10 text-brand-green border border-brand-green/30 p-2 rounded flex items-center gap-2">
                      <Zap size={14} /> Boss Reward: {mod.reward}
                    </div>
                  )}

                  {isActive && (
                    <button 
                      onClick={() => onNavigate('codelab')}
                      className="w-full bg-brand-purple hover:bg-brand-purple/80 text-white font-bold py-2 rounded transition-colors flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(176,38,255,0.3)]"
                    >
                      <PlayCircle size={18} /> Start Mission
                    </button>
                  )}
                  
                  {isCompleted && (
                    <button className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-2 rounded transition-colors flex items-center justify-center gap-2 border border-white/10">
                      Review Code
                    </button>
                  )}

                  {isLocked && (
                    <button 
                      onClick={onTriggerSuccess}
                      className="w-full bg-gray-900/50 text-gray-500 font-medium py-2 rounded flex items-center justify-center gap-2 border border-gray-800 hover:border-brand-cyan/30 transition-all"
                    >
                      <Lock size={16} /> Simulate Completion
                    </button>
                  )}
                </motion.div>

              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Skill Tree */}
      {activeTab === 'skills' && (
        <div className="py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Technical Mastery Tree</h2>
            <p className="text-gray-400">Unlock advanced techniques by completing core modules and projects.</p>
          </div>
          <SkillTree />
        </div>
      )}

      {/* Student Gallery */}
      {activeTab === 'gallery' && (
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Featured Community Projects</h2>
            <button className="bg-brand-cyan hover:bg-brand-cyan/80 text-black font-bold py-2 px-4 rounded transition-colors text-sm">
              Submit Project
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { author: 'NeonCoder', title: 'Cyberpunk Portfolio', likes: 142, img: 'bg-brand-purple/20' },
              { author: 'Sarah.JS', title: 'Weather Dashboard', likes: 98, img: 'bg-brand-cyan/20' },
              { author: 'Alex_Dev', title: 'React Calculator', likes: 56, img: 'bg-brand-orange/20' },
            ].map((proj, i) => (
              <div key={i} className="glass-panel overflow-hidden border border-white/10 hover:border-brand-cyan/30 transition-colors group cursor-pointer">
                <div className={`h-40 ${proj.img} relative flex items-center justify-center`}>
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                   <Code size={48} className="text-white/30" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-brand-cyan transition-colors">{proj.title}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">by {proj.author}</span>
                    <span className="text-[#FFD700] font-bold flex items-center gap-1">♥️ {proj.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hybrid Hub */}
      {activeTab === 'hybrid' && (
        <div className="py-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Session Status */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 border border-brand-cyan/30 bg-brand-cyan/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-brand-red animate-pulse text-white text-[10px] font-black rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div> LIVE NOW
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 rounded-2xl bg-brand-cyan/20 flex items-center justify-center text-brand-cyan border border-brand-cyan/30 shrink-0">
                    <Monitor size={48} />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-black text-white italic tracking-tight mb-1 uppercase">Advanced JS: Asynchronous Patterns</h2>
                      <p className="text-gray-400 text-sm">Instructor: <span className="text-brand-cyan font-bold">Dr. Neural_Node</span> | Room 402 & Online</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        <Calendar size={14} className="text-brand-cyan" /> Today, 10:00 AM
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        <Users size={14} className="text-brand-purple" /> 24 Students Active
                      </div>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button className="px-8 py-3 bg-brand-cyan text-black font-black rounded-xl hover:bg-brand-cyan/80 transition-all shadow-[0_0_20px_rgba(0,217,255,0.4)] uppercase text-sm flex items-center gap-2">
                        <PlayCircle size={18} /> Join Stream
                      </button>
                      <button className="px-6 py-3 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all uppercase text-sm">
                        View Slides
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 border border-white/10 bg-black/40 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-purple/20 rounded-lg text-brand-purple">
                      <Hand size={20} />
                    </div>
                    <h3 className="font-bold text-white">Live Interaction</h3>
                  </div>
                  <p className="text-xs text-gray-400">Feeling lost? Use the buttons below to notify the instructor in real-time.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-brand-purple/20 hover:border-brand-purple/50 transition-all text-xs font-bold text-gray-300 flex flex-col items-center gap-2">
                      <Mic size={18} /> Raise Hand
                    </button>
                    <button className="py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-brand-cyan/20 hover:border-brand-cyan/50 transition-all text-xs font-bold text-gray-300 flex flex-col items-center gap-2">
                      <MessageSquare size={18} /> Quick Question
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-6 border border-white/10 bg-black/40 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-orange/20 rounded-lg text-brand-orange">
                      <Clock size={20} />
                    </div>
                    <h3 className="font-bold text-white">Class Timeline</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { time: '10:00', event: 'Introduction to Promises', status: 'done' },
                      { time: '10:30', event: 'Async/Await Deep Dive', status: 'active' },
                      { time: '11:15', event: 'Hands-on Lab: Fetch API', status: 'upcoming' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-gray-500 w-10">{item.time}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'done' ? 'bg-brand-green' : item.status === 'active' ? 'bg-brand-cyan animate-pulse' : 'bg-gray-700'}`}></div>
                        <span className={`text-[11px] ${item.status === 'active' ? 'text-white font-bold' : 'text-gray-400'}`}>{item.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance & Campus Info */}
            <div className="space-y-6">
              <div className="glass-panel p-6 border border-white/10 bg-black/40 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 text-brand-cyan/5 -rotate-12">
                  <QrCode size={120} />
                </div>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                  <MapPin size={16} className="text-brand-cyan" /> 
                  Physical Check-in
                </h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Attending in-person at the <span className="text-white font-bold">Main Tech Hub</span>? Scan the classroom QR code or use the button below.
                </p>
                <button className="w-full py-3 bg-brand-cyan text-black font-black rounded-xl hover:bg-brand-cyan/80 transition-all uppercase text-xs shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                  Check-in Now
                </button>
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-mono">Location Status</span>
                  <span className="text-[10px] text-brand-green font-bold">ON-SITE VALIDATED</span>
                </div>
              </div>

              <div className="glass-panel p-6 border border-white/10 bg-black/40">
                <h3 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Hybrid Community</h3>
                <div className="space-y-4">
                  <div className="flex -space-x-3 overflow-hidden">
                    {[1, 2, 3, 4, 5].map(i => (
                      <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-black" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="" />
                    ))}
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-purple ring-2 ring-black text-[10px] font-bold text-white">
                      +12
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400">Other students are currently active in this hybrid session.</p>
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-gray-300 transition-colors">
                    View Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hybrid FAQ/Info */}
          <div className="bg-brand-purple/10 border border-brand-purple/30 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
             <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">
               <Info size={24} />
             </div>
             <div className="flex-1">
               <h4 className="text-white font-bold">How Hybrid Education Works</h4>
               <p className="text-gray-400 text-sm">Join via the stream from home, or visit our physical campus. All progress, XP, and materials are synced across both environments in real-time.</p>
             </div>
             <div className="flex gap-4">
               <button className="text-xs font-bold text-brand-purple hover:underline">Campus Map</button>
               <button className="text-xs font-bold text-brand-purple hover:underline">Help Center</button>
             </div>
          </div>
        </div>
      )}

      {/* Lesson Resources */}
      {activeTab === 'resources' && (
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Lesson PowerPoints & Materials</h2>
              <p className="text-gray-400">Access exclusive study materials uploaded by your instructors.</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></div>
              <span className="text-xs text-gray-300 font-mono">New Materials Added Today</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                title: 'Introduction to Web Architecture', 
                type: 'PPTX', 
                size: '4.2 MB', 
                addedBy: 'Dr. Cyber', 
                date: '2024-05-15',
                desc: 'Comprehensive overview of how the web works, from DNS to rendering.'
              },
              { 
                title: 'Advanced CSS Flexbox & Grid', 
                type: 'PPTX', 
                size: '6.8 MB', 
                addedBy: 'Prof. Neon', 
                date: '2024-05-18',
                desc: 'Deep dive into modern layout techniques with real-world examples.'
              },
              { 
                title: 'JavaScript Logic & DOM Flow', 
                type: 'PDF', 
                size: '2.1 MB', 
                addedBy: 'Dr. Cyber', 
                date: '2024-05-20',
                desc: 'Visual diagrams of execution context and DOM event propagation.'
              },
              { 
                title: 'React Hooks Mastery', 
                type: 'PPTX', 
                size: '5.5 MB', 
                addedBy: 'Prof. Neon', 
                date: '2024-05-22',
                desc: 'Step-by-step guide to useState, useEffect, and custom hooks.'
              },
            ].map((resource, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel border border-white/10 hover:border-brand-cyan/50 transition-all p-5 flex gap-4 group"
              >
                <div className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center ${
                  resource.type === 'PPTX' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 
                  'bg-red-500/20 text-red-500 border border-red-500/30'
                }`}>
                  <FileText size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white truncate group-hover:text-brand-cyan transition-colors">
                      {resource.title}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                    {resource.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Instructor</span>
                        <span className="text-xs text-gray-300">{resource.addedBy}</span>
                      </div>
                      <div className="w-px h-6 bg-white/10"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Size</span>
                        <span className="text-xs text-gray-300">{resource.size}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-white/5 hover:bg-brand-cyan/20 text-gray-400 hover:text-brand-cyan rounded-lg border border-white/10 transition-all">
                        <ExternalLink size={16} />
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 bg-brand-cyan/10 hover:bg-brand-cyan text-brand-cyan hover:text-black font-bold text-xs rounded-lg border border-brand-cyan/30 transition-all">
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan border border-brand-cyan/20">
              <BookOpen size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-white font-bold text-lg mb-1">Missing a Resource?</h4>
              <p className="text-gray-400 text-sm">If you can't find a specific lesson PowerPoint, please contact your instructor or check the Mission Log for recent updates.</p>
            </div>
            <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-colors">
              Request Resource
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
