import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Swords,
  Send,
  BrainCircuit,
  Trophy,
  AlertTriangle,
  Zap,
  Terminal,
  Target,
  Clock
} from 'lucide-react';
import { User, ViewType } from '../types';
import { api, ApiError } from '../lib/api';

interface BattlePlayer {
  id: string;
  name: string;
  avatar: string | null;
  level: number;
}

interface BattleDetail {
  id: string;
  challengerId: string;
  opponentId: string | null;
  challenger: BattlePlayer;
  opponent: BattlePlayer | null;
  isAI: boolean;
  status: 'AWAITING_OPPONENT' | 'JUDGING' | 'JUDGED';
  challengerCode: string | null;
  opponentCode: string | null;
  challengerScore: number | null;
  opponentScore: number | null;
  winnerId: string | null;
  feedback: string | null;
  problem: { title: string; description: string };
}

interface BattleProps {
  user: User;
  onNavigate: (view: ViewType) => void;
  battleId: string | null;
}

export function Battle({ user, onNavigate, battleId }: BattleProps) {
  const [code, setCode] = useState('');
  const queryClient = useQueryClient();

  const { data: battle, isLoading } = useQuery({
    queryKey: ['battles', battleId],
    queryFn: () => api.get<BattleDetail>(`/battles/${battleId}`),
    enabled: !!battleId,
    refetchInterval: (query) => (query.state.data?.status === 'JUDGED' ? false : 3000),
  });

  const submit = useMutation({
    mutationFn: (payload: { code: string; language: 'javascript' | 'python' | 'cpp' }) =>
      api.post<BattleDetail>(`/battles/${battleId}/submit`, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['battles', battleId], updated);
      queryClient.invalidateQueries({ queryKey: ['battles'] });
    },
    onError: (err) => {
      alert(err instanceof ApiError ? err.message : "Yuborib bo'lmadi.");
    },
  });

  if (!battleId) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center text-gray-500">
        Jang tanlanmagan. <button onClick={() => onNavigate('arena')} className="text-brand-cyan underline">Arenaga qayting</button>
      </div>
    );
  }

  if (isLoading || !battle) {
    return <div className="max-w-4xl mx-auto py-8 text-center text-gray-500">Jang yuklanmoqda...</div>;
  }

  const isChallenger = battle.challengerId === user.id;
  const opponentDisplay: BattlePlayer = battle.isAI
    ? { id: 'ai', name: 'Deep_Net_AI', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI', level: 40 }
    : (isChallenger ? battle.opponent : battle.challenger) ?? { id: 'unknown', name: 'Kutilmoqda...', avatar: null, level: 1 };

  const mySubmitted = isChallenger ? !!battle.challengerCode : !!battle.opponentCode;
  const myScore = isChallenger ? battle.challengerScore : battle.opponentScore;
  const opponentScore = isChallenger ? battle.opponentScore : battle.challengerScore;
  const iWon = battle.winnerId === user.id;
  const isDraw = battle.status === 'JUDGED' && !battle.winnerId;

  const phase: 'coding' | 'waiting' | 'judging' | 'results' =
    battle.status === 'JUDGED' ? 'results' : battle.status === 'JUDGING' ? 'judging' : mySubmitted ? 'waiting' : 'coding';

  const handleSubmit = () => {
    if (!code.trim()) return;
    submit.mutate({ code, language: 'javascript' });
  };

  return (
    <div className="min-h-[80vh] flex flex-col gap-6 max-w-6xl mx-auto py-6">
      {/* Header Info */}
      <div className="flex items-center justify-between glass-panel p-4 border border-white/10 rounded-2xl bg-black/40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-brand-cyan" alt="" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-mono">Siz</p>
              <p className="font-bold text-white text-sm">{user.name}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-mono">Raqib</p>
              <p className="font-bold text-white text-sm">{opponentDisplay.name}</p>
            </div>
            {opponentDisplay.avatar && <img src={opponentDisplay.avatar} className="w-10 h-10 rounded-full border-2 border-brand-purple" alt="" />}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-1 bg-brand-red/20 text-brand-red text-xs font-bold rounded-full border border-brand-red/30 uppercase tracking-widest flex items-center gap-2">
            <Swords size={14} /> Kod jangi
          </div>
          <button onClick={() => onNavigate('arena')} className="text-gray-500 hover:text-white transition-colors text-xs font-bold">
            Arenaga qaytish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left: Task */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-6 border border-white/10 rounded-2xl bg-brand-cyan/5 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-cyan/20 rounded-lg text-brand-cyan">
                <Target size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Sinov</h2>
            </div>
            <h3 className="text-brand-cyan font-bold mb-2 uppercase text-xs tracking-widest">{battle.problem.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{battle.problem.description}</p>
          </motion.div>
        </div>

        {/* Center: Coding Interface */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex-1 glass-panel border border-white/10 rounded-2xl overflow-hidden flex flex-col bg-black/60 relative min-h-[500px]">
            <AnimatePresence>
              {phase === 'waiting' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
                  <Clock size={64} className="text-brand-cyan animate-pulse mb-6" />
                  <p className="text-brand-cyan text-xl font-black uppercase tracking-[0.2em] mb-2">Raqib kutilmoqda</p>
                  <p className="text-gray-500 text-sm font-mono">Yechimingiz yuborildi. Raqibingiz javob berishi bilanoq hakamlik boshlanadi.</p>
                </motion.div>
              )}

              {phase === 'judging' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
                  <BrainCircuit size={64} className="text-brand-purple animate-pulse mb-6" />
                  <p className="text-brand-purple text-xl font-black uppercase tracking-[0.2em] mb-2">Neyron hakam faol</p>
                  <p className="text-gray-500 text-sm font-mono">Kod bazasi aniqlik va mantiq oqimi bo'yicha tahlil qilinmoqda...</p>
                  <div className="mt-8 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="h-full w-1/3 bg-brand-purple shadow-[0_0_15px_#B026FF]"
                    />
                  </div>
                </motion.div>
              )}

              {phase === 'results' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-12 overflow-y-auto">
                  <div className="text-center mb-8">
                    <Trophy size={64} className="text-[#FFD700] mx-auto mb-4" />
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
                      {isDraw ? 'Durrang!' : iWon ? "G'alaba qozondingiz!" : 'Mag\'lubiyat'}
                    </h2>
                  </div>

                  <div className="w-full max-w-md space-y-6">
                    <div className="glass-panel p-6 border border-brand-cyan/30 bg-brand-cyan/5 rounded-2xl">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Hakam tahlili</p>
                      <p className="text-gray-200 text-sm italic">"{battle.feedback}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">Sizning ball</p>
                        <p className="text-xl font-black text-brand-cyan">{myScore}%</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">Raqib bali</p>
                        <p className="text-xl font-black text-brand-purple">{opponentScore}%</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('arena')}
                      className="w-full py-3 bg-brand-cyan text-black font-black rounded-xl hover:bg-brand-cyan/80 transition-all uppercase text-sm"
                    >
                      Arenaga qaytish
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code Editor Header */}
            <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 px-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="h-4 w-px bg-white/10 mx-2" />
                <span className="text-[10px] text-gray-500 font-mono uppercase flex items-center gap-2">
                  <Terminal size={12} /> index.js — Tahrirlash rejimi faol
                </span>
              </div>
            </div>

            {/* Code Editor Area */}
            <div className="flex-1 relative font-mono text-sm overflow-hidden">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Yechimingizni shu yerda yozishni boshlang..."
                disabled={phase !== 'coding'}
                className="absolute inset-0 w-full h-full bg-transparent p-4 text-brand-cyan placeholder:text-gray-700 focus:outline-none resize-none z-10 disabled:opacity-50"
                spellCheck={false}
              />
            </div>

            {/* Status Footer */}
            <div className="p-4 bg-brand-cyan/5 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><AlertTriangle size={12} /> AI hakam tomonidan baholanadi</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={phase !== 'coding' || submit.isPending || !code.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-brand-cyan text-black font-black rounded-lg hover:bg-brand-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,217,255,0.3)] uppercase text-xs"
              >
                <Send size={14} /> {submit.isPending ? 'Yuborilmoqda...' : 'Yechimni yuborish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
