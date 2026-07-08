import React from 'react';

export function MissionLog() {
  const notifications = [
    { id: 1, type: 'peer_review', message: 'Alex Chen left a review on your React component.', time: '10m ago', unread: true },
    { id: 2, type: 'deadline', message: 'Task "Build Navbar" is due in 2 hours.', time: '2h ago', unread: true },
    { id: 3, type: 'myworld', message: 'Your city upgraded to Level 4!', time: '1d ago', unread: false },
    { id: 4, type: 'quest', message: 'You unlocked a new chapter in the Frontend skill tree.', time: '2d ago', unread: false },
  ];

  return (
    <div className="h-full w-full flex flex-col space-y-4 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">
          Mission Log
        </h1>
        <p className="text-gray-400">Aggregated alerts, peer reviews, and world updates.</p>
      </div>

      <div className="flex-1 bg-brand-sidebar/40 rounded-xl border border-brand-border p-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-4 rounded-lg border ${notif.unread ? 'bg-brand-cyan/10 border-brand-cyan/50' : 'bg-black/40 border-brand-border'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    notif.type === 'peer_review' ? 'bg-blue-500/20 text-blue-400' :
                    notif.type === 'deadline' ? 'bg-red-500/20 text-red-400' :
                    notif.type === 'myworld' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {notif.type.replace('_', ' ')}
                  </span>
                  <p className="mt-2 text-white font-medium">{notif.message}</p>
                </div>
                <span className="text-xs text-gray-500">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
