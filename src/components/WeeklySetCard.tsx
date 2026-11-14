import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Circle, ClipboardList, Code, Clock, HelpCircle } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { formatTashkentDateTime } from '../lib/uzDate';
import { LessonQuiz } from './LessonQuiz';

type SetStatus = 'not_started' | 'partial' | 'done';

interface SetScore {
  total: number;
  done: number;
  correct: number;
  late: number;
  percent: number;
  status: SetStatus;
}

interface WeeklySetView {
  set: { id: string; fromOrder: number; toOrder: number; opensOn: string; dueAt: string };
  lessons: { order: number; title: string }[];
  score: SetScore;
  quiz: { total: number; answered: number };
  problems: { id: string; title: string; difficulty: string; lessonOrder: number; solved: boolean }[];
}

type WeeklyResponse = WeeklySetView | { set: null };

const hasSet = (data: WeeklyResponse | null | undefined): data is WeeklySetView => !!data?.set;


/**
 * "Hafta vazifasi": every question and problem from the lessons just taught,
 * due the evening before the next class. Graded by the server alone — first
 * answer per question, tests passed per problem — so the teacher never checks
 * homework by hand. Renders nothing until the cohort's first block is over.
 */
interface WeeklySetCardProps {
  onOpenProblem: (problemId: string) => void;
}

export function WeeklySetCard({ onOpenProblem }: WeeklySetCardProps) {
  const queryClient = useQueryClient();
  const [quizOpen, setQuizOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['weekly', 'current'],
    queryFn: async (): Promise<WeeklyResponse | null> => {
      try {
        return await api.get<WeeklyResponse>('/weekly/current');
      } catch (err) {
        // No track or no class: the card simply stays hidden.
        if (err instanceof ApiError && (err.status === 400 || err.status === 404)) return null;
        throw err;
      }
    },
  });

  if (!hasSet(data)) return null;

  const { set, lessons, score, quiz, problems } = data;
  const overdue = new Date(set.dueAt).getTime() < Date.now();
  const quizLeft = quiz.total - quiz.answered;
  const progress = score.total > 0 ? Math.round((score.done / score.total) * 100) : 0;
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['weekly'] });
    queryClient.invalidateQueries({ queryKey: ['daily-plan'] });
  };
  const lessonRange = set.fromOrder === set.toOrder ? `${set.fromOrder}-dars` : `${set.fromOrder}–${set.toOrder}-darslar`;

  return (
    <section className="glass-panel p-5 relative overflow-hidden border-brand-cyan/30">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-cyan"></div>

      <div className="flex justify-between items-start gap-2 mb-1">
        <div className="flex items-center gap-2">
          <ClipboardList className="text-brand-cyan" size={18} />
          <h2 className="font-semibold text-lg text-glow text-brand-cyan">Hafta vazifasi · {lessonRange}</h2>
        </div>
        {score.status === 'done' ? (
          <span className="text-xs font-bold bg-brand-green/20 text-brand-green px-2 py-1 rounded">{score.percent}%</span>
        ) : (
          <span className="text-xs font-mono bg-white/5 text-gray-300 px-2 py-1 rounded">
            {score.done}/{score.total}
          </span>
        )}
      </div>

      <p className={`text-xs mb-3 flex items-center gap-1 ${overdue ? 'text-red-400' : 'text-gray-400'}`}>
        <Clock size={12} />
        {overdue ? 'Muddat tugagan: ' : 'Muddat: '}
        {formatTashkentDateTime(set.dueAt)}
        {overdue && ' — endi bajarilgani bahoga kirmaydi'}
      </p>

      {lessons.length > 0 && (
        <p className="text-[11px] text-gray-500 mb-3 truncate">{lessons.map((l) => `${l.order}. ${l.title}`).join(' · ')}</p>
      )}

      <div className="h-1.5 overflow-hidden rounded-full bg-black/40 mb-4">
        <div className="h-full bg-brand-cyan transition-all" style={{ width: `${progress}%` }} />
      </div>

      <ul className="space-y-2">
        <li className="bg-black/30 border border-brand-border rounded-lg px-3 py-2">
          <div className="flex items-center gap-3">
            {quizLeft === 0 ? (
              <CheckCircle2 size={18} className="text-brand-green shrink-0" />
            ) : (
              <Circle size={18} className="text-gray-500 shrink-0" />
            )}
            <p className={`flex-1 text-sm ${quizLeft === 0 ? 'text-gray-400' : 'text-gray-100'}`}>
              <HelpCircle size={12} className="inline mr-1 text-brand-purple" />
              Test va kod savollari · {quiz.answered}/{quiz.total}
            </p>
            {(quizLeft > 0 || quizOpen) && (
              <button
                onClick={() => setQuizOpen((open) => !open)}
                className="text-xs bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple border border-brand-purple/50 px-3 py-1 rounded shrink-0"
              >
                {quizOpen ? 'Yopish' : quiz.answered > 0 ? 'Davom etish' : 'Boshlash'}
              </button>
            )}
          </div>
          {quizLeft > 0 && (
            <p className="mt-1 ml-[30px] text-[11px] text-gray-500">
              Har savolga birinchi javobingiz baholanadi — shoshilmang, o'ylab javob bering.
            </p>
          )}
          {/* Stays mounted after the last answer so its explanation can be read;
              the student closes it themselves. */}
          {quizOpen && (
            <div className="mt-3">
              <LessonQuiz
                lessonKey={`weekly-${set.id}`}
                sourcePath="/weekly/current/quiz"
                onAnswered={refresh}
                variant="homework"
              />
            </div>
          )}
        </li>

        {problems.map((problem) => (
          <li
            key={problem.id}
            className="flex items-center gap-3 bg-black/30 border border-brand-border rounded-lg px-3 py-2"
          >
            {problem.solved ? (
              <CheckCircle2 size={18} className="text-brand-green shrink-0" />
            ) : (
              <Circle size={18} className="text-gray-500 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${problem.solved ? 'text-gray-400 line-through' : 'text-gray-100'}`}>
                <Code size={12} className="inline mr-1 text-brand-cyan" />
                {problem.title}
              </p>
              <p className="text-[11px] text-gray-500">
                {problem.lessonOrder}-dars · {problem.difficulty}
              </p>
            </div>
            {!problem.solved && (
              <button
                type="button"
                onClick={() => onOpenProblem(problem.id)}
                className="text-xs bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan border border-brand-cyan/50 px-3 py-1 rounded shrink-0"
              >
                Yechish
              </button>
            )}
          </li>
        ))}
      </ul>

      {score.status === 'done' && (
        <p className="mt-3 text-xs text-gray-400">
          Hammasi topshirildi. Baho: {score.correct}/{score.total} ({score.percent}%)
          {score.late > 0 && ` · ${score.late} tasi muddatdan keyin`}.
        </p>
      )}
    </section>
  );
}
