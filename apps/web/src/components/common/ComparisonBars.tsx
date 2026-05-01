import React, { useState, useEffect, useMemo } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { formatNumber } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ComparisonDataItem {
    label: string;
    value: number;
    year: number;
}

interface ComparisonBarsProps {
    data: ComparisonDataItem[];
    maxValue?: number;
    showPercentage?: boolean;
    animate?: boolean;
}

const ComparisonBars: React.FC<ComparisonBarsProps> = ({
    data,
    maxValue,
    showPercentage = true,
    animate = true,
}) => {
    const { dir, language } = useLocalization();
    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        if (animate) {
            const timer = setTimeout(() => setStartAnimation(true), 100);
            return () => clearTimeout(timer);
        }
    }, [animate]);

    const groupedData = useMemo(() => {
        const groups = new Map<string, { year: number; value: number }[]>();
        data.forEach(item => {
            if (!groups.has(item.label)) {
                groups.set(item.label, []);
            }
            groups.get(item.label)!.push({ year: item.year, value: item.value });
        });

        // For each group, sort by year descending to easily find latest and previous
        groups.forEach(values => {
            values.sort((a, b) => b.year - a.year);
        });

        return Array.from(groups.entries());
    }, [data]);

    const effectiveMaxValue = useMemo(() => {
        return maxValue || Math.max(...data.map(item => item.value), 0);
    }, [data, maxValue]);

    const getPercentageChange = (values: { year: number; value: number }[]) => {
        if (!showPercentage || values.length < 2) {
            return null;
        }
        const latest = values[0].value;
        const previous = values[1].value;
        if (previous === 0) return null; // Avoid division by zero
        const change = ((latest - previous) / previous) * 100;
        return change;
    };

    return (
        <div className="space-y-4">
            {groupedData.map(([label, values]) => {
                const latestData = values[0];
                const percentageChange = getPercentageChange(values);
                const barWidth = (latestData.value / effectiveMaxValue) * 100;
                const showValueInside = barWidth > 30;

                return (
                    <div key={label} className="flex items-center gap-2 md:gap-4">
                        <div className={`w-1/4 text-sm font-semibold text-gray-600 dark:text-gray-300 truncate ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                            {label}
                        </div>
                        <div className="w-2/4 relative h-6 md:h-8 bg-gray-200 dark:bg-slate-700 rounded-md">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md origin-left rtl:origin-right transition-transform duration-1000 ease-out"
                                style={{
                                    width: `${barWidth}%`,
                                    transform: startAnimation ? 'scaleX(1)' : 'scaleX(0)',
                                }}
                            >
                                {showValueInside && (
                                    <span className="absolute left-2 rtl:left-auto rtl:right-2 top-1/2 -translate-y-1/2 text-white font-bold text-xs md:text-sm">
                                        {formatNumber(latestData.value, language)}
                                    </span>
                                )}
                            </div>
                            {!showValueInside && (
                                <span className="absolute top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-200 font-bold text-xs md:text-sm" style={{ [dir === 'rtl' ? 'right' : 'left']: `calc(${barWidth}% + 0.5rem)` }}>
                                    {formatNumber(latestData.value, language)}
                                </span>
                            )}
                        </div>
                        <div className="w-1/4 text-xs md:text-sm">
                            {percentageChange !== null && (
                                <div className={`flex items-center gap-1 font-bold ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {percentageChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    <span>{Math.abs(percentageChange).toFixed(1)}%</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ComparisonBars;