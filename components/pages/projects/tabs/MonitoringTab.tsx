
import React, { useMemo } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { formatCurrency, formatNumber } from '../../../../lib/utils';
import { useTheme } from '../../../../hooks/useTheme';

interface MonitoringTabProps {
    project: Project;
}

const KpiCard: React.FC<{ title: string; value: number; interpretation: string; positive: boolean }> = ({ title, value, interpretation, positive }) => (
    <div className={`p-4 rounded-xl shadow-soft border-l-4 ${positive ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h4>
        <p className={`text-3xl font-bold ${positive ? 'text-green-600' : 'text-red-600'}`}>{value.toFixed(2)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{interpretation}</p>
    </div>
);


const MonitoringTab: React.FC<MonitoringTabProps> = ({ project }) => {
    const { t, language } = useLocalization();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { financialSummary } = project.costManagement;

    const taskStats = useMemo(() => {
        const stats = { pending: 0, inProgress: 0, completed: 0 };
        project.schedule.forEach(task => {
            if (task.progress === 100) stats.completed++;
            else if (task.progress > 0) stats.inProgress++;
            else stats.pending++;
        });
        return stats;
    }, [project.schedule]);

    const taskChartData = [
        { name: t('projects.reporting.modal.tasks.pending'), value: taskStats.pending },
        { name: t('projects.reporting.modal.tasks.inProgress'), value: taskStats.inProgress },
        { name: t('projects.reporting.modal.tasks.completed'), value: taskStats.completed },
    ];
    const TASK_COLORS = ['#6B7280', '#F59E0B', '#22C55E'];

    return (
        <div className="space-y-6">
            <AiCard title={t('projects.monitoring.kpis')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard title={t('projects.monitoring.spi')} value={financialSummary.spi} interpretation={financialSummary.spi >= 1 ? t('projects.monitoring.spiGood') : t('projects.monitoring.spiBad')} positive={financialSummary.spi >= 1} />
                    <KpiCard title={t('projects.monitoring.cpi')} value={financialSummary.cpi} interpretation={financialSummary.cpi >= 1 ? t('projects.monitoring.cpiGood') : t('projects.monitoring.cpiBad')} positive={financialSummary.cpi >= 1} />
                    <div className="bg-card dark:bg-dark-card/50 p-4 rounded-xl shadow-soft">
                        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t('projects.monitoring.overallCompletion')}</h4>
                        <p className="text-3xl font-bold text-primary dark:text-secondary">{project.progress}%</p>
                    </div>
                     <div className="bg-card dark:bg-dark-card/50 p-4 rounded-xl shadow-soft">
                        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t('projects.monitoring.budgetStatus')}</h4>
                        <p className="text-3xl font-bold">{formatCurrency(project.spent, language)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('common.of')} {formatCurrency(project.budget, language)}</p>
                    </div>
                </div>
            </AiCard>
            <AiCard title={t('projects.monitoring.evmChart')}>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={project.monitoring.evmHistory} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#ddd"}/>
                            <XAxis dataKey="month" tick={{ fill: isDark ? "#fff" : "#333" }} />
                            <YAxis tickFormatter={(val) => formatCurrency(val, language)} tick={{ fill: isDark ? "#fff" : "#333", fontSize: 12 }} />
                            <Tooltip formatter={(value: unknown) => {
                                const numericValue = Number(value);
                                if (isNaN(numericValue)) {
                                    return String(value);
                                }
                                return formatCurrency(numericValue, language);
                            }} />
                            <Legend />
                            <Line type="monotone" dataKey="pv" name={t('projects.monitoring.pv')} stroke="#8884d8" strokeWidth={2} />
                            <Line type="monotone" dataKey="ev" name={t('projects.monitoring.ev')} stroke="#82ca9d" strokeWidth={2} />
                            <Line type="monotone" dataKey="ac" name={t('projects.monitoring.ac')} stroke="#ffc658" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </AiCard>
            <AiCard title={t('projects.monitoring.taskStatus')}>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={taskChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label>
                                {taskChartData.map((entry, index) => (
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