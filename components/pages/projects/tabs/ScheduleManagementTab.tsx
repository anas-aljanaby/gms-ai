
import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project } from '../../../../types';
import AiCard from '../../ai/AiCard';

interface ScheduleManagementTabProps {
    project: Project;
}

const ScheduleManagementTab: React.FC<ScheduleManagementTabProps> = ({ project }) => {
    const { t } = useLocalization();

    // Gantt chart library would be integrated here.
    // This is a placeholder visualization.
    return (
        <div className="space-y-6">
            <AiCard title={t('projects.schedule.gantt')}>
                <div className="space-y-2">
                    {project.schedule.map(task => (
                        <div key={task.id} className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-slate-800 rounded-md">
                            <div className="w-1/3 font-semibold truncate">{task.name}</div>
                            <div className="w-2/3">
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 relative">
                                    <div 
                                        className="bg-primary h-4 rounded-full" 
                                        style={{ width: `${task.progress}%` }}
                                    ></div>
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
                                        {task.start} &rarr; {task.end}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </AiCard>
        </div>
    );
};

export default ScheduleManagementTab;
