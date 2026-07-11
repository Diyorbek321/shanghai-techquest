import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Table,
  Presentation,
  Check,
  Lock,
  ChevronRight,
  Zap,
  Trophy,
  Target,
  Download,
  PlayCircle,
  Users,
  Search,
  Settings as SettingsIcon,
  PieChart,
  Grid3X3,
  Mail,
  Database,
  Sparkles,
  Image,
  FileCheck,
  Award,
  Monitor,
  Folder,
  Globe,
  ShieldCheck,
  Cloud,
  Flame,
  Clock,
  CheckCircle2,
  Paperclip
} from 'lucide-react';
import { ViewType } from '../types';
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

const STAGE_FOUNDATIONS = 'Bosqich 0: Kompyuter Savodxonligi Asoslari';
const STAGE_WORD = "Bosqich 1: Word — Asoslardan Ustalikkacha";
const STAGE_EXCEL = "Bosqich 2: Excel — Asoslardan Tahlilgacha";
const STAGE_PPT = "Bosqich 3: PowerPoint — Taqdimot San'ati";
const STAGE_OUTLOOK_ACCESS = 'Bosqich 4: Outlook va Access';
const STAGE_CAPSTONE = 'Bosqich 5: Yakuniy Loyiha';

const OFFICE_MODULE_CATALOG = [
  {
    id: 1,
    moduleKey: 'os-basics',
    stage: STAGE_FOUNDATIONS,
    title: 'Kompyuter va Operatsion Tizim Asoslari',
    desc: 'Kompyuterni yoqish, ish stoli, oynalar va asosiy klaviatura/sichqoncha ko\'nikmalarini o\'rganing.',
    icon: <Monitor className="text-gray-300" />,
    xp: 100,
    type: 'foundation'
  },
  {
    id: 2,
    moduleKey: 'files-folders',
    stage: STAGE_FOUNDATIONS,
    title: 'Fayllar va Papkalar Bilan Ishlash',
    desc: "Fayl va papkalarni yaratish, nomlash, ko'chirish va arxivlashni mashq qiling.",
    icon: <Folder className="text-yellow-600" />,
    xp: 100,
    type: 'foundation'
  },
  {
    id: 3,
    moduleKey: 'internet-browser-basics',
    stage: STAGE_FOUNDATIONS,
    title: 'Internet va Brauzer Asoslari',
    desc: "Brauzerda xavfsiz va samarali qidirish, ko'p tab bilan ishlashni o'rganing.",
    icon: <Globe className="text-cyan-400" />,
    xp: 100,
    type: 'foundation'
  },
  {
    id: 4,
    moduleKey: 'digital-safety',
    stage: STAGE_FOUNDATIONS,
    title: 'Raqamli Xavfsizlik va Gigiyena',
    desc: "Kuchli parollar, fishingni aniqlash va shaxsiy ma'lumotlaringizni himoya qilishni o'rganing.",
    icon: <ShieldCheck className="text-red-400" />,
    xp: 120,
    type: 'foundation'
  },
  {
    id: 5,
    moduleKey: 'cloud-storage-basics',
    stage: STAGE_FOUNDATIONS,
    title: 'Bulutli Xotira va Fayl Almashish',
    desc: "Google Drive/OneDrive'da fayl saqlash, yuklash va ulashishni mashq qiling.",
    icon: <Cloud className="text-cyan-300" />,
    xp: 100,
    type: 'foundation'
  },
  {
    id: 6,
    moduleKey: 'word-basics',
    stage: STAGE_WORD,
    title: 'Word: Birinchi Hujjat',
    desc: "Word'ni ochish, matn kiritish, saqlash va asosiy formatlashni o'rganing.",
    icon: <FileText className="text-blue-500" />,
    xp: 150,
    type: 'word'
  },
  {
    id: 7,
    moduleKey: 'word-doc-design',
    stage: STAGE_WORD,
    title: 'Word: Professional Hujjat Dizayni',
    desc: 'Uslublar, bo\'limlar va avtomatik jadvallarni egallang.',
    icon: <FileText className="text-blue-500" />,
    xp: 250,
    type: 'word'
  },
  {
    id: 8,
    moduleKey: 'word-long-documents',
    stage: STAGE_WORD,
    title: 'Word: Uzun Hujjatlar va Tarkib Jadvali',
    desc: "Sarlavhalar, havolalar va avtomatik tarkib jadvalini boshqaring.",
    icon: <FileCheck className="text-blue-500" />,
    xp: 350,
    type: 'word'
  },
  {
    id: 9,
    moduleKey: 'word-mail-merge',
    stage: STAGE_WORD,
    title: "Word: Pochta Birlashtirish",
    desc: "Ko'plab hujjatlarni bitta shablondan avtomatik yarating.",
    icon: <Mail className="text-blue-400" />,
    xp: 300,
    type: 'word'
  },
  {
    id: 10,
    moduleKey: 'word-collaboration-review',
    stage: STAGE_WORD,
    title: "Word: Hamkorlikda Ishlash va Tekshirish",
    desc: "O'zgarishlarni kuzatish, sharhlar va hamkorlikda tahrirlashni o'zlashtiring.",
    icon: <Users className="text-blue-400" />,
    xp: 300,
    type: 'word'
  },
  {
    id: 11,
    moduleKey: 'excel-basics',
    stage: STAGE_EXCEL,
    title: 'Excel: Birinchi Jadval',
    desc: "Katakchalar, formulalar (SUM, AVERAGE) va oddiy formatlashdan boshlang.",
    icon: <Table className="text-green-500" />,
    xp: 150,
    type: 'excel'
  },
  {
    id: 12,
    moduleKey: 'excel-data-mastery',
    stage: STAGE_EXCEL,
    title: 'Excel: Ma\'lumotlar va Mantiqni Egallash',
    desc: 'Formulalar, VLOOKUP va mantiqiy funksiyalar.',
    icon: <Table className="text-green-500" />,
    xp: 400,
    type: 'excel'
  },
  {
    id: 13,
    moduleKey: 'excel-formulas-deep-dive',
    stage: STAGE_EXCEL,
    title: 'Excel: Chuqurlashtirilgan Formulalar',
    desc: "INDEX/MATCH, massiv formulalar va shartli mantiqni egallang.",
    icon: <Table className="text-green-500" />,
    xp: 450,
    type: 'excel'
  },
  {
    id: 14,
    moduleKey: 'excel-pivot-charts',
    stage: STAGE_EXCEL,
    title: 'Excel: Pivot Jadvallar va Diagrammalar',
    desc: "Katta ma'lumotlar to'plamlarini vizual hisobotlarga aylantiring.",
    icon: <Grid3X3 className="text-green-400" />,
    xp: 500,
    type: 'excel'
  },
  {
    id: 15,
    moduleKey: 'excel-advanced-analytics',
    stage: STAGE_EXCEL,
    title: 'Excel: Ilg\'or Ma\'lumotlar Tahlili',
    desc: 'Pivot jadvallar, Power Query va Boshqaruv Panellari.',
    icon: <PieChart className="text-green-400" />,
    xp: 600,
    type: 'excel_boss'
  },
  {
    id: 16,
    moduleKey: 'excel-power-query-dashboards',
    stage: STAGE_EXCEL,
    title: "Excel: Power Query va Boshqaruv Panellari",
    desc: "Turli manbalardagi ma'lumotlarni birlashtirib, jonli panel yarating.",
    icon: <PieChart className="text-green-400" />,
    xp: 650,
    type: 'excel_boss'
  },
  {
    id: 17,
    moduleKey: 'excel-macros-automation',
    stage: STAGE_EXCEL,
    title: 'Excel: Makrolar va Avtomatlashtirish',
    desc: "VBA makrolar yordamida takroriy vazifalarni avtomatlashtiring.",
    icon: <SettingsIcon className="text-green-500" />,
    xp: 550,
    type: 'excel'
  },
  {
    id: 18,
    moduleKey: 'ppt-basics',
    stage: STAGE_PPT,
    title: 'PowerPoint: Birinchi Slayd',
    desc: "Birinchi slaydlaringizni yarating: matn, rasm va oddiy dizayn asoslari.",
    icon: <Presentation className="text-orange-500" />,
    xp: 150,
    type: 'ppt'
  },
  {
    id: 19,
    moduleKey: 'ppt-narrative-design',
    stage: STAGE_PPT,
    title: 'PowerPoint: Naratsiya va Dizayn',
    desc: 'Yuqori ta\'sirli rahbariyat taqdimotlarini yarating.',
    icon: <Presentation className="text-orange-500" />,
    xp: 300,
    type: 'ppt'
  },
  {
    id: 20,
    moduleKey: 'ppt-animations-transitions',
    stage: STAGE_PPT,
    title: "PowerPoint: Animatsiya va O'tishlar",
    desc: "Professional animatsiyalar bilan taqdimotni jonlantiring.",
    icon: <Sparkles className="text-orange-400" />,
    xp: 350,
    type: 'ppt'
  },
  {
    id: 21,
    moduleKey: 'ppt-infographics',
    stage: STAGE_PPT,
    title: 'PowerPoint: Infografika va Vizual Hikoyalar',
    desc: "Murakkab ma'lumotlarni oddiy va ta'sirli vizuallarga aylantiring.",
    icon: <Image className="text-orange-500" />,
    xp: 400,
    type: 'ppt'
  },
  {
    id: 22,
    moduleKey: 'outlook-email-calendar',
    stage: STAGE_OUTLOOK_ACCESS,
    title: "Outlook: Elektron Pochta va Kalendar Boshqaruvi",
    desc: "Xat qutisi, uchrashuvlar va vazifalarni samarali boshqaring.",
    icon: <Mail className="text-cyan-500" />,
    xp: 300,
    type: 'outlook'
  },
  {
    id: 23,
    moduleKey: 'access-database-basics',
    stage: STAGE_OUTLOOK_ACCESS,
    title: "Access: Ma'lumotlar Bazasi Asoslari",
    desc: "Jadvallar, so'rovlar va formalar yordamida ma'lumotlarni tashkil eting.",
    icon: <Database className="text-purple-500" />,
    xp: 450,
    type: 'access'
  },
  {
    id: 24,
    moduleKey: 'office-capstone-certificate',
    stage: STAGE_CAPSTONE,
    title: 'Yakuniy Sertifikat Loyihasi',
    desc: "Barcha Ofis dasturlarini birlashtirgan yakuniy ish topshirig'ini bajaring.",
    icon: <Award className="text-yellow-500" />,
    xp: 800,
    type: 'capstone'
  }
];

