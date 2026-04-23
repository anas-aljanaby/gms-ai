import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { Check } from 'lucide-react';

const OnboardingChecklist: React.FC = () => {
    const { t } = useLocalization();

    const allTasks = [
        { id: 'tour', textKey: 'onboarding.checklist.tour' },
        { id: 'customize', textKey: 'onboarding.checklist.customize' },
        { id: 'report', textKey: 'onboarding.checklist.report' },
        { id: 'help', textKey: 'onboarding.checklist.help' },
    ];

    const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
        try {
            const saved = localStorage.getItem('onboardingChecklist');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch {
            return new Set();
        }
    });

    useEffect(() => {
        localStorage.setItem('onboardingChecklist', JSON.stringify(Array.from(completedTasks)));
    }, [completedTasks]);

    const handleToggle = (taskId: string) => {
        setCompletedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };
    
    const progress = Math.round((completedTasks.size / allTasks.length) * 100);

    return (
        <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4">{t('onboarding.checklist.title')}</h3>
            
            <div className="flex items-center gap-4 mb-4">
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div 
                        className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <span className="font-bold text-primary dark:text-secondary">{progress}%</span>
            </div>

            <div className="space-y-3">
                {allTasks.map(task => (
                    <label key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50">
                        <input 
                            type="checkbox" 
                            checked={completedTasks.has(task.id)}
                            onChange={() => handleToggle(task.id)}
                            className="w-5 h-5 text-primary rounded-md border-gray-300 focus:ring-primary-dark"
                        />
                        <span className={`text-sm font-medium ${completedTasks.has(task.id) ? 'line-through text-gray-500' : 'text-foreground dark:text-dark-foreground'}`}>
                            {t(task.textKey)}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default OnboardingChecklist;