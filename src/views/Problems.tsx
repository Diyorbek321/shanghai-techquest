import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, CheckCircle2, XCircle, ChevronRight, ChevronLeft, Play, Check, Loader2, Search, EyeOff, AlertTriangle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | 'MASTER';
type Language = 'javascript' | 'python' | 'cpp';

interface ProblemListItem {
  id: string;
  key: string;
  title: string;
  difficulty: Difficulty;
  points: number;
  tags: string[];
  solved: boolean;
}

interface ProblemListResponse {
  items: ProblemListItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface ProblemDetail extends ProblemListItem {
  description: string;
  starterCode: Record<Language, string | null>;
  /** Languages this problem ships starter code for; lesson practice is Python-only. */
  languages: Language[];
}

const LANGUAGE_LABEL: Record<Language, string> = {
  javascript: 'JavaScript',
  python: 'Python 3',
  cpp: 'C++',
};

/** One test case verdict. Hidden cases deliberately omit expected/actual. */
interface SubmitTestResult {
  label: string;
  hidden: boolean;
  passed: boolean;
  expected?: string;
  actual?: string;
  stderr?: string;
}

interface SubmitResult {
  passed: boolean;
  testsPassed: number;
  testsTotal: number;
  pointsAwarded: number;
  feedback: string;
  results: SubmitTestResult[];
}

/** Message shown in the results panel when the submission itself failed. */
interface SubmitFailure {
  title: string;
  detail: string;
  /** Sandbox outage is not the student's fault — render it as a warning, not a rejection. */
  sandboxDown: boolean;
}

const SANDBOX_DOWN_FAILURE: SubmitFailure = {
  title: 'Kod ishga tushirish xizmati vaqtincha ishlamayapti',
  detail:
    "Sinov muhiti (sandbox) hozir javob bermayapti. Kodingiz saqlanib qoldi — bir necha daqiqadan so'ng qayta yuboring yoki o'qituvchiga xabar bering.",
  sandboxDown: true,
};

function toSubmitFailure(error: unknown): SubmitFailure {
  if (error instanceof ApiError && error.status === 503) {
    return SANDBOX_DOWN_FAILURE;
  }
  return {
    title: 'Yuborishda xatolik yuz berdi',
    detail: error instanceof Error ? error.message : "Noma'lum xatolik. Iltimos, qaytadan urinib ko'ring.",
    sandboxDown: false,
  };
}

interface RunResult {
  stdout: string;
  stderr: string;
  compileOutput: string | null;
  timedOut: boolean;
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  EASY: 'Oson',
  MEDIUM: "O'rta",
  HARD: 'Qiyin',
  EXPERT: 'Ekspert',
  MASTER: 'Usta',
};

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  EASY: 'bg-brand-green/20 text-brand-green',
  MEDIUM: 'bg-yellow-500/20 text-yellow-500',
  HARD: 'bg-red-500/20 text-red-500',
  EXPERT: 'bg-brand-purple/20 text-brand-purple',
  MASTER: 'bg-[#FFD700]/20 text-[#FFD700]',
};

const DIFFICULTY_TABS: { label: string; value: Difficulty | 'ALL' }[] = [
  { label: 'Barchasi', value: 'ALL' },
  { label: 'Oson', value: 'EASY' },
  { label: "O'rta", value: 'MEDIUM' },
  { label: 'Qiyin', value: 'HARD' },
  { label: 'Ekspert', value: 'EXPERT' },
  { label: 'Usta', value: 'MASTER' },
];

const PAGE_SIZE = 25;

/** Monospace block that scrolls on its own instead of stretching the panel. */
function OutputBlock({ label, value, tone }: { label: string; value: string; tone: 'expected' | 'actual' | 'error' }) {
  const toneClass =
    tone === 'expected' ? 'text-brand-green' : tone === 'actual' ? 'text-red-400' : 'text-yellow-300';
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <pre
        className={`bg-black/60 border border-white/10 rounded px-2 py-1.5 text-xs whitespace-pre-wrap break-words overflow-x-auto max-h-32 ${toneClass}`}
      >
        {value === '' ? '(bo‘sh)' : value}
      </pre>
    </div>
  );
}

