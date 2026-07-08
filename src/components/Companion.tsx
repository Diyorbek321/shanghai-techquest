import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle } from 'lucide-react';

export function Companion() {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const messages = [
    "Ready to code? 🚀",
    "Don't forget to check the shop!",
    "Your XP is looking good! ✨",
    "Time for a coding battle? ⚔️",
    "Keep up the streak! 🔥",
    "Need help? Ask the AI Mentor!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
      setTimeout(() => setMessage(''), 5000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-brand-sidebar border border-brand-cyan/30 p-3 rounded-2xl rounded-bl-none shadow-[0_0_15px_rgba(0,217,255,0.2)] mb-8 max-w-[200px]"
          >
            <p className="text-sm font-medium text-white">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative pointer-events-auto cursor-pointer"
        onClick={() => setMessage("I'm here to help! 🤖")}
      >
        {/* Simple 3D-ish Drone/Bot using CSS */}
        <div className="w-16 h-16 relative">
          {/* Aura */}
          <div className="absolute inset-0 bg-brand-cyan/20 rounded-full blur-xl animate-pulse"></div>
          
          {/* Main Body */}
          <div className="absolute inset-1 bg-gradient-to-b from-brand-sidebar to-brand-bg border-2 border-brand-cyan rounded-full shadow-[inset_0_0_15px_rgba(0,217,255,0.5)] overflow-hidden">
            {/* Eye */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-black rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-4 h-full bg-brand-cyan rounded-full shadow-[0_0_10px_rgba(0,217,255,1)]"
              ></motion.div>
            </div>
            
            {/* Details */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-brand-purple rounded-full"></div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-brand-green/50 rounded-full"></div>
          </div>
          
          {/* Wings/Floaters */}
          <motion.div 
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            className="absolute -left-2 top-1/2 w-3 h-6 bg-brand-bg border border-brand-cyan/50 rounded-full origin-right"
          ></motion.div>
          <motion.div 
            animate={{ rotate: [10, -10, 10] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            className="absolute -right-2 top-1/2 w-3 h-6 bg-brand-bg border border-brand-cyan/50 rounded-full origin-left"
          ></motion.div>
        </div>
      </motion.div>
    </div>
  );
}
