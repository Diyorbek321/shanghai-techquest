/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { CodeLab } from './views/CodeLab';
import { Leaderboard } from './views/Leaderboard';
import { Classes } from './views/Classes';
import { Assignments } from './views/Assignments';
import { Achievements } from './views/Achievements';
import { Profile } from './views/Profile';
import { Shop } from './views/Shop';
import { Arena } from './views/Arena';
import { MyWorld } from './views/MyWorld';
import { FrontendCourse } from './views/FrontendCourse';
import { Problems } from './views/Problems';
import { MissionLog } from './views/MissionLog';
import { Settings } from './views/Settings';
import { TeacherPortal } from './views/TeacherPortal';
import { Teams } from './views/Teams';
import { HelpCenter } from './views/HelpCenter';
import { Battle } from './views/Battle';
import { RoboticsLab } from './views/RoboticsLab';
import { Homework } from './views/Homework';
import { Attendance } from './views/Attendance';
import { OfficeCourse } from './views/OfficeCourse';
import { AssignmentDetail } from './views/AssignmentDetail';
import { Notifications } from './views/Notifications';
import { Grades } from './views/Grades';
import { Calendar } from './views/Calendar';
import { AIMentorChat } from './components/AIMentorChat';
import { SuccessParticles } from './components/SuccessParticles';
import { Companion } from './components/Companion';
import { ShortcutManager } from './components/ShortcutManager';
import { SocialMatrix } from './components/SocialMatrix';
import { ViewType, User } from './types';
import { audioManager } from './lib/audio';
import { useQuestManager } from './lib/QuestManager';

// Initialize audio manager
audioManager.init();

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showSuccess, setShowSuccess] = useState(false);
  const { universalXp } = useQuestManager();

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Mock user data dynamically merged with context XP
  const [mockUser, setMockUser] = useState<User>({
    name: 'Alex Chen',
    avatar: 'https://i.pravatar.cc/150?u=13',
    level: Math.floor(universalXp / 500) + 10,
    title: 'Full Stack Apprentice',
    xp: universalXp,
    nextLevelXp: Math.floor(universalXp / 500) * 500 + 500,
    streak: 12,
    coins: 1250,
    avatarGear: ['neon_visor', universalXp > 3000 ? 'shoulder_armor' : ''],
    role: 'student'
  });

  const toggleRole = () => {
    setMockUser(prev => ({
      ...prev,
      role: prev.role === 'student' ? 'teacher' : 'student'
    }));
    triggerSuccess();
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={mockUser} onNavigate={setCurrentView} onTriggerSuccess={triggerSuccess} />;
      case 'classes':
        return <Classes onNavigate={setCurrentView} />;
      case 'assignments':
        return <Assignments onNavigate={setCurrentView} />;
      case 'assignment_detail':
        return <AssignmentDetail onBack={() => setCurrentView('assignments')} onTriggerSuccess={triggerSuccess} />;
      case 'codelab':
        return <CodeLab />;
      case 'arena':
        return <Arena user={mockUser} onNavigate={setCurrentView} />;
      case 'shop':
        return <Shop user={mockUser} />;
      case 'myworld':
        return <MyWorld user={mockUser} onNavigate={setCurrentView} />;
      case 'frontend_course':
        return <FrontendCourse onNavigate={setCurrentView} onTriggerSuccess={triggerSuccess} />;
      case 'office_course':
        return <OfficeCourse onNavigate={setCurrentView} />;
      case 'problems':
        return <Problems />;
      case 'leaderboard':
        return <Leaderboard user={mockUser} onNavigate={setCurrentView} />;
      case 'mission_log':
        return <MissionLog />;
      case 'achievements':
        return <Achievements />;
      case 'profile':
        return <Profile user={mockUser} onRoleToggle={toggleRole} />;
      case 'settings':
        return <Settings />;
      case 'teacher_portal':
        return <TeacherPortal />;
      case 'teams':
        return <Teams />;
      case 'help':
        return <HelpCenter />;
      case 'battle':
        return <Battle user={mockUser} onNavigate={setCurrentView} />;
      case 'robotics_lab':
        return <RoboticsLab />;
      case 'attendance':
        return <Attendance />;
      case 'homework':
        return <Homework />;
      case 'notifications':
        return <Notifications />;
      case 'grades':
        return <Grades />;
      case 'calendar':
        return <Calendar />;
      default:
        return <Dashboard user={mockUser} onNavigate={setCurrentView} onTriggerSuccess={triggerSuccess} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView} user={mockUser}>
      <div className="scanlines"></div>
      <SuccessParticles active={showSuccess} />
      <ShortcutManager />
      <Companion />
      <SocialMatrix user={mockUser} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
      <AIMentorChat />
    </Layout>
  );
}
