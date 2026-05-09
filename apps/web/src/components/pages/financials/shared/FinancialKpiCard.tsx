import React from 'react';

interface FinancialKpiCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const FinancialKpiCard: React.FC<FinancialKpiCardProps> = ({
  title,
  value,
  icon: Icon,
  colorClass,
  bgClass,
  trend,
}) => {
  return (
    <div className="bg-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-slate-700/50 p-4 flex items-center gap-4">
      <div className={`p-2.5 rounded-lg ${bgClass}`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground dark:text-dark-foreground">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
        {trend && (
          <p
            className={`text-xs font-medium mt-0.5 ${
              trend.isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {trend.isPositive ? '▲' : '▼'} {Math.abs(trend.value)}%
          </p>
        )}
      </div>
    </div>
  );
};

export default FinancialKpiCard;
