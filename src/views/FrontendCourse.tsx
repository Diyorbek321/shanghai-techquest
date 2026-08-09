import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Code, 
  Terminal, 
  Zap, 
  ShieldAlert, 
  Check, 
  Lock, 
  ChevronRight, 
  PlayCircle, 
  FileText, 
  Download, 
  ExternalLink,
  Users,
  Monitor,
  MapPin,
  MessageSquare,
  Calendar,
  Clock,
  QrCode,
  Info,
  GitBranch,
  Layers,
  TestTube,
  Rocket,
  Palette,
  FormInput,
  Gauge,
  Boxes,
  Cpu,
  Flame,
  CheckCircle2,
  Paperclip
} from 'lucide-react';
import { User, ViewType } from '../types';
import { SkillTree } from '../components/SkillTree';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';

interface ModuleProgressRow {
  moduleKey: string;
  progress: number;
  unlocked: boolean;
}

interface DailyExerciseData {
  id: string;
  prompt: string;
  estMinutes: number;
  xpReward: number;
  date: string;
  completed: boolean;
  fileUrl: string | null;
  fileName: string | null;
  streak: number;
}

interface CalendarEventData {
  id: string;
  title: string;
  type: 'CLASS' | 'DEADLINE' | 'EXAM' | 'EVENT';
  startsAt: string;
  endsAt: string | null;
}

interface ModuleAssignment {
  id: string;
  moduleKey: string | null;
  submission: { status: string } | null;
}

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' });
}

