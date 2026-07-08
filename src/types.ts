export type ViewType = 'dashboard' | 'classes' | 'assignments' | 'codelab' | 'leaderboard' | 'achievements' | 'profile' | 'shop' | 'arena' | 'myworld' | 'frontend_course' | 'problems' | 'mission_log' | 'settings' | 'teacher_portal' | 'teams' | 'help' | 'battle' | 'robotics_lab' | 'skill_tree' | 'assignment_detail' | 'attendance' | 'homework' | 'office_course' | 'notifications' | 'grades' | 'calendar';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
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
}
