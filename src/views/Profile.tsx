import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Globe, MapPin, Calendar, Award, Zap, Shield, Star, Crown } from 'lucide-react';
import { User } from '../types';

interface Badge {
  id: string;
  name: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  howToEarn: string;
  unlocked: boolean;
}

const BADGES: Badge[] = [
  { id: '1', name: 'First Hack', icon: <Zap className="w-6 h-6" />, rarity: 'common', howToEarn: 'Complete your first CodeLab challenge.', unlocked: true },
  { id: '2', name: 'UI Architect', icon: <Shield className="w-6 h-6" />, rarity: 'rare', howToEarn: 'Complete the Responsive Hydra boss battle.', unlocked: true },
  { id: '3', name: 'Algorithm Master', icon: <Star className="w-6 h-6" />, rarity: 'epic', howToEarn: 'Solve 50 coding problems in the Arena.', unlocked: true },
  { id: '4', name: 'Cyber Mayor', icon: <Crown className="w-6 h-6" />, rarity: 'legendary', howToEarn: 'Reach City Level 10 in MyWorld.', unlocked: false },
];

function BadgeCaseOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [hoveredBadge, setHoveredBadge] = useState<Badge | null>(null);

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400/30';
      case 'rare': return 'text-brand-cyan border-brand-cyan/50 shadow-[0_0_10px_rgba(0,217,255,0.3)]';
      case 'epic': return 'text-brand-purple border-brand-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.4)]';
      case 'legendary': return 'text-[#FFD700] border-[#FFD700]/50 shadow-[0_0_20px_rgba(255,215,0,0.5)]';
    }
  };

  const getRarityBg = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-400/10';
      case 'rare': return 'bg-brand-cyan/10';
      case 'epic': return 'bg-brand-purple/10';
      case 'legendary': return 'bg-[#FFD700]/10';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl glass-panel p-8 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-heading font-bold text-white mb-2">Badge Case</h2>
                <p className="text-gray-400 text-sm">Your collection of cybernetic honors and achievements.</p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white p-2">&times;</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {BADGES.map((badge) => (
                <div key={badge.id} className="relative group">
                  <motion.div
                    onMouseEnter={() => setHoveredBadge(badge)}
                    onMouseLeave={() => setHoveredBadge(null)}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`aspect-square rounded-2xl border-2 flex items-center justify-center relative cursor-help transition-all duration-300 ${badge.unlocked ? getRarityColor(badge.rarity) : 'border-gray-800 text-gray-800 grayscale'} ${getRarityBg(badge.rarity)}`}
                  >
                    {badge.icon}
                    {badge.unlocked && badge.rarity === 'legendary' && (
                      <motion.div
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl"
                      />
                    )}
                  </motion.div>
                  <p className={`mt-2 text-center text-xs font-bold uppercase tracking-widest ${badge.unlocked ? 'text-white' : 'text-gray-700'}`}>{badge.name}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 h-24 border-t border-white/10 pt-4 relative">
              <AnimatePresence mode="wait">
                {hoveredBadge ? (
                  <motion.div
                    key={hoveredBadge.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{hoveredBadge.name}</span>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${getRarityBg(hoveredBadge.rarity)} ${getRarityColor(hoveredBadge.rarity)}`}>{hoveredBadge.rarity}</span>
                    </div>
                    <p className="text-gray-400 text-sm italic">"{hoveredBadge.howToEarn}"</p>
                  </motion.div>
                ) : (
                  <div className="text-gray-600 text-sm italic flex items-center h-full justify-center">Hover over a badge to see details</div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ProfileProps {
  user: User;
  onRoleToggle?: () => void;
}

export function Profile({ user, onRoleToggle }: ProfileProps) {
  const [isBadgeCaseOpen, setIsBadgeCaseOpen] = useState(false);
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Header Profile Card */}
      <div className="glass-panel overflow-hidden border-0 relative shadow-2xl">
        <div className="h-48 bg-gradient-to-r from-[#0A0E27] via-brand-purple/40 to-brand-cyan/20 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
          
          {/* Role Badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${user.role === 'teacher' ? 'bg-brand-purple animate-pulse' : 'bg-brand-cyan'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">{user.role} Account</span>
          </div>
        </div>
        
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 sm:-mt-20 mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-brand-bg bg-brand-bg p-1 relative z-10">
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              </div>
              {/* Level ring */}
              <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90 z-0" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <circle cx="50" cy="50" r="48" fill="none" stroke="#B026FF" strokeWidth="4" strokeDasharray="301.59" strokeDashoffset="60" className="drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]" />
              </svg>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-brand-bg px-4 py-1 rounded-full border border-brand-purple text-xs font-bold whitespace-nowrap z-20 shadow-[0_0_10px_rgba(176,38,255,0.5)]">
                Lvl {user.level}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-1 text-white">{user.name}</h1>
              <p className="text-brand-cyan font-medium mb-3">{user.title}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={14} /> Shanghai, CN</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> Joined Sep 2025</span>
              </div>
            </div>
            
            <div className="flex gap-2 shrink-0">
              {onRoleToggle && (
                <button 
                  onClick={onRoleToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 font-semibold rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  <Shield size={18} />
                  Switch to {user.role === 'student' ? 'Teacher' : 'Student'}
                </button>
              )}
              <button onClick={() => setIsBadgeCaseOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-purple/20 text-brand-purple font-semibold rounded-lg hover:bg-brand-purple/30 transition-colors border border-brand-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.2)]">
                <Award size={18} />
                View Badges
              </button>
            </div>
          </div>

          <BadgeCaseOverlay isOpen={isBadgeCaseOpen} onClose={() => setIsBadgeCaseOpen(false)} />

          <p className="text-gray-300 max-w-3xl text-sm leading-relaxed mb-8">
            Passionate frontend developer exploring the intersection of design and code. Currently mastering React and diving deep into UI animations. Always looking for the next hackathon to test my skills.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-black/30 p-4 rounded-xl border border-brand-border">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total XP</div>
              <div className="text-2xl font-mono font-bold text-white">{user.xp.toLocaleString()}</div>
            </motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-black/30 p-4 rounded-xl border border-brand-border">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Courses</div>
              <div className="text-2xl font-mono font-bold text-white">8<span className="text-sm text-gray-500 ml-1">completed</span></div>
            </motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-black/30 p-4 rounded-xl border border-brand-border">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Projects</div>
              <div className="text-2xl font-mono font-bold text-white">14</div>
            </motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-black/30 p-4 rounded-xl border border-brand-border relative overflow-hidden">
              <div className="absolute -right-2 -bottom-2 text-brand-orange opacity-20">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
              </div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Streak</div>
              <div className="text-2xl font-mono font-bold text-brand-orange">{user.streak} days</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-brand-border px-2">
        {['Overview', 'Projects', 'Skills', 'Activity'].map((tab, i) => (
          <button key={tab} className={`py-3 text-sm font-medium border-b-2 transition-colors ${
            i === 0 ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-gray-400 hover:text-white'
          }`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2"><Award className="text-brand-purple" /> Featured Projects</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="glass-panel p-0 overflow-hidden group border border-brand-border hover:border-brand-purple/50 transition-colors">
                <div className="h-32 bg-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/20 to-brand-cyan/20"></div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold mb-1 group-hover:text-brand-purple transition-colors">E-Commerce Dashboard UI</h4>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">A fully responsive dashboard built with React and Tailwind CSS. Features dark mode and complex grid layouts.</p>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">React</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">Tailwind</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="font-bold text-lg">Top Skills</h3>
          <div className="glass-panel p-5 space-y-4">
            {[
              { name: 'JavaScript', val: 90, color: 'bg-yellow-400' },
              { name: 'React', val: 85, color: 'bg-blue-400' },
              { name: 'CSS/Tailwind', val: 95, color: 'bg-brand-cyan' },
              { name: 'Python', val: 60, color: 'bg-brand-green' },
            ].map(skill => (
              <div key={skill.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{skill.name}</span>
                  <span className="text-gray-400">{skill.val}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className={`${skill.color} h-1.5 rounded-full`} style={{ width: `${skill.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
