import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Code,
  Trophy,
  Medal,
  User as UserIcon,
  Settings as SettingsIcon,
  Bell,
  Search,
  MessageSquare,
  Menu,
  Store,
  Swords,
  Globe,
  BrainCircuit,
  ScrollText,
  Users,
  ShieldCheck,
  HelpCircle,
  Cpu,
  BookText,
  CalendarDays,
  Presentation,
  GraduationCap,
  Calendar as CalendarIcon,
  LogOut,
  UserCog
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ViewType, User, Track } from '../types';
import { audioManager } from '../lib/audio';
import { useAuth } from '../lib/AuthContext';

import { StudyTimer } from './StudyTimer';
import { QuickActions } from './QuickActions';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  user: User;
}

export function Layout({ children, currentView, onNavigate, user }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();

  type NavItem = { id: ViewType; label: string; icon: React.ReactNode; customColor?: string; trackRequirement?: Track };

  const isStaff = user.role === 'teacher' || user.role === 'admin';

  // Students get the full gamified experience (quests, city-building, PvP, shop).
  // Staff manage the platform, so their menu is a separate, focused set below.
  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Boshqaruv paneli', icon: <LayoutDashboard size={20} /> },
    { id: 'mission_log', label: 'Missiyalar jurnali', icon: <ScrollText size={20} />, customColor: 'text-brand-cyan shadow-[0_0_10px_rgba(0,217,255,0.5)]' },
    { id: 'myworld', label: 'Mening Shahrim', icon: <Globe size={20} />, customColor: 'text-brand-purple shadow-[0_0_10px_rgba(176,38,255,0.5)]' },
    { id: 'classes', label: 'Mening Sinflarim', icon: <BookOpen size={20} /> },
    { id: 'frontend_course', label: 'Frontend Dasturlash', icon: <Code size={20} />, customColor: 'text-brand-cyan', trackRequirement: 'frontend' },
    { id: 'office_course', label: 'Ofis Dasturlari', icon: <Presentation size={20} />, customColor: 'text-blue-500', trackRequirement: 'office' },
    { id: 'assignments', label: 'Vazifalar', icon: <CheckSquare size={20} /> },
    { id: 'homework', label: 'Uy vazifasi', icon: <BookText size={20} />, customColor: 'text-brand-orange' },
    { id: 'attendance', label: 'Davomat', icon: <CalendarDays size={20} /> },
    { id: 'notifications', label: 'Bildirishnomalar', icon: <Bell size={20} />, customColor: 'text-brand-purple' },
    { id: 'grades', label: 'Baholar', icon: <GraduationCap size={20} /> },
    { id: 'calendar', label: 'Jadval', icon: <CalendarIcon size={20} /> },
    { id: 'problems', label: 'Masalalar', icon: <BrainCircuit size={20} /> },
    { id: 'codelab', label: 'Kod Laboratoriyasi', icon: <Code size={20} /> },
    { id: 'robotics_lab', label: 'Robototexnika', icon: <Cpu size={20} />, customColor: 'text-brand-cyan shadow-[0_0_10px_rgba(0,217,255,0.3)]', trackRequirement: 'robotics' },
    { id: 'arena', label: 'Arena', icon: <Swords size={20} />, customColor: 'text-brand-red shadow-[0_0_10px_rgba(239,68,68,0.5)]' },
    { id: 'leaderboard', label: 'Reyting', icon: <Trophy size={20} /> },
    { id: 'teams', label: 'Jamoalar', icon: <Users size={20} />, customColor: 'text-brand-orange' },
    { id: 'achievements', label: 'Yutuqlar', icon: <Medal size={20} /> },
    { id: 'shop', label: "Do'kon", icon: <Store size={20} />, customColor: 'text-[#FFD700]' },
    { id: 'profile', label: 'Profil', icon: <UserIcon size={20} /> },
  ];

  const staffNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Boshqaruv paneli', icon: <LayoutDashboard size={20} /> },
    { id: 'teacher_portal', label: "O'qituvchi paneli", icon: <ShieldCheck size={20} />, customColor: 'text-brand-purple' },
    { id: 'classes', label: 'Sinflar', icon: <BookOpen size={20} /> },
    { id: 'assignments', label: 'Vazifalar', icon: <CheckSquare size={20} /> },
    { id: 'homework', label: 'Uy vazifasi', icon: <BookText size={20} />, customColor: 'text-brand-orange' },
    { id: 'attendance', label: 'Davomat', icon: <CalendarDays size={20} /> },
    { id: 'grades', label: 'Baholar', icon: <GraduationCap size={20} /> },
    { id: 'calendar', label: 'Jadval', icon: <CalendarIcon size={20} /> },
    { id: 'notifications', label: 'Bildirishnomalar', icon: <Bell size={20} />, customColor: 'text-brand-purple' },
    ...(user.role === 'admin'
      ? [{ id: 'user_management' as ViewType, label: 'Foydalanuvchilar', icon: <UserCog size={20} />, customColor: 'text-brand-cyan' }]
      : []),
    { id: 'profile', label: 'Profil', icon: <UserIcon size={20} /> },
  ];

  const navItems = isStaff
    ? staffNavItems
    : studentNavItems.filter(item => !item.trackRequirement || user.track === item.trackRequirement);

  const handleNavigate = (id: ViewType) => {
    audioManager.playClick();
    onNavigate(id);
  };

  return (
    <div className="flex h-screen w-full bg-brand-bg text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className={cn(
        "flex-shrink-0 bg-brand-sidebar border-r border-brand-border transition-all duration-300 flex flex-col z-20",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        {/* Logo area */}
        <div className="h-16 flex items-center px-4 border-b border-brand-border">
          <div className="flex items-center gap-3 text-brand-cyan">
            <div className="p-1.5 bg-brand-cyan/10 rounded-lg">
              <Code size={24} className="text-brand-cyan" />
            </div>
            {sidebarOpen && (
              <span className="font-heading font-bold text-lg tracking-wider text-glow">
                TechQuest
              </span>
            )}
          </div>
        </div>

        {/* User Card (Mini) */}
        <div className={cn("p-4 border-b border-brand-border", !sidebarOpen && "hidden")}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="relative w-10 h-10 rounded-full border-2 border-brand-purple overflow-hidden">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                {user.avatarGear?.includes('neon_visor') && (
                  <div className="absolute top-[30%] left-[10%] w-[80%] h-[20%] bg-brand-cyan/80 rounded-full blur-[1px] shadow-[0_0_10px_#00D9FF] z-10" />
                )}
                {user.avatarGear?.includes('shoulder_armor') && (
                  <div className="absolute bottom-0 left-0 w-full h-[30%] bg-brand-purple/70 border-t border-brand-cyan z-10" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-brand-bg rounded-full p-0.5 z-20">
                <span className="flex items-center justify-center w-4 h-4 bg-brand-purple text-[8px] font-bold rounded-full">
                  {user.level}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{user.name}</h3>
              <p className="text-xs text-gray-400 truncate">{user.title}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>XP</span>
              <span>{user.xp} / {user.nextLevelXp}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-brand-cyan to-brand-purple h-1.5 rounded-full"
                style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                onMouseEnter={() => audioManager.playHover()}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative",
                  isActive 
                    ? "bg-brand-cyan/10 text-brand-cyan neon-glow-cyan" 
                    : item.customColor ? `text-gray-400 hover:bg-white/5 hover:${item.customColor}` : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <div className={cn("flex-shrink-0 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")}>
                  {item.icon}
                </div>
                {sidebarOpen && (
                  <span className="font-medium text-sm text-left">{item.label}</span>
                )}
                {isActive && sidebarOpen && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(0,217,255,0.8)]"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Study Timer Area */}
        {sidebarOpen && (
          <div className="px-4 py-2">
            <StudyTimer />
          </div>
        )}

        {/* Settings button at bottom */}
        <div className="p-4 border-t border-brand-border space-y-1">
          <button 
            onClick={() => handleNavigate('help')}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white w-full rounded-lg transition-colors",
              currentView === 'help' && "bg-white/5 text-white"
            )}
          >
            <HelpCircle size={20} />
            {sidebarOpen && <span className="text-sm">Yordam markazi</span>}
          </button>
          <button
            onClick={() => handleNavigate('settings')}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white w-full rounded-lg transition-colors",
              currentView === 'settings' && "bg-white/5 text-white"
            )}
          >
            <SettingsIcon size={20} />
            {sidebarOpen && <span className="text-sm">Sozlamalar</span>}
          </button>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-brand-red w-full rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm">Chiqish</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-brand-sidebar/40 backdrop-blur-md border-b border-brand-border-subtle flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-md lg:hidden"
            >
              <Menu size={20} />
            </button>
            
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Vazifa, kod, do'stlarni qidirish..."
                className="bg-black/30 border border-brand-border rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {!isStaff && (
              <div className="flex items-center gap-1 text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
                <span className="text-sm font-bold">🔥 {user.streak}</span>
              </div>
            )}

            <button
              onClick={() => handleNavigate(isStaff ? 'notifications' : 'mission_log')}
              onMouseEnter={() => audioManager.playHover()}
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full"></span>
            </button>
            
            <button className="p-2 text-brand-purple hover:text-brand-purple/80 transition-colors hidden sm:block">
              <MessageSquare size={20} />
            </button>

            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-brand-cyan sm:hidden">
              <img src={user.avatar} alt="Profil" className="w-full h-full object-cover" />
              {user.avatarGear?.includes('neon_visor') && (
                <div className="absolute top-[30%] left-[10%] w-[80%] h-[20%] bg-brand-cyan/80 rounded-full blur-[1px] shadow-[0_0_10px_#00D9FF] z-10" />
              )}
              {user.avatarGear?.includes('shoulder_armor') && (
                <div className="absolute bottom-0 left-0 w-full h-[30%] bg-brand-purple/70 border-t border-brand-cyan z-10" />
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative bg-[radial-gradient(circle_at_50%_-20%,_#1E2248_0%,_#0A0E27_60%)]">
          {/* Subtle grid background effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10"></div>
          {children}
          <QuickActions onNavigate={onNavigate} userTrack={user.track} />
        </main>
      </div>
    </div>
  );
}
