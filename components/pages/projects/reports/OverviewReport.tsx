
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Project } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { formatCurrency, formatDate } from '../../../../lib/utils';
import { useTheme } from '../../../../hooks/useTheme';

const OverviewReport: React.FC<{ project: Project }> = ({ project }) => {
    const { t, language } = useLocalization();
    const { theme } = useTheme();

    const data = [
        { name: t('projects.reporting.modal.budget.spent'), value: project.spent },
        { name: t('projects.reporting.modal.budget.remaining'), value: project.budget - project.spent },
    ];
    const COLORS = ['#ef4444', '#22c55e'];

    return (
        <div className="space-y-6">
            <div className="text-center border-b dark:border-slate-700 pb-4 mb-4">
                <h1 className="text-2xl font-bold">{project.name[language]}</h1>
                <p className="text-gray-500">{t('projects.reporting.modal.overview.title')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                    <h3 className="font-bold text-lg mb-2">{t('projects.reporting.modal.overview.projectInfo')}</h3>
                    <div className="text-sm space-y-1">
                        <p><strong>ID:</strong> {project.id}</p>
                        <p><strong>{t('projects.reporting.modal.overview.manager')}:</strong> {project.stakeholders.primaryContact}</p>
                        <p><strong>{t('projects.reporting.modal.overview.dates')}:</strong> {formatDate(project.plannedStartDate, language)} - {formatDate(project.plannedEndDate, language)}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="font-bold text-lg mb-2">{t('projects.reporting.modal.overview.budgetVsSpent')}</h3>
                    <div className="w-full h-48">
                         <ResponsiveContainer>
                            <PieChart>
                                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: unknown) => {
                                    const numericValue = Number(value);
                                    if (isNaN(numericValue)) {
                                        return String(value);
                                    }
                                    return formatCurrency(numericValue, language);
                                }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OverviewReport;