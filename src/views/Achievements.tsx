import React, { useState } from 'react';
import { Medal, Star, Shield, Zap, Lock, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';

type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
type Category = 'PROGRAMMING' | 'SPEED' | 'SOCIAL' | 'SPECIAL' | 'SECRET';

interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  rarity: Rarity;
  category: Category;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: number;
  total: number;
}

const CATEGORY_TABS: { label: string; value: Category | 'ALL' }[] = [
  { label: 'Barchasi', value: 'ALL' },
  { label: 'Dasturlash', value: 'PROGRAMMING' },
  { label: 'Tezlik', value: 'SPEED' },
  { label: 'Ijtimoiy', value: 'SOCIAL' },
  { label: 'Maxsus', value: 'SPECIAL' },
  { label: 'Maxfiy', value: 'SECRET' },
];

const CATEGORY_ICONS: Record<Category, React.ComponentType<{ size?: number; className?: string }>> = {
  PROGRAMMING: Zap,
  SPEED: Star,
  SOCIAL: Award,
  SPECIAL: Shield,
  SECRET: Medal,
};

const RARITY_LABELS: Record<Rarity, string> = {
  COMMON: 'Oddiy',
  RARE: 'Kamyob',
  EPIC: 'Epik',
  LEGENDARY: 'Afsonaviy',
};

const RARITY_COLORS: Record<Rarity, string> = {
  COMMON: 'from-gray-400 to-gray-600 border-gray-400',
  RARE: 'from-brand-cyan to-blue-600 border-brand-cyan shadow-[0_0_15px_rgba(0,217,255,0.3)]',
  EPIC: 'from-brand-purple to-purple-800 border-brand-purple shadow-[0_0_15px_rgba(176,38,255,0.3)]',
  LEGENDARY: 'from-yellow-400 to-orange-500 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.4)]',
};

export function Achievements() {
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => api.get<Achievement[]>('/achievements'),
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const legendaryCount = achievements.filter((a) => a.unlocked && a.rarity === 'LEGENDARY').length;

  const visibleAchievements = achievements.filter((a) => activeCategory === 'ALL' || a.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <Medal className="text-brand-purple" /> Nishonlar va Yutuqlar
          </h1>
          <p className="text-gray-400">Mahoratingizni ko'rsatish uchun kamyob nishonlarni to'plang.</p>
        </div>
        <div className="flex items-center gap-4 text-center glass-panel p-3 px-6">
          <div>
            <div className="text-2xl font-mono font-bold text-brand-cyan">{unlockedCount}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Qo'lga kiritilgan</div>
          </div>
          <div className="w-px h-8 bg-brand-border"></div>
          <div>
            <div className="text-2xl font-mono font-bold text-brand-purple">{legendaryCount}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Afsonaviy</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {CATEGORY_TABS.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.value ? 'bg-white text-black' : 'bg-black/40 text-gray-400 hover:text-white border border-brand-border'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-gray-500">Yutuqlar yuklanmoqda...</p>}
      {!isLoading && visibleAchievements.length === 0 && (
        <p className="text-sm text-gray-500">Bu toifada hozircha yutuqlar yo'q.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleAchievements.map((badge) => {
          const Icon = CATEGORY_ICONS[badge.category];
          return (
            <div key={badge.id} className="glass-panel p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform relative overflow-hidden">
              {badge.unlocked && (
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}

              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 relative ${
                badge.unlocked
                  ? `bg-gradient-to-br ${RARITY_COLORS[badge.rarity]} border-2`
                  : 'bg-black border-2 border-gray-700'
              }`}>
                {badge.unlocked ? (
                  <Icon size={40} className="text-white drop-shadow-lg" />
                ) : (
                  <Lock size={32} className="text-gray-600" />
                )}
                {badge.unlocked && (
                  <div className="absolute -inset-2 rounded-full border border-white/20 animate-[spin_10s_linear_infinite]"></div>
                )}
              </div>

              <span className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${
                badge.unlocked ? (
                  badge.rarity === 'LEGENDARY' ? 'text-yellow-400' :
                  badge.rarity === 'EPIC' ? 'text-brand-purple' :
                  badge.rarity === 'RARE' ? 'text-brand-cyan' : 'text-gray-300'
                ) : 'text-gray-600'
              }`}>
                {RARITY_LABELS[badge.rarity]}
              </span>

              <h3 className={`font-bold text-lg mb-2 ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>{badge.name}</h3>
              <p className="text-xs text-gray-400 mb-4 h-8">{badge.description}</p>

              {!badge.unlocked ? (
                <div className="w-full mt-auto">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Jarayon</span>
                    <span>{badge.progress} / {badge.total}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1">
                    <div
                      className="bg-gray-500 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${badge.total ? (badge.progress / badge.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="mt-auto text-[10px] text-brand-cyan bg-brand-cyan/10 px-3 py-1 rounded-full border border-brand-cyan/20">
                  {badge.unlockedAt ? `${formatDate(badge.unlockedAt)} sanasida ochilgan` : 'ochilgan'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
