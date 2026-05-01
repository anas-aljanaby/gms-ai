
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Project } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { formatCurrency } from '../../../../lib/utils';
import { useTheme } from '../../../../hooks/useTheme';

const BudgetReport: React.FC<{ project: Project }> = ({ project }) => {
    const { t, language } = useLocalization();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const remaining = project.budget - project.spent;
    const data = [
      { name: t('projects.reporting.modal.budget.totalBudget'), value: project.budget, fill: '#8884d8' },
      { name: t('projects.reporting.modal.budget.actualSpent'), value: project.spent, fill: '#82ca9d' },
      { name: t('projects.reporting.modal.budget.remaining'), value: remaining, fill: '#ffc658' },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center border-b dark:border-slate-700 pb-4 mb-4">
                <h1 className="text-2xl font-bold">{project.name[language]}</h1>
                <p className="text-gray-500">{t('projects.reporting.modal.budget.title')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                    <h3 className="font-bold text-lg mb-2">{t('projects.reporting.modal.budget.financialSummary')}</h3>
                    <div className="text-sm space-y-2">
                        <p><strong>{t('projects.reporting.modal.budget.totalBudget')}:</strong> {formatCurrency(project.budget, language)}</p>
                        <p><strong>{t('projects.reporting.modal.budget.actualSpent')}:</strong> {formatCurrency(project.spent, language)}</p>
                        <p className="border-t dark:border-slate-700 pt-2 mt-2"><strong>{t('projects.reporting.modal.budget.remaining')}:</strong> <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(remaining, language)}</span></p>
                    </div>
                </div>
                <div className="w-full h-64">
                    <h3 className="font-bold text-lg mb-2 text-center">{t('projects.reporting.modal.budget.budgetBreakdown')}</h3>
                     <ResponsiveContainer>
                        <BarChart data={data} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#ddd"} />
                            <XAxis type="number" tickFormatter={(value) => formatCurrency(Number(value), language)} tick={{ fill: isDark ? "#fff" : "#333", fontSize: 10 }}/>
                            <YAxis type="category" dataKey="name" width={120} tick={{ fill: isDark ? "#fff" : "#333", fontSize: 12 }} />
                            <Tooltip formatter={(value: unknown) => {
                                const numericValue = Number(value);
                                if (isNaN(numericValue)) {
                                    return String(value);
                                }
                                return formatCurrency(numericValue, language);
                            }} />
                            <Bar dataKey="value" fill="#8884d8">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
export default BudgetReport;