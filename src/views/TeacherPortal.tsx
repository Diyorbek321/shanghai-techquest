import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Search, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Mail,
  GraduationCap,
  Calendar,
  LayoutDashboard
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  avatar: string;
  lastActive: string;
  progress: number;
  grade: string;
  status: 'online' | 'offline' | 'away';
}

export function TeacherPortal() {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'curriculum' | 'analytics'>('overview');

  const students: Student[] = [
    { id: '1', name: 'Alex Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', lastActive: '2m ago', progress: 85, grade: 'A', status: 'online' },
    { id: '2', name: 'Sarah Miller', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', lastActive: '1h ago', progress: 62, grade: 'B', status: 'away' },
    { id: '3', name: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', lastActive: '1d ago', progress: 45, grade: 'C', status: 'offline' },
    { id: '4', name: 'Emily Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', lastActive: '5m ago', progress: 92, grade: 'A+', status: 'online' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-purple/10 rounded-xl border border-brand-purple/20">
            <GraduationCap size={32} className="text-brand-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">Teacher Portal</h1>
            <p className="text-xs text-gray-500 font-mono">Hybrid Education Management OS v1.0</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:bg-white/10 transition-all flex items-center gap-2">
            <Calendar size={16} /> Schedule Session
          </button>
          <button className="px-6 py-2 bg-brand-purple text-white font-black rounded-xl hover:bg-brand-purple/80 transition-all shadow-[0_0_20px_rgba(176,38,255,0.4)] uppercase text-xs flex items-center gap-2">
            <Plus size={16} /> New Module
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id 
                ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Active Students" value="24" subValue="+3 from yesterday" icon={Users} color="text-brand-cyan" />
          <StatCard title="Average Grade" value="84%" subValue="Class Average" icon={GraduationCap} color="text-brand-purple" />
          <StatCard title="Modules Completed" value="12" subValue="Across all paths" icon={CheckCircle2} color="text-brand-green" />
          <StatCard title="Pending Submissions" value="8" subValue="Needs Grading" icon={AlertCircle} color="text-brand-orange" />

          {/* Recent Activity */}
          <div className="md:col-span-2 lg:col-span-3 glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={16} className="text-brand-purple" /> Recent Student Activity
            </h3>
            <div className="space-y-4">
              {students.slice(0, 3).map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={student.avatar} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                        student.status === 'online' ? 'bg-brand-green' : student.status === 'away' ? 'bg-brand-orange' : 'bg-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{student.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">Submitted "Intro to Robotics Lab" &bull; {student.lastActive}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-500 hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
              View All Activity
            </button>
          </div>

          {/* Classroom Health */}
          <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChart3 size={16} className="text-brand-cyan" /> Performance Trends
            </h3>
            <div className="space-y-6">
              <TrendItem label="Assignment Completion" value={85} color="bg-brand-cyan" />
              <TrendItem label="Code Lab Participation" value={72} color="bg-brand-purple" />
              <TrendItem label="Quiz Performance" value={64} color="bg-brand-orange" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="glass-panel border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300">Filter</button>
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300">Export CSV</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                  <th className="px-6 py-4 font-bold">Student</th>
                  <th className="px-6 py-4 font-bold">Progress</th>
                  <th className="px-6 py-4 font-bold">Grade</th>
                  <th className="px-6 py-4 font-bold">Last Active</th>
                  <th className="px-6 py-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={student.avatar} alt="" className="w-8 h-8 rounded-full border border-white/10" />
                        <div>
                          <p className="text-sm font-bold text-white">{student.name}</p>
                          <p className="text-[10px] text-gray-500">ID: {student.id}0042</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                          <span>{student.progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-purple" style={{ width: `${student.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-black font-mono ${
                        student.grade.startsWith('A') ? 'text-brand-green' : student.grade.startsWith('B') ? 'text-brand-cyan' : 'text-brand-orange'
                      }`}>
                        {student.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">{student.lastActive}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Message">
                          <Mail size={16} />
                        </button>
                        <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Settings">
                          <Settings size={16} />
                        </button>
                        <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, subValue, icon: Icon, color }: any) {
  return (
    <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 bg-white/5 rounded-xl ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
        <span className="text-[10px] text-brand-green font-bold">{subValue}</span>
      </div>
    </div>
  );
}

function TrendItem({ label, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</span>
        <span className="text-xs font-mono text-white">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
