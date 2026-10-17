import { CalendarCheck, Flame, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { WEEKDAYS } from '../../lib/lessonDays';

type DayStatus = 'done' | 'late' | 'partial' | 'missed' | 'rest' | 'open';

interface DailyPlanBoard {
  dates: { date: string; lessonDay: boolean }[];
  students: {
    id: string;
    name: string;
    streak: number;
    days: { date: string; status: DayStatus; done: number; total: number }[];
  }[];
}

const STATUS_STYLE: Record<DayStatus, { cell: string; label: string }> = {
  done: { cell: 'bg-brand-green/20 text-brand-green border-brand-green/40', label: 'Bajardi' },
  late: { cell: 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/40', label: 'Kechikib bajardi' },
  partial: { cell: 'bg-brand-orange/15 text-brand-orange border-brand-orange/40', label: 'Qisman' },
  missed: { cell: 'bg-red-500/10 text-red-400 border-red-500/30', label: 'Bajarmadi' },
  open: { cell: 'bg-white/5 text-gray-300 border-white/15', label: 'Bugun, jarayonda' },
  rest: { cell: 'bg-transparent text-gray-600 border-white/5', label: "Reja yo'q" },
};

function dayLabel(date: string): string {
  const weekday = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  return WEEKDAYS.find((w) => w.day === weekday)?.short ?? '';
}

/**
 * Who did their daily work, for the last two weeks. Every mark here comes from
 * the server's own checks (tests passed, quiz answered right) — nothing a
 * student ticked off themselves — so the teacher can act on it without
 * re-checking.
 */
export function DailyPlanPanel({ classId }: { classId: string | null }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['daily-plan', 'class', classId],
    queryFn: () => api.get<DailyPlanBoard>(`/daily-plan/class/${classId}?days=14`),
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
  if (isError || !data) return <p className="text-sm text-red-400">Kunlik rejalarni yuklab bo'lmadi.</p>;

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-start gap-3">
        <CalendarCheck className="text-brand-cyan shrink-0" size={20} />
        <div>
          <h3 className="font-bold text-white">Kunlik reja — oxirgi 14 kun</h3>
          <p className="text-xs text-gray-400">
            Har kuni o'quvchiga masala va quiz beriladi; ular testlar va javob kaliti bilan avtomatik tekshiriladi.
            Dars kunlari ustunda belgilangan.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[11px]">
        {(Object.keys(STATUS_STYLE) as DayStatus[]).map((status) => (
          <span key={status} className="flex items-center gap-1.5 text-gray-400">
            <span className={`w-3 h-3 rounded border ${STATUS_STYLE[status].cell}`} /> {STATUS_STYLE[status].label}
          </span>
        ))}
      </div>

      {data.students.length === 0 ? (
        <p className="text-sm text-gray-500">Bu sinfda hali o'quvchi yo'q.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="text-left border-separate border-spacing-1">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase">
                <th className="px-2 font-bold sticky left-0 bg-brand-bg">O'quvchi</th>
                {data.dates.map(({ date, lessonDay }) => (
                  <th key={date} className="px-1 text-center font-mono font-normal" title={date}>
                    <div className={lessonDay ? 'text-brand-purple font-bold' : ''}>{dayLabel(date)}</div>
                    <div>{date.slice(8)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.students.map((student) => (
                <tr key={student.id}>
                  <td className="px-2 py-1 text-sm text-white whitespace-nowrap sticky left-0 bg-brand-bg">
                    {student.name}
                    {student.streak > 0 && (
                      <span className="ml-2 text-[10px] text-brand-orange inline-flex items-center gap-0.5">
                        <Flame size={10} /> {student.streak}
                      </span>
                    )}
                  </td>
                  {student.days.map((day) => (
                    <td key={day.date}>
                      <div
                        title={`${day.date}: ${STATUS_STYLE[day.status].label}${day.total ? ` (${day.done}/${day.total})` : ''}`}
                        className={`w-9 h-7 rounded border text-[10px] font-mono flex items-center justify-center ${STATUS_STYLE[day.status].cell}`}
                      >
                        {day.total > 0 ? `${day.done}/${day.total}` : ''}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
