import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, UserPlus, X, Send, Check, Swords } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';
import { User, ViewType } from '../types';

interface FriendEntry {
  friendshipId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  incoming: boolean;
  friend: {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
  };
}

interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
}

interface Battle {
  id: string;
}

export function SocialMatrix({ user, onNavigate, onSelectBattle }: { user: User; onNavigate: (view: ViewType) => void; onSelectBattle: (id: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [addFriendId, setAddFriendId] = useState('');
  const [addFriendError, setAddFriendError] = useState<string | null>(null);
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: friends = [] } = useQuery({
    queryKey: ['social', 'friends'],
    queryFn: () => api.get<FriendEntry[]>('/social/friends'),
    enabled: isOpen,
  });

  const acceptedFriends = friends.filter((f) => f.status === 'ACCEPTED');
  const incomingRequests = friends.filter((f) => f.incoming);
  const selectedFriend = acceptedFriends.find((f) => f.friend.id === selectedFriendId)?.friend ?? null;

  const respondToRequest = useMutation({
    mutationFn: ({ friendshipId, accept }: { friendshipId: string; accept: boolean }) =>
      api.post(`/social/friends/${friendshipId}/respond`, { accept }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social', 'friends'] }),
  });

  const sendFriendRequest = useMutation({
    mutationFn: (userId: string) => api.post(`/social/friends/${userId}/request`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'friends'] });
      setAddFriendId('');
      setAddFriendError(null);
      setShowAddFriend(false);
    },
    onError: (error) => {
      setAddFriendError(error instanceof ApiError ? error.message : "Do'stlik so'rovini yuborib bo'lmadi.");
    },
  });

  const challengeFriend = useMutation({
    mutationFn: (opponentId: string) => api.post<Battle>('/battles', { isAI: false, opponentId }),
    onSuccess: (battle) => {
      setChallengeError(null);
      setIsOpen(false);
      onSelectBattle(battle.id);
      onNavigate('battle');
    },
    onError: (error) => {
      setChallengeError(error instanceof ApiError ? error.message : "Jangga chaqirib bo'lmadi.");
    },
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['social', 'messages', selectedFriendId],
    queryFn: () => api.get<DirectMessage[]>(`/social/messages/${selectedFriendId}`),
    enabled: !!selectedFriendId,
  });

  const sendMessage = useMutation({
    mutationFn: (content: string) => api.post<DirectMessage>(`/social/messages/${selectedFriendId}`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'messages', selectedFriendId] });
      setMessage('');
    },
  });

  const handleSendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed || !selectedFriendId || sendMessage.isPending) return;
    sendMessage.mutate(trimmed);
  };

  const handleSendFriendRequest = () => {
    const trimmed = addFriendId.trim();
    if (!trimmed || sendFriendRequest.isPending) return;
    sendFriendRequest.mutate(trimmed);
  };

  const pendingIncomingCount = incomingRequests.length;

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
        {pendingIncomingCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-cyan text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-bg">
            {pendingIncomingCount}
          </span>
        )}
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
                <Users size={16} /> Ijtimoiy Matritsa
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAddFriend((v) => !v)} className="text-gray-400 hover:text-white transition-colors"><UserPlus size={16} /></button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={16} /></button>
              </div>
            </div>

            {showAddFriend && (
              <div className="p-3 border-b border-white/10 bg-black/20 space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={addFriendId}
                    onChange={(e) => setAddFriendId(e.target.value)}
                    placeholder="Foydalanuvchi ID..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 pr-10 text-xs focus:outline-none focus:border-brand-purple transition-colors"
                  />
                  <button
                    onClick={handleSendFriendRequest}
                    disabled={sendFriendRequest.isPending || !addFriendId.trim()}
                    className="absolute right-2 top-1.5 text-brand-purple hover:scale-110 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <UserPlus size={16} />
                  </button>
                </div>
                {addFriendError && <p className="text-[10px] text-brand-red">{addFriendError}</p>}
              </div>
            )}

            {incomingRequests.length > 0 && (
              <div className="p-2 space-y-1 border-b border-white/10">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest px-2">So'rovlar</p>
                {incomingRequests.map((req) => (
                  <div key={req.friendshipId} className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
                    <img src={req.friend.avatar} alt="" className="w-8 h-8 rounded-full border border-gray-700" />
                    <span className="flex-1 text-xs font-bold text-gray-200 truncate">{req.friend.name}</span>
                    <button
                      onClick={() => respondToRequest.mutate({ friendshipId: req.friendshipId, accept: true })}
                      className="p-1.5 rounded-lg bg-brand-green/20 text-brand-green hover:bg-brand-green/30 transition-colors"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => respondToRequest.mutate({ friendshipId: req.friendshipId, accept: false })}
                      className="p-1.5 rounded-lg bg-brand-red/20 text-brand-red hover:bg-brand-red/30 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {challengeError && <p className="text-[10px] text-brand-red px-3 pt-2">{challengeError}</p>}

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {acceptedFriends.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">Hozircha do'stlar yo'q.</p>
              )}
              {acceptedFriends.map(({ friend }) => (
                <div
                  key={friend.id}
                  className={`w-full flex items-center gap-2 p-3 rounded-xl transition-all hover:bg-white/5 group ${selectedFriendId === friend.id ? 'bg-white/10 border border-brand-purple/30' : 'border border-transparent'}`}
                >
                  <button onClick={() => setSelectedFriendId(friend.id)} className="flex-1 flex items-center gap-3 min-w-0 text-left">
                    <div className="relative">
                      <img src={friend.avatar} alt="" className="w-10 h-10 rounded-full border border-gray-700" />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-brand-sidebar ${
                        friend.online ? 'bg-brand-green' : 'bg-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-sm text-gray-200 group-hover:text-brand-purple transition-colors">{friend.name}</span>
                        <span className="text-[9px] text-gray-500 uppercase">{friend.online ? 'online' : 'offline'}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">Aloqa boshlang...</p>
                    </div>
                  </button>
                  <button
                    onClick={() => challengeFriend.mutate(friend.id)}
                    disabled={challengeFriend.isPending}
                    title="Jangga chaqirish"
                    className="shrink-0 p-1.5 rounded-lg bg-brand-red/10 text-brand-red hover:bg-brand-red/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Swords size={14} />
                  </button>
                </div>
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
                  <span className="text-[9px] text-brand-cyan font-bold uppercase tracking-tighter">To'g'ridan-to'g'ri Aloqa Faol</span>
                </div>
              </div>
              <button onClick={() => setSelectedFriendId(null)} className="text-gray-400 hover:text-white transition-colors"><X size={16} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">Hali xabarlar yo'q. Suhbatni boshlang!</p>
              )}
              {messages.map((msg) =>
                msg.senderId === user.id ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="bg-brand-cyan/10 border border-brand-cyan/30 p-2.5 rounded-2xl rounded-tr-none max-w-[80%]">
                      <p className="text-xs text-brand-cyan">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl rounded-tl-none max-w-[80%]">
                      <p className="text-xs text-gray-300">{msg.content}</p>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Xabar yuboring..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-xs focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendMessage.isPending || !message.trim()}
                  className="absolute right-2 top-1.5 text-brand-cyan hover:scale-110 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                >
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
