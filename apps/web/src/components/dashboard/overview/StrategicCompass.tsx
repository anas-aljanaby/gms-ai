import React from 'react';
import { Compass } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useFormatting } from '../../../hooks/useFormatting';
import { useBousala } from '../../../hooks/useBousala';
import DashboardCard from './DashboardCard';

interface StrategicCompassProps {
  setActiveModule: (module: string) => void;
}

const RING_RADIUS = 26;
const RING_CIRCUM = 2 * Math.PI * RING_RADIUS;

const ProgressRing: React.FC<{ value: number; color: string; label: string }> = ({ value, color, label }) => {
  const offset = RING_CIRCUM - (Math.min(100, Math.max(0, value)) / 100) * RING_CIRCUM;
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={RING_RADIUS} fill="none" strokeWidth="6" className="stroke-gray-200 dark:stroke-slate-700" />
        <circle
          cx="32"
          cy="32"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="6"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUM}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground dark:text-dark-foreground tabular-nums">
        {label}
      </span>
    </div>
  );
};

/**
 * StrategicCompass - شريط بوصلة الأهداف الاستراتيجية (Bousala) مع تقدم كل هدف.
 */
const StrategicCompass: React.FC<StrategicCompassProps> = ({ setActiveModule }) => {
  const { t } = useLocalization(['dashboard']);
  const { formatNumber: fNumber } = useFormatting();
  const { data, isLoading } = useBousala();
  const goals = data?.goals ?? [];

  return (
    <DashboardCard
      title={t('dashboard.overview.compass.title')}
      subtitle={t('dashboard.overview.compass.subtitle')}
      action={{ label: t('dashboard.overview.compass.viewAll'), onClick: () => setActiveModule('bousala') }}
    >
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-8 text-gray-500 dark:text-gray-400">
          <Compass size={32} className="mb-2 opacity-60" />
          <p className="text-sm">{t('dashboard.overview.compass.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {goals.slice(0, 6).map((goal) => {
            const onTrack = goal.progress >= 60;
            const color = onTrack ? '#22c55e' : '#f59e0b';
            return (
              <button
                key={goal.id}
                onClick={() => setActiveModule('bousala')}
                className="text-start flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <ProgressRing value={goal.progress} color={color} label={`${fNumber(Math.round(goal.progress))}%`} />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground dark:text-dark-foreground truncate">{goal.title}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      onTrack
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}
                  >
                    {onTrack ? t('dashboard.overview.compass.onTrack') : t('dashboard.overview.compass.atRisk')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
};

export default StrategicCompass;
