import React, { type ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Sparkline from '../../common/Sparkline';

export type ChipAccent = 'primary' | 'green' | 'amber' | 'red' | 'violet' | 'sky';

const ACCENTS: Record<ChipAccent, { badge: string; spark: string }> = {
  primary: { badge: 'bg-primary/10 text-primary', spark: 'hsl(210, 40%, 50%)' },
  green: { badge: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300', spark: '#22c55e' },
  amber: { badge: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300', spark: '#f59e0b' },
  red: { badge: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300', spark: '#ef4444' },
  violet: { badge: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300', spark: '#a855f7' },
  sky: { badge: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300', spark: '#0ea5e9' },
};

interface KpiChipProps {
  label: string;
  value: string;
  icon: ReactNode;
  accent?: ChipAccent;
  /** Month-over-month change as a percentage. Rendered as a coloured arrow + value. */
  change?: number;
  /** Caption shown next to the change (e.g. "vs last month"). */
  changeLabel?: string;
  /** Real series used to draw a subtle background sparkline. */
  trend?: number[];
  /** Secondary stat shown under the value when there is no trend. */
  sub?: string;
  loading?: boolean;
  onClick?: () => void;
}

/**
 * KpiChip - بطاقة مؤشر مكثفة تعرض قيمة فعلية مع اتجاه ونسبة تغير من بيانات حقيقية.
 */
const KpiChip: React.FC<KpiChipProps> = ({
  label,
  value,
  icon,
  accent = 'primary',
  change,
  changeLabel,
  trend,
  sub,
  loading,
  onClick,
}) => {
  const { badge, spark } = ACCENTS[accent];
  const hasTrend = !loading && trend && trend.length >= 2;
  const isPositive = (change ?? 0) >= 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col justify-between min-h-[140px] text-start w-full bg-card dark:bg-dark-card p-5 rounded-2xl shadow-soft overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {hasTrend && (
        <div className="absolute inset-x-0 bottom-0 opacity-[0.18] dark:opacity-25 pointer-events-none">
          <Sparkline data={trend!} color={spark} width={320} height={56} className="w-full" animate={false} />
        </div>
      )}

      <div className="relative flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <span className={`p-2 rounded-xl shrink-0 ${badge}`}>{icon}</span>
      </div>

      <div className="relative mt-3">
        {loading ? (
          <div className="h-8 w-24 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
        ) : (
          <p className="text-3xl font-bold text-foreground dark:text-dark-foreground tabular-nums leading-none">
            {value}
          </p>
        )}

        {!loading && change !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 mt-2 text-xs font-semibold ${
              isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isPositive ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
            {Math.abs(change).toFixed(1)}%
            {changeLabel && <span className="ms-1 font-normal text-gray-400 dark:text-gray-500">{changeLabel}</span>}
          </span>
        )}

        {!loading && change === undefined && sub && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{sub}</p>
        )}
      </div>
    </button>
  );
};

export default KpiChip;