const OFFICE_PROJECTS = [
  {
    id: 'annual-report',
    title: 'Yillik Korporativ Hisobot',
    desc: "Word'da moliyaviy hisobotni loyihalang va Excel'dagi jonli diagrammalarni unga bog'lang.",
    icon: <FileText className="text-blue-500" />,
    requiredModules: ['word-doc-design', 'excel-data-mastery'],
  },
  {
    id: 'sales-dashboard',
    title: 'Savdo Boshqaruv Paneli',
    desc: "Power Query yordamida bir nechta manbadan ma'lumot yig'ib, pivot jadval va diagrammalar bilan boshqaruv panelini yarating.",
    icon: <PieChart className="text-green-400" />,
    requiredModules: ['excel-pivot-charts', 'excel-power-query-dashboards'],
  },
  {
    id: 'investor-pitch',
    title: 'Investorlar uchun Taqdimot',
    desc: "Infografika va animatsiyalar bilan yuqori ta'sirli PowerPoint taqdimotini tayyorlang.",
    icon: <Presentation className="text-orange-500" />,
    requiredModules: ['ppt-narrative-design', 'ppt-infographics'],
  },
  {
    id: 'capstone-certificate',
    title: 'Yakuniy Sertifikat Loyihasi',
    desc: "Barcha Ofis dasturlarini birlashtirgan yakuniy ishni topshiring va sertifikat oling.",
    icon: <Award className="text-yellow-500" />,
    requiredModules: ['office-capstone-certificate'],
  },
];

