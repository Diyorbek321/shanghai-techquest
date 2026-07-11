import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar as CalendarIcon,
  Info
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'CLASS' | 'DEADLINE' | 'EXAM' | 'EVENT';
  startsAt: string;
  endsAt: string | null;
}

const TYPE_COLOR: Record<CalendarEvent['type'], string> = {
  CLASS: 'bg-brand-cyan',
  DEADLINE: 'bg-brand-red',
  EXAM: 'bg-brand-red',
  EVENT: 'bg-brand-purple',
};

const TYPE_LABEL: Record<CalendarEvent['type'], string> = {
  CLASS: 'Dars',
  DEADLINE: 'Muddat',
  EXAM: 'Imtihon',
  EVENT: 'Tadbir',
};

export function Calendar() {
  const [monthOffset, setMonthOffset] = useState(0);

  const { data: events = [] } = useQuery({
    queryKey: ['calendar'],
    queryFn: () => api.get<CalendarEvent[]>('/calendar'),
  });

  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthLabel = viewDate.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstWeekday = viewDate.getDay();
  const isCurrentMonth = viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    events.forEach((e) => {
      const d = new Date(e.startsAt);
      if (d.getFullYear() === viewDate.getFullYear() && d.getMonth() === viewDate.getMonth()) {
        const list = map.get(d.getDate()) ?? [];
        list.push(e);
        map.set(d.getDate(), list);
      }
    });
    return map;
  }, [events, viewDate]);

  const upcoming = [...events]
    .filter((e) => new Date(e.startsAt).getTime() >= Date.now())
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-panel border border-white/10 bg-black/40 p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-2">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <CalendarIcon className="text-brand-cyan" /> {monthLabel}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setMonthOffset((m) => m - 1)} className="p-2 hover:bg-white/5 rounded-lg transition-all border border-white/10 text-gray-400 hover:text-white">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setMonthOffset((m) => m + 1)} className="p-2 hover:bg-white/5 rounded-lg transition-all border border-white/10 text-gray-400 hover:text-white">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'].map(day => (
              <div key={day} className="p-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/2">
                {day}
              </div>
            ))}
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`empty-${i}`} className="p-4 h-32 bg-transparent opacity-20 border-t border-l border-white/5" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dayEvents = eventsByDay.get(day) ?? [];
              const isToday = isCurrentMonth && day === today.getDate();

              return (
                <div
                  key={day}
                  className={`p-2 h-32 bg-black/20 border-t border-l border-white/5 hover:bg-white/2 transition-colors relative group ${isToday ? 'bg-brand-cyan/5' : ''}`}
                >
                  <span className={`text-xs font-bold ${isToday ? 'text-brand-cyan' : 'text-gray-500'} mb-2 block`}>
                    {day}
                  </span>

                  <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                    {dayEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-[8px] p-1.5 rounded border border-white/10 ${TYPE_COLOR[event.type]} bg-opacity-20 text-white font-bold leading-tight truncate cursor-pointer hover:bg-opacity-40 transition-all`}
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
              <Clock size={16} className="text-brand-orange" /> Yaqinlashib kelayotgan
            </h3>
            <div className="space-y-4">
              {upcoming.length === 0 && <p className="text-xs text-gray-500">Yaqinlashib kelayotgan tadbirlar yo'q.</p>}
              {upcoming.map((event) => (
                <div key={event.id} className="p-4 bg-white/5 border-l-2 border-brand-cyan rounded-r-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">{TYPE_LABEL[event.type]}</span>
                    <span className="text-[8px] text-gray-500 font-mono italic">
                      {new Date(event.startsAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase">{event.title}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-orange/5 border border-brand-orange/20 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-brand-orange">
              <Info size={16} />
              <h4 className="text-xs font-black uppercase tracking-wider">Eslatma</h4>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-tight">
              Davomat yaqinlik sensori yoki kirish tokeni orqali avtomatik qayd etiladi. Qurilmangiz sinxronlashganiga ishonch hosil qiling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
