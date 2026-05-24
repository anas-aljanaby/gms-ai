import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useToast } from '../../../../hooks/useToast';
import type { Project } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { formatCurrency } from '../../../../lib/utils';
import { Pencil, Check, X } from 'lucide-react';

interface MonitoringTabProps {
    project: Project;
    onUpdate?: (updated: Project) => void;
}

const MonitoringTab: React.FC<MonitoringTabProps> = ({ project, onUpdate }) => {
    const { t, language } = useLocalization(['common', 'projects']);
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [progress, setProgress] = useState(project.progress);

    useEffect(() => {
        if (!isEditing) setProgress(project.progress);
    }, [project.progress, isEditing]);

    const taskStats = useMemo(() => {
        const stats = { pending: 0, inProgress: 0, completed: 0 };
        project.schedule.forEach(task => {
            if (task.progress === 100) stats.completed++;
            else if (task.progress > 0) stats.inProgress++;
            else stats.pending++;
        });
        return stats;
    }, [project.schedule]);

    const budgetUtilization = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;
    const activeRisks = project.riskManagement.riskRegister.filter(r => r.status !== 'closed').length;

    const start = new Date(project.plannedStartDate);
    const end = new Date(project.plannedEndDate);
    const today = new Date();
    const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
    const daysRemaining = Math.max(0, Math.round((end.getTime() - today.getTime()) / 86400000));

    const taskChartData = [
        { name: t('projects.reporting.modal.tasks.pending'), value: taskStats.pending },
        { name: t('projects.reporting.modal.tasks.inProgress'), value: taskStats.inProgress },
        { name: t('projects.reporting.modal.tasks.completed'), value: taskStats.completed },
    ];
    const TASK_COLORS = ['#6B7280', '#F59E0B', '#22C55E'];

    const handleSave = () => {
        const clamped = Math.min(100, Math.max(0, progress));
        onUpdate?.({ ...project, progress: clamped });
        setIsEditing(false);
        toast.showSuccess(t('projects.updateSuccess', 'Project updated successfully'));
    };

    const handleCancel = () => {
        setProgress(project.progress);
        setIsEditing(false);
    };

    const statCards = [
        {
            label: t('projects.monitoring.overallCompletion'),
            value: `${project.progress}%`,
            color: project.progress >= 75 ? 'text-emerald-600' : project.progress >= 40 ? 'text-blue-600' : 'text-amber-600',
        },
        {
            label: t('projects.monitoring.budgetStatus'),
            value: `${budgetUtilization}%`,
            sub: `${formatCurrency(project.spent, language)} / ${formatCurrency(project.budget, language)}`,
            color: budgetUtilization > 90 ? 'text-red-600' : 'text-foreground dark:text-dark-foreground',
        },
        {
            label: t('projects.monitoring.activeRisks'),
            value: String(activeRisks),
            color: activeRisks > 3 ? 'text-red-600' : activeRisks > 0 ? 'text-amber-600' : 'text-emerald-600',
        },
        {
            label: t('projects.reporting.modal.timeline.totalDays'),
            value: `${daysRemaining}d`,
            sub: t('projects.reporting.modal.timeline.elapsedDays') + `: ${totalDays - daysRemaining}`,
            color: daysRemaining < 14 ? 'text-red-600' : 'text-foreground dark:text-dark-foreground',
        },
    ];

    const inputClass = 'w-24 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-dark-foreground focus:ring-1 focus:ring-primary';

    return (
        <div className="space-y-6">
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{t('projects.monitoring.overallCompletion')}</h3>
                    {onUpdate && (
                        !isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                                <Pencil size={13} /> {t('common.edit')}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={handleCancel} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-red-600 rounded-lg">
                                    <X size={13} /> {t('common.cancel')}
                                </button>
                                <button onClick={handleSave} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-lg">
                                    <Check size={13} /> {t('common.save')}
                                </button>
                            </div>
                        )
                    )}
                </div>
                {!isEditing ? (
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{project.progress}%</p>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min={0}
                            max={100}
                            className={inputClass}
                            value={progress}
                            onChange={e => setProgress(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                        />
                        <span className="text-sm text-gray-500">%</span>
                    </div>
                )}
            </div>

            <AiCard title={t('projects.monitoring.kpis')}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map(card => (
                        <div key={card.label} className="bg-card dark:bg-dark-card/50 p-4 rounded-xl shadow-soft">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{card.label}</h4>
                            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                            {card.sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{card.sub}</p>}
                        </div>
                    ))}
                </div>
            </AiCard>

            <AiCard title={t('projects.monitoring.taskStatus')}>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={taskChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label>
                                {taskChartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={TASK_COLORS[index % TASK_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value} ${t('projects.monitoring.tasksUnit')}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </AiCard>
        </div>
    );
};

export default MonitoringTab;
