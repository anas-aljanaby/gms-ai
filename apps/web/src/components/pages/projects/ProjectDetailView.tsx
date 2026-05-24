
import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import type { Project, Beneficiary, ProjectLifecycleStageId, ProjectType } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import Tabs from '../../common/Tabs';
import ScopeManagementTab from './tabs/ScopeManagementTab';
import ScheduleManagementTab from './tabs/ScheduleManagementTab';
import CostManagementTab from './tabs/CostManagementTab';
import HumanResourcesTab from './tabs/HumanResourcesTab';
import RiskManagementTab from './tabs/RiskManagementTab';
import DocumentsTab from './tabs/DocumentsTab';
import ReportsTab from './tabs/ReportsTab';
import BeneficiariesTab from './tabs/BeneficiariesTab';
import MonitoringTab from './tabs/MonitoringTab';
import ProjectOverviewTab from './tabs/ProjectOverviewTab';
import { ArrowLeft, MapPin, Calendar, Check, Pencil, X } from 'lucide-react';

interface HeaderFormState {
    nameEn: string;
    nameAr: string;
    stage: ProjectLifecycleStageId;
    type: ProjectType;
    plannedStartDate: string;
    plannedEndDate: string;
    country: string;
    city: string;
    donor: string;
    primaryContact: string;
    goal: string;
    budget: number;
    progress: number;
}

const buildHeaderForm = (project: Project): HeaderFormState => ({
    nameEn: project.name.en || '',
    nameAr: project.name.ar || '',
    stage: project.stage,
    type: project.type,
    plannedStartDate: project.plannedStartDate?.split('T')[0] || '',
    plannedEndDate: project.plannedEndDate?.split('T')[0] || '',
    country: project.location?.country || '',
    city: project.location?.city || '',
    donor: project.stakeholders?.donor || '',
    primaryContact: project.stakeholders?.primaryContact || '',
    goal: project.goal || '',
    budget: project.budget || 0,
    progress: project.progress || 0,
});

const STAGES: ProjectLifecycleStageId[] = ['design', 'planning', 'implementation', 'monitoring', 'closure'];
const PROJECT_TYPES: ProjectType[] = ['humanitarian', 'development', 'health', 'education', 'infrastructure'];

interface ProjectDetailViewProps {
    project: Project;
    beneficiaries: Beneficiary[];
    onBack: () => void;
    onUpdate?: (updated: Project) => void;
    initialTab?: string;
}

const stageConfig: Record<string, { bg: string; text: string; dot: string }> = {
    design: { bg: 'bg-slate-100 dark:bg-slate-700/40', text: 'text-slate-700 dark:text-slate-300', dot: 'bg-slate-400' },
    planning: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-400' },
    implementation: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
    monitoring: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-500' },
    closure: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
};

