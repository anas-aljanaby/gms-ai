import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import type { Language } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';

interface TimelineViewProps {
  progress: number;
  setProgress: (value: number) => void;
}

const cardDetails = [
    { key: "prospect", emoji: "🔭", stats: 12, colorClasses: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" },
    { key: "observer", emoji: "👀", stats: 7, colorClasses: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300" },
    { key: "engager", emoji: "🤝", stats: 5, colorClasses: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" },
    { key: "contributor", emoji: "💸", stats: 3, colorClasses: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300" },
    { key: "giver", emoji: "💚", stats: 3, colorClasses: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" },
    { key: "advocate", emoji: "🗣️", stats: 2, colorClasses: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" },
    { key: "multiplier", emoji: "✨", stats: 2, colorClasses: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" },
];


const Step: React.FC<{ label: string; status: 'completed' | 'current' | 'upcoming' }> = ({ label, status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-green-500 border-green-500',
          icon: <Check className="w-4 h-4 text-white" />,
          label: 'text-green-600 dark:text-green-400 font-semibold',
        };
      case 'current':
        return {
          circle: 'bg-primary border-primary ring-4 ring-primary/20 animate-pulse',
          icon: <div className="w-2 h-2 bg-white rounded-full"></div>,
          label: 'text-primary dark:text-secondary font-semibold',
        };
      case 'upcoming':
      default:
        return {
          circle: 'bg-gray-200 dark:bg-slate-600 border-gray-200 dark:border-slate-600',
          icon: null,
          label: 'text-gray-400 dark:text-slate-500',
        };
    }
  };

  const { circle, icon, label: labelClass } = getStatusClasses();

  return (
    <div className="flex flex-col items-center gap-2 z-10 w-16 md:w-20">
      <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${circle}`}>
        {icon}
      </div>
      <span className={`text-xs sm:text-sm text-center font-medium ${labelClass}`}>{label}</span>
    </div>
  );
};

const TimelineView: React.FC<TimelineViewProps> = ({ progress, setProgress }) => {
  const { t, language } = useLocalization();
  const isRTL = language === 'ar';
  
  const stepsResult = t('timeline.steps', { returnObjects: true });
  const steps = Array.isArray(stepsResult) ? stepsResult : [];
  
  const numSegments = steps.length > 1 ? steps.length - 1 : 1;
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);
  
  const getStatusForStep = (index: number) => {
      if (steps.length === 0) return 'upcoming';

      let status: 'completed' | 'current' | 'upcoming';
      const stepPosition = (index / numSegments) * 100;
      
      if (progress > stepPosition) {
          status = 'completed';
      } else if (progress === stepPosition) {
          status = 'current';
      } else {
          status = 'upcoming';
      }
      
      const prevStepPosition = index > 0 ? ((index - 1) / numSegments) * 100 : 0;
      if(progress > prevStepPosition && progress < stepPosition) {
           if (Math.abs(progress - stepPosition) > Math.abs(progress - prevStepPosition) ) {
              // closer to previous step, so this one is upcoming
           } else {
              status = 'current';
           }
      }

      if(progress === 100) status = 'completed';
      if(progress < (100 / numSegments / 2) && index === 0) status = 'current';
      
      return status;
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="p-4 md:p-6 gap-4 flex flex-col bg-card dark:bg-dark-card rounded-2xl shadow-soft">
      {/* Desktop Timeline */}
      <div className="hidden md:block relative w-full pt-6 pb-4 px-4">
        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700 mx-4">
             <div
                className={`absolute top-1/2 -translate-y-1/2 h-4 bg-primary/20 transition-all duration-300 ease-out z-[1] rounded-full ${isRTL ? 'right-0' : 'left-0'}`}
                style={{ width: `${animatedProgress}%` }}
            ></div>
        </div>
        <div className="relative flex justify-between items-start mt-4">
          {steps.map((label, index) => (
            <Step key={index} label={label} status={getStatusForStep(index)} />
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="block md:hidden">
          <div className="relative h-[450px] py-4">
              <div className={`absolute top-0 bottom-0 w-1 bg-gray-200 dark:bg-slate-700 ${isRTL ? 'right-4' : 'left-4'}`}>
                   <div
                        className={`absolute w-full bg-primary/20 transition-all duration-300 ease-out z-[1] rounded-full top-0`}
                        style={{ height: `${animatedProgress}%` }}
                    ></div>
              </div>
              <div className="relative flex flex-col justify-between h-full">
                 {steps.map((label, index) => (
                    <div key={index} className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                         <Step label={label} status={getStatusForStep(index)} />
                    </div>
                ))}
              </div>
          </div>
      </div>
      
      <div className="px-4 pt-4">
          <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full"
          />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-4 pt-4">
          {cardDetails.map((card, index) => {
              const stepPosition = (index / (cardDetails.length - 1)) * 100;
              const isActive = progress >= stepPosition;
              const stepLabel = steps[index] || card.key;
              return (
                  <div key={card.key} className={`p-3 rounded-lg text-center transition-all duration-300 ${card.colorClasses} ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                      <div className="text-2xl">{card.emoji}</div>
                      <div className="text-xs font-semibold">{stepLabel}</div>
                      <div className="text-lg font-bold">{card.stats}</div>
                  </div>
              );
          })}
      </div>
    </div>
  );
};

export default TimelineView;
