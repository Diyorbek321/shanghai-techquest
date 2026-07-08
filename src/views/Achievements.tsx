import React from 'react';
import { Medal, Star, Shield, Zap, Lock, Award } from 'lucide-react';

export function Achievements() {
  const categories = ['All', 'Coding', 'Speed', 'Social', 'Special', 'Secret'];
  
  const badges = [
    { id: 1, name: 'Bug Hunter', desc: 'Found 10 bugs in peer review', icon: Shield, rarity: 'rare', unlocked: true, date: 'May 12' },
    { id: 2, name: 'Night Owl', desc: 'Submitted 5 quests after midnight', icon: Star, rarity: 'epic', unlocked: true, date: 'Jun 01' },
    { id: 3, name: 'Code Ninja', desc: 'Flawless execution on 10 algorithm tests', icon: Zap, rarity: 'legendary', unlocked: false, progress: 7, total: 10 },
    { id: 4, name: 'First Blood', desc: 'First to submit an assignment in class', icon: Medal, rarity: 'common', unlocked: true, date: 'Jan 15' },
    { id: 5, name: 'Helpful Hand', desc: 'Answered 20 questions in forums', icon: Award, rarity: 'rare', unlocked: false, progress: 12, total: 20 },
  ];

  const rarityColors = {
    common: 'from-gray-400 to-gray-600 border-gray-400',
    rare: 'from-brand-cyan to-blue-600 border-brand-cyan shadow-[0_0_15px_rgba(0,217,255,0.3)]',
    epic: 'from-brand-purple to-purple-800 border-brand-purple shadow-[0_0_15px_rgba(176,38,255,0.3)]',
    legendary: 'from-yellow-400 to-orange-500 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.4)]',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <Medal className="text-brand-purple" /> Badges & Achievements
          </h1>
          <p className="text-gray-400">Collect rare badges to show off your mastery.</p>
        </div>
        <div className="flex items-center gap-4 text-center glass-panel p-3 px-6">
          <div>
            <div className="text-2xl font-mono font-bold text-brand-cyan">24</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Earned</div>
          </div>
          <div className="w-px h-8 bg-brand-border"></div>
          <div>
            <div className="text-2xl font-mono font-bold text-brand-purple">3</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Legendary</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat, i) => (
          <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            i === 0 ? 'bg-white text-black' : 'bg-black/40 text-gray-400 hover:text-white border border-brand-border'
          }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge) => (
          <div key={badge.id} className="glass-panel p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform relative overflow-hidden">
            {badge.unlocked && (
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}
            
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 relative ${
              badge.unlocked 
                ? `bg-gradient-to-br ${rarityColors[badge.rarity as keyof typeof rarityColors]} border-2`
                : 'bg-black border-2 border-gray-700'
            }`}>
              {badge.unlocked ? (
                <badge.icon size={40} className="text-white drop-shadow-lg" />
              ) : (
                <Lock size={32} className="text-gray-600" />
              )}
              {badge.unlocked && (
                <div className="absolute -inset-2 rounded-full border border-white/20 animate-[spin_10s_linear_infinite]"></div>
              )}
            </div>

            <span className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${
              badge.unlocked ? (
                badge.rarity === 'legendary' ? 'text-yellow-400' :
                badge.rarity === 'epic' ? 'text-brand-purple' :
                badge.rarity === 'rare' ? 'text-brand-cyan' : 'text-gray-300'
              ) : 'text-gray-600'
            }`}>
              {badge.rarity}
            </span>
            
            <h3 className={`font-bold text-lg mb-2 ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>{badge.name}</h3>
            <p className="text-xs text-gray-400 mb-4 h-8">{badge.desc}</p>
            
            {!badge.unlocked && badge.progress !== undefined ? (
              <div className="w-full mt-auto">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{badge.progress} / {badge.total}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1">
                  <div className="bg-gray-500 h-1 rounded-full transition-all duration-1000" style={{ width: `${(badge.progress / badge.total) * 100}%` }}></div>
                </div>
              </div>
            ) : badge.unlocked ? (
              <div className="mt-auto text-[10px] text-brand-cyan bg-brand-cyan/10 px-3 py-1 rounded-full border border-brand-cyan/20">
                Unlocked {badge.date}
              </div>
            ) : null}
          </div>
        ))}

        {/* Secret Badge */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center border-dashed border-2 border-brand-border bg-black/40 relative overflow-hidden">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 bg-black border-2 border-gray-800">
            <span className="text-4xl font-heading font-bold text-gray-800">?</span>
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-600">Secret Achievement</h3>
          <p className="text-xs text-gray-600">Keep exploring to uncover this hidden challenge.</p>
        </div>
      </div>
    </div>
  );
}
