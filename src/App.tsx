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
import { AssignmentSubmissions } from './views/AssignmentSubmissions';
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

// Initialize audio manager
audioManager.init();

export default function App({ user }: { user: User }) {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedBattleId, setSelectedBattleId] = useState<string | null>(null);

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Cosmetic gear derived client-side from XP thresholds; not persisted server-side.
  const mockUser: User = {
    ...user,
    avatarGear: ['neon_visor', user.xp > 3000 ? 'shoulder_armor' : ''],
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={mockUser} onNavigate={setCurrentView} onTriggerSuccess={triggerSuccess} />;
      case 'classes':
        return <Classes onNavigate={setCurrentView} />;
      case 'assignments':
        return <Assignments user={mockUser} onNavigate={setCurrentView} onSelectAssignment={setSelectedAssignmentId} />;
      case 'assignment_detail':
        return (
          <AssignmentDetail
            assignmentId={selectedAssignmentId}
            onBack={() => setCurrentView('assignments')}
            onTriggerSuccess={triggerSuccess}
          />
        );
      case 'assignment_submissions':
        return (
          <AssignmentSubmissions
            assignmentId={selectedAssignmentId}
            onBack={() => setCurrentView('assignments')}
          />
        );
      case 'codelab':
        return <CodeLab />;
      case 'arena':
        return <Arena user={mockUser} onNavigate={setCurrentView} onSelectBattle={setSelectedBattleId} />;
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
        return <Leaderboard user={mockUser} onNavigate={setCurrentView} onSelectBattle={setSelectedBattleId} />;
      case 'mission_log':
        return <MissionLog />;
      case 'achievements':
        return <Achievements />;
      case 'profile':
        return <Profile user={mockUser} />;
      case 'settings':
        return <Settings user={mockUser} />;
      case 'teacher_portal':
        return <TeacherPortal />;
      case 'teams':
        return <Teams user={mockUser} />;
      case 'help':
        return <HelpCenter />;
      case 'battle':
        return <Battle user={mockUser} onNavigate={setCurrentView} battleId={selectedBattleId} />;
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
      <SocialMatrix user={mockUser} onNavigate={setCurrentView} onSelectBattle={setSelectedBattleId} />
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
