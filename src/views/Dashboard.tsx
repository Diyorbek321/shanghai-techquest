import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, PlayCircle, Star, Target, Zap, ChevronRight, Activity, ArrowUpRight, Code, CheckSquare, Trophy, Gift, LayoutList } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { User } from '../types';
import { TaskSequencer } from '../components/TaskSequencer';
import { api } from '../lib/api';
import { formatRelativeTime } from '../lib/utils';

interface DashboardProps {
  user: User;
  onNavigate: (view: any) => void;
  onTriggerSuccess: () => void;
}

interface ModuleProgressRow {
  moduleKey: string;
  progress: number;
  unlocked: boolean;
}

interface DashboardAssignment {
  id: string;
  title: string;
  track: string;
  dueDate: string;
  xpReward: number;
  submission: { status: string } | null;
}

interface Quest {
  id: string;
  completed: boolean;
}

interface ActivityNotification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  title: string;
  body: string;
  createdAt: string;
}

const ACTIVITY_STYLES: Record<ActivityNotification['type'], { text: string; dot: string }> = {
  SUCCESS: { text: 'text-brand-green', dot: 'bg-brand-green' },
  INFO: { text: 'text-brand-cyan', dot: 'bg-brand-cyan' },
  WARNING: { text: 'text-brand-orange', dot: 'bg-brand-orange' },
  ALERT: { text: 'text-brand-purple', dot: 'bg-brand-purple' },
};

