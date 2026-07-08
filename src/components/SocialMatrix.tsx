import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, MessageSquare, UserPlus, X, Send, Circle } from 'lucide-react';
import { User } from '../types';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'idle';
  activity?: string;
  lastMessage?: string;
}

export function SocialMatrix({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [message, setMessage] = useState('');

  const friends: Friend[] = [
    { id: '1', name: 'Neural_Knight', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', status: 'online', activity: 'Solving a Problem', lastMessage: 'The new Arena bot is tough!' },
    { id: '2', name: 'Cyber_Synth', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', status: 'idle', activity: 'Building in MyWorld', lastMessage: 'Check out my city upgrade!' },
    { id: '3', name: 'Data_Drifter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', status: 'online', activity: 'Competing in Arena', lastMessage: 'Anyone for a duel?' },
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-brand-purple text-white rounded-full shadow-[0_0_20px_rgba(176,38,255,0.4)] flex items-center justify-center border border-brand-purple/50"
      >
        <Users size={24} />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-cyan text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-bg">
          1
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-6 z-50 w-80 bg-brand-sidebar border border-brand-purple/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[500px]"
          >
            <div className="bg-brand-purple/20 p-4 border-b border-brand-purple/30 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2 text-brand-purple">
                <Users size={16} /> Social Matrix
              </h3>
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-white transition-colors"><UserPlus size={16} /></button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={16} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 text-left group ${selectedFriend?.id === friend.id ? 'bg-white/10 border border-brand-purple/30' : 'border border-transparent'}`}
                >
                  <div className="relative">
                    <img src={friend.avatar} alt="" className="w-10 h-10 rounded-full border border-gray-700" />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-brand-sidebar ${
                      friend.status === 'online' ? 'bg-brand-green' : friend.status === 'idle' ? 'bg-[#FFD700]' : 'bg-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-sm text-gray-200 group-hover:text-brand-purple transition-colors">{friend.name}</span>
                      <span className="text-[9px] text-gray-500 uppercase">{friend.status}</span>
                    </div>
                    {friend.status === 'online' && friend.activity && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></div>
                        <span className="text-[10px] text-brand-cyan font-medium">{friend.activity}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 truncate">{friend.lastMessage || 'Start a connection...'}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {selectedFriend && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-40 right-[350px] z-50 w-80 h-[400px] bg-brand-sidebar border border-brand-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            <div className="bg-brand-cyan/20 p-4 border-b border-brand-cyan/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selectedFriend.avatar} alt="" className="w-8 h-8 rounded-full border border-brand-cyan/30" />
                <div>
                  <h4 className="font-bold text-xs text-white leading-none">{selectedFriend.name}</h4>
                  <span className="text-[9px] text-brand-cyan font-bold uppercase tracking-tighter">Direct Link Active</span>
                </div>
              </div>
              <button onClick={() => setSelectedFriend(null)} className="text-gray-400 hover:text-white transition-colors"><X size={16} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-end">
                <div className="bg-brand-cyan/10 border border-brand-cyan/30 p-2.5 rounded-2xl rounded-tr-none max-w-[80%]">
                  <p className="text-xs text-brand-cyan">Yo! Check out that new city material I found in the shop.</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl rounded-tl-none max-w-[80%]">
                  <p className="text-xs text-gray-300">Nice! I just need {selectedFriend.name === 'Neural_Knight' ? '200' : '450'} more Neural Coins to get it.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Transmit message..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-xs focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <button className="absolute right-2 top-1.5 text-brand-cyan hover:scale-110 transition-transform">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
