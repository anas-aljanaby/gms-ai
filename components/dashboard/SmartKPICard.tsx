import React, { memo } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import type { Language } from '../../types';
import { formatNumber, formatCurrency } from '../../lib/utils';
import Sparkline from '../common/Sparkline';
import { CalendarIcon } from '../icons/ActionIcons';

interface SmartKPICardProps {
  title: Partial<Record<Language, string>>;
  value: number;
  icon: string; // Emoji
  changePercentage?: number;
  target?: number;
  daysRemaining?: number;
  trend?: number[];
  priority?: 'urgent' | 'warning' | 'neutral'; // For trend color
}

const SmartKPICard: React.FC<SmartKPICardProps> = memo(({ title, value, icon, changePercentage, target, daysRemaining, trend, priority }) => {
  const { language, t } = useLocalization();

  const renderChange = () => {
    if (changePercentage === undefined) return null;
    const isPositive = changePercentage > 0;
    const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
    const arrow = isPositive ? '↑' : '↓';
    return (
      <span className={`font-semibold ${colorClass}`}>
        {Math.abs(changePercentage)}% {arrow}
      </span>
    );
  };

  const trendColor = priority === 'urgent' ? '#ef4444' : priority === 'warning' ? '#f59e0b' : '#3b82f6'; // Changed neutral to primary blue
  const progress = target ? Math.round((value / target) * 100) : 0;

  return (
    <article className="relative bg-card dark:bg-dark-card p-4 rounded-2xl shadow-soft overflow-hidden h-full">
      {/* Background Sparkline for non-target cards */}
      {trend && !target && (
        <div className="absolute bottom-0 left-0 right-0 opacity-20 dark:opacity-10 pointer-events-none">
          <Sparkline data={trend} color={trendColor} width={180} height={60} />
        </div>
      )}

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top section: Title and Icon */}
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-600 dark:text-gray-400 pr-2">
              {title[language] || title.en}
            </h3>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
        
        {/* Bottom section: Value and details */}
        <div className="mt-2">
          {target ? (
            // Target-based KPI display
            <>
              <p className="text-3xl font-bold text-foreground dark:text-dark-foreground">
                {formatCurrency(value, language)}
              </p>
              <div className="mt-2">
                <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                  <span>{progress}%</span>
                  <span>{t('kpiCard.target', {target: formatCurrency(target, language)})}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-slate-700">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                {daysRemaining !== undefined && (
                   <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <CalendarIcon className="w-3 h-3"/>
                      <span>{formatNumber(daysRemaining, language)} {t('kpiCard.daysRemaining')}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Value-based KPI display
            <div className="text-left rtl:text-right">
              <p className="text-4xl lg:text-5xl font-bold text-foreground dark:text-dark-foreground leading-none">
                {formatNumber(value, language)}
              </p>
              {renderChange()}
            </div>
          )}
        </div>
      </div>
    </article>
  );
});

export default SmartKPICard;
