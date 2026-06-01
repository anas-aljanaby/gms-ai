import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useLocalization } from '../../../hooks/useLocalization';
import { useFormatting } from '../../../hooks/useFormatting';
import { useTheme } from '../../../hooks/useTheme';
import { useFinancialOverview } from '../../../hooks/useFinancialOverview';
import DashboardCard from './DashboardCard';

interface RevenueExpensesChartProps {
  setActiveModule: (module: string) => void;
}

/**
 * RevenueExpensesChart - رسم بياني للإيرادات مقابل المصروفات خلال 12 شهرًا من بيانات فعلية.
 */
const RevenueExpensesChart: React.FC<RevenueExpensesChartProps> = ({ setActiveModule }) => {
  const { t, language } = useLocalization(['dashboard']);
  const { formatCurrency: fCurrency } = useFormatting();
  const { theme } = useTheme();
  const { data, isLoading } = useFinancialOverview();

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const chartData = (data?.monthlyData ?? []).map((m) => ({
    ...m,
    label: new Date(`${m.month}-01`).toLocaleDateString(language === 'ar' ? 'ar' : 'en', { month: 'short' }),
  }));

  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-slate-700 shadow-lg text-sm">
        <p className="font-semibold text-foreground dark:text-dark-foreground mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {t(`dashboard.overview.revenueChart.${entry.dataKey}`)}: {fCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <DashboardCard
      title={t('dashboard.overview.revenueChart.title')}
      subtitle={t('dashboard.overview.revenueChart.subtitle')}
      action={{ label: t('dashboard.overview.revenueChart.viewAll'), onClick: () => setActiveModule('financials') }}
    >
      <div className="h-72">
        {isLoading ? (
          <div className="h-full rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="label" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={70}
                tickFormatter={(v) => fCurrency(Number(v))}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t(`dashboard.overview.revenueChart.${value}`)}
                  </span>
                )}
              />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardCard>
  );
};

export default RevenueExpensesChart;
