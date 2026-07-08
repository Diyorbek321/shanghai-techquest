import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, PlayCircle, Star, Target, Zap, ChevronRight, Activity, ArrowUpRight, Code, CheckSquare, Trophy, Gift, LayoutGrid, LayoutList } from 'lucide-react';
import { User } from '../types';
import { TaskSequencer } from '../components/TaskSequencer';

interface DashboardProps {
  user: User;
  onNavigate: (view: any) => void;
  onTriggerSuccess: () => void;
}

export function Dashboard({ user, onNavigate, onTriggerSuccess }: DashboardProps) {
  const [claimed, setClaimed] = useState(false);

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
            Welcome back, <span className="text-brand-cyan">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-400">Ready to level up your coding skills today?</p>
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
                  <h4 className="text-[#FFD700] font-bold text-sm">Daily Login Bonus</h4>
                  <p className="text-xs text-gray-300">+50 XP Available</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClaim}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black font-bold px-3 py-1.5 rounded text-sm flex items-center gap-1 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                >
                  <Gift size={16} /> Claim
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
                <h2 className="font-semibold text-lg text-glow">Continue Learning</h2>
              </div>
              <span className="text-xs font-mono bg-brand-cyan/20 text-brand-cyan px-2 py-1 rounded">Frontend</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <div className="w-full sm:w-2/3">
                <h3 className="text-xl font-bold mb-2 group-hover:text-brand-cyan transition-colors">Advanced CSS Grid Architectures</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">Master complex responsive layouts using CSS Grid areas, minmax(), and auto-fit/auto-fill properties to build modern dashboard interfaces.</p>
                
                <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                  <span>Module 4 of 12</span>
                  <span>45% Complete</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                  <div className="bg-brand-cyan h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                
                <button 
                  onClick={() => onNavigate('classes')}
                  className="bg-brand-cyan text-brand-bg font-semibold px-4 py-2 rounded flex items-center gap-2 hover:bg-brand-cyan/90 transition-all neon-glow-cyan"
                >
                  <PlayCircle size={18} />
                  Resume Module
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
                <h2 className="font-semibold text-lg text-glow text-brand-orange">Daily Coding Katas</h2>
              </div>
              <span className="text-xs font-mono bg-brand-orange/20 text-brand-orange px-2 py-1 rounded">Time-Limited</span>
            </div>
            
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-400">Complete these short frontend challenges to earn bonus XP and coins. Speed and clean code are rewarded!</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/30 border border-brand-orange/20 rounded-lg p-4 hover:border-brand-orange/50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-sm">Center a Div</h4>
                    <span className="text-xs text-[#FFD700] font-bold">+25 Coins</span>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> 2 mins average
                    </div>
                    <button 
                      onClick={() => onNavigate('codelab')}
                      className="text-xs bg-brand-orange hover:bg-brand-orange/80 text-black font-bold px-3 py-1.5 rounded"
                    >
                      Start Kata
                    </button>
                  </div>
                </div>

                <div className="bg-black/30 border border-brand-orange/20 rounded-lg p-4 hover:border-brand-orange/50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-sm">Button Hover Effect</h4>
                    <span className="text-xs text-[#FFD700] font-bold">+50 Coins</span>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> 5 mins average
                    </div>
                    <button 
                      onClick={() => onNavigate('codelab')}
                      className="text-xs bg-brand-orange hover:bg-brand-orange/80 text-black font-bold px-3 py-1.5 rounded"
                    >
                      Start Kata
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
                <h2 className="font-semibold text-lg">Urgent Quests</h2>
              </div>
              <button onClick={() => onNavigate('assignments')} className="text-xs text-gray-400 hover:text-white flex items-center">
                View all <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'Build a Responsive Navbar', subject: 'Frontend', due: '4 hours', progress: 80, urgent: true },
                { title: 'REST API Authentication', subject: 'Backend', due: '1 day', progress: 30, urgent: false },
                { title: 'Binary Search Trees Lab', subject: 'Algorithms', due: '2 days', progress: 0, urgent: false }
              ].map((task, i) => (
                <div key={i} className="bg-black/20 border border-brand-border rounded-lg p-3 hover:border-brand-cyan/50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.subject === 'Frontend' ? 'bg-brand-cyan/20 text-brand-cyan' :
                        task.subject === 'Backend' ? 'bg-brand-purple/20 text-brand-purple' :
                        'bg-brand-green/20 text-brand-green'
                      }`}>
                        {task.subject}
                      </span>
                      {task.urgent && (
                        <span className="text-[10px] font-bold bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock size={10} /> {task.due}
                        </span>
                      )}
                      {!task.urgent && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> Due in {task.due}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-sm">{task.title}</h4>
                  </div>
                  
                  <div className="w-full sm:w-32 flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${task.urgent ? 'bg-brand-orange' : 'bg-brand-cyan'}`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button onClick={() => onNavigate('codelab')} className="hidden sm:flex text-brand-cyan p-2 hover:bg-brand-cyan/10 rounded-full transition-colors">
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

          {/* Peer Project Gallery (Mentor Only Feature) */}
          <section className="glass-panel p-5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="text-brand-cyan" size={18} />
                <h2 className="font-semibold text-lg">Peer Project Gallery</h2>
              </div>
              {user.level >= 20 && (
                <span className="text-[10px] bg-brand-purple/20 text-brand-purple px-2 py-1 rounded border border-brand-purple/50 font-bold uppercase tracking-widest">Mentor Access</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Sarah J.', title: 'Neon Clock Component', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80', level: 18 },
                { name: 'Marcus D.', title: 'Cyberpunk Form UI', img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80', level: 15 }
              ].map((project, i) => (
                <div key={i} className="group relative bg-black/40 border border-brand-border rounded-xl overflow-hidden hover:border-brand-cyan/50 transition-all">
                  <div className="aspect-video relative">
                    <img src={project.img} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="absolute bottom-2 left-2">
                      <p className="text-[10px] text-gray-400 font-mono">By {project.name}</p>
                    </div>
                  </div>
                  <div className="p-2 space-y-2">
                    <h4 className="text-xs font-bold text-white truncate">{project.title}</h4>
                    {user.level >= 20 ? (
                      <button 
                        onClick={() => alert(`Initiating formal peer review for ${project.name}'s project...`)}
                        className="w-full py-1.5 bg-brand-purple text-white text-[10px] font-bold rounded flex items-center justify-center gap-1 hover:bg-brand-purple/80 transition-colors"
                      >
                        <Trophy size={12} /> Review Project
                      </button>
                    ) : (
                      <button className="w-full py-1.5 bg-white/5 text-gray-500 text-[10px] font-bold rounded cursor-not-allowed flex items-center justify-center gap-1">
                        <Star size={12} /> View Only
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 flex flex-col items-center justify-center text-center">
              <Star className="text-brand-purple mb-2" size={24} />
              <div className="font-mono text-2xl font-bold">{user.xp}</div>
              <div className="text-xs text-gray-400">Total XP</div>
            </div>
            <div className="glass-panel p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Target size={64} className="text-brand-orange" />
              </div>
              <div className="text-brand-orange font-bold text-xl mb-1 flex items-center gap-1">
                🔥 {user.streak}
              </div>
              <div className="font-mono text-xl font-bold">Days</div>
              <div className="text-xs text-gray-400">Current Streak</div>
            </div>
            <div className="glass-panel p-4 flex flex-col items-center justify-center text-center">
              <CheckSquare className="text-brand-green mb-2" size={24} />
              <div className="font-mono text-2xl font-bold">42</div>
              <div className="text-xs text-gray-400">Quests Completed</div>
            </div>
            <div className="glass-panel p-4 flex flex-col items-center justify-center text-center">
              <Trophy className="text-[#FFD700] mb-2" size={24} />
              <div className="font-mono text-2xl font-bold">#14</div>
              <div className="text-xs text-gray-400">Class Rank</div>
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
                  <p className="text-xs text-gray-300">Your personal coding mentor</p>
                </div>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask a question about your code..."
                  className="w-full bg-black/40 border border-brand-border rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-brand-purple hover:bg-brand-purple/20 rounded">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="glass-panel p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Activity className="text-gray-400" size={18} />
                <h2 className="font-semibold text-lg">Activity Feed</h2>
              </div>
            </div>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-border before:via-brand-border before:to-transparent">
              {[
                { action: 'Earned Badge:', target: 'Bug Hunter', time: '2h ago', color: 'text-brand-purple', dot: 'bg-brand-purple' },
                { action: 'Completed:', target: 'CSS Flexbox Layouts', time: '5h ago', color: 'text-brand-green', dot: 'bg-brand-green' },
                { action: 'Leveled Up:', target: 'Lvl 12 Code Warrior', time: '1d ago', color: 'text-brand-cyan', dot: 'bg-brand-cyan' }
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 border-brand-bg ${item.dot} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] bg-black/20 p-3 rounded-lg border border-brand-border">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 mb-1">{item.time}</span>
                      <p className="text-sm">
                        <span className="text-gray-400">{item.action} </span>
                        <span className={`font-semibold ${item.color}`}>{item.target}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
