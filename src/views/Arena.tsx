import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Swords, Zap, Shield, Trophy, Flame } from 'lucide-react';
import { User, ViewType } from '../types';
import { VersusTransition } from '../components/VersusTransition';
import { api, ApiError } from '../lib/api';

interface BattlePlayer {
  id: string;
  name: string;
  avatar: string | null;
  level: number;
}

interface Battle {
  id: string;
  challengerId: string;
  opponentId: string | null;
  challenger: BattlePlayer;
  opponent: BattlePlayer | null;
  isAI: boolean;
  status: 'AWAITING_OPPONENT' | 'JUDGING' | 'JUDGED';
  winnerId: string | null;
  problem: { title: string };
}

interface LeaderboardPlayer {
  id: string;
  name: string;
  eloRating: number;
  streak: number;
}

export function Arena({ user, onNavigate, onSelectBattle }: { user: User; onNavigate: (view: ViewType) => void; onSelectBattle: (id: string) => void }) {
  const [showTransition, setShowTransition] = useState(false);
  const [pendingBattle, setPendingBattle] = useState<Battle | null>(null);
  const queryClient = useQueryClient();

  const { data: battles = [] } = useQuery({
    queryKey: ['battles'],
    queryFn: () => api.get<Battle[]>('/battles'),
  });
  const { data: topPlayers = [] } = useQuery({
    queryKey: ['leaderboard', 'elo'],
    queryFn: () => api.get<LeaderboardPlayer[]>('/leaderboard?sortBy=elo'),
  });

  const resolved = battles.filter((b) => b.status === 'JUDGED');
  const wins = resolved.filter((b) => b.winnerId === user.id).length;
  const winRate = resolved.length ? Math.round((wins / resolved.length) * 100) : 0;

  const createBattle = useMutation({
    mutationFn: (isAI: boolean) => api.post<Battle>('/battles', { isAI }),
    onSuccess: (battle) => {
      queryClient.invalidateQueries({ queryKey: ['battles'] });
      setPendingBattle(battle);
      setShowTransition(true);
    },
    onError: (err) => {
      alert(err instanceof ApiError ? err.message : "Jang boshlab bo'lmadi.");
    },
  });

  const opponentDisplay = pendingBattle?.opponent ?? { id: 'ai', name: 'Deep_Net_AI', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI', level: 40 };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Arena Profile & Queue */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="glass-panel p-6 border-brand-red/30 shadow-[0_0_30px_rgba(220,38,38,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 p-1">
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full border-2 border-black" />
              </div>
              <div>
                <h2 className="font-bold text-xl">{user.name}</h2>
                <div className="text-red-400 font-mono font-bold text-sm">ELO: {user.eloRating.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                <div className="text-gray-400 text-xs uppercase mb-1">G'alaba foizi</div>
                <div className="font-bold text-lg text-brand-green">{resolved.length ? `${winRate}%` : '—'}</div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                <div className="text-gray-400 text-xs uppercase mb-1">Jami g'alabalar</div>
                <div className="font-bold text-lg text-white">{wins}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => createBattle.mutate(false)}
                disabled={createBattle.isPending}
                className="w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-60"
              >
                <Swords /> {createBattle.isPending ? 'Raqib qidirilmoqda...' : 'Arenaga kirish'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => createBattle.mutate(true)}
                disabled={createBattle.isPending}
                className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-brand-bg border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/10 transition-all disabled:opacity-60"
              >
                <Zap size={16} /> AI bilan janjal
              </motion.button>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Trophy className="text-[#FFD700]" /> Eng kuchli jangchilar</h3>
            <div className="space-y-4">
              {topPlayers.length === 0 && <p className="text-sm text-gray-500">Hozircha reyting bo'sh.</p>}
              {topPlayers.slice(0, 5).map((player, i) => (
                <div key={player.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center font-bold text-gray-500">#{i + 1}</div>
                    <div className="font-medium">{player.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm text-brand-cyan">{player.eloRating}</div>
                    <div className="text-xs text-orange-400 flex items-center justify-end gap-1"><Flame size={10} /> {player.streak}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modes & Battle History */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-brand-cyan/30 bg-gradient-to-br from-brand-bg to-brand-cyan/10">
              <Zap className="text-brand-cyan mb-3" size={32} />
              <h3 className="font-bold text-xl mb-1">Chaqmoq Kod</h3>
              <p className="text-sm text-gray-400">Algoritmik topshiriqlar bo'yicha AI hakam bilan tezkor jang.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-brand-purple/30 bg-gradient-to-br from-brand-bg to-brand-purple/10">
              <Shield className="text-brand-purple mb-3" size={32} />
              <h3 className="font-bold text-xl mb-1">Xatoliklarni Yo'qotuvchi</h3>
              <p className="text-sm text-gray-400">Real raqib bilan asinxron jang — kim yaxshiroq yechim topsa g'olib bo'ladi.</p>
            </motion.div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="font-bold text-xl mb-4">Mening janglarim</h3>
            <div className="space-y-4">
              {battles.length === 0 && <p className="text-sm text-gray-500">Hali jang yo'q. Arenaga kiring!</p>}
              {battles.slice(0, 6).map((battle) => {
                const isChallenger = battle.challengerId === user.id;
                const opponentName = battle.isAI ? 'Deep_Net_AI' : (isChallenger ? battle.opponent?.name : battle.challenger.name) ?? "Kutilmoqda...";
                return (
                  <div key={battle.id} className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-white/20 transition-colors">
                    <div className="flex-1 flex items-center justify-center sm:justify-end gap-3 text-right">
                      <span className="font-bold text-lg">{user.name}</span>
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500 overflow-hidden">
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="flex flex-col items-center px-4">
                      <div className="text-xs text-brand-red font-bold uppercase tracking-widest mb-1">VS</div>
                      <div className="font-mono text-xs">
                        {battle.status === 'JUDGED' ? (battle.winnerId === user.id ? "G'alaba" : battle.winnerId ? 'Mag\'lubiyat' : 'Durrang') : 'Kutilmoqda'}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">{battle.problem.title}</div>
                    </div>

                    <div className="flex-1 flex items-center justify-center sm:justify-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500"></div>
                      <span className="font-bold text-lg">{opponentName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
