
import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

interface ScheduleManagementTabProps {
    project: Project;
}

const progressColor = (progress: number) => {
    if (progress === 100) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-amber-500';
    return 'bg-gray-200 dark:bg-slate-700';
};

const statusIcon = (progress: number) => {
    if (progress === 100) return <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />;
    if (progress > 0) return <Clock size={14} className="text-amber-500 shrink-0" />;
    return <Circle size={14} className="text-gray-300 dark:text-slate-600 shrink-0" />;
};

const ScheduleManagementTab: React.FC<ScheduleManagementTabProps> = ({ project }) => {
    const { t } = useLocalization();

    return (
        <div className="space-y-6">
            <AiCard title={t('projects.schedule.gantt')}>
                <div className="space-y-1">
                    <div className="grid grid-cols-[1fr_2fr_100px] gap-4 px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700/50">
                        <span>{t('projects.schedule.task', 'Task')}</span>
                        <span>{t('projects.schedule.timeline', 'Timeline')}</span>
                        <span className="text-end">{t('projects.list.progress')}</span>
                    </div>
                    {project.schedule.map(task => (
                        <div key={task.id} className="grid grid-cols-[1fr_2fr_100px] gap-4 items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                            <div className="flex items-center gap-2 min-w-0">
                                {statusIcon(task.progress)}
                                <span className="text-sm font-medium text-foreground dark:text-dark-foreground truncate">{task.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${progressColor(task.progress)}`}
                                        style={{ width: `${Math.max(task.progress, 2)}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">{task.start} → {task.end}</span>
                            </div>
                            <span className="text-sm font-semibold text-end text-foreground dark:text-dark-foreground">{task.progress}%</span>
                        </div>
                    ))}
                </div>
            </AiCard>
        </div>
    );
};

export default ScheduleManagementTab;