function TestResultRow({ test }: { test: SubmitTestResult }) {
  const showDetails = !test.passed && !test.hidden;
  return (
    <li className="rounded-md border border-white/10 bg-black/30 px-3 py-2 min-w-0">
      <div className="flex items-center gap-2 text-xs">
        {test.passed ? (
          <CheckCircle2 size={14} className="text-brand-green shrink-0" />
        ) : (
          <XCircle size={14} className="text-red-500 shrink-0" />
        )}
        <span className={`truncate ${test.passed ? 'text-gray-300' : 'text-red-300 font-bold'}`}>
          {test.hidden && !test.passed ? 'Yashirin test — yiqildi' : test.label}
        </span>
        {test.hidden && (
          <span className="ml-auto flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-500 shrink-0">
            <EyeOff size={11} /> Yashirin
          </span>
        )}
      </div>

      {showDetails && (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <OutputBlock label="Kutilgan natija" value={test.expected ?? ''} tone="expected" />
          <OutputBlock label="Sizning natijangiz" value={test.actual ?? ''} tone="actual" />
          {test.stderr && (
            <div className="md:col-span-2">
              <OutputBlock label="Xatolik oqimi" value={test.stderr} tone="error" />
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export function Problems() {
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState('');
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitFailure, setSubmitFailure] = useState<SubmitFailure | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: listData, isLoading } = useQuery({
    queryKey: ['problems', difficultyFilter, search, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (difficultyFilter !== 'ALL') params.set('difficulty', difficultyFilter);
      if (search.trim()) params.set('search', search.trim());
      params.set('page', String(page));
      params.set('pageSize', String(PAGE_SIZE));
      return api.get<ProblemListResponse>(`/problems?${params.toString()}`);
    },
  });

  const problemsList = listData?.items ?? [];
  const total = listData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const { data: activeProblem, isLoading: isDetailLoading } = useQuery({
    queryKey: ['problems', 'detail', activeProblemId],
    queryFn: () => api.get<ProblemDetail>(`/problems/${activeProblemId}`),
    enabled: !!activeProblemId,
  });

  const runCode = useMutation({
    mutationFn: () => api.post<RunResult>('/problems/run', { code, language }),
    onSuccess: (data) => {
      setRunResult(data);
      setResult(null);
      setSubmitFailure(null);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError && error.status === 503
          ? SANDBOX_DOWN_FAILURE.detail
          : error instanceof Error
            ? error.message
            : 'Kodni ishga tushirishda xatolik yuz berdi.';
      setRunResult({ stdout: '', stderr: message, compileOutput: null, timedOut: false });
      setResult(null);
      setSubmitFailure(null);
    },
  });

  const submit = useMutation({
    mutationFn: () =>
      api.post<SubmitResult>(`/problems/${activeProblemId}/submit`, { code, language }),
    onSuccess: (data) => {
      setResult(data);
      setRunResult(null);
      setSubmitFailure(null);
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
    onError: (error: unknown) => {
      setSubmitFailure(toSubmitFailure(error));
      setResult(null);
      setRunResult(null);
    },
  });

  const handleSelectProblem = (prob: ProblemListItem) => {
    setActiveProblemId(prob.id);
    setRunResult(null);
    setResult(null);
    setSubmitFailure(null);
  };

  React.useEffect(() => {
    if (!activeProblem) return;
    // Fall back to the problem's first available language when the currently
    // selected one has no starter code (e.g. Python-only lesson practice).
    const next = activeProblem.starterCode[language] !== null ? language : activeProblem.languages[0] ?? language;
    setLanguage(next);
    setCode(activeProblem.starterCode[next] ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProblem]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    if (activeProblem) {
      setCode(activeProblem.starterCode[lang] ?? '');
    }
  };

  const handleRun = () => {
    if (runCode.isPending) return;
    setResult(null);
    setSubmitFailure(null);
    runCode.mutate();
  };

  const handleSubmit = () => {
    if (!activeProblemId || submit.isPending) return;
    setSubmitFailure(null);
    submit.mutate();
  };

  const handleFilterChange = (value: Difficulty | 'ALL') => {
    setDifficultyFilter(value);
    setPage(1);
  };

  if (!activeProblemId) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <BrainCircuit className="text-brand-purple" size={32} />
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white">Dasturlash Masalalari</h1>
            <p className="text-gray-400">Ko'nikmalaringizni oshirish va XP to'plash uchun algoritmik masalalarni yeching.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {DIFFICULTY_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleFilterChange(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  difficultyFilter === tab.value ? 'bg-white text-black' : 'bg-black/40 text-gray-400 hover:text-white border border-brand-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Masala nomini qidirish..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:border-brand-cyan focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="glass-panel p-1 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/50 text-gray-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Holat</th>
                <th className="px-6 py-4 font-semibold">Nomi</th>
                <th className="px-6 py-4 font-semibold">Qiyinlik</th>
                <th className="px-6 py-4 font-semibold">Ballar</th>
                <th className="px-6 py-4 font-semibold">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Masalalar yuklanmoqda...</td>
                </tr>
              )}
              {!isLoading && problemsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Hozircha masalalar yo'q.</td>
                </tr>
              )}
              {problemsList.map((prob, i) => (
                <tr key={prob.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    {prob.solved ? <CheckCircle2 className="text-brand-green" size={18} /> : <div className="w-4 h-4 rounded-full border border-gray-600"></div>}
                  </td>
                  <td className="px-6 py-4 font-bold text-white group-hover:text-brand-cyan transition-colors">
                    {(page - 1) * PAGE_SIZE + i + 1}. {prob.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${DIFFICULTY_STYLE[prob.difficulty]}`}>
                      {DIFFICULTY_LABEL[prob.difficulty]}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-brand-purple font-bold">
                    +{prob.points} XP
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSelectProblem(prob)}
                      className="text-gray-400 hover:text-white flex items-center gap-1 text-xs font-bold"
                    >
                      Yechish <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && total > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{total} ta masaladan {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} ko'rsatilmoqda</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-brand-cyan/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="font-mono text-xs">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-brand-cyan/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isDetailLoading || !activeProblem) {
    return <div className="max-w-4xl mx-auto py-8 text-center text-gray-500">Masala yuklanmoqda...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mt-6 -mx-8">
      {/* Top Bar */}
      <div className="h-14 bg-brand-sidebar border-b border-brand-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveProblemId(null)}
            className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <ChevronLeft size={16} /> Masalalarga qaytish
          </button>
          <div className="h-6 w-px bg-white/10"></div>
          <h2 className="font-bold">{activeProblem.title}</h2>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${DIFFICULTY_STYLE[activeProblem.difficulty]}`}>
            {DIFFICULTY_LABEL[activeProblem.difficulty]}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="bg-black/50 border border-white/10 text-white text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-brand-cyan/50"
          >
            {activeProblem.languages.map((lang) => (
              <option key={lang} value={lang}>{LANGUAGE_LABEL[lang]}</option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: runCode.isPending ? 1 : 1.05 }}
            whileTap={{ scale: runCode.isPending ? 1 : 0.95 }}
            onClick={handleRun}
            disabled={runCode.isPending}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-brand-purple/20 border border-brand-purple/50 rounded-md hover:bg-brand-purple/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {runCode.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Ishga tushirilmoqda...
              </>
            ) : (
              <>
                <Play size={16} /> Ishga tushirish
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: submit.isPending ? 1 : 1.05 }}
            whileTap={{ scale: submit.isPending ? 1 : 0.95 }}
            onClick={handleSubmit}
            disabled={submit.isPending}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-brand-bg bg-brand-cyan rounded-md hover:bg-brand-cyan/90 transition-all neon-glow-cyan shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submit.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Testlar bajarilmoqda...
              </>
            ) : (
              <>
                <Check size={16} /> Yuborish
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Main Split Area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel: Description */}
        <div className="w-1/3 flex flex-col border-r border-brand-border bg-brand-bg p-6 overflow-y-auto">
          <h3 className="font-bold text-xl mb-4">{activeProblem.title}</h3>

          <div className="flex gap-2 mb-6">
            {activeProblem.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-gray-300">
            {activeProblem.description.split('\n').map((line: string, i: number) => {
              if (line.startsWith('**')) {
                return <p key={i} className="font-bold text-white mt-4">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line.startsWith('Kiritma:') || line.startsWith('Natija:') || line.startsWith('Izoh:')) {
                return <div key={i} className="bg-white/5 px-3 py-2 font-mono text-xs rounded my-1 border border-white/10">{line}</div>;
              }
              return <p key={i} className="mb-2">{line}</p>;
            })}
          </div>
        </div>

        {/* Right Panel: Editor & Output */}
        <div className="w-2/3 flex flex-col">
          {/* Monaco Editor */}
          <div className="flex-1 border-b border-brand-border">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1.6,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
              }}
            />
          </div>

          {/* Terminal / Output */}
          <div className="h-64 bg-[#0a0a0a] flex flex-col border-t border-black">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs font-bold text-gray-400 flex items-center justify-between border-b border-black">
              <span>Sinov Natijalari</span>
              {result && (
                <span className={`font-mono ${result.passed ? 'text-brand-green' : 'text-red-400'}`}>
                  {result.testsPassed}/{result.testsTotal} test o'tdi
                </span>
              )}
            </div>
            <div className="p-4 font-mono text-sm overflow-y-auto overflow-x-hidden flex-1">
              {submit.isPending ? (
                <div className="flex items-center gap-2 text-brand-cyan">
                  <Loader2 size={16} className="animate-spin" /> Kodingiz testlarda tekshirilmoqda, iltimos kuting...
                </div>
              ) : submitFailure ? (
                <div
                  className={`flex items-start gap-2 rounded-md border px-3 py-2 ${
                    submitFailure.sandboxDown
                      ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300'
                      : 'border-red-500/40 bg-red-500/10 text-red-300'
                  }`}
                >
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-bold">{submitFailure.title}</p>
                    <p className="text-xs text-gray-300 mt-1 whitespace-pre-wrap break-words">{submitFailure.detail}</p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-3 min-w-0">
                  <div className={`flex flex-wrap items-center gap-2 font-bold ${result.passed ? 'text-brand-green' : 'text-red-500'}`}>
                    {result.passed ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {result.passed ? 'Qabul qilindi!' : 'Qabul qilinmadi'}
                    <span className="text-gray-400 font-normal">
                      {result.testsPassed}/{result.testsTotal} test o'tdi
                    </span>
                    {result.passed && result.pointsAwarded > 0 && (
                      <span className="text-brand-purple">+{result.pointsAwarded} XP</span>
                    )}
                  </div>

                  {result.results.length > 0 ? (
                    <ul className="space-y-1.5">
                      {result.results.map((test, i) => (
                        <TestResultRow key={`${test.label}-${i}`} test={test} />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 italic text-xs">Bu masala uchun testlar topilmadi.</p>
                  )}

                  {result.feedback && (
                    <div className="border-t border-white/10 pt-2">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Qo'shimcha izoh</p>
                      <pre className="text-gray-400 text-xs whitespace-pre-wrap break-words">{result.feedback}</pre>
                    </div>
                  )}
                </div>
              ) : runCode.isPending ? (
                <div className="flex items-center gap-2 text-brand-cyan">
                  <Loader2 size={16} className="animate-spin" /> Kod ishga tushirilmoqda...
                </div>
              ) : runResult ? (
                <div className="space-y-2">
                  {runResult.compileOutput && (
                    <div>
                      <p className="text-yellow-500 font-bold mb-1">Kompilyatsiya:</p>
                      <pre className="text-yellow-200 whitespace-pre-wrap">{runResult.compileOutput}</pre>
                    </div>
                  )}
                  {runResult.stdout && (
                    <pre className="text-gray-300 whitespace-pre-wrap">{runResult.stdout}</pre>
                  )}
                  {runResult.stderr && (
                    <div>
                      <p className="text-red-500 font-bold mb-1">Xatolik:</p>
                      <pre className="text-red-400 whitespace-pre-wrap">{runResult.stderr}</pre>
                    </div>
                  )}
                  {runResult.timedOut && (
                    <p className="text-red-500 font-bold">Vaqt tugadi: kod juda uzoq ishladi va to'xtatildi.</p>
                  )}
                  {!runResult.compileOutput && !runResult.stdout && !runResult.stderr && !runResult.timedOut && (
                    <div className="text-gray-600 italic">Dastur natija chiqarmadi (stdout bo'sh).</div>
                  )}
                </div>
              ) : (
                <div className="text-gray-600 italic">Natijalarni ko'rish uchun kodingizni ishga tushiring...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
