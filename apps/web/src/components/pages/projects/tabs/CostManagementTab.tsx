
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { formatCurrency, formatDate, formatNumber } from '../../../../lib/utils';
import { useTheme } from '../../../../hooks/useTheme';
import { PlusCircle, X, Check, Pencil } from 'lucide-react';
import { useProjectExpenses } from '../../../../hooks/useProjects';
import { useToast } from '../../../../hooks/useToast';

interface CostManagementTabProps {
    project: Project;
    isInitiallyActive?: boolean;
    onUpdate?: (updated: Project) => void;
}

interface ExpenseForm {
    date: string;
    description: string;
    category: string;
    amount: string;
}

const EXPENSE_CATEGORIES = ['equipment', 'salaries', 'travel', 'other'];

const emptyExpenseForm = (): ExpenseForm => ({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'other',
    amount: '',
});

const CHART_PANEL_CLASSNAME = 'rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/30 sm:p-5';
const CHART_GRID_COLOR = '#e5e7eb';
const CHART_GRID_COLOR_DARK = '#334155';

const formatAxisCurrency = (value: number, language: 'en' | 'ar') => {
    const absoluteValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absoluteValue >= 1000) {
        const compactValue = absoluteValue >= 100000
            ? Math.round(absoluteValue / 1000)
            : Number((absoluteValue / 1000).toFixed(1));
        return `${sign}$${formatNumber(compactValue, language, { maximumFractionDigits: 1 })}k`;
    }

    return `${sign}$${formatNumber(absoluteValue, language, { maximumFractionDigits: 0 })}`;
};

