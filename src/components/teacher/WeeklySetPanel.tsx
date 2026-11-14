import { AlertTriangle, ClipboardList, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { formatTashkentDateTime } from '../../lib/uzDate';

type SetStatus = 'not_started' | 'partial' | 'done';

interface SetScore {
  total: number;
  done: number;
  correct: number;
  late: number;
  percent: number;
  status: SetStatus;
}

interface ClassSetReport {
  set: { id: string; fromOrder: number; toOrder: number; opensOn: string; dueAt: string };
  lessons: { order: number; title: string }[];
  total: number;
  students: { id: string; name: string; score: SetScore }[];
  missed: { id: string; prompt: string; lessonOrder: number; wrong: number; answered: number }[];
}

type ReportResponse = ClassSetReport | { set: null };

const STATUS_LABEL: Record<SetStatus, { text: string; cls: string }> = {
  done: { text: 'Topshirdi', cls: 'text-brand-green' },
  partial: { text: 'Qisman', cls: 'text-brand-orange' },
  not_started: { text: 'Boshlamagan', cls: 'text-red-400' },
};

function percentClass(percent: number): string {
  if (percent >= 80) return 'text-brand-green';
  if (percent >= 50) return 'text-brand-orange';
  return 'text-red-400';
}


/**
 * The current homework set, graded: one row per student and the questions the
 * class got wrong most — what to go over in the first minutes of the next
 * lesson. Every number comes from the server's own checks.
 */
export function WeeklySetPanel({ classId }: { classId: string | null }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['weekly', 'class', classId],
    queryFn: () => api.get<ReportResponse>(`/weekly/class/${classId}`),
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
  if (isError || !data) return <p className="text-sm text-red-400">Hafta vazifasini yuklab bo'lmadi.</p>;
  if (!data.set) {
    return (
      <div className="glass-panel p-6 text-sm text-gray-400">
        Hafta vazifasi birinchi dars kunlari tugagach ochiladi. Sinfning boshlanish sanasi va dars kunlari
        belgilanganini tekshiring.
      </div>
    );
  }

  const report = data as ClassSetReport;
  const overdue = new Date(report.set.dueAt).getTime() < Date.now();
  const submitted = report.students.filter((s) => s.score.status === 'done').length;
  const average =
    report.students.length > 0
      ? Math.round(report.students.reduce((sum, s) => sum + s.score.percent, 0) / report.students.length)
      : 0;

  return (
    <div className="glass-panel p-6 space-y-5">
      <div className="flex items-start gap-3">
        <ClipboardList className="text-brand-cyan shrink-0" size={20} />
        <div>
          <h3 className="font-bold text-white">
            Hafta vazifasi — {report.set.fromOrder === report.set.toOrder
              ? `${report.set.fromOrder}-dars`
              : `${report.set.fromOrder}–${report.set.toOrder}-darslar`}
          </h3>
          <p className="text-xs text-gray-400">
            {report.lessons.map((l) => `${l.order}. ${l.title}`).join(' · ')}
          </p>
          <p className={`text-xs mt-1 ${overdue ? 'text-brand-orange' : 'text-gray-400'}`}>
            {report.total} ta topshiriq · muddat {formatTashkentDateTime(report.set.dueAt)}
            {overdue ? ' (tugagan — natijalar yakuniy)' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Stat label="Topshirdi" value={`${submitted}/${report.students.length}`} />
        <Stat label="O'rtacha baho" value={`${average}%`} />
        <Stat label="Topshiriqlar" value={String(report.total)} />
      </div>

      {report.missed.length > 0 && (
        <div className="rounded-lg border border-brand-orange/30 bg-brand-orange/5 p-4">
          <p className="text-sm font-bold text-brand-orange flex items-center gap-2 mb-2">
            <AlertTriangle size={14} /> Ko'pchilik xato qilgan savollar — darsda ko'rib chiqing
          </p>
          <ol className="space-y-1 text-sm text-gray-200 list-decimal ml-5">
            {report.missed.map((q) => (
              <li key={q.id}>
                <span className="text-gray-500">{q.lessonOrder}-dars:</span> {q.prompt}{' '}
                <span className="text-brand-orange text-xs">
                  ({q.wrong}/{q.answered} xato)
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {report.students.length === 0 ? (
        <p className="text-sm text-gray-500">Bu sinfda hali o'quvchi yo'q.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase border-b border-white/10">
                <th className="py-2 pr-3">O'quvchi</th>
                <th className="py-2 pr-3">Holat</th>
                <th className="py-2 pr-3 text-right">Bajardi</th>
                <th className="py-2 pr-3 text-right">Baho</th>
                <th className="py-2 text-right">Kechikkan</th>
              </tr>
            </thead>
            <tbody>
              {[...report.students]
                .sort((a, b) => a.score.percent - b.score.percent)
                .map(({ id, name, score }) => (
                  <tr key={id} className="border-b border-white/5">
                    <td className="py-2 pr-3 text-white">{name}</td>
                    <td className={`py-2 pr-3 text-xs ${STATUS_LABEL[score.status].cls}`}>
                      {STATUS_LABEL[score.status].text}
                    </td>
                    <td className="py-2 pr-3 text-right font-mono text-gray-300">
                      {score.done}/{score.total}
                    </td>
                    <td className={`py-2 pr-3 text-right font-mono font-bold ${percentClass(score.percent)}`}>
                      {score.percent}%
                    </td>
                    <td className="py-2 text-right font-mono text-gray-400">{score.late || '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p className="mt-2 text-[11px] text-gray-500">
            Baho: savolga birinchi javob to'g'ri bo'lsa yoki masala testlardan o'tsa — muddatgacha. Eng past baholar
            yuqorida.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}
