import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Trophy, 
  MessageCircle, 
  Zap, 
  Shield, 
  Search, 
  Plus, 
  ChevronRight, 
  Star,
  Swords,
  Flame
} from 'lucide-react';

export function Teams() {
  const teams = [
    { 
      id: 1, 
      name: 'Cyber Sentinels', 
      motto: 'Securing the mainframe, one line at a time.',
      members: 42, 
      level: 15, 
      rank: 4,
      tag: 'SEC',
      color: 'text-brand-cyan',
      glow: 'shadow-[0_0_15px_rgba(0,217,255,0.3)]'
    },
    { 
      id: 2, 
      name: 'Neon Knights', 
      motto: 'Design with speed, deploy with style.',
      members: 38, 
      level: 12, 
      rank: 12,
      tag: 'UIX',
      color: 'text-brand-purple',
      glow: 'shadow-[0_0_15px_rgba(176,38,255,0.3)]'
    },
    { 
      id: 3, 
      name: 'Logic Lords', 
      motto: 'The algorithm is our compass.',
      members: 56, 
      level: 18, 
      rank: 1,
      tag: 'ALG',
      color: 'text-brand-orange',
      glow: 'shadow-[0_0_15px_rgba(255,149,0,0.3)]'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white tracking-tighter flex items-center gap-4">
            Guilds & Factions
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-bg bg-gray-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="Member" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </h1>
          <p className="text-gray-400 mt-2">Join a elite team to tackle group quests and dominate the seasonal rankings.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-brand-cyan hover:bg-brand-cyan/80 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(0,217,255,0.4)]">
            <Plus size={20} />
            Found Guild
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search guilds by name, tag, or philosophy..." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-brand-cyan focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            {teams.map((team, i) => (
              <motion.div 
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel p-6 border border-white/10 rounded-2xl hover:border-white/30 transition-all cursor-pointer group ${team.glow}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-3xl font-heading font-black ${team.color}`}>
                    {team.tag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-brand-cyan transition-colors">{team.name}</h3>
                      <span className="text-[10px] font-mono text-gray-500 bg-black/40 px-2 py-0.5 rounded border border-white/5 uppercase tracking-widest">Rank #{team.rank}</span>
                    </div>
                    <p className="text-sm text-gray-400 italic mb-4 line-clamp-1">"{team.motto}"</p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users size={14} className="text-brand-cyan" />
                        <span className="text-gray-300 font-bold">{team.members}</span> Members
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Zap size={14} className="text-brand-purple" />
                        Level <span className="text-gray-300 font-bold">{team.level}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Flame size={14} className="text-brand-red" />
                        <span className="text-gray-300 font-bold">12d</span> Streak
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-gray-600 group-hover:text-brand-cyan transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar / Leaderboard Preview */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-brand-cyan/5">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Star size={20} className="text-brand-cyan" />
              Seasonal Quests
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-xl border border-brand-cyan/20">
                <p className="text-xs font-bold text-brand-cyan uppercase tracking-tighter mb-1">Global Battle</p>
                <h4 className="text-sm font-bold text-white mb-2">The DDoS Defense Protocols</h4>
                <div className="w-full bg-white/5 h-1.5 rounded-full mb-2">
                  <div className="h-full bg-brand-cyan w-2/3 rounded-full"></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Progress: 65%</span>
                  <span>4d left</span>
                </div>
              </div>
              <button className="w-full py-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan text-xs font-bold rounded-lg border border-brand-cyan/30 transition-all">
                View All Group Quests
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 border border-white/10 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Swords size={20} className="text-brand-red" />
              Faction Wars
            </h2>
            <div className="space-y-3">
              {[
                { faction: 'Front-End Enclave', status: 'Winning', score: '12k' },
                { faction: 'Back-End Bastion', status: 'Trailing', score: '9.5k' },
                { faction: 'Design Dominion', status: 'Idle', score: '4.2k' },
              ].map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-sm text-white font-medium">{f.faction}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-brand-cyan">{f.score}</span>
                    <span className="text-[10px] text-gray-500">{f.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
