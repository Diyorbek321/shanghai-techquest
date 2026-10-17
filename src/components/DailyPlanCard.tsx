import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarCheck, CheckCircle2, Circle, Code, Flame, HelpCircle, History, X } from 'lucide-react';
import { User, ViewType } from '../types';
import { api, ApiError } from '../lib/api';
import { DailyExerciseCard } from './DailyExerciseCard';
import { LessonQuiz } from './LessonQuiz';

type PlanItem =
  | { kind: 'quiz'; done: boolean; answeredCorrectly: number; total: number }
  | {
      kind: 'problem';
      done: boolean;
      problemId: string;
      title: string;
      difficulty: string;
      points: number;
      lessonOrder: number | null;
      lessonTitle: string | null;
    };

interface PlanView {
  date: string;
  lessonDay: boolean;
  items: PlanItem[];
  done: boolean;
  late: boolean;
  xpAwarded: number;
  xpReward: number;
}

interface TodayResponse {
  today: PlanView;
  pending: { date: string; done: number; total: number }[];
  streak: number;
}

interface DailyPlanCardProps {
  user: User;
  onNavigate: (view: ViewType) => void;
  onOpenProblem: (problemId: string) => void;
}

function formatDay(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toLocaleDateString('uz-UZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

/**
 * Today's work, picked from the student's own class timetable and checked by
 * the server: a problem counts once its tests pass, the quiz once every answer
 * is right. There is no "done" button — the day closes itself.
 *
 * Students whose class has no timetable (or tracks without lesson content)
 * keep the older drill card, which is what a 404 here means.
 */
export function DailyPlanCard({ user, onNavigate, onOpenProblem }: DailyPlanCardProps) {
  const queryClient = useQueryClient();
  const [quizOpen, setQuizOpen] = useState(false);
  const [pastDate, setPastDate] = useState<string | null>(null);
  const isStudent = user.role === 'student';

  const todayQuery = useQuery({
    queryKey: ['daily-plan', 'today'],
    enabled: isStudent,
    queryFn: async (): Promise<TodayResponse | null> => {
      try {
        return await api.get<TodayResponse>('/daily-plan');
      } catch (err) {
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) return null;
        throw err;
      }
    },
  });

  const pastQuery = useQuery({
    queryKey: ['daily-plan', 'day', pastDate],
    enabled: !!pastDate,
    queryFn: () => api.get<PlanView>(`/daily-plan/day/${pastDate}`),
  });

  const plan = pastDate ? pastQuery.data : todayQuery.data?.today;

  // XP and streak change on the server the moment the last item is checked.
  useEffect(() => {
    if (plan?.done) queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  }, [plan?.done, queryClient]);

  if (!isStudent || todayQuery.data === null) {
    return <DailyExerciseCard track={user.track} onNavigate={onNavigate} />;
  }
  if (!todayQuery.data || !plan) return null;

  const { pending, streak } = todayQuery.data;
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['daily-plan'] });
  const doneCount = plan.items.filter((item) => item.done).length;

  return (
    <section className="glass-panel p-5 relative overflow-hidden border-brand-orange/30">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange"></div>

      <div className="flex justify-between items-start gap-2 mb-1">
        <div className="flex items-center gap-2">
          <CalendarCheck className="text-brand-orange" size={18} />
          <h2 className="font-semibold text-lg text-glow text-brand-orange">
            {pastDate ? `Kechikkan kun: ${formatDay(pastDate)}` : 'Kunlik reja'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {plan.lessonDay && !pastDate && (
            <span className="text-[10px] uppercase tracking-wider bg-brand-purple/20 text-brand-purple px-2 py-1 rounded">
              Dars kuni
            </span>
          )}
          {streak > 0 && (
            <span className="text-xs font-mono bg-brand-orange/20 text-brand-orange px-2 py-1 rounded flex items-center gap-1">
              <Flame size={12} /> {streak} kun
            </span>
          )}
          {pastDate && (
            <button
              onClick={() => {
                setPastDate(null);
                setQuizOpen(false);
              }}
              className="p-1 text-gray-400 hover:text-white"
              aria-label="Bugungi rejaga qaytish"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        {plan.items.length === 0
          ? "Bugun reja yo'q — birinchi darsdan keyin boshlanadi."
          : plan.done
            ? `Bajarildi! +${plan.xpAwarded} XP${plan.late ? ' (kechikkan)' : ''}`
            : `${doneCount}/${plan.items.length} bajarildi · tizim o'zi tekshiradi · +${plan.xpReward} XP`}
      </p>

      <ul className="space-y-2">
        {plan.items.map((item, index) =>
          item.kind === 'problem' ? (
            <li
              key={item.problemId}
              className="flex items-center gap-3 bg-black/30 border border-brand-border rounded-lg px-3 py-2"
            >
              {item.done ? (
                <CheckCircle2 size={18} className="text-brand-green shrink-0" />
              ) : (
                <Circle size={18} className="text-gray-500 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${item.done ? 'text-gray-400 line-through' : 'text-gray-100'}`}>
                  <Code size={12} className="inline mr-1 text-brand-cyan" />
                  {item.title}
                </p>
                {item.lessonOrder !== null && (
                  <p className="text-[11px] text-gray-500 truncate">
                    {item.lessonOrder}-dars{item.lessonTitle ? `: ${item.lessonTitle}` : ''} · {item.difficulty}
                  </p>
                )}
              </div>
              {!item.done && (
                <button
                  onClick={() => onOpenProblem(item.problemId)}
                  className="text-xs bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan border border-brand-cyan/50 px-3 py-1 rounded shrink-0"
                >
                  Yechish
                </button>
              )}
            </li>
          ) : (
            <li key={`quiz-${index}`} className="bg-black/30 border border-brand-border rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                {item.done ? (
                  <CheckCircle2 size={18} className="text-brand-green shrink-0" />
                ) : (
                  <Circle size={18} className="text-gray-500 shrink-0" />
                )}
                <p className={`flex-1 text-sm ${item.done ? 'text-gray-400 line-through' : 'text-gray-100'}`}>
                  <HelpCircle size={12} className="inline mr-1 text-brand-purple" />
                  Takrorlash testi · {item.answeredCorrectly}/{item.total} to'g'ri
                </p>
                {!item.done && (
                  <button
                    onClick={() => setQuizOpen((open) => !open)}
                    className="text-xs bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple border border-brand-purple/50 px-3 py-1 rounded shrink-0"
                  >
                    {quizOpen ? 'Yopish' : 'Boshlash'}
                  </button>
                )}
              </div>
              {quizOpen && !item.done && (
                <div className="mt-3">
                  <LessonQuiz
                    lessonKey={`daily-${plan.date}`}
                    sourcePath={`/daily-plan/day/${plan.date}/quiz`}
                    onAnswered={refresh}
                  />
                </div>
              )}
            </li>
          )
        )}
      </ul>

      {!pastDate && pending.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
            <History size={12} /> Bajarilmagan kunlar — hali yopsa bo'ladi (yarim XP, ketma-ketlikka qo'shilmaydi)
          </p>
          <div className="flex flex-wrap gap-2">
            {pending.map((day) => (
              <button
                key={day.date}
                onClick={() => {
                  setPastDate(day.date);
                  setQuizOpen(false);
                }}
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded px-2 py-1 text-gray-300"
              >
                {formatDay(day.date)} · {day.done}/{day.total}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
