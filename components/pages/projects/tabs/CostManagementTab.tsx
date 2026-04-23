
import React, { useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { formatCurrency, formatDate } from '../../../../lib/utils';
import { useTheme } from '../../../../hooks/useTheme';

interface CostManagementTabProps {
    project: Project;
    isInitiallyActive?: boolean;
}

const KpiCard: React.FC<{ title: string; value: string; colorClass: string }> = ({ title, value, colorClass }) => (
    <div className="bg-card dark:bg-dark-card/50 p-4 rounded-xl shadow-soft">
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h4>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

const CostManagementTab: React.FC<CostManagementTabProps> = ({ project, isInitiallyActive }) => {
    const { t, language } = useLocalization();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const kpiCardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isInitiallyActive && kpiCardRef.current) {
            kpiCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            kpiCardRef.current.classList.add('animate-pulse-fast', 'ring-4', 'ring-red-500', 'transition-all', 'duration-500');
            setTimeout(() => {
                kpiCardRef.current?.classList.remove('animate-pulse-fast', 'ring-4', 'ring-red-500');
            }, 4000);
        }
    }, [isInitiallyActive]);

    const remainingBudget = project.budget - project.spent;
    const budgetData = project.costManagement.budgetDetails.map(item => ({
        name: t(`projects.cost.categories.${item.category}`),
        Planned: item.planned,
        Actual: item.actual,
    }));

    return (
        <div className="space-y-6">
            <AiCard title={t('projects.cost.dashboard')} ref={kpiCardRef}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard title={t('projects.cost.totalBudget')} value={formatCurrency(project.budget, language)} colorClass="text-foreground dark:text-dark-foreground" />
                    <KpiCard title={t('projects.cost.totalSpent')} value={formatCurrency(project.spent, language)} colorClass="text-orange-500" />
                    <KpiCard title={t('projects.cost.remaining')} value={formatCurrency(remainingBudget, language)} colorClass={remainingBudget > 0 ? "text-green-500" : "text-red-500"} />
                    <KpiCard title={t('projects.cost.earnedValue')} value={formatCurrency(project.costManagement.financialSummary.ev, language)} colorClass="text-purple-500" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div>
                        <h4 className="font-semibold mb-2">{t('projects.cost.plannedVsActual')}</h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={budgetData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#ddd"} />
                                    <XAxis dataKey="name" tick={{ fill: isDark ? "#fff" : "#333", fontSize: 12 }} />
                                    <YAxis tickFormatter={(val) => formatCurrency(Number(val), language).replace('$', '$/k')} tick={{ fill: isDark ? "#fff" : "#333" }} />
                                    <Tooltip formatter={(value: unknown) => {
                                        const numericValue = Number(value);
                                        if (isNaN(numericValue)) {
                                            return String(value);
                                        }
                                        return formatCurrency(numericValue, language);
                                    }} />
                                    <Legend />
                                    <Bar dataKey="Planned" fill="#8884d8" />
                                    <Bar dataKey="Actual" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">{t('projects.cost.burnRate')}</h4>
                        <div className="h-64">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={project.costManagement.financialSummary.burnRate}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#ddd"} />
                                <XAxis dataKey="month" tick={{ fill: isDark ? "#fff" : "#333", fontSize: 12 }}/>
                                <YAxis tickFormatter={(val) => formatCurrency(Number(val), language)} tick={{ fill: isDark ? "#fff" : "#333" }}/>
                                <Tooltip formatter={(value: unknown) => {
                                    const numericValue = Number(value);
                                    if (isNaN(numericValue)) {
                                        return String(value);
                                    }
                                    return formatCurrency(numericValue, language);
                                }} />
                                <Legend />
                                <Line type="monotone" dataKey="value" name="Spent" stroke="#ef4444" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </AiCard>

            <AiCard title={t('projects.cost.detailedBudget')}>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="p-2">{t('projects.cost.category')}</th>
                                <th className="p-2 text-right">{t('projects.cost.planned')}</th>
                                <th className="p-2 text-right">{t('projects.cost.actual')}</th>
                                <th className="p-2 text-right">{t('projects.cost.variance')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project.costManagement.budgetDetails.map(item => {
                                const variance = item.planned - item.actual;
                                return (
                                <tr key={item.category} className="border-t dark:border-slate-700">
                                    <td className="p-2 font-semibold">{t(`projects.cost.categories.${item.category}`)}</td>
                                    <td className="p-2 text-right">{formatCurrency(item.planned, language)}</td>
                                    <td className="p-2 text-right">{formatCurrency(item.actual, language)}</td>
                                    <td className={`p-2 text-right font-semibold ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(variance, language)}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </AiCard>
             <AiCard title={t('projects.cost.expenseLog')}>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="p-2">{t('projects.cost.date')}</th>
                                <th className="p-2">{t('projects.cost.description')}</th>
                                <th className="p-2">{t('projects.cost.category')}</th>
                                <th className="p-2">{t('projects.cost.wbs_link')}</th>
                                <th className="p-2 text-right">{t('projects.cost.amount')}</th>
                            </tr>
                        </thead>
                         <tbody>
                             {project.costManagement.expenseLog.map(item => (
                                <tr key={item.id} className="border-t dark:border-slate-700">
                                    <td className="p-2">{formatDate(item.date, language)}</td>
                                    <td className="p-2">{item.description}</td>
                                    <td className="p-2">{t(`projects.cost.categories.${item.category}`)}</td>
                                    <td className="p-2 text-xs font-mono">{item.wbsId}</td>
                                    <td className="p-2 text-right font-semibold">{formatCurrency(item.amount, language)}</td>
                                </tr>
                             ))}
                         </tbody>
                    </table>
                </div>
            </AiCard>
        </div>
    );
};

export default CostManagementTab;