const KpiCard: React.FC<{ title: string; value: string; colorClass: string }> = ({ title, value, colorClass }) => (
    <div className="bg-card dark:bg-dark-card/50 p-4 rounded-xl shadow-soft">
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h4>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

const CostManagementTab: React.FC<CostManagementTabProps> = ({ project, isInitiallyActive, onUpdate }) => {
    const { t, language } = useLocalization(['common', 'projects']);
    const { theme } = useTheme();
    const toast = useToast();
    const { data: expenses = project.costManagement.expenseLog, createExpense } = useProjectExpenses(project.id);
    const isDark = theme === 'dark';
    const kpiCardRef = useRef<HTMLDivElement>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<ExpenseForm>(emptyExpenseForm());
    const [isBudgetEditing, setIsBudgetEditing] = useState(false);
    const [budget, setBudget] = useState(project.budget);

    useEffect(() => {
        if (!isBudgetEditing) setBudget(project.budget);
    }, [project.budget, isBudgetEditing]);

    useEffect(() => {
        if (isInitiallyActive && kpiCardRef.current) {
            kpiCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            kpiCardRef.current.classList.add('animate-pulse-fast', 'ring-4', 'ring-red-500', 'transition-all', 'duration-500');
            setTimeout(() => {
                kpiCardRef.current?.classList.remove('animate-pulse-fast', 'ring-4', 'ring-red-500');
            }, 4000);
        }
    }, [isInitiallyActive]);

    const handleSave = async () => {
        const amount = parseFloat(form.amount);
        if (!form.description.trim() || isNaN(amount) || amount <= 0) return;
        try {
            await createExpense({
                date: form.date,
                description: form.description.trim(),
                category: form.category,
                amount,
            });
            setModalOpen(false);
            setForm(emptyExpenseForm());
        } catch {
            toast.showError(t('common.error', 'Something went wrong. Please try again.'));
        }
    };

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = budget - totalSpent;
    const budgetData = useMemo(() => (
        project.costManagement.budgetDetails.map(item => ({
            name: t(`projects.cost.categories.${item.category}`, item.category),
            planned: item.planned,
            actual: item.actual,
        }))
    ), [project.costManagement.budgetDetails, t]);
    const burnRateData = useMemo(() => {
        if (project.costManagement.financialSummary.burnRate.length > 0) {
            return project.costManagement.financialSummary.burnRate;
        }

        if (expenses.length === 0) {
            return [];
        }

        const groupedExpenses = new Map<string, number>();
        expenses.forEach((expense) => {
            const bucket = expense.date.slice(0, 7);
            groupedExpenses.set(bucket, (groupedExpenses.get(bucket) ?? 0) + expense.amount);
        });

        return Array.from(groupedExpenses.entries())
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([bucket, value]) => ({
                month: new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US', { month: 'short' }).format(new Date(`${bucket}-01T00:00:00`)),
                value,
            }));
    }, [expenses, language, project.costManagement.financialSummary.burnRate]);
    const hasBurnRateData = burnRateData.length > 0;

    const handleBudgetSave = () => {
        onUpdate?.({ ...project, budget: Math.max(0, budget) });
        setIsBudgetEditing(false);
        toast.showSuccess(t('projects.updateSuccess', 'Project updated successfully'));
    };

    const handleBudgetCancel = () => {
        setBudget(project.budget);
        setIsBudgetEditing(false);
    };

    const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-dark-foreground focus:ring-1 focus:ring-primary";
    const labelClass = "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1";

    return (
        <div className="space-y-6">
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{t('projects.cost.totalBudget')}</h3>
                    {onUpdate && (
                        !isBudgetEditing ? (
                            <button onClick={() => setIsBudgetEditing(true)} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                                <Pencil size={13} /> {t('common.edit')}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={handleBudgetCancel} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-red-600 rounded-lg">
                                    <X size={13} /> {t('common.cancel')}
                                </button>
                                <button onClick={handleBudgetSave} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-lg">
                                    <Check size={13} /> {t('common.save')}
                                </button>
                            </div>
                        )
                    )}
                </div>
                {!isBudgetEditing ? (
                    <p className="text-2xl font-bold text-foreground dark:text-dark-foreground">{formatCurrency(project.budget, language)}</p>
                ) : (
                    <input
                        type="number"
                        min={0}
                        className={`${inputClass} max-w-xs`}
                        value={budget}
                        onChange={e => setBudget(Number(e.target.value) || 0)}
                    />
                )}
            </div>

            <AiCard title={t('projects.cost.dashboard')} ref={kpiCardRef}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard title={t('projects.cost.totalBudget')} value={formatCurrency(budget, language)} colorClass="text-foreground dark:text-dark-foreground" />
                    <KpiCard title={t('projects.cost.totalSpent')} value={formatCurrency(totalSpent, language)} colorClass="text-orange-500" />
                    <KpiCard title={t('projects.cost.remaining')} value={formatCurrency(remainingBudget, language)} colorClass={remainingBudget > 0 ? "text-green-500" : "text-red-500"} />
                    <KpiCard title={t('projects.cost.earnedValue')} value={formatCurrency(project.costManagement.financialSummary.ev, language)} colorClass="text-purple-500" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className={CHART_PANEL_CLASSNAME}>
                        <h4 className="mb-3 text-sm font-semibold text-foreground dark:text-dark-foreground">{t('projects.cost.plannedVsActual')}</h4>
                        <div className="h-72" dir="ltr">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={budgetData}
                                    margin={{ top: 8, right: 12, left: 12, bottom: 8 }}
                                    barCategoryGap="22%"
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        strokeDasharray="3 3"
                                        stroke={isDark ? CHART_GRID_COLOR_DARK : CHART_GRID_COLOR}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: isDark ? "#cbd5e1" : "#64748b", fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={{ stroke: isDark ? CHART_GRID_COLOR_DARK : CHART_GRID_COLOR }}
                                        tickMargin={10}
                                        interval={0}
                                    />
                                    <YAxis
                                        width={76}
                                        tickFormatter={(value) => formatAxisCurrency(Number(value), language)}
                                        tick={{ fill: isDark ? "#cbd5e1" : "#64748b", fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                    />
                                    <Tooltip
                                        formatter={(value: unknown) => {
                                            const n = Number(value);
                                            return isNaN(n) ? String(value) : formatCurrency(n, language);
                                        }}
                                        contentStyle={{
                                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                            borderColor: isDark ? '#334155' : '#e2e8f0',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={28}
                                        iconType="square"
                                        wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="planned" name={t('projects.cost.planned')} fill="#7c7ce0" radius={[8, 8, 0, 0]} maxBarSize={40} />
                                    <Bar dataKey="actual" name={t('projects.cost.actual')} fill="#7fc8a6" radius={[8, 8, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={CHART_PANEL_CLASSNAME}>
                        <h4 className="mb-3 text-sm font-semibold text-foreground dark:text-dark-foreground">{t('projects.cost.burnRate')}</h4>
                        {hasBurnRateData ? (
                            <div className="h-72" dir="ltr">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={burnRateData}
                                        margin={{ top: 8, right: 12, left: 12, bottom: 8 }}
                                    >
                                        <CartesianGrid
                                            vertical={false}
                                            strokeDasharray="3 3"
                                            stroke={isDark ? CHART_GRID_COLOR_DARK : CHART_GRID_COLOR}
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fill: isDark ? "#cbd5e1" : "#64748b", fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={{ stroke: isDark ? CHART_GRID_COLOR_DARK : CHART_GRID_COLOR }}
                                            tickMargin={10}
                                        />
                                        <YAxis
                                            width={76}
                                            tickFormatter={(value) => formatAxisCurrency(Number(value), language)}
                                            tick={{ fill: isDark ? "#cbd5e1" : "#64748b", fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />
                                        <Tooltip
                                            formatter={(value: unknown) => {
                                                const n = Number(value);
                                                return isNaN(n) ? String(value) : formatCurrency(n, language);
                                            }}
                                            contentStyle={{
                                                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                                borderColor: isDark ? '#334155' : '#e2e8f0',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                            }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={28}
                                            iconType="plainline"
                                            wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            name={t('projects.cost.monthlySpend')}
                                            stroke="#f97316"
                                            strokeWidth={2.5}
                                            dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
                                            activeDot={{ r: 6, fill: '#f97316', stroke: isDark ? '#0f172a' : '#ffffff', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-6 text-center dark:border-slate-700 dark:bg-slate-900/20">
                                <div className="max-w-xs space-y-2">
                                    <p className="text-sm font-semibold text-foreground dark:text-dark-foreground">
                                        {t('projects.cost.noBurnRateData')}
                                    </p>
                                    <p className="text-xs leading-6 text-gray-500 dark:text-gray-400">
                                        {t('projects.cost.noBurnRateHint')}
                                    </p>
                                </div>
                            </div>
                        )}
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
                                        <td className="p-2 font-semibold">{t(`projects.cost.categories.${item.category}`, item.category)}</td>
                                        <td className="p-2 text-right">{formatCurrency(item.planned, language)}</td>
                                        <td className="p-2 text-right">{formatCurrency(item.actual, language)}</td>
                                        <td className={`p-2 text-right font-semibold ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(variance, language)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </AiCard>

            <AiCard title={t('projects.cost.expenseLog')}>
                <div className="flex justify-end mb-4">
                    <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors">
                        <PlusCircle size={15} /> {t('projects.cost.logExpense')}
                    </button>
                </div>
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
                            {expenses.map(item => (
                                <tr key={item.id} className="border-t dark:border-slate-700">
                                    <td className="p-2">{formatDate(item.date, language)}</td>
                                    <td className="p-2">{item.description}</td>
                                    <td className="p-2">{t(`projects.cost.categories.${item.category}`, item.category)}</td>
                                    <td className="p-2 text-xs font-mono">{item.wbsId}</td>
                                    <td className="p-2 text-right font-semibold">{formatCurrency(item.amount, language)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AiCard>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-slate-700 p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold">{t('projects.cost.logExpense')}</h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>{t('projects.cost.date')}</label>
                                    <input type="date" className={inputClass} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('projects.cost.category')}</label>
                                    <select className={inputClass} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                        {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{t(`projects.cost.categories.${c}`)}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.cost.description')}</label>
                                <input className={inputClass} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.cost.amount')}</label>
                                <input type="number" min={0} className={inputClass} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-5">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">{t('common.cancel')}</button>
                            <button onClick={handleSave} disabled={!form.description.trim() || !form.amount} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50">
                                <Check size={14} /> {t('common.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CostManagementTab;
