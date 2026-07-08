import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Zap } from 'lucide-react';

interface VersusTransitionProps {
  player1: { name: string; avatar: string; level: number };
  player2: { name: string; avatar: string; level: number };
  onComplete: () => void;
}

export function VersusTransition({ player1, player2, onComplete }: VersusTransitionProps) {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 overflow-hidden"
    >
      {/* Background Light Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(0,217,255,0.2)_0%,transparent_70%)]"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      <div className="relative w-full max-w-5xl flex flex-col md:flex-row items-center justify-between px-12 gap-12">
        
        {/* Player 1 */}
        <motion.div 
          initial={{ x: -500, opacity: 0, rotateY: -45 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.2 }}
          className="flex flex-col items-center gap-6 perspective-1000"
        >
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-48 h-48 rounded-2xl bg-brand-cyan/20 border-4 border-brand-cyan shadow-[0_0_50px_rgba(0,217,255,0.5)] overflow-hidden"
            >
              <img src={player1.avatar} alt={player1.name} className="w-full h-full object-cover" />
            </motion.div>
            <div className="absolute -bottom-4 -right-4 bg-brand-cyan text-black px-4 py-1 rounded-lg font-black text-xl italic">
              LVL {player1.level}
            </div>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{player1.name}</h2>
        </motion.div>

        {/* Center VS */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.8 }}
          className="relative z-10"
        >
          <div className="flex flex-col items-center">
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
                filter: ["drop-shadow(0 0 0px #fff)", "drop-shadow(0 0 20px #00D9FF)", "drop-shadow(0 0 0px #fff)"]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-8xl font-black text-white italic tracking-tighter select-none"
            >
              VS
            </motion.div>
            <div className="flex gap-4 mt-4">
              <Zap className="text-brand-cyan animate-pulse" size={32} />
              <Swords className="text-brand-purple animate-bounce" size={32} />
            </div>
          </div>
          
          {/* Energy Beam */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-1 bg-gradient-to-r from-transparent via-brand-cyan to-transparent shadow-[0_0_30px_#00D9FF]"
          />
        </motion.div>

        {/* Player 2 */}
        <motion.div 
          initial={{ x: 500, opacity: 0, rotateY: 45 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.4 }}
          className="flex flex-col items-center gap-6 perspective-1000"
        >
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="w-48 h-48 rounded-2xl bg-brand-purple/20 border-4 border-brand-purple shadow-[0_0_50px_rgba(176,38,255,0.5)] overflow-hidden"
            >
              <img src={player2.avatar} alt={player2.name} className="w-full h-full object-cover" />
            </motion.div>
            <div className="absolute -bottom-4 -left-4 bg-brand-purple text-white px-4 py-1 rounded-lg font-black text-xl italic">
              LVL {player2.level}
            </div>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{player2.name}</h2>
        </motion.div>

      </div>

      {/* Speed Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -1000, y: Math.random() * 1000 }}
            animate={{ x: 2000 }}
            transition={{ 
              duration: 0.2 + Math.random() * 0.3, 
              repeat: Infinity, 
              delay: Math.random() * 2 
            }}
            className="absolute h-0.5 w-64 bg-white"
          />
        ))}
      </div>
    </motion.div>
  );
}
