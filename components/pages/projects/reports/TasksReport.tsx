
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Project } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { formatNumber } from '../../../../lib/utils';

const TasksReport: React.FC<{ project: Project }> = ({ project }) => {
    const { t, language } = useLocalization();
    
    const taskStats = useMemo(() => {
        const stats = { pending: 0, inProgress: 0, completed: 0 };
        project.schedule.forEach(task => {
            if (task.progress === 100) stats.completed++;
            else if (task.progress > 0) stats.inProgress++;
            else stats.pending++;
        });
        return stats;
    }, [project.schedule]);

    const data = [
        { name: t('projects.reporting.modal.tasks.pending'), value: taskStats.pending },
        { name: t('projects.reporting.modal.tasks.inProgress'), value: taskStats.inProgress },
        { name: t('projects.reporting.modal.tasks.completed'), value: taskStats.completed },
    ];
    const COLORS = ['#6B7280', '#F59E0B', '#22C55E'];

    return (
        <div className="space-y-6">
            <div className="text-center border-b dark:border-slate-700 pb-4 mb-4">
                <h1 className="text-2xl font-bold">{project.name[language]}</h1>
                <p className="text-gray-500">{t('projects.reporting.modal.tasks.title')}</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                    <h3 className="font-bold text-lg mb-2">{t('projects.reporting.modal.tasks.taskSummary')}</h3>
                    <div className="text-sm space-y-2">
                        <p><strong>{t('projects.reporting.modal.tasks.pending')}:</strong> {formatNumber(taskStats.pending, language)}</p>
                        <p><strong>{t('projects.reporting.modal.tasks.inProgress')}:</strong> {formatNumber(taskStats.inProgress, language)}</p>
                        <p><strong>{t('projects.reporting.modal.tasks.completed')}:</strong> {formatNumber(taskStats.completed, language)}</p>
                        <p className="border-t dark:border-slate-700 pt-2 mt-2"><strong>{t('projects.reporting.modal.tasks.totalTasks')}:</strong> {formatNumber(project.schedule.length, language)}</p>
                    </div>
                </div>
                <div className="w-full h-64">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value: unknown) => {
                                const numericValue = Number(value);
                                if (isNaN(numericValue)) {
                                    return String(value);
                                }
                                return formatNumber(numericValue, language);
                            }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
             </div>
        </div>
    );
};
export default TasksReport;