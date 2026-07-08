import React from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  MessageSquare, 
  Award, 
  AlertTriangle, 
  Clock, 
  Check, 
  MoreHorizontal,
  Mail,
  Zap
} from 'lucide-react';

export function Notifications() {
  const notifications = [
    { 
      id: 1, 
      type: 'achievement', 
      title: 'New Achievement Unlocked!', 
      message: 'You earned the "Fast Learner" badge for completing 5 lessons in 24 hours.', 
      time: '2 hours ago', 
      read: false,
      icon: <Award className="text-brand-purple" />
    },
    { 
      id: 2, 
      type: 'assignment', 
      title: 'Assignment Due Soon', 
      message: 'Your "Responsive Hydra" project is due in 4 hours. Don\'t forget to submit!', 
      time: '4 hours ago', 
      read: false,
      icon: <Clock className="text-brand-orange" />
    },
    { 
      id: 3, 
      type: 'message', 
      title: 'New Message from Instructor', 
      message: 'Alex, great work on your last CSS lab. Take a look at the feedback I left on your Grid layout.', 
      time: 'Yesterday', 
      read: true,
      icon: <MessageSquare className="text-brand-cyan" />
    },
    { 
      id: 4, 
      type: 'system', 
      title: 'System Update', 
      message: 'The Robotics Lab will be undergoing maintenance tonight from 10 PM to 2 AM UTC.', 
      time: '2 days ago', 
      read: true,
      icon: <AlertTriangle className="text-brand-red" />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
            <Bell className="text-brand-purple animate-pulse" /> Signal Center
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Incoming Communications & Alerts</p>
        </div>
        <button className="text-[10px] font-black text-brand-cyan uppercase hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-panel p-5 border flex gap-5 transition-all group cursor-pointer ${
              notif.read ? 'border-white/5 bg-black/20 opacity-70' : 'border-white/10 bg-black/40 hover:border-brand-purple/50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10`}>
              {notif.icon}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h3 className={`font-bold ${notif.read ? 'text-gray-400' : 'text-white'} group-hover:text-brand-purple transition-colors`}>
                  {notif.title}
                </h3>
                <span className="text-[10px] text-gray-500 font-mono">{notif.time}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{notif.message}</p>
            </div>

            {!notif.read && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-brand-purple rounded-full shadow-[0_0_10px_rgba(176,38,255,0.8)]" />
              </div>
            )}
            
            <button className="self-center p-2 text-gray-600 hover:text-white transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        <div className="glass-panel p-4 border border-white/10 bg-brand-purple/5 flex items-center gap-4">
          <Zap size={24} className="text-brand-purple" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black">Unread Signals</p>
            <p className="text-xl font-black text-white italic">02</p>
          </div>
        </div>
        <div className="glass-panel p-4 border border-white/10 bg-brand-cyan/5 flex items-center gap-4">
          <Mail size={24} className="text-brand-cyan" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black">Instructor Messages</p>
            <p className="text-xl font-black text-white italic">14</p>
          </div>
        </div>
        <div className="glass-panel p-4 border border-white/10 bg-brand-orange/5 flex items-center gap-4">
          <Award size={24} className="text-brand-orange" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black">Achievements</p>
            <p className="text-xl font-black text-white italic">38</p>
          </div>
        </div>
      </div>
    </div>
  );
}
