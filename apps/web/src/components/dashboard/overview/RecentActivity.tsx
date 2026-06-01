import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useFormatting } from '../../../hooks/useFormatting';
import { useFinancialOverview } from '../../../hooks/useFinancialOverview';
import DashboardCard from './DashboardCard';

interface RecentActivityProps {
  setActiveModule: (module: string) => void;
}

/**
 * RecentActivity - أحدث الحركات المالية الفعلية (تدفقات داخلة وخارجة).
 */
const RecentActivity: React.FC<RecentActivityProps> = ({ setActiveModule }) => {
  const { t, pickLocalized } = useLocalization(['dashboard']);
  const { formatCurrency: fCurrency, formatDate: fDate } = useFormatting();
  const { data, isLoading } = useFinancialOverview();

  const transactions = data?.recentTransactions ?? [];

  return (
    <DashboardCard
      title={t('dashboard.overview.activity.title')}
      action={{ label: t('dashboard.overview.activity.viewAll'), onClick: () => setActiveModule('financials') }}
    >
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          {t('dashboard.overview.activity.empty')}
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-slate-800">
          {transactions.map((txn) => {
            const inflow = txn.direction === 'inflow';
            return (
              <li key={txn.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span
                  className={`p-2 rounded-lg shrink-0 ${
                    inflow
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'
                  }`}
                >
                  {inflow ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground dark:text-dark-foreground truncate">
                    {txn.relatedEntityName || pickLocalized(txn.description)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{fDate(txn.date, 'medium')}</p>
                </div>
                <span
                  className={`text-sm font-semibold tabular-nums shrink-0 ${
                    inflow ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {inflow ? '+' : '−'}
                  {fCurrency(txn.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
};

export default RecentActivity;
