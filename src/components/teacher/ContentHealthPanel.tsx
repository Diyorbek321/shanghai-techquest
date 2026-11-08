import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

type Severity = 'high' | 'medium';

type Issue =
  | {
      kind: 'problem';
      id: string;
      title: string;
      difficulty: string;
      lessonOrder: number;
      lessonTitle: string;
      flag: 'no_tests' | 'nobody_solves' | 'easy_but_unsolved' | 'low_solve_rate';
      severity: Severity;
      attempted: number;
      solved: number;
      solveRate: number | null;
    }
  | {
      kind: 'question';
      id: string;
      prompt: string;
      lessonOrder: number;
      lessonTitle: string;
      flag: 'mostly_wrong';
      severity: Severity;
      students: number;
      correctRate: number;
    };

interface ContentHealth {
  track: string;
  checked: { problems: number; questions: number };
  issues: Issue[];
}

const FLAG_TEXT: Record<Issue['flag'], { title: string; action: string }> = {
  no_tests: {
    title: "Testi yo'q",
    action: "Hech kim yecha olmaydi — masalaga test qo'shish kerak.",
  },
  nobody_solves: {
    title: 'Hech kim yechmagan',
    action: "Testlar yoki shartni tekshiring: kutilgan javob xato bo'lishi mumkin.",
  },
  easy_but_unsolved: {
    title: 'Oson, lekin yechilmayapti',
    action: 'Shart noaniq yoki test xato bo\'lishi mumkin. O\'zingiz yechib ko\'ring.',
  },
  low_solve_rate: {
    title: 'Kam yechilmoqda',
    action: 'Darsda shu mavzuni qayta tushuntirish yoki masalani yengillatish kerak bo\'lishi mumkin.',
  },
  mostly_wrong: {
    title: 'Ko\'pchilik xato javob beryapti',
    action: "Javob kalitini tekshiring: to'g'ri variant noto'g'ri belgilangan bo'lishi mumkin.",
  },
};

const SEVERITY_STYLE: Record<Severity, string> = {
  high: 'border-red-500/40 bg-red-500/10 text-red-300',
  medium: 'border-brand-orange/40 bg-brand-orange/10 text-brand-orange',
};

const percent = (rate: number) => `${Math.round(rate * 100)}%`;

function IssueRow({ issue }: { issue: Issue }) {
  const text = FLAG_TEXT[issue.flag];
  const stat =
    issue.kind === 'problem'
      ? issue.flag === 'no_tests'
        ? null
        : `${issue.attempted} o'quvchidan ${issue.solved} tasi yechgan`
      : `${issue.students} o'quvchi, to'g'ri javoblar ${percent(issue.correctRate)}`;

  return (
    <li className={`rounded-xl border p-4 space-y-1 ${SEVERITY_STYLE[issue.severity]}`}>
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
        <span>{text.title}</span>
        <span className="text-gray-400 font-normal normal-case">
          {issue.lessonOrder}-dars · {issue.lessonTitle}
        </span>
      </div>
      <p className="text-sm text-white break-words">
        {issue.kind === 'problem' ? `Masala: ${issue.title} (${issue.difficulty})` : `Savol: ${issue.prompt}`}
      </p>
      {stat && <p className="text-xs text-gray-400">{stat}</p>}
      <p className="text-xs text-gray-300">{text.action}</p>
    </li>
  );
}

/**
 * Problems and quiz questions whose results across the whole track suggest
 * the content is broken. Each row says what to check; nothing is changed
 * automatically.
 */
export function ContentHealthPanel({ classId }: { classId: string | null }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['quality', 'class', classId],
    queryFn: () => api.get<ContentHealth>(`/quality/class/${classId}`),
    enabled: !!classId,
  });

  if (!classId) return <p className="text-sm text-gray-500">Avval sinfni tanlang.</p>;
  if (isLoading) {
    return (
      <p className="text-sm text-gray-500 flex items-center gap-2">
        <Loader2 size={14} className="animate-spin" /> Yuklanmoqda...
      </p>
    );
  }
  if (isError || !data) return <p className="text-sm text-red-400">Kontent tahlilini yuklab bo'lmadi.</p>;

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-start gap-3">
        {data.issues.length > 0 ? (
          <ShieldAlert className="text-brand-orange shrink-0" size={20} />
        ) : (
          <ShieldCheck className="text-brand-green shrink-0" size={20} />
        )}
        <div>
          <h3 className="font-bold text-white">Kontent sifati</h3>
          <p className="text-xs text-gray-400">
            {data.checked.problems} ta masala va {data.checked.questions} ta savol shu yo'nalishdagi barcha
            o'quvchilar natijasi bo'yicha tekshirildi. Kamida 5 o'quvchi urinib ko'rgan narsa baholanadi.
          </p>
        </div>
      </div>

      {data.issues.length === 0 ? (
        <p className="text-sm text-gray-400">Shubhali masala yoki savol topilmadi.</p>
      ) : (
        <ul className="space-y-2">
          {data.issues.map((issue) => (
            <IssueRow key={`${issue.kind}:${issue.id}`} issue={issue} />
          ))}
        </ul>
      )}
    </div>
  );
}