export function OfficeCourse({ onNavigate }: { onNavigate: (view: ViewType) => void }) {
  const [activeTab, setActiveTab] = useState<'modules' | 'skills' | 'projects'>('modules');

  const { data: progressRows = [] } = useQuery({
    queryKey: ['progress', 'modules', 'office'],
    queryFn: () => api.get<ModuleProgressRow[]>('/progress/modules?track=office'),
  });

  const progressByKey = new Map(progressRows.map((r) => [r.moduleKey, r]));

  const officeModules = OFFICE_MODULE_CATALOG.map((m) => {
    const row = progressByKey.get(m.moduleKey);
    const progress = row?.progress ?? 0;
    const unlocked = row?.unlocked ?? false;
    const status = progress >= 100 ? 'completed' : unlocked ? 'active' : 'locked';
    return { ...m, status, progress };
  });

  const completionPct = officeModules.length
    ? Math.round(officeModules.reduce((sum, m) => sum + m.progress, 0) / officeModules.length)
    : 0;

  const modulesByStage = officeModules.reduce<{ stage: string; modules: typeof officeModules }[]>((groups, mod) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.stage === mod.stage) {
      lastGroup.modules.push(mod);
    } else {
      groups.push({ stage: mod.stage, modules: [mod] });
    }
    return groups;
  }, []);

  const isModuleComplete = (moduleKey: string) => (progressByKey.get(moduleKey)?.progress ?? 0) >= 100;

  const officeProjects = OFFICE_PROJECTS.map((project) => {
    const missingModules = project.requiredModules
      .filter((key) => !isModuleComplete(key))
      .map((key) => OFFICE_MODULE_CATALOG.find((m) => m.moduleKey === key)?.title ?? key);
    return { ...project, unlocked: missingModules.length === 0, missingModules };
  });

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

  const [dailyFile, setDailyFile] = useState<File | null>(null);

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
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-8 border-0 relative overflow-hidden bg-gradient-to-br from-blue-900/20 to-green-900/10 rounded-3xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Grid3X3 size={160} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-brand-cyan shadow-2xl">
              <Presentation size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Ofis Dasturlari</h1>
              <p className="text-gray-400 max-w-md text-sm">Zamonaviy ish joyining asosiy vositalarini egallang. Boshlang'ich darajadan Microsoft 365 to'plamining mohir foydalanuvchisiga aylaning.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center p-4 bg-black/40 rounded-2xl border border-white/10 min-w-[100px]">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Daraja</p>
              <p className="text-xl font-black text-brand-cyan uppercase">Analitik</p>
            </div>
            <div className="text-center p-4 bg-black/40 rounded-2xl border border-white/10 min-w-[100px]">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Bajarildi</p>
              <p className="text-xl font-black text-brand-purple uppercase">{completionPct}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Exercise */}
      {!dailyExerciseLoading && dailyExercise && (
        <div className={`glass-panel p-6 border flex flex-col md:flex-row items-start md:items-center gap-6 rounded-2xl ${
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
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
        {[
          { id: 'modules', label: 'O\'quv Dasturi', icon: Target },
          { id: 'skills', label: 'Ko\'nikmalar daraxti', icon: Zap },
          { id: 'projects', label: 'Yakuniy Loyihalar', icon: Trophy },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'modules' && (
        <div className="space-y-10">
          {modulesByStage.map((group) => (
            <div key={group.stage} className="space-y-4">
              <h2 className="text-sm font-black text-white uppercase tracking-widest border-l-4 border-blue-500 pl-3">
                {group.stage}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.modules.map((mod, i) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`glass-panel p-6 border transition-all group ${
                      mod.status === 'locked' ? 'border-white/5 opacity-50 bg-black/20' :
                      mod.status === 'active' ? 'border-blue-500/50 bg-blue-500/5' :
                      'border-green-500/50 bg-green-500/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-white/5 ${mod.status === 'locked' ? 'text-gray-600' : ''}`}>
                          {React.cloneElement(mod.icon as React.ReactElement<any>, { size: 28 })}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Daraja {mod.id}</span>
                            {mod.status === 'completed' && <Check size={12} className="text-green-500" />}
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{mod.title}</h3>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/20">
                        +{mod.xp} XP
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-8 leading-relaxed">{mod.desc}</p>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(j => (
                          <img key={j} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mod.id + j}`} className="w-6 h-6 rounded-full border-2 border-black" alt="" />
                        ))}
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[8px] text-gray-500 border-2 border-black font-bold">
                          +42
                        </div>
                      </div>

                      {mod.status === 'locked' ? (
                        <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase">
                          <Lock size={14} /> Oldingi Modul Talab Etiladi
                        </div>
                      ) : (
                        <button className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${
                          mod.status === 'completed' ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-blue-600 text-white shadow-xl shadow-blue-900/20'
                        }`}>
                          {mod.status === 'completed' ? 'Qayta ko\'rish' : 'Missiyani Davom Ettirish'}
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-8">
          <div className="glass-panel p-8 border border-white/10 bg-black/40">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                  <Zap size={24} className="text-blue-500" /> Ofis Mahorat Daraxti
                </h3>
                <p className="text-gray-500 text-xs mt-1">Modullarni bosib o'tgan sari texnik mahoratlarni oching.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Word</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Excel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">PPT</span>
                </div>
              </div>
            </div>

            <div className="relative min-h-[500px] flex justify-center py-12">
              {/* Central Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center z-10">
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-500 uppercase">Umumiy Kuch</p>
                  <p className="text-2xl font-black text-white italic">LV.12</p>
                </div>
              </div>

              {/* Connecting Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 800 500">
                <line x1="400" y1="250" x2="200" y2="100" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="400" y1="250" x2="600" y2="100" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="400" y1="250" x2="400" y2="400" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="400" cy="250" r="150" fill="none" stroke="white" strokeWidth="1" strokeDasharray="8 8" />
              </svg>

              {/* Skill Nodes */}
              <div className="relative w-full h-full max-w-4xl">
                <SkillNode
                  title="Pivot Mantiqi"
                  level={4}
                  color="green"
                  pos="top-[10%] left-[20%]"
                  icon={<Table size={16} />}
                  desc="Dinamik ma'lumotlarni umumlashtirish va guruhlash."
                />
                <SkillNode
                  title="Formula Ustasi"
                  level={7}
                  color="green"
                  pos="top-[40%] left-[5%]"
                  icon={<Zap size={16} />}
                  desc="Murakkab ichma-ich funksiyalar va mantiq."
                />
                <SkillNode
                  title="Makro Bot"
                  level={1}
                  color="green"
                  pos="bottom-[10%] left-[20%]"
                  locked
                  icon={<Lock size={16} />}
                  desc="VBA va asosiy avtomatlashtirish skriptlari."
                />

                <SkillNode
                  title="Uslub Ustasi"
                  level={5}
                  color="blue"
                  pos="top-[10%] right-[20%]"
                  icon={<FileText size={16} />}
                  desc="Umumiy hujjat uslublari va mavzulari."
                />
                <SkillNode
                  title="Ko'rib Chiqish Oqimi"
                  level={3}
                  color="blue"
                  pos="top-[40%] right-[5%]"
                  icon={<Users size={16} />}
                  desc="O'zgarishlarni kuzatish va birgalikda tahrirlash."
                />
                <SkillNode
                  title="Pochta Birlashtirish"
                  level={0}
                  color="blue"
                  pos="bottom-[10%] right-[20%]"
                  locked
                  icon={<Lock size={16} />}
                  desc="Ommaviy hujjat yaratish."
                />

                <SkillNode
                  title="Harakat San'ati"
                  level={2}
                  color="orange"
                  pos="bottom-[5%] left-[50%] -translate-x-1/2"
                  icon={<PlayCircle size={16} />}
                  desc="Morf o'tishlari va ilg'or animatsiyalar."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border border-white/10 bg-blue-600/5">
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-tighter">Joriy Mashg'ulot: <span className="text-blue-400 italic">VLOOKUP'ni Egallash</span></h4>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>
              <p className="text-[10px] text-gray-500 font-mono text-right uppercase">65% bajarildi &bull; Darajani oshirishga 2.4k XP qoldi</p>
            </div>
            <div className="glass-panel p-6 border border-white/10 bg-green-600/5">
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-tighter">Keyingi Bosqich: <span className="text-green-400 italic">Ma'lumotlar Arxitektori Darajasi</span></h4>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-500">
                      <Trophy size={14} />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 italic">"Professional sertifikatgacha sizga atigi 2 ta boss modul qoldi."</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officeProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-panel p-6 border transition-all group ${
                project.unlocked ? 'border-brand-purple/50 bg-brand-purple/5' : 'border-white/5 opacity-60 bg-black/20'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${project.unlocked ? '' : 'text-gray-600'}`}>
                    {React.cloneElement(project.icon as React.ReactElement<any>, { size: 28 })}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-purple transition-colors">{project.title}</h3>
                </div>
                <Trophy size={20} className={project.unlocked ? 'text-[#FFD700]' : 'text-gray-700'} />
              </div>

              <p className="text-sm text-gray-400 mb-8 leading-relaxed">{project.desc}</p>

              <div className="pt-6 border-t border-white/5">
                {project.unlocked ? (
                  <button className="px-6 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 bg-brand-purple text-white shadow-xl shadow-brand-purple/20">
                    Loyihani Boshlash <ChevronRight size={14} />
                  </button>
                ) : (
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center gap-2 font-bold uppercase text-gray-600 mb-2">
                      <Lock size={14} /> Talab qilinadigan modullar
                    </div>
                    <ul className="space-y-1 list-disc list-inside">
                      {project.missingModules.map((title) => (
                        <li key={title}>{title}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Featured Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border border-white/10 bg-blue-600/5 flex flex-col justify-between group cursor-pointer hover:border-blue-500/50 transition-all">
          <div className="flex items-center gap-3 text-blue-400 mb-4">
            <Download size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Shablonlar</span>
          </div>
          <h4 className="text-white font-bold mb-2">Korporativ Hisobot To'plami</h4>
          <p className="text-xs text-gray-500">Biznes uchun 24 ta professional Word va Excel shablonlari.</p>
        </div>
        <div className="glass-panel p-6 border border-white/10 bg-green-600/5 flex flex-col justify-between group cursor-pointer hover:border-green-500/50 transition-all">
          <div className="flex items-center gap-3 text-green-400 mb-4">
            <PlayCircle size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Darsliklar</span>
          </div>
          <h4 className="text-white font-bold mb-2">Pivot Jadval Siri</h4>
          <p className="text-xs text-gray-500">Video: 10 daqiqada dinamik ma'lumotlar xulosasini egallash.</p>
        </div>
        <div className="glass-panel p-6 border border-white/10 bg-orange-600/5 flex flex-col justify-between group cursor-pointer hover:border-orange-500/50 transition-all">
          <div className="flex items-center gap-3 text-orange-400 mb-4">
            <Users size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Jamoa</span>
          </div>
          <h4 className="text-white font-bold mb-2">Formatlash Gildiyasi</h4>
          <p className="text-xs text-gray-500">400+ talaba bilan birga eng yaxshi hujjat dizaynlaringizni ulashing.</p>
        </div>
      </div>
    </div>
  );
}

function SkillNode({ title, level, color, pos, icon, desc, locked }: any) {
  const colors: any = {
    blue: 'border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    green: 'border-green-500/50 bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]',
    orange: 'border-orange-500/50 bg-orange-500/10 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
  };

  return (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`absolute ${pos} group z-20`}
    >
      <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${
        locked ? 'border-white/5 bg-white/5 text-gray-600' : colors[color] + ' hover:scale-110'
      }`}>
        {icon}
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 p-3 glass-panel border border-white/10 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
        <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-tighter">{title}</h4>
        <p className="text-[10px] text-gray-500 leading-tight mb-2">{desc}</p>
        {!locked && (
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-current opacity-40" style={{ width: `${level * 10}%` }} />
          </div>
        )}
        {locked && (
          <p className="text-[8px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
            <Lock size={8} /> YOPIQ
          </p>
        )}
      </div>
    </motion.div>
  );
}

function SkillCard({ title, level, color }: any) {
  const colors: any = {
    blue: 'from-blue-500 to-blue-700 shadow-blue-900/40',
    green: 'from-green-500 to-green-700 shadow-green-900/40',
    orange: 'from-orange-500 to-orange-700 shadow-orange-900/40'
  };

  return (
    <div className="space-y-3">
      <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${colors[color]} shadow-xl flex items-center justify-center text-3xl font-black text-white italic`}>
        {level}
      </div>
      <div>
        <p className="text-[10px] font-bold text-white uppercase tracking-tight">{title}</p>
        <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
          <div className="h-full bg-white/40" style={{ width: `${level * 20}%` }} />
        </div>
      </div>
    </div>
  );
}
