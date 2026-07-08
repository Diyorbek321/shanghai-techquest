import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon,
  Video,
  Info
} from 'lucide-react';

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState('October 2023');
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const events = [
    { day: 2, title: 'Frontend Fundamentals', type: 'lecture', time: '09:00 - 11:00', color: 'bg-brand-cyan' },
    { day: 5, title: 'UX Design Workshop', type: 'workshop', time: '14:00 - 16:00', color: 'bg-brand-purple' },
    { day: 12, title: 'Robotics Team Meeting', type: 'team', time: '16:30 - 18:00', color: 'bg-brand-orange' },
    { day: 15, title: 'CSS Mastery Exam', type: 'exam', time: '10:00 - 12:00', color: 'bg-brand-red' },
    { day: 24, title: 'React Masterclass', type: 'lecture', time: '09:00 - 12:00', color: 'bg-brand-cyan' },
    { day: 24, title: 'Guest Speaker: Web3', type: 'event', time: '15:00 - 17:00', color: 'bg-brand-purple' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Calendar Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-panel border border-white/10 bg-black/40 p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-2">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <CalendarIcon className="text-brand-cyan" /> {currentMonth}
            </h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-all border border-white/10 text-gray-400 hover:text-white">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-all border border-white/10 text-gray-400 hover:text-white">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/2">
                {day}
              </div>
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`empty-${i}`} className="p-4 h-32 bg-transparent opacity-20 border-t border-l border-white/5" />
            ))}
            {days.map(day => {
              const dayEvents = events.filter(e => e.day === day);
              const isToday = day === 24;

              return (
                <div 
                  key={day} 
                  className={`p-2 h-32 bg-black/20 border-t border-l border-white/5 hover:bg-white/2 transition-colors relative group ${isToday ? 'bg-brand-cyan/5' : ''}`}
                >
                  <span className={`text-xs font-bold ${isToday ? 'text-brand-cyan' : 'text-gray-500'} mb-2 block`}>
                    {day}
                  </span>
                  
                  <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                    {dayEvents.map((event, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-[8px] p-1.5 rounded border border-white/10 ${event.color} bg-opacity-20 text-white font-bold leading-tight truncate cursor-pointer hover:bg-opacity-40 transition-all`}
                      >
                        {event.title}
                      </motion.div>
                    ))}
                  </div>
                  
                  {isToday && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-[0_0_8px_rgba(0,217,255,0.8)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Schedule */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border border-white/10 bg-black/40">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={16} className="text-brand-orange" /> Today's Chronos
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-brand-cyan/10 border-l-2 border-brand-cyan rounded-r-xl space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">Active Now</span>
                  <span className="text-[8px] text-gray-500 font-mono italic">ENDS IN 42M</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase">React Masterclass</h4>
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><MapPin size={10} /> Hub 402</span>
                  <span className="flex items-center gap-1"><Users size={10} /> 24 Slots</span>
                </div>
              </div>

              <div className="p-4 bg-white/5 border-l-2 border-brand-purple rounded-r-xl space-y-2 opacity-80">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest">Next Up</span>
                  <span className="text-[8px] text-gray-500 font-mono italic">15:00 - 17:00</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase">Guest Speaker: Web3</h4>
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><Video size={10} /> Virtual</span>
                  <span className="flex items-center gap-1"><Users size={10} /> Open</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-orange/5 border border-brand-orange/20 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-brand-orange">
              <Info size={16} />
              <h4 className="text-xs font-black uppercase tracking-wider">Reminder</h4>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-tight">
              Attendance tracking is automatic via proximity sensor or login token. Ensure your device is synced.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
