import React, { useState, useEffect, useMemo } from 'react';
import {
    ArrowLeft, Target, Briefcase, Pencil, Trash2, Check, X, Loader, PlusCircle, Link2, Unlink,
    TrendingUp, TrendingDown, Minus, ChevronRight,
} from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency, formatDate, formatNumber } from '../../../lib/utils';
import type { BousalaGoal, BousalaProject, BousalaKpi, Project as MainProject, HrData } from '../../../types';
import StatusBadge from './StatusBadge';
import BousalaSectionEmpty from './BousalaSectionEmpty';
import ResponsiblePersonField from './ResponsiblePersonField';

type GoalEditForm = { title: string; description: string; responsiblePerson: string; status: string };

const trendIcon = {
    up: <TrendingUp className="w-4 h-4 text-green-500" />,
    down: <TrendingDown className="w-4 h-4 text-red-500" />,
    stable: <Minus className="w-4 h-4 text-gray-500" />,
};

const KpiCard: React.FC<{ kpi: BousalaKpi; canManage: boolean; onEdit: () => void; onDelete: () => void }> = ({ kpi, canManage, onEdit, onDelete }) => {
    const { t, language } = useLocalization(['common', 'bousala']);
    const progress = kpi.target > 0 ? Math.min(100, (kpi.value / kpi.target) * 100) : 0;
    return (
        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl">
            <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                    <h5 className="font-semibold text-sm flex items-center gap-2" dir="auto">
                        {kpi.title}
                        {trendIcon[kpi.trend]}
                    </h5>
                    {kpi.description && <p className="text-xs text-gray-500 mt-0.5" dir="auto">{kpi.description}</p>}
                </div>
                {canManage && (
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button type="button" onClick={onEdit} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500" aria-label={t('bousala.kpiEdit.editAria')}>
                            <Pencil size={14} />
                        </button>
                        <button type="button" onClick={onDelete} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500" aria-label={t('bousala.kpiEdit.deleteAria')}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>
            <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold tabular-nums">{formatNumber(kpi.value, language)}</span>
                <span className="text-sm text-gray-500">/ {formatNumber(kpi.target, language)} {kpi.unit}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[11px] text-gray-400 mt-2">{t('bousala.common.lastUpdated', { date: formatDate(kpi.lastUpdated, language) })}</p>
        </div>
    );
};

interface GoalDetailViewProps {
    goal: BousalaGoal;
    linkedProjects: BousalaProject[];
    mainProjects: MainProject[];
    hrData: HrData;
    canManage: boolean;
    isSavingGoal: boolean;
    onBack: () => void;
    onSaveGoal: (goalId: string, data: GoalEditForm) => void | Promise<void>;
    onDeleteGoal: (goalId: string) => void;
    onAddKpiClick: () => void;
    onEditKpi: (kpi: BousalaKpi) => void;
    onDeleteKpi: (goalId: string, kpiId: string) => void;
    onLinkProjectClick: () => void;
    onUnlinkProject: (projectId: string) => void;
    setActiveModule: (module: string) => void;
}

const GoalDetailView: React.FC<GoalDetailViewProps> = ({
    goal, linkedProjects, mainProjects, hrData, canManage, isSavingGoal,
    onBack, onSaveGoal, onDeleteGoal, onAddKpiClick, onEditKpi, onDeleteKpi,
    onLinkProjectClick, onUnlinkProject, setActiveModule,
}) => {
    const { t, language, pickLocalized } = useLocalization(['common', 'bousala', 'projects']);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<GoalEditForm>({
        title: goal.title, description: goal.description, responsiblePerson: goal.responsiblePerson, status: goal.status ?? '',
    });
    const [titleError, setTitleError] = useState<string | undefined>();

    const statusOptions = useMemo(
        () => Object.values(t('bousala.statusOptions', { returnObjects: true }) as Record<string, string>),
        [t],
    );

    useEffect(() => {
        if (!isEditing) {
            setForm({ title: goal.title, description: goal.description, responsiblePerson: goal.responsiblePerson, status: goal.status ?? '' });
            setTitleError(undefined);
        }
    }, [goal.title, goal.description, goal.responsiblePerson, goal.status, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setTitleError(t('bousala.goalEdit.titleRequired'));
            return;
        }
        try {
            await Promise.resolve(onSaveGoal(goal.id, {
                title: form.title.trim(),
                description: form.description.trim(),
                responsiblePerson: form.responsiblePerson.trim(),
                status: form.status,
            }));
            setIsEditing(false);
        } catch {
            // parent handles errors
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary">
                <ArrowLeft size={16} className="rtl:rotate-180" /> {t('bousala.goalDetail.back')}
            </button>

            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 p-6">
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500">{t('bousala.addGoalModal.goalTitle')}</label>
                            <input
                                type="text" value={form.title}
                                onChange={e => { setForm(f => ({ ...f, title: e.target.value })); if (titleError) setTitleError(undefined); }}
                                disabled={isSavingGoal}
                                className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-base font-bold disabled:opacity-50" dir="auto"
                            />
                            {titleError && <p className="mt-1 text-xs text-red-600">{titleError}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500">{t('bousala.addGoalModal.description')}</label>
                            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} disabled={isSavingGoal}
                                className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-sm disabled:opacity-50" dir="auto" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500">{t('bousala.addGoalModal.responsiblePerson')}</label>
                            <ResponsiblePersonField value={form.responsiblePerson} onChange={value => setForm(f => ({ ...f, responsiblePerson: value }))} disabled={isSavingGoal} hrData={hrData}
                                className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-sm disabled:opacity-50" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500">{t('bousala.goalEdit.status')}</label>
                            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} disabled={isSavingGoal}
                                className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-sm disabled:opacity-50">
                                <option value="">—</option>
                                {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                            <button type="submit" disabled={isSavingGoal} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold disabled:opacity-50">
                                {isSavingGoal ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                                {isSavingGoal ? t('common.saving') : t('common.save')}
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} disabled={isSavingGoal} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-50">
                                <X size={14} /> {t('common.cancel')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                            <Target className="w-8 h-8 text-primary dark:text-secondary flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="font-bold text-2xl text-primary dark:text-secondary" dir="auto">{goal.title}</h1>
                                    <StatusBadge status={goal.status} />
                                </div>
                                {goal.description && <p className="text-sm text-gray-500 mt-1" dir="auto">{goal.description}</p>}
                                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-gray-500">
                                    {goal.responsiblePerson && (
                                        <span><span className="font-semibold">{t('bousala.addGoalModal.responsiblePerson')}:</span> <span dir="auto">{goal.responsiblePerson}</span></span>
                                    )}
                                    {goal.deadline && (
                                        <span><span className="font-semibold">{t('bousala.goalDetail.deadline')}:</span> {formatDate(goal.deadline, language)}</span>
                                    )}
                                </div>
                                <div className="mt-4 max-w-md">
                                    <div className="flex justify-between text-sm font-semibold mb-1">
                                        <span>{t('bousala.common.progressLabel')}</span>
                                        <span>{formatNumber(goal.progress, language)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${goal.progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {canManage && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button type="button" onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 text-gray-500" aria-label={t('bousala.goalEdit.editAria')}>
                                    <Pencil size={18} />
                                </button>
                                <button type="button" onClick={() => onDeleteGoal(goal.id)} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500" aria-label={t('bousala.goalEdit.deleteAria')}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* KPIs */}
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">{t('bousala.kpis')}</h2>
                    {canManage && (
                        <button onClick={onAddKpiClick} className="inline-flex items-center gap-1 text-sm font-semibold text-primary dark:text-secondary-light hover:underline">
                            <PlusCircle size={14} /> {t('bousala.common.addKpi')}
                        </button>
                    )}
                </div>
                {goal.kpis && goal.kpis.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {goal.kpis.map(kpi => (
                            <KpiCard key={kpi.id} kpi={kpi} canManage={canManage} onEdit={() => onEditKpi(kpi)} onDelete={() => onDeleteKpi(goal.id, kpi.id)} />
                        ))}
                    </div>
                ) : (
                    <BousalaSectionEmpty compact title={t('bousala.empty.noKpis.title')} description={t('bousala.empty.noKpis.description')}
                        actionLabel={canManage ? t('bousala.empty.noKpis.action') : undefined} onAction={canManage ? onAddKpiClick : undefined} />
                )}
            </div>

            {/* Linked projects */}
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">{t('bousala.projects')}</h2>
                    {canManage && (
                        <button onClick={onLinkProjectClick} className="inline-flex items-center gap-1 text-sm font-semibold text-primary dark:text-secondary-light hover:underline">
                            <Link2 size={14} /> {t('bousala.empty.noProjects.action')}
                        </button>
                    )}
                </div>
                {linkedProjects.length > 0 ? (
                    <div className="space-y-3">
                        {linkedProjects.map(project => {
                            const source = project.sourceProjectId ? mainProjects.find(p => p.id === project.sourceProjectId) : undefined;
                            const canOpen = !!source;
                            return (
                                <div key={project.id} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                    <div className="flex items-start justify-between gap-2">
                                        <button
                                            type="button"
                                            onClick={() => source && setActiveModule(`projects/${source.id}/overview`)}
                                            disabled={!canOpen}
                                            className="flex items-start gap-3 min-w-0 flex-1 text-start disabled:cursor-default"
                                        >
                                            <Briefcase className="w-6 h-6 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="font-bold text-base" dir="auto">{source ? pickLocalized(source.name) : project.title}</h4>
                                                    {source && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{t(`projects.stages.${source.stage}`)}</span>}
                                                </div>
                                                {project.description && <p className="text-sm text-gray-500 mt-0.5" dir="auto">{project.description}</p>}
                                            </div>
                                        </button>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            {canOpen && <ChevronRight className="w-5 h-5 text-gray-400 rtl:rotate-180" />}
                                            {canManage && (
                                                <button type="button" onClick={() => onUnlinkProject(project.id)} className="p-1.5 rounded hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300" aria-label={t('bousala.projectEdit.unlinkAria')}>
                                                    <Unlink size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-gray-500">
                                        <span><span className="font-semibold">{t('bousala.common.progress')}:</span> {formatNumber(project.progress, language)}%</span>
                                        {source && <span><span className="font-semibold">{t('bousala.common.budget')}:</span> {formatCurrency(source.budget, language)}</span>}
                                        {source && <span><span className="font-semibold">{t('bousala.goalDetail.spent')}:</span> {formatCurrency(source.spent, language)}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <BousalaSectionEmpty compact title={t('bousala.empty.noProjects.title')} description={t('bousala.empty.noProjects.description')}
                        actionLabel={canManage ? t('bousala.empty.noProjects.action') : undefined} onAction={canManage ? onLinkProjectClick : undefined} />
                )}
            </div>
        </div>
    );
};

export default GoalDetailView;
