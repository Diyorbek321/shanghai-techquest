import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Loader2,
  Lock,
  Server,
  Target,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ViewType } from '../types';
import { api } from '../lib/api';
import { LessonQuiz } from '../components/LessonQuiz';

/** Mirrors LessonMastery from src/server/routes/lessons.ts. */
interface LessonMastery {
  problemsPassed: number;
  problemsRequired: number;
  quizCorrect: number;
  quizTotal: number;
  mastered: boolean;
}

type UnlockedBy = 'first' | 'mastery' | 'deadline' | null;

interface LessonSummary {
  key: string;
  order: number;
  month: number;
  week: number;
  title: string;
  section: string;
  summary: string;
  kind: 'lesson' | 'project';
  xpReward: number;
  hasSlides: boolean;
  unlocked: boolean;
  unlockedBy: UnlockedBy;
  behind: boolean;
  mastery: LessonMastery;
  assignmentId: string | null;
  dueDate: string | null;
  submissionStatus: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'LATE' | null;
}

/** Quiz mastery threshold on the server (QUIZ_MASTERY_RATIO in lessons.ts). */
const QUIZ_MASTERY_PERCENT = 60;

/**
 * What the student still has to do before this lesson opens. Returns null when
 * the lesson has no authored practice yet (lessons 13..96) — there the gate
 * falls back to "hand in the previous homework", which the deadline line
 * already communicates.
 */
function lockRequirements(mastery: LessonMastery): string | null {
  if (mastery.problemsRequired === 0) return null;

  const problemsLeft = Math.max(0, mastery.problemsRequired - mastery.problemsPassed);
  const parts: string[] = [];
  if (problemsLeft > 0) {
    parts.push(`${problemsLeft} ta masala`);
  }
  if (mastery.quizTotal > 0) {
    const needed = Math.ceil((mastery.quizTotal * QUIZ_MASTERY_PERCENT) / 100);
    if (mastery.quizCorrect < needed) {
      parts.push(`testda ${QUIZ_MASTERY_PERCENT}% (${mastery.quizCorrect}/${mastery.quizTotal})`);
    }
  }
  if (parts.length === 0) return null;
  return `Ochilishi uchun: ${parts.join(' va ')}`;
}

interface MonthGroup {
  month: number;
  title: string;
  completed: number;
  total: number;
  lessons: LessonSummary[];
}

interface LessonDetailData extends LessonSummary {
  objectives: string[];
  homeworkMain: string;
  homeworkReview: string[];
  homeworkNote: string;
  make: { easy: string; medium: string; hard: string };
  nextTopic: string | null;
  nextPrompt: string | null;
  problems: { id: string; key: string; title: string; difficulty: string; points: number; tags: string[] }[];
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' });
}

function isDone(status: LessonSummary['submissionStatus']): boolean {
  return status === 'SUBMITTED' || status === 'GRADED';
}

function LessonStatusIcon({ lesson }: { lesson: LessonSummary }) {
  if (isDone(lesson.submissionStatus)) {
    return <Check size={16} className="text-emerald-400" />;
  }
  if (!lesson.unlocked) {
    return <Lock size={16} className="text-gray-600" />;
  }
  if (lesson.kind === 'project') {
    return <Trophy size={16} className="text-[#FFD700]" />;
  }
  return <ChevronRight size={16} className="text-emerald-400" />;
}

