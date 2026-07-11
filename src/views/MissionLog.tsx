import React from 'react';
import { useQuery } from '@tanstack/react-query';
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

const TYPE_STYLES: Record<Notification['type'], string> = {
  SUCCESS: 'bg-green-500/20 text-green-400',
  WARNING: 'bg-orange-500/20 text-orange-400',
  ALERT: 'bg-red-500/20 text-red-400',
  INFO: 'bg-blue-500/20 text-blue-400',
};

const TYPE_LABEL: Record<Notification['type'], string> = {
  SUCCESS: 'Muvaffaqiyat',
  WARNING: 'Ogohlantirish',
  ALERT: 'Signal',
  INFO: 'Ma\'lumot',
};

export function MissionLog() {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get<Notification[]>('/notifications'),
  });

  return (
    <div className="h-full w-full flex flex-col space-y-4 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">
          Missiyalar jurnali
        </h1>
        <p className="text-gray-400">Jamlangan ogohlantirishlar, tengdoshlar sharhlari va dunyo yangilanishlari.</p>
      </div>

      <div className="flex-1 bg-brand-sidebar/40 rounded-xl border border-brand-border p-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        {isLoading && <p className="text-sm text-gray-500">Missiyalar jurnali yuklanmoqda...</p>}
        {!isLoading && notifications.length === 0 && (
          <p className="text-sm text-gray-500">Hozircha yozuvlar yo'q.</p>
        )}
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-4 rounded-lg border ${!notif.read ? 'bg-brand-cyan/10 border-brand-cyan/50' : 'bg-black/40 border-brand-border'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${TYPE_STYLES[notif.type]}`}>
                    {TYPE_LABEL[notif.type]}
                  </span>
                  <p className="mt-2 text-white font-medium">{notif.title}</p>
                  <p className="text-sm text-gray-400">{notif.body}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{formatRelativeTime(notif.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
