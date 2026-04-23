import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useCountUp } from '../../hooks/useCountUp';
import { formatCurrency, formatNumber } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    format: 'currency' | 'percentage' | 'number';
    trend: number;
    trendLabel?: string;
    colorClass?: string; // Kept for compatibility but not used
    positiveIsUp?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, format, trend, trendLabel, positiveIsUp = true }) => {
    const { t, language } = useLocalization();
    const animatedValue = useCountUp(value, 2000);

    const formattedValue = () => {
        switch (format) {
            case 'currency':
                return formatCurrency(animatedValue, language);
            case 'percentage':
                return `${animatedValue.toFixed(1)}%`;
            case 'number':
            default:
                return formatNumber(Math.round(animatedValue), language);
        }
    };

    const isStable = Math.abs(trend) < 0.1;
    const isPositive = positiveIsUp ? trend >= 0.1 : trend <= -0.1;
    
    const trendState = isStable ? 'stable' : isPositive ? 'up' : 'down';
    
    const trendColors = {
        up: {
            iconBg: 'bg-green-100 dark:bg-green-900/20',
            text: 'text-green-600',
            border: 'border-green-500',
            shadow: 'hover:shadow-green-500/20',
        },
        down: {
            iconBg: 'bg-red-100 dark:bg-red-900/20',
            text: 'text-red-600',
            border: 'border-red-500',
            shadow: 'hover:shadow-red-500/20',
        },
        stable: {
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
            text: 'text-yellow-600',
            border: 'border-yellow-500',
            shadow: 'hover:shadow-yellow-500/20',
        }
    };
    
    const colors = trendColors[trendState];
    const TrendIcon = isStable ? Minus : isPositive ? TrendingUp : TrendingDown;

    return (
        <div className={`bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft border-l-4 flex flex-col justify-between h-full transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${colors.border} ${colors.shadow}`}>
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
                    <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                        {React.cloneElement(icon as React.ReactElement, { className: `w-5 h-5 ${colors.text}` })}
                    </div>
                </div>
                <p className="text-4xl font-bold text-foreground dark:text-dark-foreground mt-2">{formattedValue()}</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold">
                <span className={colors.text}><TrendIcon size={14} /></span>
                <span className={colors.text}>{Math.abs(trend)}%</span>
                <span className="text-gray-500 dark:text-gray-400">{trendLabel || (isStable ? '' : t('dashboard.vsLastPeriod'))}</span>
            </div>
        </div>
    );
};

export default SummaryCard;