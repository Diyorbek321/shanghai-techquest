import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Swords } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { User, ViewType } from '../types';
import { VersusTransition } from '../components/VersusTransition';
import { api, ApiError } from '../lib/api';

interface LeaderboardProps {
  user: User;
  onNavigate: (view: ViewType) => void;
  onSelectBattle: (id: string) => void;
}

interface LeaderboardPlayer {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  track: string | null;
  eloRating: number;
  isUser: boolean;
}

interface BattlePlayer {
  id: string;
  name: string;
  avatar: string | null;
  level: number;
}

interface Battle {
  id: string;
  isAI: boolean;
  opponent: BattlePlayer | null;
}

type Scope = 'class' | 'track' | 'global';

// Backend (/leaderboard) distinguishes three real scopes: the caller's own
// class, their track, and the global pool — there is no weekly/monthly time
// window, so the tabs map 1:1 to those behaviors instead of implying a
// time-period split that doesn't exist server-side.
//
// Class comes first and is the default: a top-50 global board is unreachable
// for most students, while their own room is the ranking they actually feel.
const SCOPE_TABS: { label: string; scope: Scope }[] = [
  { label: 'Sinfim', scope: 'class' },
  { label: 'Trekim', scope: 'track' },
  { label: 'Barcha davr', scope: 'global' },
];

