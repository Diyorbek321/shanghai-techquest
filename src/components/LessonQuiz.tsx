import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Loader2, RefreshCw, RotateCcw, Sparkles, X } from 'lucide-react';
import { api } from '../lib/api';

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  lessonKey: string;
  isReview: boolean;
}

interface QuizSession {
  lessonKey: string;
  questions: QuizQuestion[];
}

interface AnswerResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;
  xpAwarded: number;
  streak: number;
  dueAt: string;
}

/** What the student has committed for the question currently on screen. */
interface CommittedAnswer {
  choiceIndex: number;
  result: AnswerResult;
}

export function LessonQuiz({ lessonKey }: { lessonKey: string }) {
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(0);
  const [committed, setCommitted] = useState<CommittedAnswer | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [finished, setFinished] = useState(false);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['quiz', lessonKey],
    queryFn: () => api.get<QuizSession>(`/quiz/${lessonKey}`),
  });

  const questions = useMemo(() => data?.questions ?? [], [data]);
  const question = questions[index] ?? null;

  const answer = useMutation({
    mutationFn: ({ questionId, choiceIndex }: { questionId: string; choiceIndex: number }) =>
      api.post<AnswerResult>(`/quiz/${questionId}/answer`, { choiceIndex }),
    onSuccess: (result, variables) => {
      setCommitted({ choiceIndex: variables.choiceIndex, result });
      if (result.correct) setCorrectCount((prev) => prev + 1);
      setXpEarned((prev) => prev + result.xpAwarded);
      // The mastery gate and the due-badge both depend on this attempt.
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', 'due'] });
    },
  });

  const handleChoice = (choiceIndex: number) => {
    if (!question || committed || answer.isPending) return;
    answer.mutate({ questionId: question.id, choiceIndex });
  };

  const handleNext = () => {
    setCommitted(null);
    answer.reset();
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex(index + 1);
  };

  const handleRestart = () => {
    setIndex(0);
    setCommitted(null);
    setCorrectCount(0);
    setXpEarned(0);
    setFinished(false);
    answer.reset();
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-brand-border bg-black/20 p-4 text-sm text-gray-400">
        <Loader2 className="animate-spin" size={16} /> Savollar yuklanmoqda...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
        Savollarni yuklab bo'lmadi: {error instanceof Error ? error.message : "Noma'lum xatolik"}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-brand-border bg-black/20 p-4">
        <p className="text-sm text-gray-300">Bu dars uchun test savollari hali tayyorlanmagan.</p>
        <p className="mt-1 text-xs text-gray-500">
          Savollar qo'shilgach shu yerda paydo bo'ladi. Hozircha uy vazifasi va mashqlarga e'tibor bering.
        </p>
      </div>
    );
  }

  if (finished) {
    return (
      <QuizSummary
        total={questions.length}
        correct={correctCount}
        xpEarned={xpEarned}
        onRestart={handleRestart}
        isRestarting={isFetching}
      />
    );
  }

  if (!question) return null;

  return (
    <div className="rounded-lg border border-brand-border bg-black/20 p-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-gray-500">
          {index + 1} / {questions.length}
        </span>
        {question.isReview && (
          <span className="flex items-center gap-1 rounded bg-brand-purple/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-purple">
            <RefreshCw size={10} /> Takrorlash
          </span>
        )}
        <span className="ml-auto text-xs font-bold text-emerald-400">{correctCount} to'g'ri</span>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/40">
        <motion.div
          className="h-full bg-brand-cyan"
          initial={false}
          animate={{ width: `${((index + (committed ? 1 : 0)) / questions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {question.isReview && (
        <p className="mt-3 text-[11px] text-brand-purple/80">
          Bu savol oldingi darsdan — bilimingiz mustahkamlanishi uchun qaytadan so'ralmoqda.
        </p>
      )}

      <p className="mt-3 text-sm font-medium text-gray-100">{question.prompt}</p>

      <ul className="mt-3 space-y-2">
        {question.choices.map((choice, choiceIndex) => (
          <li key={choiceIndex}>
            <ChoiceCard
              label={choice}
              index={choiceIndex}
              committed={committed}
              disabled={!!committed || answer.isPending}
              onSelect={handleChoice}
            />
          </li>
        ))}
      </ul>

      {answer.isPending && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="animate-spin" size={14} /> Tekshirilmoqda...
        </div>
      )}

      {answer.isError && !committed && (
        <p className="mt-3 text-xs text-red-400">
          Javobni yuborib bo'lmadi:{' '}
          {answer.error instanceof Error ? answer.error.message : "Noma'lum xatolik"}. Qayta urinib ko'ring.
        </p>
      )}

      <AnimatePresence initial={false}>
        {committed && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-3 rounded-lg border p-3 ${
              committed.result.correct
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-red-500/30 bg-red-500/10'
            }`}
          >
            <div className="flex items-center gap-2">
              {committed.result.correct ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <X size={14} className="text-red-400" />
              )}
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  committed.result.correct ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {committed.result.correct ? "To'g'ri!" : "Noto'g'ri"}
              </span>
              {committed.result.xpAwarded > 0 && (
                <span className="ml-auto text-xs font-bold text-[#FFD700]">+{committed.result.xpAwarded} XP</span>
              )}
            </div>
            {committed.result.explanation && (
              <p className="mt-1.5 text-sm text-gray-300">{committed.result.explanation}</p>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="mt-3 rounded-lg border border-brand-cyan/30 bg-brand-cyan/15 px-3 py-1.5 text-xs font-bold text-brand-cyan transition-colors hover:bg-brand-cyan/25"
            >
              {index + 1 >= questions.length ? 'Yakunlash' : 'Keyingi savol →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChoiceCard({
  label,
  index,
  committed,
  disabled,
  onSelect,
}: {
  label: string;
  index: number;
  committed: CommittedAnswer | null;
  disabled: boolean;
  onSelect: (index: number) => void;
}) {
  const isCorrectChoice = committed?.result.correctIndex === index;
  const isPicked = committed?.choiceIndex === index;

  // After committing: always highlight the right answer, and mark the student's
  // pick as wrong when it missed. Before committing: neutral card.
  const state = !committed
    ? 'border-brand-border bg-black/20 hover:border-brand-cyan/40 hover:bg-white/5'
    : isCorrectChoice
      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
      : isPicked
        ? 'border-red-500/50 bg-red-500/10 text-red-400'
        : 'border-brand-border bg-black/20 opacity-50';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(index)}
      className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${state} ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      <span className="mt-0.5 font-mono text-[10px] text-gray-500">
        {String.fromCharCode(65 + index)}
      </span>
      <span className="flex-1">{label}</span>
      {committed && isCorrectChoice && <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" />}
      {committed && isPicked && !isCorrectChoice && <X size={14} className="mt-0.5 shrink-0 text-red-400" />}
    </button>
  );
}

function QuizSummary({
  total,
  correct,
  xpEarned,
  onRestart,
  isRestarting,
}: {
  total: number;
  correct: number;
  xpEarned: number;
  onRestart: () => void;
  isRestarting: boolean;
}) {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = percent >= 60;

  return (
    <div
      className={`rounded-lg border p-4 ${
        passed ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-brand-orange/30 bg-brand-orange/10'
      }`}
    >
      <div className="flex items-center gap-2">
        <Sparkles size={16} className={passed ? 'text-emerald-400' : 'text-brand-orange'} />
        <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Test yakunlandi</span>
        {xpEarned > 0 && <span className="ml-auto text-xs font-bold text-[#FFD700]">+{xpEarned} XP</span>}
      </div>

      <div className="mt-2 text-2xl font-bold">
        {correct}
        <span className="text-sm text-gray-500">/{total}</span>
        <span className={`ml-2 text-sm ${passed ? 'text-emerald-400' : 'text-brand-orange'}`}>{percent}%</span>
      </div>

      <p className="mt-1 text-sm text-gray-300">
        {passed
          ? "Ajoyib! Bu darsning test qismi bajarildi. Xatolarga qaytib qaraysiz — savollar keyinroq takrorlanadi."
          : "Darsni yana bir bor ko'rib chiqing va testni qayta yeching. Ochilish uchun kamida 60% kerak."}
      </p>

      <button
        type="button"
        onClick={onRestart}
        disabled={isRestarting}
        className="mt-3 flex items-center gap-2 rounded-lg border border-brand-cyan/30 bg-brand-cyan/15 px-3 py-1.5 text-xs font-bold text-brand-cyan transition-colors hover:bg-brand-cyan/25 disabled:opacity-50"
      >
        {isRestarting ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
        Qaytadan yechish
      </button>
    </div>
  );
}
