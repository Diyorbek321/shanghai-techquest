import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Swords, 
  Clock, 
  Code, 
  Send, 
  CheckCircle2, 
  BrainCircuit, 
  Trophy, 
  AlertTriangle,
  Zap,
  ChevronRight,
  Terminal,
  Target
} from 'lucide-react';
import { User, ViewType } from '../types';

interface BattleProps {
  user: User;
  onNavigate: (view: ViewType) => void;
}

export function Battle({ user, onNavigate }: BattleProps) {
  const [phase, setPhase] = useState<'countdown' | 'coding' | 'submitting' | 'judging' | 'results'>('countdown');
  const [timer, setTimer] = useState(120); // 2 minutes
  const [countdown, setCountdown] = useState(3);
  const [submission, setSubmission] = useState('');
  const [winner, setWinner] = useState<any>(null);

  const opponent = {
    name: 'Cyber_Shadow',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow',
    level: 28
  };

  const task = {
    title: "Responsive Matrix Navigation",
    description: "Create a navigation bar that uses CSS Grid. It must collapse into a hamburger menu on screens smaller than 768px and feature a 'glitch' effect on hover for the logo.",
    constraints: [
      "Use only Tailwind CSS and React",
      "Must be fully responsive",
      "Include at least 4 navigation links",
      "Logo must have a unique animation"
    ]
  };

  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'countdown' && countdown === 0) {
      setPhase('coding');
    }
  }, [phase, countdown]);

  useEffect(() => {
    if (phase === 'coding' && timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (phase === 'coding' && timer === 0) {
      handleFinalSubmit();
    }
  }, [phase, timer]);

  const handleFinalSubmit = () => {
    setPhase('submitting');
    setTimeout(() => {
      setPhase('judging');
      simulateJudging();
    }, 2000);
  };

  const simulateJudging = () => {
    setTimeout(() => {
      setWinner({
        name: user.name,
        score: 94,
        reason: "Exceptional use of semantic HTML and creative hover state implementation.",
        stats: { clarity: 98, speed: 85, readability: 92 }
      });
      setPhase('results');
    }, 4000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[80vh] flex flex-col gap-6 max-w-6xl mx-auto py-6">
      
      {/* Header Info */}
      <div className="flex items-center justify-between glass-panel p-4 border border-white/10 rounded-2xl bg-black/40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-brand-cyan" alt="" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-mono">Challenger</p>
              <p className="font-bold text-white text-sm">{user.name}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <div className={`text-2xl font-black italic tracking-tighter ${timer < 30 ? 'text-brand-red animate-pulse' : 'text-brand-cyan'}`}>
              {formatTime(timer)}
            </div>
            <p className="text-[10px] text-gray-500 uppercase">System Time Remaining</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-mono">Opponent</p>
              <p className="font-bold text-white text-sm">{opponent.name}</p>
            </div>
            <img src={opponent.avatar} className="w-10 h-10 rounded-full border-2 border-brand-purple" alt="" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-1 bg-brand-red/20 text-brand-red text-xs font-bold rounded-full border border-brand-red/30 uppercase tracking-widest flex items-center gap-2">
            <Swords size={14} /> Live Duel
          </div>
          <button 
            onClick={() => onNavigate('arena')}
            className="text-gray-500 hover:text-white transition-colors text-xs font-bold"
          >
            Forfeit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left: Task & Constraints */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 border border-white/10 rounded-2xl bg-brand-cyan/5 h-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-cyan/20 rounded-lg text-brand-cyan">
                <Target size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">The Challenge</h2>
            </div>
            
            <h3 className="text-brand-cyan font-bold mb-2 uppercase text-xs tracking-widest">{task.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              {task.description}
            </p>

            <div className="space-y-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Protocol Constraints</p>
              {task.constraints.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-gray-400">
                  <div className="mt-0.5 text-brand-cyan"><Zap size={14} /></div>
                  {c}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Center: Coding Interface */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex-1 glass-panel border border-white/10 rounded-2xl overflow-hidden flex flex-col bg-black/60 relative">
            
            <AnimatePresence>
              {phase === 'countdown' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                  <p className="text-brand-cyan text-sm uppercase tracking-[0.3em] font-black mb-4">Initializing Neural Link</p>
                  <div className="text-9xl font-black text-white italic">{countdown === 0 ? 'GO!' : countdown}</div>
                </motion.div>
              )}

              {phase === 'judging' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
                >
                  <BrainCircuit size={64} className="text-brand-purple animate-pulse mb-6" />
                  <p className="text-brand-purple text-xl font-black uppercase tracking-[0.2em] mb-2">Neural Judge Active</p>
                  <p className="text-gray-500 text-sm font-mono">Analyzing codebase for clarity and logic flow...</p>
                  <div className="mt-8 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="h-full w-1/3 bg-brand-purple shadow-[0_0_15px_#B026FF]"
                    />
                  </div>
                </motion.div>
              )}

              {phase === 'results' && winner && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-12 overflow-y-auto"
                >
                  <div className="text-center mb-8">
                    <Trophy size={64} className="text-[#FFD700] mx-auto mb-4" />
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Victory Declared</h2>
                    <p className="text-brand-cyan font-mono text-sm">Winner: {winner.name}</p>
                  </div>

                  <div className="w-full max-w-md space-y-6">
                    <div className="glass-panel p-6 border border-brand-cyan/30 bg-brand-cyan/5 rounded-2xl">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Judge Analysis</p>
                      <p className="text-gray-200 text-sm italic">"{winner.reason}"</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Clarity', val: winner.stats.clarity, color: 'text-brand-cyan' },
                        { label: 'Logic', val: winner.stats.speed, color: 'text-brand-purple' },
                        { label: 'Style', val: winner.stats.readability, color: 'text-brand-orange' },
                      ].map((s, i) => (
                        <div key={i} className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-[10px] text-gray-500 uppercase mb-1">{s.label}</p>
                          <p className={`text-xl font-black ${s.color}`}>{s.val}%</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={() => onNavigate('arena')}
                        className="flex-1 py-3 bg-brand-cyan text-black font-black rounded-xl hover:bg-brand-cyan/80 transition-all uppercase text-sm"
                      >
                        Return to Arena
                      </button>
                      <button 
                        className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all uppercase text-sm"
                      >
                        Save Snippet
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code Editor Header */}
            <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 px-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="h-4 w-px bg-white/10 mx-2" />
                <span className="text-[10px] text-gray-500 font-mono uppercase flex items-center gap-2">
                  <Terminal size={12} /> index.tsx — Edit Mode Active
                </span>
              </div>
              <div className="flex gap-2">
                <div className="text-[10px] text-gray-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" /> Opponent is typing...
                </div>
              </div>
            </div>

            {/* Simulated Code Editor Area */}
            <div className="flex-1 relative font-mono text-sm overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-white/5 border-r border-white/5 flex flex-col items-center pt-4 text-gray-600 select-none">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className="h-6 flex items-center">{i + 1}</div>
                ))}
              </div>
              <textarea 
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="// Start coding your solution here..."
                className="absolute inset-0 left-12 w-[calc(100%-3rem)] h-full bg-transparent p-4 text-brand-cyan placeholder:text-gray-700 focus:outline-none resize-none z-10"
                spellCheck={false}
              />
              <div className="absolute inset-0 left-12 p-4 pointer-events-none opacity-20">
                <div className="text-gray-400">
                  {"<nav className=\"fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-white/10 z-50\">\n  <div className=\"max-w-7xl mx-auto px-4 h-16 flex items-center justify-between\">\n    <div className=\"text-xl font-black italic tracking-tighter\">\n      LOG<span className=\"text-brand-cyan\">O</span>\n    </div>\n    ..."}
                </div>
              </div>
            </div>

            {/* Status Footer */}
            <div className="p-4 bg-brand-cyan/5 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-brand-cyan" /> Autocomplete Ready</span>
                <span className="flex items-center gap-1"><AlertTriangle size={12} /> 0 Syntax Errors</span>
              </div>
              <button 
                onClick={handleFinalSubmit}
                disabled={phase !== 'coding'}
                className="flex items-center gap-2 px-6 py-2 bg-brand-cyan text-black font-black rounded-lg hover:bg-brand-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,217,255,0.3)] uppercase text-xs"
              >
                <Send size={14} /> Submit Solution
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
