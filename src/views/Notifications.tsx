import React from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  MessageSquare,
  Award,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatRelativeTime } from '../lib/utils';

interface Notification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const ICONS: Record<Notification['type'], React.ReactNode> = {
  SUCCESS: <Award className="text-brand-purple" />,
  WARNING: <AlertTriangle className="text-brand-orange" />,
  ALERT: <AlertTriangle className="text-brand-red" />,
  INFO: <MessageSquare className="text-brand-cyan" />,
};

export function Notifications() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get<Notification[]>('/notifications'),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    notifications.filter((n) => !n.read).forEach((n) => markRead.mutate(n.id));
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
            <Bell className="text-brand-purple animate-pulse" /> Bildirishnomalar markazi
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Kiruvchi xabarlar va ogohlantirishlar</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-[10px] font-black text-brand-cyan uppercase hover:underline">
            Barchasini o'qilgan deb belgilash
          </button>
        )}
      </div>

      {isLoading && <p className="text-sm text-gray-500 px-2">Bildirishnomalar yuklanmoqda...</p>}
      {!isLoading && notifications.length === 0 && (
        <p className="text-sm text-gray-500 px-2">Hozircha bildirishnomalar yo'q. Barcha ishlar bajarilgan.</p>
      )}

      <div className="space-y-3">
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => !notif.read && markRead.mutate(notif.id)}
            className={`glass-panel p-5 border flex gap-5 transition-all group cursor-pointer ${
              notif.read ? 'border-white/5 bg-black/20 opacity-70' : 'border-white/10 bg-black/40 hover:border-brand-purple/50'
            }`}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10">
              {ICONS[notif.type] ?? <Info className="text-brand-cyan" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h3 className={`font-bold ${notif.read ? 'text-gray-400' : 'text-white'} group-hover:text-brand-purple transition-colors`}>
                  {notif.title}
                </h3>
                <span className="text-[10px] text-gray-500 font-mono">{formatRelativeTime(notif.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{notif.body}</p>
            </div>

            {!notif.read && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-brand-purple rounded-full shadow-[0_0_10px_rgba(176,38,255,0.8)]" />
              </div>
            )}

          </motion.div>
        ))}
      </div>
    </div>
  );
}
