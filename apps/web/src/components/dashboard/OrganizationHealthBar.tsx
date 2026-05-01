import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { TrendingUp, DollarSign, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Language } from '../../types';

const OrganizationHealthBar: React.FC = () => {
  const { t, language, setLanguage, dir } = useLocalization();
  
  const indicatorKeys = [
    "overall_performance",
    "financial_stability",
    "donor_retention",
    "project_success",
    "volunteer_engagement"
  ];

  const iconMap: Record<string, React.ElementType> = {
    overall_performance: TrendingUp,
    financial_stability: DollarSign,
    donor_retention: Users,
    project_success: CheckCircle,
    volunteer_engagement: AlertTriangle,
  };

  const indicators = React.useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      key: indicatorKeys[i],
      value: Math.floor(Math.random() * (100 - 40 + 1)) + 40,
    }));
  }, [language]); // Depend on language to re-randomize on lang change for demo

  const [animatedValues, setAnimatedValues] = useState<Record<number, number>>({});

  useEffect(() => {
    if (indicators.length === 0) return;
    
    const initialValues: Record<number, number> = {};
    indicators.forEach(indicator => {
      initialValues[indicator.id] = 0;
    });
    setAnimatedValues(initialValues);

    const timer = setTimeout(() => {
      const finalValues: Record<number, number> = {};
      indicators.forEach(indicator => {
        finalValues[indicator.id] = indicator.value;
      });
      setAnimatedValues(finalValues);
    }, 100);

    return () => clearTimeout(timer);
  }, [indicators]);

  const getColor = (value: number) => {
    if (value > 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatus = (value: number): string => {
    if (value > 80) return 'statusExcellent';
    if (value >= 60) return 'statusGood';
    if (value >= 40) return 'statusAverage';
    return 'statusWeak';
  };

  return (
    <div dir={dir} className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-foreground dark:text-dark-foreground">
          {t('matrix.title')}
        </h1>
        <div className="flex gap-2">
            {(['en', 'ar'] as Language[]).map((lang) => (
                <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                        language === lang
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600'
                    }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        {indicators.map((indicator) => {
          const colorClass = getColor(indicator.value);
          const statusKey = getStatus(indicator.value);
          const statusText = t(`health_bar.${statusKey}`);
          const Icon = iconMap[indicator.key];
          const indicatorText = t(`health_bar.${indicator.key}`);

          return (
            <div key={indicator.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-300">
                  {Icon && <Icon className="w-6 h-6" />}
                  {indicatorText}
                </span>
                <span className="text-sm font-medium text-blue-500 dark:text-blue-400">
                  {indicator.value}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-5 dark:bg-slate-700">
                <div 
                  className={`${colorClass} h-5 rounded-full transition-all duration-[1500ms] ease-out`} 
                  style={{ width: `${animatedValues[indicator.id] || 0}%` }}
                ></div>
              </div>
              <div className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                {statusText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrganizationHealthBar;