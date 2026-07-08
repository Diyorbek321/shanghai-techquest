import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BarChart,
  CalendarDays,
  Info
} from 'lucide-react';

export function Attendance() {
  const attendanceLogs = [
    { date: 'Oct 24, 2023', status: 'present', type: 'on-site', location: 'Tech Hub Room 402', time: '09:00 AM' },
    { date: 'Oct 23, 2023', status: 'present', type: 'remote', location: 'Virtual Classroom', time: '09:15 AM' },
    { date: 'Oct 22, 2023', status: 'absent', type: 'none', location: '-', time: '-' },
    { date: 'Oct 21, 2023', status: 'present', type: 'on-site', location: 'Lab 12', time: '08:55 AM' },
    { date: 'Oct 20, 2023', status: 'present', type: 'remote', location: 'Virtual Classroom', time: '10:05 AM' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="glass-panel p-8 border border-white/10 bg-black/40 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-cyan/10 rounded-2xl border border-brand-cyan/20">
            <CalendarDays size={32} className="text-brand-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">Attendance Matrix</h1>
            <p className="text-xs text-gray-500 font-mono">Hybrid Presence Tracking &bull; Semester 1</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Monthly Rate</p>
            <p className="text-3xl font-black text-brand-cyan italic">92%</p>
          </div>
          <div className="w-px h-10 bg-white/10 self-center"></div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Total Streak</p>
            <p className="text-3xl font-black text-brand-purple italic">12<span className="text-xs ml-1">Days</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border border-white/10 bg-black/40">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <BarChart size={16} className="text-brand-cyan" /> Distribution
            </h3>
            <div className="space-y-4">
              <PresenceStat label="On-Site Hub" value={65} color="bg-brand-cyan" icon={<MapPin size={12} />} />
              <PresenceStat label="Remote Login" value={27} color="bg-brand-purple" icon={<Globe size={12} />} />
              <PresenceStat label="Unexcused" value={8} color="bg-brand-red" icon={<XCircle size={12} />} />
            </div>
          </div>

          <div className="bg-brand-cyan/5 border border-brand-cyan/20 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-brand-cyan">
              <Info size={16} />
              <h4 className="text-xs font-bold uppercase tracking-wider">Policy Note</h4>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Hybrid presence counts equally for XP calculation. On-site attendance grants an additional <span className="text-brand-cyan">+5 Social XP</span> per session.
            </p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="lg:col-span-2 glass-panel border border-white/10 bg-black/40 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Activity</span>
            <button className="text-[10px] text-brand-cyan font-bold hover:underline">Download Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {attendanceLogs.map((log, i) => (
                  <motion.tr 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{log.date}</span>
                        <span className="text-[10px] text-gray-500">{log.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.type === 'on-site' ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20' : 
                        log.type === 'remote' ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20' :
                        'bg-gray-800 text-gray-500'
                      }`}>
                        {log.type === 'on-site' ? <MapPin size={10} /> : log.type === 'remote' ? <Globe size={10} /> : null}
                        {log.type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${log.status === 'present' ? 'text-brand-green' : 'text-brand-red'}`}>
                        {log.status === 'present' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        <span className="text-xs font-black uppercase italic">{log.status}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function PresenceStat({ label, value, color, icon }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
        <span className="text-gray-500 flex items-center gap-1.5">{icon} {label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