export function BackendCourse({
  onNavigate,
  onSelectAssignment,
}: {
  onNavigate: (view: ViewType) => void;
  onSelectAssignment: (id: string) => void;
}) {
  const [openMonth, setOpenMonth] = useState<number | null>(null);
  const [openLessonKey, setOpenLessonKey] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['lessons', 'backend'],
    queryFn: () => api.get<{ months: MonthGroup[] }>('/lessons?track=backend'),
  });

  const months = data?.months ?? [];

  // A locked lesson is gated by the PREVIOUS lesson's mastery, so the row needs
  // its predecessor — which may live in the previous month group.
  const previousByKey = useMemo(() => {
    const ordered = months.flatMap((m) => m.lessons).sort((a, b) => a.order - b.order);
    return new Map(ordered.slice(1).map((lesson, i) => [lesson.key, ordered[i]] as const));
  }, [months]);

  const totals = useMemo(() => {
    const all = months.flatMap((m) => m.lessons);
    return {
      total: all.length,
      done: all.filter((l) => isDone(l.submissionStatus)).length,
      xp: all.filter((l) => l.submissionStatus === 'GRADED').reduce((sum, l) => sum + l.xpReward, 0),
    };
  }, [months]);

  // Open the month the student is currently working through.
  const activeMonth = useMemo(() => {
    const current = months.find((m) => m.lessons.some((l) => l.unlocked && !isDone(l.submissionStatus)));
    return current?.month ?? months[0]?.month ?? null;
  }, [months]);

  const expandedMonth = openMonth ?? activeMonth;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="animate-spin mr-2" size={20} /> Darslar yuklanmoqda...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-brand-red/10 border border-brand-red/30 rounded-xl text-brand-red text-sm">
        Darslarni yuklab bo'lmadi: {error instanceof Error ? error.message : 'Nomaʼlum xatolik'}
      </div>
    );
  }

  if (months.length === 0) {
    return (
      <div className="p-6 bg-black/30 border border-brand-border rounded-xl text-gray-400 text-sm">
        Bu yo'nalish uchun darslar hali kiritilmagan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Server size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Python Backend Dasturlash</span>
            </div>
            <h1 className="text-2xl font-bold">8 oylik kurs · {totals.total} ta dars</h1>
            <p className="text-sm text-gray-400 mt-1">
              Haftasiga 3 dars. Har darsdan keyin uy vazifasi — keyingi darsgacha topshiriladi.
            </p>
          </div>
          <div className="flex gap-6">
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {totals.done}
                <span className="text-sm text-gray-500">/{totals.total}</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Topshirilgan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#FFD700]">{totals.xp}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Olingan XP</div>
            </div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${totals.total ? (totals.done / totals.total) * 100 : 0}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </header>

      <div className="space-y-3">
        {months.map((month) => {
          const isOpen = expandedMonth === month.month;
          const locked = month.lessons.every((l) => !l.unlocked);
          return (
            <div key={month.month} className="border border-brand-border rounded-xl overflow-hidden bg-black/20">
              <button
                type="button"
                onClick={() => setOpenMonth(isOpen ? -1 : month.month)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
              >
                {isOpen ? (
                  <ChevronDown size={18} className="text-emerald-400 shrink-0" />
                ) : (
                  <ChevronRight size={18} className="text-gray-500 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold uppercase tracking-wider text-gray-200">
                    {month.month}-OY · {month.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {month.lessons[0]?.title} → {month.lessons[month.lessons.length - 1]?.title}
                  </div>
                </div>
                {locked ? (
                  <Lock size={16} className="text-gray-600 shrink-0" />
                ) : (
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${
                      month.completed === month.total
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {month.completed}/{month.total}
                  </span>
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-brand-border/60"
                  >
                    {month.lessons.map((lesson) => {
                      const previous = previousByKey.get(lesson.key);
                      const requirement = !lesson.unlocked
                        ? (previous ? lockRequirements(previous.mastery) : null) ??
                          "Ochilishi uchun: oldingi darsning uy vazifasini topshiring"
                        : null;
                      return (
                        <li key={lesson.key}>
                          <button
                            type="button"
                            disabled={!lesson.unlocked}
                            onClick={() => setOpenLessonKey(lesson.key)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-brand-border/30 last:border-b-0 transition-colors ${
                              lesson.unlocked ? 'hover:bg-white/5' : 'opacity-60 cursor-not-allowed'
                            }`}
                          >
                            <LessonStatusIcon lesson={lesson} />
                            <span className="text-xs text-gray-600 w-14 shrink-0">Dars {lesson.order}</span>
                            <span className="flex-1 min-w-0 text-sm">
                              <span className="flex items-center gap-2 min-w-0">
                                <span className="truncate">{lesson.title}</span>
                                {lesson.kind === 'project' && (
                                  <span className="text-[10px] font-bold text-[#FFD700] uppercase shrink-0">
                                    Loyiha
                                  </span>
                                )}
                                {lesson.unlocked && lesson.behind && (
                                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-orange shrink-0">
                                    <Clock size={10} /> Kechikkan
                                  </span>
                                )}
                              </span>
                              {requirement && (
                                <span className="block text-[11px] text-gray-500 mt-0.5 truncate">
                                  {requirement}
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-gray-500 shrink-0 hidden sm:inline">
                              {formatDate(lesson.dueDate)}
                            </span>
                            <span className="text-xs font-bold text-emerald-400 shrink-0">+{lesson.xpReward}</span>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {openLessonKey && (
          <LessonDetailPanel
            lessonKey={openLessonKey}
            onClose={() => setOpenLessonKey(null)}
            onOpenAssignment={(assignmentId) => {
              onSelectAssignment(assignmentId);
              onNavigate('assignment_detail');
            }}
            onOpenProblems={() => onNavigate('problems')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LessonDetailPanel({
  lessonKey,
  onClose,
  onOpenAssignment,
  onOpenProblems,
}: {
  lessonKey: string;
  onClose: () => void;
  onOpenAssignment: (assignmentId: string) => void;
  onOpenProblems: () => void;
}) {
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonKey],
    queryFn: () => api.get<LessonDetailData>(`/lessons/${lessonKey}`),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-xl h-full overflow-y-auto bg-brand-bg border-l border-brand-border p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          {isLoading || !lesson ? (
            <div className="text-gray-400 text-sm flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} /> Yuklanmoqda...
            </div>
          ) : (
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                {lesson.month}-oy · {lesson.week}-hafta · Dars {lesson.order}/96
              </div>
              <h2 className="text-xl font-bold mt-1">{lesson.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{lesson.summary}</p>
            </div>
          )}
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white shrink-0">
            <X size={20} />
          </button>
        </div>

        {lesson && (
          <>
            <div className="flex flex-wrap gap-2">
              {lesson.hasSlides && (
                <a
                  href={`/api/lessons/${lesson.key}/slides`}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
                >
                  <Download size={16} /> Taqdimotni yuklab olish
                </a>
              )}
              {lesson.assignmentId && (
                <button
                  type="button"
                  onClick={() => onOpenAssignment(lesson.assignmentId!)}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-brand-orange/15 text-brand-orange border border-brand-orange/30 hover:bg-brand-orange/25 transition-colors"
                >
                  <Target size={16} /> Uy vazifasini topshirish
                </button>
              )}
            </div>

            {lesson.dueDate && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock size={14} /> Muddat: {formatDate(lesson.dueDate)}
                <span className="text-emerald-400 font-bold ml-auto">+{lesson.xpReward} XP</span>
              </div>
            )}

            <Section icon={<Award size={16} className="text-[#FFD700]" />} title="Xulosa">
              <ul className="space-y-1.5">
                {lesson.objectives.map((objective, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-gray-600 font-mono text-xs pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={<Target size={16} className="text-brand-orange" />} title="Uy vazifasi">
              <div className="rounded-lg bg-brand-orange/10 border border-brand-orange/20 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-orange mb-1">
                  Asosiy topshiriq · 60%
                </div>
                <p className="text-sm">{lesson.homeworkMain}</p>
              </div>
              <div className="rounded-lg bg-white/5 border border-brand-border p-3 mt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Takrorlash · 40%
                </div>
                <ul className="space-y-1">
                  {lesson.homeworkReview.map((item, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-gray-600">▢</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {lesson.homeworkNote && <p className="text-xs text-gray-500 mt-2">{lesson.homeworkNote}</p>}
            </Section>

            <Section icon={<Zap size={16} className="text-emerald-400" />} title="Mustaqil mashq (ixtiyoriy)">
              {(
                [
                  ['Oson', lesson.make.easy],
                  ["O'rta", lesson.make.medium],
                  ['Qiyin', lesson.make.hard],
                ] as const
              ).map(([label, text]) => (
                <div key={label} className="flex gap-3 text-sm py-1.5 border-b border-brand-border/30 last:border-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 w-12 shrink-0 pt-1">
                    {label}
                  </span>
                  <span className="text-gray-300">{text}</span>
                </div>
              ))}
            </Section>

            {lesson.problems.length > 0 && (
              <Section icon={<BrainCircuit size={16} className="text-brand-purple" />} title="Bonus masalalar">
                <ul className="space-y-1.5">
                  {lesson.problems.map((problem) => (
                    <li key={problem.id} className="flex items-center gap-2 text-sm">
                      <span className="text-[10px] font-bold uppercase text-gray-500 w-14 shrink-0">
                        {problem.difficulty}
                      </span>
                      <span className="flex-1 truncate text-gray-300">{problem.title}</span>
                      <span className="text-xs text-brand-purple font-bold">+{problem.points}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={onOpenProblems}
                  className="mt-2 text-xs text-brand-purple hover:underline"
                >
                  Masalalar bo'limida yechish →
                </button>
              </Section>
            )}

            <Section icon={<FileText size={16} className="text-brand-cyan" />} title="Tekshiruv testi">
              <LessonQuiz lessonKey={lesson.key} />
            </Section>

            <MasteryCard mastery={lesson.mastery} behind={lesson.behind} />

            {lesson.nextTopic && (
              <div className="rounded-lg border border-brand-border p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Keyingi dars</div>
                <div className="text-sm font-bold mt-0.5">{lesson.nextTopic}</div>
                {lesson.nextPrompt && <p className="text-xs text-gray-400 mt-1">{lesson.nextPrompt}</p>}
              </div>
            )}
          </>
        )}
      </motion.aside>
    </motion.div>
  );
}

/**
 * Progress toward unlocking the NEXT lesson. Hidden for lessons that have no
 * authored practice yet, where the gate is still the old "hand in the homework"
 * rule and a 0/0 progress bar would only confuse.
 */
function MasteryCard({ mastery, behind }: { mastery: LessonMastery; behind: boolean }) {
  if (mastery.problemsRequired === 0) return null;

  const quizNeeded = Math.ceil((mastery.quizTotal * QUIZ_MASTERY_PERCENT) / 100);
  const quizOk = mastery.quizTotal === 0 || mastery.quizCorrect >= quizNeeded;

  return (
    <section
      className={`rounded-lg border p-3 ${
        mastery.mastered ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-brand-border bg-black/20'
      }`}
    >
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
        {mastery.mastered ? (
          <Check size={14} className="text-emerald-400" />
        ) : (
          <Lock size={14} className="text-gray-500" />
        )}
        Keyingi darsni ochish
      </h3>

      <ul className="mt-2 space-y-1.5">
        <MasteryRow
          done={mastery.problemsPassed >= mastery.problemsRequired}
          label="Majburiy masalalar"
          value={`${Math.min(mastery.problemsPassed, mastery.problemsRequired)}/${mastery.problemsRequired}`}
        />
        {mastery.quizTotal > 0 && (
          <MasteryRow
            done={quizOk}
            label={`Test (kamida ${QUIZ_MASTERY_PERCENT}%)`}
            value={`${mastery.quizCorrect}/${mastery.quizTotal}`}
          />
        )}
      </ul>

      {behind && (
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-brand-orange">
          <Clock size={12} /> Muddat o'tgani uchun ochilgan — kechikkan holatda o'qiyapsiz.
        </p>
      )}
    </section>
  );
}

function MasteryRow({ done, label, value }: { done: boolean; label: string; value: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {done ? (
        <Check size={14} className="text-emerald-400 shrink-0" />
      ) : (
        <span className="w-3.5 text-center text-gray-600">▢</span>
      )}
      <span className={done ? 'text-emerald-300' : 'text-gray-300'}>{label}</span>
      <span className="ml-auto font-mono text-xs text-gray-500">{value}</span>
    </li>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}
