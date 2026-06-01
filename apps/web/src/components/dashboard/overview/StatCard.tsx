import React, { type ReactNode } from 'react';

export type StatAccent = 'primary' | 'green' | 'amber' | 'red' | 'violet' | 'sky';

const ACCENTS: Record<StatAccent, string> = {
  primary: 'bg-primary/10 text-primary',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300',
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300',
};

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accent?: StatAccent;
  sub?: string;
  loading?: boolean;
  onClick?: () => void;
}

/**
 * StatCard - بطاقة مؤشر مفرد تعرض قيمة فعلية مع أيقونة وإمكانية الانتقال للوحدة.
 */
const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent = 'primary', sub, loading, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-start w-full bg-card dark:bg-dark-card p-5 rounded-2xl shadow-soft hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
  >
    <div className="flex items-center gap-3 mb-3">
      <span className={`p-2.5 rounded-xl ${ACCENTS[accent]}`}>{icon}</span>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
    </div>
    {loading ? (
      <div className="h-8 w-24 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
    ) : (
      <p className="text-2xl font-bold text-foreground dark:text-dark-foreground tabular-nums">{value}</p>
    )}
    {sub && !loading && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
  </button>
);

export default StatCard;
