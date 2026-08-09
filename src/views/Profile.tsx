import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Github, Linkedin, Globe, Calendar, Award, Zap, Shield, Star, Medal, Lock, Activity as ActivityIcon, Briefcase, CheckCircle2, FileText, Loader2, EyeOff } from 'lucide-react';
import { User } from '../types';
import { api, ApiError } from '../lib/api';
import { formatDate, formatRelativeTime } from '../lib/utils';
import { trackLabel } from '../lib/tracks';

const ROLE_LABELS: Record<User['role'], string> = {
  student: "O'quvchi",
  teacher: "O'qituvchi",
  admin: 'Administrator',
};


function moduleTitle(moduleKey: string): string {
  return moduleKey.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

interface ProjectSubmission {
  status: string;
  githubUrl: string | null;
  demoUrl: string | null;
}

interface ProfileAssignment {
  id: string;
  title: string;
  track: string;
  submission: ProjectSubmission | null;
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

const SKILL_COLORS = ['bg-brand-cyan', 'bg-brand-purple', 'bg-brand-orange', 'bg-brand-green', 'bg-yellow-400'];

function ProjectCard({ project }: { project: ProfileAssignment }) {
  const submission = project.submission;
  return (
    <motion.div whileHover={{ y: -5 }} className="glass-panel p-0 overflow-hidden group border border-brand-border hover:border-brand-purple/50 transition-colors">
      <div className="h-32 bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/20 to-brand-cyan/20"></div>
      </div>
      <div className="p-4">
        <h4 className="font-bold mb-1 group-hover:text-brand-purple transition-colors">{project.title}</h4>
        <p className="text-xs text-gray-400 mb-3">
          {submission?.status === 'GRADED' ? 'Baholangan loyiha' : 'Topshirilgan loyiha'}
        </p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded capitalize">{trackLabel(project.track)}</span>
          {submission?.githubUrl && (
            <a href={submission.githubUrl} target="_blank" rel="noreferrer" className="text-[10px] bg-white/10 px-2 py-0.5 rounded hover:bg-white/20 transition-colors flex items-center gap-1">
              <Github size={10} /> GitHub
            </a>
          )}
          {submission?.demoUrl && (
            <a href={submission.demoUrl} target="_blank" rel="noreferrer" className="text-[10px] bg-white/10 px-2 py-0.5 rounded hover:bg-white/20 transition-colors flex items-center gap-1">
              <Globe size={10} /> Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SkillBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="text-gray-400">{value}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
type Category = 'PROGRAMMING' | 'SPEED' | 'SOCIAL' | 'SPECIAL' | 'SECRET';

interface Badge {
  id: string;
  name: string;
  category: Category;
  rarity: Rarity;
  howToEarn: string;
  unlocked: boolean;
}

const CATEGORY_ICONS: Record<Category, React.ComponentType<{ className?: string }>> = {
  PROGRAMMING: Zap,
  SPEED: Star,
  SOCIAL: Award,
  SPECIAL: Shield,
  SECRET: Medal,
};

const RARITY_LABELS: Record<Rarity, string> = {
  COMMON: 'oddiy',
  RARE: 'noyob',
  EPIC: 'epik',
  LEGENDARY: 'afsonaviy',
};

function BadgeCaseOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [hoveredBadge, setHoveredBadge] = useState<Badge | null>(null);

  const { data: badges = [], isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => api.get<Badge[]>('/achievements'),
    enabled: isOpen,
  });

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'COMMON': return 'text-gray-400 border-gray-400/30';
      case 'RARE': return 'text-brand-cyan border-brand-cyan/50 shadow-[0_0_10px_rgba(0,217,255,0.3)]';
      case 'EPIC': return 'text-brand-purple border-brand-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.4)]';
      case 'LEGENDARY': return 'text-[#FFD700] border-[#FFD700]/50 shadow-[0_0_20px_rgba(255,215,0,0.5)]';
    }
  };

  const getRarityBg = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'COMMON': return 'bg-gray-400/10';
      case 'RARE': return 'bg-brand-cyan/10';
      case 'EPIC': return 'bg-brand-purple/10';
      case 'LEGENDARY': return 'bg-[#FFD700]/10';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl glass-panel p-8 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-heading font-bold text-white mb-2">Nishonlar to'plami</h2>
                <p className="text-gray-400 text-sm">Sizning kibernetik sharaf va yutuqlaringiz to'plami.</p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white p-2">&times;</button>
            </div>

            {isLoading && <p className="text-sm text-gray-500">Nishonlar yuklanmoqda...</p>}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {badges.map((badge) => {
                const Icon = CATEGORY_ICONS[badge.category];
                return (
                  <div key={badge.id} className="relative group">
                    <motion.div
                      onMouseEnter={() => setHoveredBadge(badge)}
                      onMouseLeave={() => setHoveredBadge(null)}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`aspect-square rounded-2xl border-2 flex items-center justify-center relative cursor-help transition-all duration-300 ${badge.unlocked ? getRarityColor(badge.rarity) : 'border-gray-800 text-gray-800 grayscale'} ${getRarityBg(badge.rarity)}`}
                    >
                      {badge.unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      {badge.unlocked && badge.rarity === 'LEGENDARY' && (
                        <motion.div
                          animate={{ opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl"
                        />
                      )}
                    </motion.div>
                    <p className={`mt-2 text-center text-xs font-bold uppercase tracking-widest ${badge.unlocked ? 'text-white' : 'text-gray-700'}`}>{badge.name}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 h-24 border-t border-white/10 pt-4 relative">
              <AnimatePresence mode="wait">
                {hoveredBadge ? (
                  <motion.div
                    key={hoveredBadge.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{hoveredBadge.name}</span>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${getRarityBg(hoveredBadge.rarity)} ${getRarityColor(hoveredBadge.rarity)}`}>{RARITY_LABELS[hoveredBadge.rarity]}</span>
                    </div>
                    <p className="text-gray-400 text-sm italic">"{hoveredBadge.howToEarn}"</p>
                  </motion.div>
                ) : (
                  <div className="text-gray-600 text-sm italic flex items-center h-full justify-center">Tafsilotlarni ko'rish uchun nishon ustiga sichqonchani olib boring</div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------------------------
 * Portfolio — the public record of what a student actually built and solved.
 * Served by GET /api/portfolio/:userId (see src/server/routes/portfolio.ts).
 * ------------------------------------------------------------------------- */

type ProblemDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | 'MASTER';

const PORTFOLIO_DIFFICULTY_STYLE: Record<ProblemDifficulty, string> = {
  EASY: 'bg-brand-green/20 text-brand-green',
  MEDIUM: 'bg-yellow-500/20 text-yellow-500',
  HARD: 'bg-red-500/20 text-red-500',
  EXPERT: 'bg-brand-purple/20 text-brand-purple',
  MASTER: 'bg-[#FFD700]/20 text-[#FFD700]',
};

const PORTFOLIO_DIFFICULTY_LABEL: Record<ProblemDifficulty, string> = {
  EASY: 'Oson',
  MEDIUM: "O'rta",
  HARD: 'Qiyin',
  EXPERT: 'Ekspert',
  MASTER: 'Master',
};

interface PortfolioSolvedProblem {
  problemId: string;
  title: string;
  difficulty: ProblemDifficulty;
  points: number;
  tags: string[];
  solvedAt: string | null;
}

interface PortfolioRubricScore {
  label: string;
  points: number;
  note?: string;
}

interface PortfolioProject {
  submissionId: string;
  lessonKey: string | null;
  title: string;
  status: string;
  submittedAt: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  defense: string | null;
  rubricTotal: number | null;
  rubricMax: number;
  rubricScores: PortfolioRubricScore[];
}

interface PortfolioResponse {
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
    level: number;
    xp: number;
    title: string | null;
    track: string | null;
    profilePublic: boolean;
  };
  solvedCount: number;
  solved: PortfolioSolvedProblem[];
  projects: PortfolioProject[];
}

const DEFENSE_MAX_CHARS = 2000;

function difficultyStyle(difficulty: ProblemDifficulty): string {
  return PORTFOLIO_DIFFICULTY_STYLE[difficulty] ?? 'bg-white/10 text-gray-300';
}

function difficultyLabel(difficulty: ProblemDifficulty): string {
  return PORTFOLIO_DIFFICULTY_LABEL[difficulty] ?? difficulty;
}

function SolvedProblemRow({ problem }: { problem: PortfolioSolvedProblem }) {
  return (
    <div className="flex items-center gap-3 bg-black/20 px-3 py-2 rounded-lg border border-brand-border">
      <CheckCircle2 size={14} className="text-brand-green shrink-0" />
      <span className="flex-1 text-sm text-white truncate">{problem.title}</span>
      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${difficultyStyle(problem.difficulty)}`}>
        {difficultyLabel(problem.difficulty)}
      </span>
      <span className="text-xs font-mono text-brand-purple shrink-0">+{problem.points} XP</span>
    </div>
  );
}

interface DefenseEditorProps {
  submissionId: string;
  initialValue: string;
  onSaved: () => void;
}

/**
 * Inline defense editor. Only rendered for the portfolio owner — a defense
 * written by anyone else is worthless when an employer starts asking questions.
 */
function DefenseEditor({ submissionId, initialValue, onSaved }: DefenseEditorProps) {
  const [text, setText] = useState(initialValue);

  const mutation = useMutation({
    mutationFn: (defense: string) =>
      api.post<{ id: string; defense: string }>(`/portfolio/projects/${submissionId}/defense`, { defense }),
    onSuccess: () => onSaved(),
  });

  const trimmed = text.trim();
  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? "Himoya matnini saqlab bo'lmadi. Qaytadan urinib ko'ring."
        : null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs text-gray-400 leading-relaxed">
        Loyihangizni o'z so'zlaringiz bilan himoya qiling: qanday muammoni yechdingiz, qanday texnologiyalarni
        tanladingiz va nima uchun. Ish beruvchilar suhbatda aynan shuni so'raydi — kod emas, uning ortidagi qaror.
      </p>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={DEFENSE_MAX_CHARS}
        rows={4}
        placeholder="Masalan: Bu API'ni Express va Prisma'da yozdim, chunki..."
        className="w-full bg-black/40 border border-brand-border rounded-lg p-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan/60 transition-colors resize-y"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] text-gray-500 font-mono">
          {trimmed.length}/{DEFENSE_MAX_CHARS}
        </span>
        <button
          type="button"
          disabled={trimmed.length === 0 || mutation.isPending}
          onClick={() => mutation.mutate(trimmed)}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/50 hover:bg-brand-cyan/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <FileText size={12} />}
          Himoyani saqlash
        </button>
      </div>
      {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}
    </div>
  );
}

interface PortfolioProjectCardProps {
  project: PortfolioProject;
  isOwner: boolean;
  onSaved: () => void;
}

function PortfolioProjectCard({ project, isOwner, onSaved }: PortfolioProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const hasDefense = Boolean(project.defense && project.defense.trim().length > 0);
  const showEditor = isOwner && (!hasDefense || isEditing);

  return (
    <div className="glass-panel p-5 border border-brand-border">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="font-bold text-white">{project.title}</h4>
        {project.rubricTotal !== null ? (
          <span className="shrink-0 text-xs font-mono px-2 py-0.5 rounded bg-brand-green/20 text-brand-green">
            {project.rubricTotal}/{project.rubricMax} ball
          </span>
        ) : (
          <span className="shrink-0 text-xs px-2 py-0.5 rounded bg-white/10 text-gray-400">Baholanmagan</span>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] bg-white/10 px-2 py-0.5 rounded hover:bg-white/20 transition-colors flex items-center gap-1"
          >
            <Github size={10} /> GitHub
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] bg-white/10 px-2 py-0.5 rounded hover:bg-white/20 transition-colors flex items-center gap-1"
          >
            <Globe size={10} /> Demo
          </a>
        )}
        {!project.githubUrl && !project.demoUrl && (
          <span className="text-[10px] text-gray-500">Havola qo'shilmagan</span>
        )}
      </div>

      {project.rubricScores.length > 0 && (
        <div className="space-y-1 mb-3">
          {project.rubricScores.map((score) => (
            <div key={score.label} className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{score.label}</span>
              <span className="font-mono text-gray-300">{score.points}</span>
            </div>
          ))}
        </div>
      )}

      {hasDefense && (
        <div className="bg-black/20 border border-brand-border rounded-lg p-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Loyiha himoyasi</span>
            {isOwner && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-[10px] text-brand-cyan hover:underline"
              >
                Tahrirlash
              </button>
            )}
          </div>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{project.defense}</p>
        </div>
      )}

      {!hasDefense && !isOwner && (
        <p className="text-xs text-gray-500 italic">Muallif hali loyiha himoyasini yozmagan.</p>
      )}

      {showEditor && (
        <DefenseEditor
          submissionId={project.submissionId}
          initialValue={project.defense ?? ''}
          onSaved={() => {
            setIsEditing(false);
            onSaved();
          }}
        />
      )}
    </div>
  );
}

interface PortfolioSectionProps {
  viewerId: string;
  ownerId: string;
}

function PortfolioSection({ viewerId, ownerId }: PortfolioSectionProps) {
  const queryClient = useQueryClient();
  const isOwner = viewerId === ownerId;

  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio', ownerId],
    queryFn: () => api.get<PortfolioResponse>(`/portfolio/${ownerId}`),
    retry: false,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['portfolio', ownerId] });
  };

  if (isLoading) {
    return <p className="text-sm text-gray-500">Portfolio yuklanmoqda...</p>;
  }

  // A closed profile answers 404 on purpose (it must not confirm the id exists),
  // so this is a normal state, not an error screen.
  if (error instanceof ApiError && error.status === 404) {
    return (
      <div className="glass-panel p-6 border border-brand-border flex items-start gap-3">
        <EyeOff size={18} className="text-gray-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white mb-1">Bu profil yopiq</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Egasi portfolioni yashirgan. Sozlamalardan profilni ochiq qilsangiz, ishlaringiz hammaga ko'rinadi.
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-red-400">
        Portfolioni yuklab bo'lmadi. Sahifani yangilab, qaytadan urinib ko'ring.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <CheckCircle2 className="text-brand-green" /> Yechilgan masalalar
          <span className="text-sm font-mono text-gray-500">({data.solvedCount})</span>
        </h3>
        {data.solved.length === 0 ? (
          <p className="text-sm text-gray-500">
            Hali bironta masala yechilmagan. Amaliyot bo'limidan birinchi masalani yeching!
          </p>
        ) : (
          <div className="space-y-2">
            {data.solved.map((problem) => (
              <SolvedProblemRow key={problem.problemId} problem={problem} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Briefcase className="text-brand-purple" /> Loyihalar portfoliosi
          <span className="text-sm font-mono text-gray-500">({data.projects.length})</span>
        </h3>
        {data.projects.length === 0 ? (
          <p className="text-sm text-gray-500">
            Hali topshirilgan loyiha yo'q. Kursdagi loyiha darsini yakunlang — portfolio shu yerda yig'iladi.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {data.projects.map((project) => (
              <PortfolioProjectCard
                key={project.submissionId}
                project={project}
                isOwner={isOwner}
                onSaved={invalidate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProfileProps {
  user: User;
  onRoleToggle?: () => void;
}

interface ModuleProgressEntry {
  moduleKey: string;
  progress: number;
  unlocked: boolean;
}

const TABS = ["Umumiy ko'rinish", 'Portfolio', 'Loyihalar', "Ko'nikmalar", 'Faollik'] as const;
type ProfileTab = (typeof TABS)[number];

export function Profile({ user, onRoleToggle }: ProfileProps) {
  const [isBadgeCaseOpen, setIsBadgeCaseOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>(TABS[0]);

  const { data: modules = [] } = useQuery({
    queryKey: ['progress', 'modules'],
    queryFn: () => api.get<ModuleProgressEntry[]>('/progress/modules'),
  });
  const completedModules = modules.filter((m) => m.unlocked).length;
  const unlockedModules = modules.filter((m) => m.unlocked);

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => api.get<ProfileAssignment[]>('/assignments'),
  });
  const projects = assignments.filter(
    (a) => a.submission && (a.submission.status === 'SUBMITTED' || a.submission.status === 'GRADED')
  );

  const { data: activity = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get<ActivityNotification[]>('/notifications'),
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Header Profile Card */}
      <div className="glass-panel overflow-hidden border-0 relative shadow-2xl">
        <div className="h-48 bg-gradient-to-r from-[#0A0E27] via-brand-purple/40 to-brand-cyan/20 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
          
          {/* Role Badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${user.role === 'teacher' ? 'bg-brand-purple animate-pulse' : 'bg-brand-cyan'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">{ROLE_LABELS[user.role]} hisobi</span>
          </div>
        </div>
        
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 sm:-mt-20 mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-brand-bg bg-brand-bg p-1 relative z-10">
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              </div>
              {/* Level ring */}
              <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90 z-0" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <circle cx="50" cy="50" r="48" fill="none" stroke="#B026FF" strokeWidth="4" strokeDasharray="301.59" strokeDashoffset="60" className="drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]" />
              </svg>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-brand-bg px-4 py-1 rounded-full border border-brand-purple text-xs font-bold whitespace-nowrap z-20 shadow-[0_0_10px_rgba(176,38,255,0.5)]">
                {user.level}-daraja
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-1 text-white">{user.name}</h1>
              <p className="text-brand-cyan font-medium mb-3">{user.title}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(user.createdAt)} sanasida qo'shilgan</span>
              </div>
            </div>
            
            <div className="flex gap-2 shrink-0">
              {onRoleToggle && (
                <button 
                  onClick={onRoleToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 font-semibold rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  <Shield size={18} />
                  {user.role === 'student' ? "O'qituvchiga o'tish" : "O'quvchiga o'tish"}
                </button>
              )}
              <button onClick={() => setIsBadgeCaseOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-purple/20 text-brand-purple font-semibold rounded-lg hover:bg-brand-purple/30 transition-colors border border-brand-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.2)]">
                <Award size={18} />
                Nishonlarni ko'rish
              </button>
            </div>
          </div>

          <BadgeCaseOverlay isOpen={isBadgeCaseOpen} onClose={() => setIsBadgeCaseOpen(false)} />

          <p className="text-gray-300 max-w-3xl text-sm leading-relaxed mb-8">
            Dizayn va kod chorrahasini o'rganayotgan ishtiyoqli frontend dasturchi. Hozirda Reactni chuqur o'rganmoqda va UI animatsiyalariga sho'ng'imoqda. Ko'nikmalarini sinash uchun doimo yangi hakatonlar izlaydi.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-black/30 p-4 rounded-xl border border-brand-border">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Jami XP</div>
              <div className="text-2xl font-mono font-bold text-white">{user.xp.toLocaleString()}</div>
            </motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-black/30 p-4 rounded-xl border border-brand-border">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Kurslar</div>
              <div className="text-2xl font-mono font-bold text-white">{completedModules}<span className="text-sm text-gray-500 ml-1">tugallangan</span></div>
            </motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-black/30 p-4 rounded-xl border border-brand-border">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Loyihalar</div>
              <div className="text-2xl font-mono font-bold text-white">{projects.length}</div>
            </motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-black/30 p-4 rounded-xl border border-brand-border relative overflow-hidden">
              <div className="absolute -right-2 -bottom-2 text-brand-orange opacity-20">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
              </div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Ketma-ket kunlar</div>
              <div className="text-2xl font-mono font-bold text-brand-orange">{user.streak} kun</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-brand-border px-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Umumiy ko'rinish" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2"><Award className="text-brand-purple" /> Tanlangan loyihalar</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.length === 0 && (
                <p className="text-sm text-gray-500 sm:col-span-2">Hali loyihalar yo'q. Birinchi vazifangizni topshiring!</p>
              )}
              {projects.slice(0, 2).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg">Asosiy ko'nikmalar</h3>
            <div className="glass-panel p-5 space-y-4">
              {unlockedModules.length === 0 && (
                <p className="text-sm text-gray-500">Hali modul boshlanmagan.</p>
              )}
              {unlockedModules.slice(0, 4).map((m, i) => (
                <SkillBar key={m.moduleKey} label={moduleTitle(m.moduleKey)} value={m.progress} color={SKILL_COLORS[i % SKILL_COLORS.length]} />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Portfolio' && <PortfolioSection viewerId={user.id} ownerId={user.id} />}

      {activeTab === 'Loyihalar' && (
        <div className="space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2"><Award className="text-brand-purple" /> Barcha loyihalar</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.length === 0 && (
              <p className="text-sm text-gray-500 sm:col-span-2 lg:col-span-3">Hali loyihalar yo'q. Birinchi vazifangizni topshiring!</p>
            )}
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "Ko'nikmalar" && (
        <div className="max-w-xl space-y-6">
          <h3 className="font-bold text-lg">Modullar bo'yicha ko'nikmalar</h3>
          <div className="glass-panel p-5 space-y-4">
            {unlockedModules.length === 0 && (
              <p className="text-sm text-gray-500">Hali modul boshlanmagan.</p>
            )}
            {unlockedModules.map((m, i) => (
              <SkillBar key={m.moduleKey} label={moduleTitle(m.moduleKey)} value={m.progress} color={SKILL_COLORS[i % SKILL_COLORS.length]} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Faollik' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2"><ActivityIcon className="text-brand-purple" /> Faoliyat lentasi</h3>
          <div className="glass-panel p-5 space-y-3">
            {activity.length === 0 && (
              <p className="text-sm text-gray-500">Hozircha faoliyat yo'q.</p>
            )}
            {activity.slice(0, 10).map((item) => {
              const style = ACTIVITY_STYLES[item.type];
              return (
                <div key={item.id} className="bg-black/20 p-3 rounded-lg border border-brand-border flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${style.dot}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold ${style.text}`}>{item.title}</span>
                      <span className="text-[10px] text-gray-500 shrink-0">{formatRelativeTime(item.createdAt)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