function formatEventTime(iso: string) {
  return new Date(iso).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

const MODULE_CATALOG = [
  {
    id: 1,
    moduleKey: 'html-foundations',
    title: 'HTML Asoslari',
    desc: 'Sahifaning strukturaviy to\'rini quring.',
    icon: BookOpen,
    xp: 150,
    type: 'lesson',
    isHybrid: true
  },
  {
    id: 2,
    moduleKey: 'css-cyber-styling',
    title: 'CSS Kiber-Uslub',
    desc: 'Neon estetika va flex tartiblarni joriy eting.',
    icon: Code,
    xp: 200,
    type: 'lesson',
    isHybrid: true
  },
  {
    id: 3,
    moduleKey: 'js-logic-gates',
    title: 'JS Mantiq Darvozalari',
    desc: 'DOM\'ni buzib kiring va interaktivlikni ulang.',
    icon: Terminal,
    xp: 350,
    type: 'lesson',
    isHybrid: false
  },
  {
    id: 4,
    moduleKey: 'boss-responsive-hydra',
    title: 'BOSS: Moslashuvchan Gidra',
    desc: '3 ta qurilma o\'lchamida joylashuv xatolarini yengib chiqing.',
    icon: ShieldAlert,
    xp: 1000,
    type: 'boss',
    reward: 'Neon Plazma Shisha (Material)'
  },
  {
    id: 5,
    moduleKey: 'react-components',
    title: 'React Komponentlari',
    desc: 'Modulli UI komponentlarini yarating.',
    icon: Zap,
    xp: 400,
    type: 'lesson'
  },
  {
    id: 6,
    moduleKey: 'react-hooks-state',
    title: 'React Hooklari va Holat Boshqaruvi',
    desc: 'useState, useEffect va maxsus hooklar bilan dinamik interfeys quring.',
    icon: Cpu,
    xp: 450,
    type: 'lesson'
  },
  {
    id: 7,
    moduleKey: 'typescript-types',
    title: 'TypeScript Turlar Olami',
    desc: "Interfeyslar, generiklar va turlarni xavfsizligini o'rganing.",
    icon: FileText,
    xp: 400,
    type: 'lesson'
  },
  {
    id: 8,
    moduleKey: 'git-github-mastery',
    title: 'Git va GitHub Ustaligi',
    desc: "Branch, commit va pull request iш jarayonini egallang.",
    icon: GitBranch,
    xp: 300,
    type: 'lesson',
    isHybrid: true
  },
  {
    id: 9,
    moduleKey: 'boss-merge-conflict-beast',
    title: "BOSS: Merge Conflict Yirtqichi",
    desc: "Murakkab birlashtirish ziddiyatlarini yengib, tarixni saqlab qoling.",
    icon: ShieldAlert,
    xp: 900,
    type: 'boss',
    reward: 'Kiber Po\'lat (Material)'
  },
  {
    id: 10,
    moduleKey: 'api-fetch-requests',
    title: "API va Fetch So'rovlari",
    desc: "REST API bilan ishlash, async/await va xatoliklarni boshqarish.",
    icon: MessageSquare,
    xp: 400,
    type: 'lesson'
  },
  {
    id: 11,
    moduleKey: 'tailwind-utility-first',
    title: 'Tailwind CSS Utility-First Yondashuv',
    desc: "Tezkor va moslashuvchan uslublashtirish tizimini o'zlashtiring.",
    icon: Palette,
    xp: 300,
    type: 'lesson'
  },
  {
    id: 12,
    moduleKey: 'react-router-navigation',
    title: 'React Router Navigatsiyasi',
    desc: "Ko'p sahifali ilovalar uchun marshrutlashni sozlang.",
    icon: MapPin,
    xp: 350,
    type: 'lesson'
  },
  {
    id: 13,
    moduleKey: 'forms-validation',
    title: 'Formalar va Validatsiya',
    desc: "Foydalanuvchi kiritmalarini tekshirish va xatoliklarni ko'rsatish.",
    icon: FormInput,
    xp: 350,
    type: 'lesson'
  },
  {
    id: 14,
    moduleKey: 'boss-form-dragon',
    title: 'BOSS: Forma Ajdahosi',
    desc: "Ko'p bosqichli, murakkab validatsiyali formani mag'lub eting.",
    icon: ShieldAlert,
    xp: 1100,
    type: 'boss',
    reward: 'Golografik Panel (Material)'
  },
  {
    id: 15,
    moduleKey: 'state-management',
    title: 'Holatni Global Boshqarish',
    desc: "Context API va Redux yordamida murakkab holatni boshqaring.",
    icon: Boxes,
    xp: 500,
    type: 'lesson'
  },
  {
    id: 16,
    moduleKey: 'animations-framer-motion',
    title: 'Animatsiyalar (Framer Motion)',
    desc: "Silliq o'tishlar va interaktiv animatsiyalar yarating.",
    icon: Layers,
    xp: 350,
    type: 'lesson'
  },
  {
    id: 17,
    moduleKey: 'web-performance',
    title: 'Veb Unumdorlikni Optimallashtirish',
    desc: "Lazy loading, bundle hajmi va renderlash tezligini yaxshilang.",
    icon: Gauge,
    xp: 450,
    type: 'lesson'
  },
  {
    id: 18,
    moduleKey: 'testing-jest-rtl',
    title: 'Testlash (Jest va RTL)',
    desc: "Komponentlaringiz uchun ishonchli avtomatik testlar yozing.",
    icon: TestTube,
    xp: 400,
    type: 'lesson'
  },
  {
    id: 19,
    moduleKey: 'boss-deploy-gauntlet',
    title: "BOSS: Ishga Tushirish Sinovi",
    desc: "Ilovangizni CI/CD orqali ishlab chiqarish muhitiga xavfsiz chiqaring.",
    icon: ShieldAlert,
    xp: 1200,
    type: 'boss',
    reward: 'Kvant Halo Ramkasi (Frame)'
  },
  {
    id: 20,
    moduleKey: 'capstone-portfolio',
    title: 'Yakuniy Loyiha: Portfolio Sayti',
    desc: "O'rgangan barcha ko'nikmalaringizni birlashtirib, portfolio sayt yarating.",
    icon: Rocket,
    xp: 800,
    type: 'lesson'
  },
];

interface FrontendCourseProps {
  onNavigate: (view: ViewType) => void;
  onTriggerSuccess: () => void;
  onSelectAssignment: (assignmentId: string) => void;
}

export function FrontendCourse({ onNavigate, onTriggerSuccess, onSelectAssignment }: FrontendCourseProps) {
  const [activeTab, setActiveTab] = React.useState<'path' | 'skills' | 'gallery' | 'roadmap' | 'resources' | 'hybrid'>('path');

  const { data: progressRows = [] } = useQuery({
    queryKey: ['progress', 'modules', 'frontend'],
    queryFn: () => api.get<ModuleProgressRow[]>('/progress/modules?track=frontend'),
  });

  const { data: moduleAssignments = [] } = useQuery({
    queryKey: ['assignments', 'frontend'],
    queryFn: () => api.get<ModuleAssignment[]>('/assignments?track=frontend'),
  });

  const assignmentByModuleKey = new Map(
    moduleAssignments.filter((a) => a.moduleKey).map((a) => [a.moduleKey as string, a])
  );

  const progressByKey = new Map(progressRows.map((r) => [r.moduleKey, r]));

  let previousModuleCompleted = true;
  const modules = MODULE_CATALOG.map((m) => {
    const row = progressByKey.get(m.moduleKey);
    const progress = row?.progress ?? 0;
    const unlocked = previousModuleCompleted || (row?.unlocked ?? false);
    const status = progress >= 100 ? 'completed' : unlocked ? 'active' : 'locked';
    previousModuleCompleted = progress >= 100;
    return { ...m, status, progress, assignment: assignmentByModuleKey.get(m.moduleKey) ?? null };
  });

  const goToMission = (assignment: ModuleAssignment | null) => {
    if (!assignment) return;
    onSelectAssignment(assignment.id);
    onNavigate('assignment_detail');
  };

  const campaignProgress = modules.length
    ? Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)
    : 0;

  const queryClient = useQueryClient();

  const { data: dailyExercise, isLoading: dailyExerciseLoading } = useQuery({
    queryKey: ['daily-exercise'],
    queryFn: async (): Promise<DailyExerciseData | null> => {
      try {
        return await api.get<DailyExerciseData>('/daily-exercise');
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return null;
        throw err;
      }
    },
  });

  const { data: calendarEvents = [] } = useQuery({
    queryKey: ['calendar'],
    queryFn: () => api.get<CalendarEventData[]>('/calendar'),
  });

  const classEvents = React.useMemo(
    () =>
      calendarEvents
        .filter((e) => e.type === 'CLASS')
        .slice()
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
    [calendarEvents]
  );

  const now = Date.now();

  const liveClassEvent = classEvents.find((e) => {
    const start = new Date(e.startsAt).getTime();
    const end = e.endsAt ? new Date(e.endsAt).getTime() : null;
    return end !== null && now >= start && now <= end;
  });

  const upcomingClassEvents = classEvents.filter((e) => new Date(e.startsAt).getTime() > now);
  const nextClassEvent = upcomingClassEvents[0];
  const heroEvent = liveClassEvent ?? nextClassEvent;
  const scheduleEvents = (liveClassEvent ? [liveClassEvent, ...upcomingClassEvents] : upcomingClassEvents).slice(0, 4);

  const [dailyFile, setDailyFile] = React.useState<File | null>(null);

  const completeDailyExercise = useMutation({
    mutationFn: async (file: File | null) => {
      let fileUrl: string | undefined;
      let fileName: string | undefined;
      if (file) {
        const uploaded = await api.upload<{ url: string; fileName: string }>('/uploads', file);
        fileUrl = uploaded.url;
        fileName = uploaded.fileName;
      }
      return api.post<{ xp: number; streak: number }>('/daily-exercise/complete', { fileUrl, fileName });
    },
    onSuccess: () => {
      setDailyFile(null);
      queryClient.invalidateQueries({ queryKey: ['daily-exercise'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-brand-cyan/20 to-transparent p-6 rounded-2xl border border-brand-cyan/30 shadow-[0_0_20px_rgba(0,217,255,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="relative z-10">
          <button 
            onClick={() => onNavigate('classes')}
            className="text-brand-cyan text-sm flex items-center gap-1 hover:underline mb-2"
          >
            &lt; Darslarga qaytish
          </button>
          <div className="inline-block px-2 py-1 bg-brand-cyan/20 text-brand-cyan text-xs font-bold uppercase tracking-wider rounded border border-brand-cyan/50 mb-2">
            Faol Kampaniya
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-2 text-white drop-shadow-md">
            Frontend Veb Mahorati
          </h1>
          <p className="text-gray-300 max-w-xl">
            Frontend arxitekturasiga kirib boring. Immersiv raqamli tajribalar yaratish va joylashuv boss'larini yengish uchun HTML, CSS va JavaScript'ni egallang.
          </p>
        </div>

        <div className="relative z-10 bg-black/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm flex items-center gap-4 min-w-[200px]">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Kampaniya Jarayoni</div>
            <div className="text-2xl font-bold text-brand-cyan font-mono">{campaignProgress}%</div>
          </div>
          <div className="flex-1">
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${campaignProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple shadow-[0_0_10px_rgba(0,217,255,0.8)]"
              ></motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Exercise */}
      {!dailyExerciseLoading && dailyExercise && (
        <div className={`p-6 border flex flex-col md:flex-row items-start md:items-center gap-6 rounded-2xl ${
          dailyExercise.completed ? 'border-green-500/40 bg-green-500/5' : 'border-brand-cyan/30 bg-black/40'
        }`}>
          <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border ${
            dailyExercise.completed ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan'
          }`}>
            {dailyExercise.completed ? <CheckCircle2 size={26} /> : <Zap size={26} />}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Kunlik Mashq</p>
              <span className="flex items-center gap-1 text-[10px] font-bold text-orange-400">
                <Flame size={12} /> {dailyExercise.streak} kunlik seriya
              </span>
            </div>
            <p className="text-sm text-white leading-relaxed">{dailyExercise.prompt}</p>
            <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-500">
              <span className="flex items-center gap-1"><Clock size={12} /> ~{dailyExercise.estMinutes} daqiqa</span>
              <span className="font-mono text-[#FFD700]">+{dailyExercise.xpReward} XP</span>
            </div>

            {!dailyExercise.completed && (
              <label className="mt-3 flex items-center gap-2 w-full max-w-sm bg-black/40 border border-dashed border-white/15 rounded-lg py-2 px-3 text-xs text-gray-400 cursor-pointer hover:border-brand-cyan transition-all">
                <Paperclip size={14} className="text-gray-500 shrink-0" />
                <span className="flex-1 truncate">{dailyFile ? dailyFile.name : 'Faylni biriktirish (ixtiyoriy)'}</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.xlsx,.pptx,.png,.jpg,.jpeg,.zip"
                  onChange={(e) => setDailyFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>
            )}
            {dailyExercise.completed && dailyExercise.fileUrl && (
              <a
                href={dailyExercise.fileUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 flex items-center gap-2 text-xs text-brand-cyan hover:underline w-fit"
              >
                <Paperclip size={12} /> {dailyExercise.fileName ?? 'Yuklangan fayl'}
              </a>
            )}
          </div>

          {dailyExercise.completed ? (
            <div className="shrink-0 text-xs font-bold text-green-400 uppercase tracking-wider">Bugun bajarildi ✓</div>
          ) : (
            <button
              onClick={() => completeDailyExercise.mutate(dailyFile)}
              disabled={completeDailyExercise.isPending}
              className="shrink-0 px-6 py-3 bg-brand-cyan text-black font-black rounded-xl text-xs uppercase tracking-wider hover:bg-brand-cyan/80 disabled:opacity-60 transition-all"
            >
              {completeDailyExercise.isPending ? 'Yuborilmoqda...' : 'Bajardim'}
            </button>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto hide-scrollbar">
        {[
          { id: 'path', label: 'Kampaniya Yo\'li' },
          { id: 'roadmap', label: 'Interaktiv Yo\'l Xaritasi' },
          { id: 'hybrid', label: 'Gibrid Jonli Markaz' },
          { id: 'skills', label: 'Ko\'nikmalar daraxti' },
          { id: 'resources', label: 'Dars Materiallari' },
          { id: 'gallery', label: 'Talabalar Galereyasi' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-brand-cyan text-brand-cyan' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Roadmap Visualization */}
      {activeTab === 'roadmap' && (
        <div className="py-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              { id: 'm1', title: '1-bosqich: Asoslar', milestones: [
                { name: 'HTML Struktura', progress: 100, dep: null },
                { name: 'CSS Selektorlari', progress: 100, dep: 'HTML Struktura' },
                { name: 'Bloklar Modeli', progress: 100, dep: 'CSS Selektorlari' }
              ]},
              { id: 'm2', title: '2-bosqich: Mantiq va Interaktivlik', milestones: [
                { name: 'JS Asoslari', progress: 40, dep: 'Bloklar Modeli' },
                { name: 'DOM bilan ishlash', progress: 10, dep: 'JS Asoslari' },
                { name: 'Hodisa Tinglovchilari', progress: 0, dep: 'DOM bilan ishlash' }
              ]},
              { id: 'm3', title: '3-bosqich: Freymvorklar', milestones: [
                { name: 'React\'ga Kirish', progress: 0, dep: 'JS Asoslari' },
                { name: 'Hooklar va State', progress: 0, dep: 'React\'ga Kirish' },
                { name: 'Ilg\'or API', progress: 0, dep: 'Hooklar va State' }
              ]}
            ].map((phase, i) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 border border-white/10 flex flex-col gap-4"
              >
                <h3 className="font-bold text-lg text-brand-cyan">{phase.title}</h3>
                <div className="space-y-6">
                  {phase.milestones.map((ms, j) => (
                    <div key={j} className="relative">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white font-medium flex items-center gap-2">
                          {ms.progress === 100 ? <Check size={14} className="text-brand-green" /> : <ChevronRight size={14} />}
                          {ms.name}
                        </span>
                        <span className="text-gray-500">{ms.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${ms.progress}%` }}
                          transition={{ duration: 1, delay: i * 0.1 + j * 0.1 }}
                          className={`h-full ${ms.progress === 100 ? 'bg-brand-green' : 'bg-brand-cyan shadow-[0_0_8px_rgba(0,217,255,0.5)]'}`}
                        />
                      </div>
                      {ms.dep && (
                        <div className="text-[10px] text-gray-500 mt-1 italic flex items-center gap-1">
                          <Lock size={10} /> Talab qilinadi: {ms.dep}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-brand-purple/10 border border-brand-purple/30 p-6 rounded-xl flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple border border-brand-purple/50">
              <Zap size={32} />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1 text-lg">Keyingi Muhim Bosqich: JavaScript Asoslarini Egallash</h4>
              <p className="text-gray-400 text-sm">Siz hozir 2-bosqichning 40% qismini bosib o'tdingiz. React Freymvork yo'nalishini ochish uchun qolgan sinovlarni bajaring.</p>
            </div>
            <button
              onClick={() => onNavigate('codelab')}
              className="ml-auto px-6 py-2 bg-brand-purple text-white font-bold rounded-lg hover:bg-brand-purple/80 transition-colors shadow-[0_0_15px_rgba(176,38,255,0.4)]"
            >
              Loyihani Davom Ettirish
            </button>
          </div>
        </div>
      )}

      {/* Interactive Path */}
      {activeTab === 'path' && (
      <div className="relative py-8">
        {/* Connecting Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-800 -translate-x-1/2 rounded-full z-0">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '55%' }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
            className="w-full bg-gradient-to-b from-brand-cyan via-brand-purple to-transparent shadow-[0_0_15px_rgba(0,217,255,0.5)]"
          ></motion.div>
        </div>

        <div className="space-y-12 relative z-10">
          {modules.map((mod, index) => {
            const isEven = index % 2 === 0;
            const isCompleted = mod.status === 'completed';
            const isActive = mod.status === 'active';
            const isLocked = mod.status === 'locked';
            const isBoss = mod.type === 'boss';

            return (
              <div key={mod.id} className={`flex flex-col md:flex-row items-center gap-6 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Node Spacer for Desktop */}
                <div className="hidden md:block md:flex-1"></div>

                {/* Node Icon/Avatar */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center border-4 relative z-10 ${
                    isCompleted ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-[0_0_20px_rgba(0,217,255,0.4)]' :
                    isActive ? 'bg-brand-purple/20 border-brand-purple text-brand-purple shadow-[0_0_20px_rgba(176,38,255,0.6)] animate-pulse' :
                    isBoss ? 'bg-red-500/10 border-red-500/50 text-red-500/50' :
                    'bg-gray-900 border-gray-700 text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check size={24} /> : isLocked ? <Lock size={24} /> : <mod.icon size={28} />}
                </motion.div>

                {/* Node Content Card */}
                <motion.div 
                  initial={{ x: isEven ? 50 : -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.2 }}
                  className={`flex-1 w-full max-w-md glass-panel p-5 relative group ${
                    isActive ? 'border-brand-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.1)]' : 
                    isBoss && !isLocked ? 'border-red-500/50 bg-red-500/5' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      <div className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isBoss ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-300'
                      }`}>
                        {isBoss ? 'Boss jangi' : `${mod.id}-modul`}
                      </div>
                      {mod.isHybrid && (
                        <div className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded border border-brand-cyan/30 flex items-center gap-1 font-bold">
                          <Users size={10} /> GIBRID
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-mono text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/20">
                      +{mod.xp} XP
                    </div>
                  </div>
                  
                  <h3 className={`font-bold text-xl mb-2 ${isBoss ? 'text-red-400' : 'text-white'}`}>
                    {mod.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {mod.desc}
                  </p>

                  {isBoss && mod.reward && (
                    <div className="mb-4 text-xs bg-brand-green/10 text-brand-green border border-brand-green/30 p-2 rounded flex items-center gap-2">
                      <Zap size={14} /> Boss Mukofoti: {mod.reward}
                    </div>
                  )}

                  {isActive && (
                    <div className="space-y-2">
                      <button
                        onClick={() => goToMission(mod.assignment)}
                        disabled={!mod.assignment}
                        className="w-full bg-brand-purple hover:bg-brand-purple/80 text-white font-bold py-2 rounded transition-colors flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(176,38,255,0.3)] disabled:opacity-50"
                      >
                        <PlayCircle size={18} />
                        {mod.assignment?.submission ? 'Missiyani Ko\'rish' : 'Missiyani Boshlash'}
                      </button>
                      <button
                        onClick={() => onNavigate('codelab')}
                        className="w-full text-[11px] text-gray-500 hover:text-brand-cyan transition-colors py-1"
                      >
                        CodeLab'da mashq qilish &rarr;
                      </button>
                    </div>
                  )}

                  {isCompleted && (
                    <button
                      onClick={() => goToMission(mod.assignment)}
                      disabled={!mod.assignment}
                      className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-2 rounded transition-colors flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50"
                    >
                      Topshiriqni Ko'rib chiqish
                    </button>
                  )}

                  {isLocked && (
                    <button
                      onClick={onTriggerSuccess}
                      className="w-full bg-gray-900/50 text-gray-500 font-medium py-2 rounded flex items-center justify-center gap-2 border border-gray-800 hover:border-brand-cyan/30 transition-all"
                    >
                      <Lock size={16} /> Bajarilishni Simulyatsiya qilish
                    </button>
                  )}
                </motion.div>

              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Skill Tree */}
      {activeTab === 'skills' && (
        <div className="py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Texnik Mahorat Daraxti</h2>
            <p className="text-gray-400">Asosiy modullar va loyihalarni bajarib, ilg'or texnikalarni oching.</p>
          </div>
          <SkillTree />
        </div>
      )}

      {/* Student Gallery */}
      {activeTab === 'gallery' && (
        <div className="py-8">
          <h2 className="text-xl font-bold mb-6">Talabalar Galereyasi</h2>
          <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-brand-purple/5 max-w-xl">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Code size={20} className="text-brand-purple" />
              Jamoat Loyihalari Galereyasi
            </h3>
            <p className="text-xs text-gray-500">Bu funksiya hali ishlab chiqilmoqda &mdash; tez orada talabalar o'z loyihalarini shu yerda ulashib, jamoat bilan baham ko'rishlari mumkin bo'ladi.</p>
          </div>
        </div>
      )}

      {/* Hybrid Hub */}
      {activeTab === 'hybrid' && (
        <div className="py-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Session Status */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 border border-brand-cyan/30 bg-brand-cyan/5 relative overflow-hidden"
              >
                {liveClassEvent && (
                  <div className="absolute top-0 right-0 p-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-brand-red animate-pulse text-white text-[10px] font-black rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div> HOZIR JONLI
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 rounded-2xl bg-brand-cyan/20 flex items-center justify-center text-brand-cyan border border-brand-cyan/30 shrink-0">
                    <Monitor size={48} />
                  </div>
                  <div className="space-y-4 flex-1">
                    {heroEvent ? (
                      <>
                        <div>
                          <h2 className="text-2xl font-black text-white italic tracking-tight mb-1 uppercase">{heroEvent.title}</h2>
                          <p className="text-gray-400 text-sm">
                            {liveClassEvent ? 'Hozir davom etmoqda' : 'Keyingi rejalashtirilgan onlayn dars'}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <Calendar size={14} className="text-brand-cyan" /> {formatEventDate(heroEvent.startsAt)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <Clock size={14} className="text-brand-purple" />
                            {formatEventTime(heroEvent.startsAt)}
                            {heroEvent.endsAt ? ` – ${formatEventTime(heroEvent.endsAt)}` : ''}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">Hozircha rejalashtirilgan onlayn dars yo'q</h2>
                        <p className="text-gray-400 text-sm">Yangi gibrid darslar jadvalga qo'shilganda, ular shu yerda ko'rinadi.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              <div className="glass-panel p-6 border border-white/10 bg-black/40 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-orange/20 rounded-lg text-brand-orange">
                    <Clock size={20} />
                  </div>
                  <h3 className="font-bold text-white">Dars Jadvali</h3>
                </div>
                {scheduleEvents.length === 0 ? (
                  <p className="text-xs text-gray-500">Hozircha rejalashtirilgan onlayn dars yo'q.</p>
                ) : (
                  <div className="space-y-3">
                    {scheduleEvents.map((event) => {
                      const isLive = liveClassEvent?.id === event.id;
                      return (
                        <div key={event.id} className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-gray-500 w-10">{formatEventTime(event.startsAt)}</span>
                          <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-brand-cyan animate-pulse' : 'bg-gray-700'}`}></div>
                          <span className={`text-[11px] ${isLive ? 'text-white font-bold' : 'text-gray-400'}`}>{event.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Attendance & Campus Info */}
            <div className="space-y-6">
              <div className="glass-panel p-6 border border-white/10 bg-black/40 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 text-brand-cyan/5 -rotate-12">
                  <QrCode size={120} />
                </div>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                  <MapPin size={16} className="text-brand-cyan" />
                  Jismoniy Ro'yxatdan O'tish
                </h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  <span className="text-white font-bold">Asosiy Tech Markazida</span> shaxsan ishtirok etyapsizmi? Sinf QR kodini skanerlang yoki quyidagi tugmadan foydalaning.
                </p>
                <button className="w-full py-3 bg-brand-cyan text-black font-black rounded-xl hover:bg-brand-cyan/80 transition-all uppercase text-xs shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                  Hozir Ro'yxatdan O'tish
                </button>
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-mono">Joylashuv Holati</span>
                  <span className="text-[10px] text-brand-green font-bold">JOYIDA TASDIQLANDI</span>
                </div>
              </div>

              <div className="glass-panel p-6 border border-white/10 bg-black/40">
                <h3 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Gibrid Jamoa</h3>
                <div className="space-y-4">
                  <div className="flex -space-x-3 overflow-hidden">
                    {[1, 2, 3, 4, 5].map(i => (
                      <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-black" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="" />
                    ))}
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-purple ring-2 ring-black text-[10px] font-bold text-white">
                      +12
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400">Boshqa talabalar hozir ushbu gibrid darsda faol.</p>
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-gray-300 transition-colors">
                    Jonli Chatni Ko'rish
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hybrid FAQ/Info */}
          <div className="bg-brand-purple/10 border border-brand-purple/30 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
             <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">
               <Info size={24} />
             </div>
             <div className="flex-1">
               <h4 className="text-white font-bold">Gibrid Ta'lim Qanday Ishlaydi</h4>
               <p className="text-gray-400 text-sm">Uydan efir orqali qo'shiling yoki jismoniy kampusimizga tashrif buyuring. Barcha progress, XP va materiallar ikkala muhitda ham real vaqtda sinxronlashadi.</p>
             </div>
             <div className="flex gap-4 items-center">
               <span className="text-xs font-bold text-gray-500">Kampus Xaritasi</span>
               <button onClick={() => onNavigate('help')} className="text-xs font-bold text-brand-purple hover:underline">Yordam Markazi</button>
             </div>
          </div>
        </div>
      )}

      {/* Lesson Resources */}
      {activeTab === 'resources' && (
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Dars Prezentatsiyalari va Materiallari</h2>
              <p className="text-gray-400">O'qituvchilaringiz yuklagan maxsus o'quv materiallariga kiring.</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></div>
              <span className="text-xs text-gray-300 font-mono">Bugun Yangi Materiallar Qo'shildi</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Veb Arxitekturaga Kirish',
                type: 'PPTX',
                size: '4.2 MB',
                addedBy: 'Dr. Cyber',
                date: '2024-05-15',
                desc: 'Veb qanday ishlashi haqida to\'liq ma\'lumot: DNS\'dan renderlashgacha.'
              },
              {
                title: 'Ilg\'or CSS Flexbox va Grid',
                type: 'PPTX',
                size: '6.8 MB',
                addedBy: 'Prof. Neon',
                date: '2024-05-18',
                desc: 'Zamonaviy joylashuv texnikalarini real misollar bilan chuqur o\'rganish.'
              },
              {
                title: 'JavaScript Mantiqi va DOM Oqimi',
                type: 'PDF',
                size: '2.1 MB',
                addedBy: 'Dr. Cyber',
                date: '2024-05-20',
                desc: 'Bajarilish konteksti va DOM hodisalari tarqalishining vizual diagrammalari.'
              },
              {
                title: 'React Hooklarini Egallash',
                type: 'PPTX',
                size: '5.5 MB',
                addedBy: 'Prof. Neon',
                date: '2024-05-22',
                desc: 'useState, useEffect va maxsus hooklar bo\'yicha bosqichma-bosqich qo\'llanma.'
              },
            ].map((resource, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel border border-white/10 hover:border-brand-cyan/50 transition-all p-5 flex gap-4 group"
              >
                <div className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center ${
                  resource.type === 'PPTX' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 
                  'bg-red-500/20 text-red-500 border border-red-500/30'
                }`}>
                  <FileText size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white truncate group-hover:text-brand-cyan transition-colors">
                      {resource.title}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                    {resource.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">O'qituvchi</span>
                        <span className="text-xs text-gray-300">{resource.addedBy}</span>
                      </div>
                      <div className="w-px h-6 bg-white/10"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Hajmi</span>
                        <span className="text-xs text-gray-300">{resource.size}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-white/5 hover:bg-brand-cyan/20 text-gray-400 hover:text-brand-cyan rounded-lg border border-white/10 transition-all">
                        <ExternalLink size={16} />
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 bg-brand-cyan/10 hover:bg-brand-cyan text-brand-cyan hover:text-black font-bold text-xs rounded-lg border border-brand-cyan/30 transition-all">
                        <Download size={14} />
                        Yuklab olish
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan border border-brand-cyan/20">
              <BookOpen size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-white font-bold text-lg mb-1">Material topilmadimi?</h4>
              <p className="text-gray-400 text-sm">Agar kerakli dars prezentatsiyasini topa olmasangiz, o'qituvchingiz bilan bog'laning yoki so'nggi yangilanishlar uchun Missiya Jurnalini tekshiring.</p>
            </div>
            <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-colors">
              Material So'rash
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
