import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowUp, ArrowDown, Minus, Medal, Swords } from 'lucide-react';
import { User } from '../types';
import { VersusTransition } from '../components/VersusTransition';

interface LeaderboardProps {
  user: User;
  onNavigate: (view: any) => void;
}

interface LeaderboardPlayer {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  change: string;
  isUser?: boolean;
}

export function Leaderboard({ user, onNavigate }: LeaderboardProps) {
  const [showTransition, setShowTransition] = useState(false);
  const [opponent, setOpponent] = useState<any>(null);
  
  const handleChallenge = (player: LeaderboardPlayer) => {
    setOpponent({
      name: player.name,
      avatar: player.avatar,
      level: player.level
    });
    setShowTransition(true);
  };
  const [topPlayers, setTopPlayers] = useState<LeaderboardPlayer[]>([
    { rank: 2, name: 'Cyber Ninja', avatar: 'https://i.pravatar.cc/150?u=1', xp: 4200, level: 18, change: 'up' },
    { rank: 1, name: 'Neon Samurai', avatar: 'https://i.pravatar.cc/150?u=2', xp: 5150, level: 22, change: 'same' },
    { rank: 3, name: 'Data Weaver', avatar: 'https://i.pravatar.cc/150?u=3', xp: 3950, level: 16, change: 'up' },
  ]);

  const [otherPlayers, setOtherPlayers] = useState<LeaderboardPlayer[]>([
    { rank: 4, name: 'Grid Runner', avatar: 'https://i.pravatar.cc/150?u=4', xp: 3800, level: 15, change: 'down' },
    { rank: 5, name: 'Byte Hacker', avatar: 'https://i.pravatar.cc/150?u=5', xp: 3750, level: 15, change: 'up' },
    { rank: 6, name: 'Pixel Mage', avatar: 'https://i.pravatar.cc/150?u=6', xp: 3600, level: 14, change: 'same' },
    { rank: 7, name: 'Null Pointer', avatar: 'https://i.pravatar.cc/150?u=7', xp: 3450, level: 14, change: 'down' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update one of the top players
      setTopPlayers(prev => prev.map(p => {
        if (Math.random() > 0.7) {
          const gain = Math.floor(Math.random() * 5);
          return { ...p, xp: p.xp + gain, change: gain > 0 ? 'up' : 'same' };
        }
        return p;
      }));

      // Randomly update other players
      setOtherPlayers(prev => prev.map(p => {
        if (Math.random() > 0.6) {
          const gain = Math.floor(Math.random() * 10);
          return { ...p, xp: p.xp + gain, change: gain > 0 ? 'up' : 'same' };
        }
        return p;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const restOfBoard = [
    ...otherPlayers,
    { rank: 13, name: user.name, avatar: user.avatar, xp: user.xp, level: user.level, change: 'up', isUser: true },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
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
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <Trophy className="text-[#FFD700]" /> Leaderboard
            <span className="flex h-2 w-2 relative ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
            </span>
            <span className="text-xs font-mono text-brand-green uppercase tracking-widest animate-pulse">Live</span>
          </h1>
          <p className="text-gray-400">Compete with your peers and rise through the ranks.</p>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-lg border border-brand-border">
          {['Weekly', 'Monthly', 'All Time'].map((tab, i) => (
            <button key={tab} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${i === 0 ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-gray-400 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

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
                Lvl {player.level}
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
      <div className="bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl p-4 flex items-center justify-between neon-glow-cyan">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center font-bold text-brand-cyan border border-brand-cyan/50">
            #13
          </div>
          <div>
            <h4 className="font-semibold text-white">Your Rank</h4>
            <p className="text-xs text-brand-cyan">Only 150 XP to reach top 10!</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-brand-cyan text-brand-bg font-bold rounded hover:bg-brand-cyan/90 transition-colors text-sm">
          Do a Quest
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/40 border-b border-brand-border text-xs text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">Student</th>
              <th className="px-6 py-4 font-medium">XP</th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">Streak</th>
              <th className="px-6 py-4 font-medium hidden md:table-cell">Badges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {restOfBoard.map((row, i) => (
              <tr key={row.rank} className={`hover:bg-white/5 transition-colors ${row.isUser ? 'bg-brand-purple/10' : ''} group`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-400 w-6">#{row.rank}</span>
                    {row.change === 'up' && <ArrowUp size={14} className="text-brand-green" />}
                    {row.change === 'down' && <ArrowDown size={14} className="text-brand-orange" />}
                    {row.change === 'same' && <Minus size={14} className="text-gray-600" />}
                  </div>
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
                          <span className="text-[8px] bg-brand-purple/20 text-brand-purple px-1.5 py-0.5 rounded border border-brand-purple/50 font-bold uppercase tracking-widest">Mentor</span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400">Lvl {row.level}</div>
                    </div>
                  </div>
                  {!row.isUser && (
                    <button 
                      onClick={() => handleChallenge(row)}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-3 py-1 bg-brand-red/20 text-brand-red border border-brand-red/30 rounded text-[10px] font-bold uppercase transition-all hover:bg-brand-red hover:text-white"
                    >
                      <Swords size={12} /> Challenge
                    </button>
                  )}
                </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono font-medium text-brand-cyan">{row.xp.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <span className="text-brand-orange text-sm flex items-center gap-1">🔥 {Math.floor(Math.random() * 20) + 1}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="w-6 h-6 rounded-full bg-brand-bg border border-gray-600 flex items-center justify-center">
                        <Medal size={12} className={j === 0 ? "text-brand-purple" : j === 1 ? "text-brand-green" : "text-brand-cyan"} />
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
