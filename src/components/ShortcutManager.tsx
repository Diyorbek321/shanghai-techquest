import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, Keyboard, Zap, BrainCircuit, Play, MessageSquare, HelpCircle } from 'lucide-react';

export function ShortcutManager() {
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show cheat sheet on '?'
      if (e.key === '?' && !e.repeat) {
        setShowCheatSheet(true);
      }

      // Ctrl + Space: Trigger AI Mentor
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('toggle-ai-mentor'));
      }

      // Ctrl + Enter: Run Code (Contextual)
      if (e.ctrlKey && e.code === 'Enter') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('run-code-shortcut'));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === '?') {
        setShowCheatSheet(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const shortcuts = [
    { keys: ['Ctrl', 'Space'], label: 'Summon AI Mentor', icon: MessageSquare },
    { keys: ['Ctrl', 'Enter'], label: 'Execute Neural Code', icon: Play },
    { keys: ['G'], label: 'Go to MyWorld', icon: Zap },
    { keys: ['L'], label: 'View Leaderboard', icon: HelpCircle },
    { keys: ['?'], label: 'Hold for Shortcut Matrix', icon: Keyboard },
  ];

  return (
    <AnimatePresence>
      {showCheatSheet && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-brand-sidebar/95 border border-brand-cyan/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,217,255,0.2)] max-w-xl w-full"
          >
            <div className="flex items-center gap-3 mb-8 border-b border-brand-cyan/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                <Command size={24} />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider">Neural Interface Shortcuts</h2>
                <p className="text-xs text-brand-cyan/60 font-mono uppercase tracking-widest">Global Command Matrix v1.0.4</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 group hover:border-brand-cyan/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-brand-cyan transition-colors">
                      <s.icon size={18} />
                    </div>
                    <span className="text-sm font-bold text-gray-300">{s.label}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {s.keys.map(k => (
                      <kbd key={k} className="px-2.5 py-1 bg-brand-sidebar border-b-2 border-brand-cyan/40 rounded text-[10px] font-mono font-bold text-brand-cyan uppercase">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-brand-cyan/10 flex items-center justify-center gap-2">
              <BrainCircuit size={14} className="text-brand-cyan animate-pulse" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Matrix Active • Awaiting Input</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
