export type ViewType = 'dashboard' | 'classes' | 'assignments' | 'codelab' | 'leaderboard' | 'achievements' | 'profile' | 'shop' | 'arena' | 'myworld' | 'frontend_course' | 'problems' | 'mission_log' | 'settings' | 'teacher_portal' | 'teams' | 'help' | 'battle' | 'robotics_lab' | 'skill_tree' | 'assignment_detail' | 'assignment_submissions' | 'attendance' | 'homework' | 'office_course' | 'backend_course' | 'notifications' | 'grades' | 'calendar' | 'user_management';

export type UserRole = 'student' | 'teacher' | 'admin';

export type Track = 'frontend' | 'robotics' | 'office' | 'backend';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  level: number;
  title: string;
  xp: number;
  nextLevelXp: number;
  streak: number;
  coins: number;
  avatarGear?: string[];
  role: UserRole;
  track: Track | null;
  theme: 'dark' | 'neon' | 'cyber';
  audioEnabled: boolean;
  pushEnabled: boolean;
  onlineVisible: boolean;
  profilePublic: boolean;
  eloRating: number;
  teamId: string | null;
  teamRole: 'leader' | 'member' | null;
  createdAt: string;
}