function moduleTitle(moduleKey: string): string {
  return moduleKey.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

const TRACK_LABEL: Record<string, string> = {
  frontend: 'Frontend',
  robotics: 'Robototexnika',
  office: 'Ofis',
};

function trackLabel(track: string): string {
  return TRACK_LABEL[track] ?? track;
}

export function Dashboard({ user, onNavigate, onTriggerSuccess }: DashboardProps) {
  const [claimed, setClaimed] = useState(false);

  const { data: moduleProgress = [] } = useQuery({
    queryKey: ['progress', 'modules'],
    queryFn: () => api.get<ModuleProgressRow[]>('/progress/modules'),
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => api.get<DashboardAssignment[]>('/assignments'),
  });

  const { data: quests = [] } = useQuery({
    queryKey: ['quests'],
    queryFn: () => api.get<Quest[]>('/quests'),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get<ActivityNotification[]>('/notifications'),
  });
  const recentActivity = notifications.slice(0, 3);

  const activeModule = moduleProgress.find((m) => m.unlocked && m.progress < 100) ?? moduleProgress[0];
  const upcomingAssignments = [...assignments]
    .filter((a) => !a.submission || a.submission.status !== 'GRADED')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);
  const questsCompleted = quests.filter((q) => q.completed).length;

  const handleClaim = () => {
    setClaimed(true);
    onTriggerSuccess();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1">
            Xush kelibsiz, <span className="text-brand-cyan">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-400">Bugun dasturlash ko'nikmalaringizni oshirishga tayyormisiz?</p>
        </div>
        
        {/* Daily Loot Chest */}
        <AnimatePresence>
          {!claimed && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-[#FFD700]/20 to-[#FF8C00]/20 border border-[#FFD700]/50 p-1 rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.3)] shrink-0"
            >
              <div className="bg-black/50 px-4 py-2 rounded-lg flex items-center gap-4 backdrop-blur-sm">
                <div>
                  <h4 className="text-[#FFD700] font-bold text-sm">Kunlik kirish bonusi</h4>
                  <p className="text-xs text-gray-300">+50 XP mavjud</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClaim}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black font-bold px-3 py-1.5 rounded text-sm flex items-center gap-1 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                >
                  <Gift size={16} /> Olish
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN - 60% (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Continue Learning */}
          <section className="glass-panel p-5 relative overflow-hidden group">
            {/* Cyberpunk accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-cyan"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Zap className="text-brand-cyan" size={18} />
                <h2 className="font-semibold text-lg text-glow">O'qishni davom ettirish</h2>
              </div>
              <span className="text-xs font-mono bg-brand-cyan/20 text-brand-cyan px-2 py-1 rounded capitalize">{user.track ? trackLabel(user.track) : 'Umumiy'}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <div className="w-full sm:w-2/3">
                <h3 className="text-xl font-bold mb-2 group-hover:text-brand-cyan transition-colors">
                  {activeModule ? moduleTitle(activeModule.moduleKey) : "Sinflaringizni kashf eting"}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {activeModule ? "Kurs yo'l xaritangizda to'xtagan joyingizdan davom eting." : "Yo'nalishingizni boshlash uchun Mening Sinflarim bo'limiga o'ting."}
                </p>

                {activeModule && (
                  <>
                    <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                      <span>Joriy modul</span>
                      <span>{activeModule.progress}% bajarildi</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                      <div className="bg-brand-cyan h-2 rounded-full" style={{ width: `${activeModule.progress}%` }}></div>
                    </div>
                  </>
                )}

                <button
                  onClick={() => onNavigate('classes')}
                  className="bg-brand-cyan text-brand-bg font-semibold px-4 py-2 rounded flex items-center gap-2 hover:bg-brand-cyan/90 transition-all neon-glow-cyan"
                >
                  <PlayCircle size={18} />
                  Modulni davom ettirish
                </button>
              </div>
              
              <div className="w-full sm:w-1/3 aspect-video bg-black/50 rounded-lg border border-brand-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/20 to-transparent"></div>
                <Code className="text-brand-cyan/50" size={48} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="text-white" size={32} />
                </div>
              </div>
            </div>
          </section>

          {/* Daily Coding Katas */}
          <section className="glass-panel p-5 relative overflow-hidden group border-brand-orange/30">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Code className="text-brand-orange" size={18} />
                <h2 className="font-semibold text-lg text-glow text-brand-orange">Kunlik dasturlash mashqlari</h2>
              </div>
              <span className="text-xs font-mono bg-brand-orange/20 text-brand-orange px-2 py-1 rounded">Vaqt cheklangan</span>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-400">Bonus XP va tangalar ishlash uchun ushbu qisqa frontend topshiriqlarini bajaring. Tezlik va toza kod mukofotlanadi!</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/30 border border-brand-orange/20 rounded-lg p-4 hover:border-brand-orange/50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-sm">Divni markazga joylashtirish</h4>
                    <span className="text-xs text-[#FFD700] font-bold">+25 Tanga</span>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> O'rtacha 2 daqiqa
                    </div>
                    <button
                      onClick={() => onNavigate('codelab')}
                      className="text-xs bg-brand-orange hover:bg-brand-orange/80 text-black font-bold px-3 py-1.5 rounded"
                    >
                      Mashqni boshlash
                    </button>
                  </div>
                </div>

                <div className="bg-black/30 border border-brand-orange/20 rounded-lg p-4 hover:border-brand-orange/50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-sm">Tugma hover effekti</h4>
                    <span className="text-xs text-[#FFD700] font-bold">+50 Tanga</span>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> O'rtacha 5 daqiqa
                    </div>
                    <button
                      onClick={() => onNavigate('codelab')}
                      className="text-xs bg-brand-orange hover:bg-brand-orange/80 text-black font-bold px-3 py-1.5 rounded"
                    >
                      Mashqni boshlash
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Today's Tasks */}
          <section className="glass-panel p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Target className="text-brand-orange" size={18} />
                <h2 className="font-semibold text-lg">Shoshilinch missiyalar</h2>
              </div>
              <button onClick={() => onNavigate('assignments')} className="text-xs text-gray-400 hover:text-white flex items-center">
                Barchasini ko'rish <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingAssignments.length === 0 && (
                <p className="text-sm text-gray-500">Hozircha kutilayotgan missiyalar yo'q. Ajoyib ish!</p>
              )}
              {upcomingAssignments.map((task) => (
                <div key={task.id} className="bg-black/20 border border-brand-border rounded-lg p-3 hover:border-brand-cyan/50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan capitalize">
                        {trackLabel(task.track)}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} /> {formatRelativeTime(task.dueDate)}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm">{task.title}</h4>
                  </div>

                  <span className="text-xs font-mono font-bold text-brand-purple">+{task.xpReward} XP</span>

                  <button onClick={() => onNavigate('assignments')} className="hidden sm:flex text-brand-cyan p-2 hover:bg-brand-cyan/10 rounded-full transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN - 40% (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          
          <TaskSequencer />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 flex flex-col items-center justify-center text-center">
              <Star className="text-brand-purple mb-2" size={24} />
              <div className="font-mono text-2xl font-bold">{user.xp}</div>
              <div className="text-xs text-gray-400">Jami XP</div>
            </div>
            <div className="glass-panel p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Target size={64} className="text-brand-orange" />
              </div>
              <div className="text-brand-orange font-bold text-xl mb-1 flex items-center gap-1">
                🔥 {user.streak}
              </div>
              <div className="font-mono text-xl font-bold">Kun</div>
              <div className="text-xs text-gray-400">Joriy seriya</div>
            </div>
            <div className="glass-panel p-4 flex flex-col items-center justify-center text-center">
              <CheckSquare className="text-brand-green mb-2" size={24} />
              <div className="font-mono text-2xl font-bold">{questsCompleted}</div>
              <div className="text-xs text-gray-400">Bajarilgan missiyalar</div>
            </div>
            <div className="glass-panel p-4 flex flex-col items-center justify-center text-center">
              <Trophy className="text-[#FFD700] mb-2" size={24} />
              <div className="font-mono text-2xl font-bold">{user.coins}</div>
              <div className="text-xs text-gray-400">Tangalar</div>
            </div>
          </div>

          {/* AI Mentor Card */}
          <section className="glass-panel p-1 rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-bg relative group">
            <div className="absolute inset-0 bg-brand-purple/5 blur-xl group-hover:bg-brand-purple/10 transition-colors rounded-xl"></div>
            <div className="bg-brand-card p-4 rounded-lg relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center border border-brand-purple/50">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-bold text-brand-purple text-glow">TechSensei AI</h3>
                  <p className="text-xs text-gray-300">Sizning shaxsiy dasturlash mentoringiz</p>
                </div>
              </div>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-mentor'))}
                className="w-full flex items-center justify-between gap-2 bg-black/40 border border-brand-border rounded-lg pl-3 pr-2 py-2.5 text-sm text-gray-400 hover:border-brand-purple hover:text-white transition-all group/mentor"
              >
                <span>Kodingiz haqida savol bering...</span>
                <span className="p-1 text-brand-purple group-hover/mentor:bg-brand-purple/20 rounded transition-colors">
                  <ArrowUpRight size={18} />
                </span>
              </button>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="glass-panel p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Activity className="text-gray-400" size={18} />
                <h2 className="font-semibold text-lg">Faoliyat lentasi</h2>
              </div>
            </div>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-border before:via-brand-border before:to-transparent">
              {recentActivity.length === 0 && (
                <p className="text-sm text-gray-500">Hozircha faoliyat yo'q.</p>
              )}
              {recentActivity.map((item) => {
                const style = ACTIVITY_STYLES[item.type];
                return (
                  <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 border-brand-bg ${style.dot} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}></div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] bg-black/20 p-3 rounded-lg border border-brand-border">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 mb-1">{formatRelativeTime(item.createdAt)}</span>
                        <p className="text-sm">
                          <span className={`font-semibold ${style.text}`}>{item.title}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
