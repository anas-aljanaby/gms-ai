import React from 'react';
import { AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useFormatting } from '../../../hooks/useFormatting';
import { useFinancialOverview } from '../../../hooks/useFinancialOverview';
import type { FinancialAlert } from '../../../types/financials';
import DashboardCard from './DashboardCard';

const STYLES: Record<FinancialAlert['type'], { icon: React.ReactNode; cls: string }> = {
  danger: { icon: <ShieldAlert size={16} />, cls: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' },
  warning: { icon: <AlertTriangle size={16} />, cls: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' },
  info: { icon: <Info size={16} />, cls: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300' },
};

/**
 * AttentionAlerts - تنبيهات مالية فعلية تتطلب الانتباه.
 */
const AttentionAlerts: React.FC = () => {
  const { t, pickLocalized } = useLocalization(['dashboard']);
  const { formatDate: fDate } = useFormatting();
  const { data, isLoading } = useFinancialOverview();

  const alerts = data?.alerts ?? [];

  return (
    <DashboardCard title={t('dashboard.overview.alerts.title')}>
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 dark:text-gray-400">
          <CheckCircle2 size={32} className="mb-2 text-green-500" />
          <p className="text-sm">{t('dashboard.overview.alerts.empty')}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => {
            const style = STYLES[alert.type];
            return (
              <li key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg ${style.cls}`}>
                <span className="mt-0.5 shrink-0">{style.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{pickLocalized(alert.message)}</p>
                  <p className="text-xs opacity-80 mt-0.5">{fDate(alert.date, 'medium')}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
};

export default AttentionAlerts;
