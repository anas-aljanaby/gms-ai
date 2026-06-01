import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PiggyBank } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useFormatting } from '../../../hooks/useFormatting';
import { useFinancialOverview } from '../../../hooks/useFinancialOverview';
import DashboardCard from './DashboardCard';

interface FundAllocationProps {
  setActiveModule: (module: string) => void;
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4', '#ec4899'];

/**
 * FundAllocation - رسم دائري لتوزيع أرصدة الصناديق المالية الفعلية.
 */
const FundAllocation: React.FC<FundAllocationProps> = ({ setActiveModule }) => {
  const { t, pickLocalized } = useLocalization(['dashboard']);
  const { formatCurrency: fCurrency } = useFormatting();
  const { data, isLoading } = useFinancialOverview();

  const funds = (data?.funds ?? []).filter((f) => f.balance > 0);
  const chartData = funds.map((f) => ({ name: pickLocalized(f.name), value: f.balance }));
  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <DashboardCard
      title={t('dashboard.overview.funds.title')}
      action={{ label: t('dashboard.overview.funds.viewAll'), onClick: () => setActiveModule('financials') }}
    >
      {isLoading ? (
        <div className="h-64 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
      ) : chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500 dark:text-gray-400">
          <PiggyBank size={32} className="mb-2 opacity-60" />
          <p className="text-sm">{t('dashboard.overview.funds.empty')}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => fCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.overview.funds.total')}</span>
              <span className="text-lg font-bold text-foreground dark:text-dark-foreground">{fCurrency(total)}</span>
            </div>
          </div>
          <ul className="w-full mt-4 space-y-2">
            {chartData.map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-600 dark:text-gray-300 truncate">{d.name}</span>
                </span>
                <span className="font-semibold text-foreground dark:text-dark-foreground tabular-nums shrink-0">
                  {fCurrency(d.value)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardCard>
  );
};

export default FundAllocation;
