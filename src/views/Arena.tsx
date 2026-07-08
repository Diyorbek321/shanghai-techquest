import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Zap, Shield, Target, Trophy, Flame } from 'lucide-react';
import { User } from '../types';
import { VersusTransition } from '../components/VersusTransition';

export function Arena({ user, onNavigate }: { user: User; onNavigate: (view: any) => void }) {
  const [matchmaking, setMatchmaking] = useState(false);
  const [battleMode, setBattleMode] = useState<'pvp' | 'ai' | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [opponent, setOpponent] = useState<any>(null);

  useEffect(() => {
    if (matchmaking) {
      const timer = setTimeout(() => {
        setOpponent({
          name: 'Cyber_Shadow',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow',
          level: 28
        });
        setShowTransition(true);
        setMatchmaking(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [matchmaking]);

  const startAIBattle = () => {
    setOpponent({
      name: 'Deep_Net_AI',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI',
      level: 40
    });
    setShowTransition(true);
  };

  const activeBattles = [
    { id: 1, p1: 'Alex_Dev', p2: 'CodeMaster99', type: 'Algorithm Race', stake: 100, time: '2:45' },
    { id: 2, p1: 'Sarah.JS', p2: 'NinjaCoder', type: 'UI Speedrun', stake: 250, time: '5:12' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <AnimatePresence>
        {showTransition && (
          <VersusTransition 
            player1={{ name: user.name, avatar: user.avatar, level: user.level }}
            player2={opponent}
            onComplete={() => {
              setShowTransition(false);
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
                <div className="text-red-400 font-mono font-bold text-sm">ELO: 1,420</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                <div className="text-gray-400 text-xs uppercase mb-1">Win Rate</div>
                <div className="font-bold text-lg text-brand-green">68%</div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                <div className="text-gray-400 text-xs uppercase mb-1">Total Wins</div>
                <div className="font-bold text-lg text-white">42</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMatchmaking(!matchmaking)}
                className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  matchmaking 
                    ? 'bg-red-500/20 border border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
                    : 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                }`}
              >
                {matchmaking ? (
                  <>Searching for Opponent...</>
                ) : (
                  <><Swords /> Enter Arena</>
                )}
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startAIBattle}
                className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-brand-bg border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/10 transition-all"
              >
                <Zap size={16} /> Skirmish vs AI
              </motion.button>
            </div>
          </div>
          
          <div className="glass-panel p-6">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Trophy className="text-[#FFD700]" /> Top Gladiators</h3>
             <div className="space-y-4">
                {[
                  { name: 'DrWho', elo: 2150, streak: 12 },
                  { name: 'NullPointer', elo: 2040, streak: 5 },
                  { name: 'ReactGod', elo: 1980, streak: 3 },
                ].map((player, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-center font-bold text-gray-500">#{i+1}</div>
                      <div className="font-medium">{player.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-brand-cyan">{player.elo}</div>
                      <div className="text-xs text-orange-400 flex items-center justify-end gap-1"><Flame size={10} /> {player.streak}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Active Battles & Modes */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-brand-cyan/30 bg-gradient-to-br from-brand-bg to-brand-cyan/10 cursor-pointer">
                <Zap className="text-brand-cyan mb-3" size={32} />
                <h3 className="font-bold text-xl mb-1">Blitz Code</h3>
                <p className="text-sm text-gray-400">3-minute algorithmic challenges. Fastest correct solution wins.</p>
             </motion.div>
             <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-brand-purple/30 bg-gradient-to-br from-brand-bg to-brand-purple/10 cursor-pointer">
                <Shield className="text-brand-purple mb-3" size={32} />
                <h3 className="font-bold text-xl mb-1">Bug Squasher</h3>
                <p className="text-sm text-gray-400">Find and fix the bugs in the provided code before your opponent.</p>
             </motion.div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="font-bold text-xl mb-4">Live Spectator Matches</h3>
            <div className="space-y-4">
              {activeBattles.map((battle) => (
                <div key={battle.id} className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-white/20 transition-colors cursor-pointer">
                  <div className="flex-1 flex items-center justify-center sm:justify-end gap-3 text-right">
                    <span className="font-bold text-lg">{battle.p1}</span>
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500"></div>
                  </div>
                  
                  <div className="flex flex-col items-center px-4">
                    <div className="text-xs text-brand-red font-bold uppercase tracking-widest mb-1">VS</div>
                    <div className="font-mono text-sm">{battle.time}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{battle.type}</div>
                  </div>

                  <div className="flex-1 flex items-center justify-center sm:justify-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500"></div>
                    <span className="font-bold text-lg">{battle.p2}</span>
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
