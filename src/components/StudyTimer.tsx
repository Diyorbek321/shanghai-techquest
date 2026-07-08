import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Play, Pause, RotateCcw, Zap, Trophy } from 'lucide-react';

export function StudyTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          setShowReward(true);
          setTimeout(() => setShowReward(false), 5000);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="relative">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-4 border border-white/10 bg-black/40 w-full"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Timer size={16} className="text-brand-cyan" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Deep Focus</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-brand-purple font-bold">
            <Zap size={10} /> +50 XP / Session
          </div>
        </div>

        <div className="text-3xl font-black text-white font-mono text-center mb-4 tracking-tighter">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={toggleTimer}
            className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all ${
              isActive ? 'bg-white/10 text-white' : 'bg-brand-cyan text-black shadow-[0_0_15px_rgba(0,217,255,0.3)]'
            }`}
          >
            {isActive ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            {isActive ? 'Pause' : 'Focus'}
          </button>
          <button 
            onClick={resetTimer}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 rounded-2xl border border-brand-cyan/50 shadow-[0_0_30px_rgba(0,217,255,0.2)]"
          >
            <Trophy className="text-[#FFD700] mb-2" size={32} />
            <p className="text-xs font-black text-white uppercase italic">Session Complete!</p>
            <p className="text-[10px] text-brand-cyan font-bold">+50 XP EARNED</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