export function Leaderboard({ user, onNavigate, onSelectBattle }: LeaderboardProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [pendingBattle, setPendingBattle] = useState<Battle | null>(null);

  const scope = SCOPE_TABS[activeTabIndex].scope;

  const { data: players = [], isLoading } = useQuery({
    queryKey: ['leaderboard', scope],
    queryFn: () => api.get<LeaderboardPlayer[]>(`/leaderboard?scope=${scope}`),
  });

  const createBattle = useMutation({
    mutationFn: () => api.post<Battle>('/battles', { isAI: false }),
    onSuccess: (battle) => {
      setPendingBattle(battle);
      setShowTransition(true);
    },
    onError: (err) => {
      alert(err instanceof ApiError ? err.message : "Jang boshlab bo'lmadi.");
    },
  });

  const handleChallenge = () => {
    createBattle.mutate();
  };

  const topPlayers = players.slice(0, 3);
  const restOfBoard = players.slice(3);

  const userRow = players.find((p) => p.isUser);
  const rankAbove = userRow ? players.find((p) => p.rank === userRow.rank - 1) : undefined;
  const xpToNextRank = userRow && rankAbove ? Math.max(0, rankAbove.xp - userRow.xp) : null;

  const opponentDisplay = pendingBattle?.opponent ?? {
    name: 'Deep_Net_AI',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI',
    level: 40,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <AnimatePresence>
        {showTransition && pendingBattle && (
          <VersusTransition
            player1={{ name: user.name, avatar: user.avatar, level: user.level }}
            player2={{ name: opponentDisplay.name, avatar: opponentDisplay.avatar ?? '', level: opponentDisplay.level }}
            onComplete={() => {
              setShowTransition(false);
              onSelectBattle(pendingBattle.id);
              onNavigate('battle');
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <Trophy className="text-[#FFD700]" /> Reyting
            <span className="flex h-2 w-2 relative ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
            </span>
            <span className="text-xs font-mono text-brand-green uppercase tracking-widest animate-pulse">Jonli</span>
          </h1>
          <p className="text-gray-400">Tengdoshlaringiz bilan bellashing va reytingda yuqoriga ko'tariling.</p>
        </div>

        <div className="flex bg-black/40 p-1 rounded-lg border border-brand-border">
          {SCOPE_TABS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTabIndex(i)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${i === activeTabIndex ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-gray-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Reyting yuklanmoqda...</p>}

      {!isLoading && players.length > 0 && (
        <>
          {/* Podium */}
          <div className="glass-panel p-8 pt-12 mt-12 flex justify-center items-end gap-2 sm:gap-6 md:gap-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-cyan/5 to-transparent pointer-events-none rounded-xl"></div>

            {topPlayers.map((player) => (
              <div key={player.rank} className={`flex flex-col items-center ${player.rank === 1 ? 'order-2 -mt-10' : player.rank === 2 ? 'order-1' : 'order-3'}`}>
                <div className="relative mb-4">
                  <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-black z-10 ${
                    player.rank === 1 ? 'bg-[#FFD700] shadow-[0_0_15px_#FFD700]' :
                    player.rank === 2 ? 'bg-[#C0C0C0]' :
                    'bg-[#CD7F32]'
                  }`}>
                    {player.rank}
                  </div>
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className={`rounded-full object-cover border-4 ${
                      player.rank === 1 ? 'w-24 h-24 border-[#FFD700]' : 'w-20 h-20 border-brand-cyan/50'
                    }`}
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-bg px-2 py-0.5 rounded-full border border-brand-border text-[10px] font-bold whitespace-nowrap">
                    {player.level}-daraja
                  </div>
                </div>

                <h3 className={`font-bold text-center ${player.rank === 1 ? 'text-lg text-[#FFD700] text-glow' : 'text-md text-white'}`}>
                  {player.name}
                </h3>
                <p className="font-mono text-brand-cyan font-bold">{player.xp.toLocaleString()} XP</p>

                <div className={`w-full mt-4 rounded-t-lg bg-gradient-to-t ${
                  player.rank === 1 ? 'from-brand-cyan/30 to-brand-cyan/10 h-32 border-t-2 border-[#FFD700]' :
                  player.rank === 2 ? 'from-brand-purple/20 to-brand-purple/5 h-24 border-t-2 border-[#C0C0C0]' :
                  'from-brand-green/20 to-brand-green/5 h-20 border-t-2 border-[#CD7F32]'
                }`}></div>
              </div>
            ))}
          </div>

          {/* User Highlight */}
          {userRow && (
            <div className="bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl p-4 flex items-center justify-between neon-glow-cyan">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center font-bold text-brand-cyan border border-brand-cyan/50">
                  #{userRow.rank}
                </div>
                <div>
                  <h4 className="font-semibold text-white">Sizning o'rningiz</h4>
                  <p className="text-xs text-brand-cyan">
                    {xpToNextRank !== null && xpToNextRank > 0
                      ? `Oldingi o'ringa yetish uchun bor-yo'g'i ${xpToNextRank} XP qoldi!`
                      : "Siz reytingning eng tepasidasiz!"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('mission_log')}
                className="px-4 py-2 bg-brand-cyan text-brand-bg font-bold rounded hover:bg-brand-cyan/90 transition-colors text-sm"
              >
                Missiya bajarish
              </button>
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-brand-border text-xs text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">O'rin</th>
                  <th className="px-6 py-4 font-medium">O'quvchi</th>
                  <th className="px-6 py-4 font-medium">XP</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Seriya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/50">
                {restOfBoard.map((row) => (
                  <tr key={row.rank} className={`hover:bg-white/5 transition-colors ${row.isUser ? 'bg-brand-purple/10' : ''} group`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-gray-400 w-6">#{row.rank}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={row.avatar} alt="" className={`w-8 h-8 rounded-full border ${row.level >= 20 ? 'border-brand-purple shadow-[0_0_10px_rgba(176,38,255,0.8)] animate-pulse' : 'border-gray-700'}`} />
                          {row.level >= 20 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-purple rounded-full flex items-center justify-center border border-white">
                              <Trophy size={8} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className={`font-medium ${row.isUser ? 'text-brand-cyan' : 'text-white'}`}>{row.name}</div>
                            {row.level >= 20 && (
                              <span className="text-[8px] bg-brand-purple/20 text-brand-purple px-1.5 py-0.5 rounded border border-brand-purple/50 font-bold uppercase tracking-widest">Ustoz</span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400">{row.level}-daraja</div>
                        </div>
                      </div>
                      {!row.isUser && (
                        <button
                          onClick={handleChallenge}
                          disabled={createBattle.isPending}
                          className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-3 py-1 bg-brand-red/20 text-brand-red border border-brand-red/30 rounded text-[10px] font-bold uppercase transition-all hover:bg-brand-red hover:text-white disabled:opacity-50"
                        >
                          <Swords size={12} /> Chaqiriq
                        </button>
                      )}
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-medium text-brand-cyan">{row.xp.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="text-brand-orange text-sm flex items-center gap-1">🔥 {row.streak}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
