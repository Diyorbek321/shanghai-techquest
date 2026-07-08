import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

export function SuccessParticles({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#00D9FF', '#B026FF', '#FFD700', '#FF3E3E'];
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: Math.random(),
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        duration: Math.random() * 1 + 1,
        delay: Math.random() * 0.2
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 2500);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ 
              x: p.x, 
              y: p.y, 
              opacity: 0, 
              scale: 1,
              rotate: 360 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: p.duration, 
              delay: p.delay,
              ease: "easeOut"
            }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${p.color}`
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