const progressColor = (progress: number) => {
    if (progress >= 75) return 'bg-emerald-500';
    if (progress >= 40) return 'bg-blue-500';
    if (progress > 0) return 'bg-amber-500';
    return 'bg-gray-300 dark:bg-slate-600';
};

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, beneficiaries, onBack, onUpdate, initialTab }) => {
    const { t, language, dir } = useLocalization(['common', 'projects']);
    const toast = useToast();
    const [activeTab, setActiveTab] = useState(initialTab || 'overview');
    const [isHeaderEditing, setIsHeaderEditing] = useState(false);
    const [headerForm, setHeaderForm] = useState<HeaderFormState>(() => buildHeaderForm(project));

    useEffect(() => {
        if (!isHeaderEditing) {
            setHeaderForm(buildHeaderForm(project));
        }
    }, [project, isHeaderEditing]);

    const stage = stageConfig[isHeaderEditing ? headerForm.stage : project.stage] || stageConfig.design;

    const formatProjectLocation = (city?: string, country?: string) => {
        if (!city && !country) return '';
        if (!city) return country || '';
        if (!country) return city;
        return language === 'ar' ? `${country}، ${city}` : `${city}, ${country}`;
    };

    const handleHeaderSave = () => {
        if (!headerForm.nameEn.trim()) {
            toast.showError(t('projects.validation.nameRequired', 'Project name (English) is required'));
            return;
        }
        if (!headerForm.plannedStartDate || !headerForm.plannedEndDate) {
            toast.showError(t('projects.validation.datesRequired', 'Start and end dates are required'));
            return;
        }
        const updated: Project = {
            ...project,
            name: { en: headerForm.nameEn.trim(), ar: headerForm.nameAr.trim() },
            stage: headerForm.stage,
            type: headerForm.type,
            plannedStartDate: headerForm.plannedStartDate,
            plannedEndDate: headerForm.plannedEndDate,
            location: { ...project.location, country: headerForm.country, city: headerForm.city },
            stakeholders: { ...project.stakeholders, donor: headerForm.donor, primaryContact: headerForm.primaryContact },
            goal: headerForm.goal,
            budget: headerForm.budget,
            progress: headerForm.progress,
        };
        onUpdate?.(updated);
        setIsHeaderEditing(false);
        toast.showSuccess(t('projects.updateSuccess', 'Project updated successfully'));
    };

    const handleHeaderCancel = () => {
        setHeaderForm(buildHeaderForm(project));
        setIsHeaderEditing(false);
    };

    const tabs = [
        { id: 'overview', label: t('projects.tabs.overview') },
        { id: 'monitoring', label: t('projects.tabs.monitoring') },
        { id: 'scope', label: t('projects.tabs.scope') },
        { id: 'schedule', label: t('projects.tabs.schedule') },
        { id: 'cost', label: t('projects.tabs.cost') },
        { id: 'hr', label: t('projects.tabs.hr') },
        { id: 'risks', label: t('projects.tabs.risks') },
        { id: 'beneficiaries', label: t('sidebar.beneficiaries') },
        { id: 'documents', label: t('projects.tabs.documents') },
        { id: 'reports', label: t('projects.tabs.reports') },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <ProjectOverviewTab project={project} />;
            case 'monitoring': return <MonitoringTab project={project} />;
            case 'scope': return <ScopeManagementTab project={project} onUpdate={onUpdate} />;
            case 'schedule': return <ScheduleManagementTab project={project} onUpdate={onUpdate} />;
            case 'cost': return <CostManagementTab project={project} isInitiallyActive={initialTab === 'cost'} onUpdate={onUpdate} />;
            case 'hr': return <HumanResourcesTab project={project} />;
            case 'risks': return <RiskManagementTab project={project} onUpdate={onUpdate} />;
            case 'beneficiaries': return <BeneficiariesTab project={project} beneficiaries={beneficiaries} />;
            case 'documents': return <DocumentsTab project={project} />;
            case 'reports': return <ReportsTab project={project} />;
            default: return <div className="text-center p-8">{t('placeholder.underConstruction')}</div>;
        }
    };

    const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold dark:border-slate-600 dark:bg-slate-900 dark:text-dark-foreground focus:ring-1 focus:ring-primary focus:border-primary";
    const labelClass = "text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider";

    return (
        <div className="animate-fade-in space-y-4">
            <div className="bg-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary dark:hover:text-secondary transition-colors">
                        <ArrowLeft size={16} className={dir === 'rtl' ? 'rotate-180' : undefined} />
                        {t('projects.backToList')}
                    </button>
                    {!isHeaderEditing ? (
                        <button
                            onClick={() => setIsHeaderEditing(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-secondary rounded-lg transition-colors"
                        >
                            <Pencil size={14} />
                            {t('common.edit', 'Edit')}
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleHeaderCancel}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <X size={14} />
                                {t('common.cancel', 'Cancel')}
                            </button>
                            <button
                                onClick={handleHeaderSave}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                            >
                                <Check size={14} />
                                {t('common.save', 'Save')}
                            </button>
                        </div>
                    )}
                </div>

                {!isHeaderEditing ? (
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-foreground dark:text-dark-foreground truncate">
                                    {project.name[language]}
                                </h1>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${stage.bg} ${stage.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${stage.dot}`}></span>
                                    {t(`projects.stages.${project.stage}`)}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {project.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin size={13} />
                                        {formatProjectLocation(project.location.city, project.location.country)}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar size={13} />
                                    {new Date(project.plannedStartDate).toLocaleDateString()} - {new Date(project.plannedEndDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 shrink-0">
                            <div className="text-center">
                                <p className="text-xs text-gray-400 mb-0.5">{t('projects.list.progress')}</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <div className={`h-full rounded-full ${progressColor(project.progress)}`} style={{ width: `${project.progress}%` }}></div>
                                    </div>
                                    <span className="text-sm font-bold text-foreground dark:text-dark-foreground">{project.progress}%</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400 mb-0.5">{t('projects.list.budget')}</p>
                                <p className="text-sm font-bold text-foreground dark:text-dark-foreground">{formatCurrency(project.budget, language)}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>{t('projects.wizard.form.nameEn', 'Project Name (English)')}</label>
                                <input
                                    className={inputClass}
                                    value={headerForm.nameEn}
                                    onChange={e => setHeaderForm(f => ({ ...f, nameEn: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.wizard.form.nameAr', 'Project Name (Arabic)')}</label>
                                <input
                                    className={inputClass}
                                    dir="rtl"
                                    value={headerForm.nameAr}
                                    onChange={e => setHeaderForm(f => ({ ...f, nameAr: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>{t('projects.list.stage', 'Stage')}</label>
                                <select
                                    className={inputClass}
                                    value={headerForm.stage}
                                    onChange={e => setHeaderForm(f => ({ ...f, stage: e.target.value as ProjectLifecycleStageId }))}
                                >
                                    {STAGES.map(s => (
                                        <option key={s} value={s}>{t(`projects.stages.${s}`)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.wizard.form.type', 'Type')}</label>
                                <select
                                    className={inputClass}
                                    value={headerForm.type}
                                    onChange={e => setHeaderForm(f => ({ ...f, type: e.target.value as ProjectType }))}
                                >
                                    {PROJECT_TYPES.map(pt => (
                                        <option key={pt} value={pt}>{t(`projects.types.${pt}`)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.wizard.form.startDate', 'Start Date')}</label>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={headerForm.plannedStartDate}
                                    onChange={e => setHeaderForm(f => ({ ...f, plannedStartDate: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.wizard.form.endDate', 'End Date')}</label>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={headerForm.plannedEndDate}
                                    onChange={e => setHeaderForm(f => ({ ...f, plannedEndDate: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>{t('projects.overview.country', 'Country')}</label>
                                <input
                                    className={inputClass}
                                    value={headerForm.country}
                                    onChange={e => setHeaderForm(f => ({ ...f, country: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.overview.city', 'City')}</label>
                                <input
                                    className={inputClass}
                                    value={headerForm.city}
                                    onChange={e => setHeaderForm(f => ({ ...f, city: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.list.budget', 'Budget')}</label>
                                <input
                                    type="number"
                                    className={inputClass}
                                    value={headerForm.budget}
                                    onChange={e => setHeaderForm(f => ({ ...f, budget: Number(e.target.value) || 0 }))}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.list.progress', 'Progress')} (%)</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    className={inputClass}
                                    value={headerForm.progress}
                                    onChange={e => setHeaderForm(f => ({ ...f, progress: Math.min(100, Math.max(0, Number(e.target.value) || 0)) }))}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>{t('projects.wizard.form.donor', 'Donor')}</label>
                                <input
                                    className={inputClass}
                                    value={headerForm.donor}
                                    onChange={e => setHeaderForm(f => ({ ...f, donor: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.wizard.form.manager', 'Project Manager')}</label>
                                <input
                                    className={inputClass}
                                    value={headerForm.primaryContact}
                                    onChange={e => setHeaderForm(f => ({ ...f, primaryContact: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>{t('projects.overview.goal', 'Goal')}</label>
                            <textarea
                                className={`${inputClass} resize-none`}
                                rows={2}
                                value={headerForm.goal}
                                onChange={e => setHeaderForm(f => ({ ...f, goal: e.target.value }))}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-card dark:bg-dark-card rounded-xl shadow-soft border border-gray-200 dark:border-slate-700/50">
                <div className="px-6 pt-2">
                    <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailView;
