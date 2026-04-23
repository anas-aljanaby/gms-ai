import React, { useState } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { BarChart as BarChartIcon, ClipboardList as ClipboardListIcon, FileText as FileTextIcon } from 'lucide-react';
import { ClockIcon } from '../../../icons/MetricsIcons';
import ReportModal from '../reports/ReportModal';
import OverviewReport from '../reports/OverviewReport';
import TasksReport from '../reports/TasksReport';
import BudgetReport from '../reports/BudgetReport';
import TimelineReport from '../reports/TimelineReport';
import { formatDate, formatNumber } from '../../../../lib/utils';

interface ReportsTabProps {
    project: Project;
}

type ReportType = 'overview' | 'tasks' | 'budget' | 'progress';

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex justify-between items-center py-3 border-b dark:border-slate-700 last:border-b-0">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="text-sm text-foreground dark:text-dark-foreground font-semibold">{children}</dd>
    </div>
);


const ReportsTab: React.FC<{ project: Project }> = ({ project }) => {
    const { t, language } = useLocalization();
    const [openModal, setOpenModal] = useState<ReportType | null>(null);
    const [favorite, setFavorite] = useState<string | null>(() => localStorage.getItem('favoriteReport'));
    const [activeTab, setActiveTab] = useState('create');

    // Calculations for Progress Report
    const startDate = new Date(project.plannedStartDate);
    const endDate = new Date(project.plannedEndDate);
    const today = new Date();

    const totalDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const elapsedDays = Math.max(0, Math.min(totalDays, Math.round((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))));
    const timeElapsedPercent = totalDays > 0 ? Math.round((elapsedDays / totalDays) * 100) : 0;
    const completionProgress = project.progress;
    
    const getStatus = () => {
        const difference = completionProgress - timeElapsedPercent;
        if (difference > 5) {
            return { text: t('projects.reporting.modal.timeline.statuses.ahead'), color: 'text-green-600', icon: '🟢' };
        }
        if (difference < -5) {
            return { text: t('projects.reporting.modal.timeline.statuses.behind'), color: 'text-red-600', icon: '🔴' };
        }
        return { text: t('projects.reporting.modal.timeline.statuses.onTrack'), color: 'text-yellow-600', icon: '🟡' };
    };
    const statusInfo = getStatus();

    const reportCards: { id: ReportType; title: string; description: string; icon: React.FC; buttonColor?: string; }[] = [
        {
            id: 'overview',
            title: t('projects.reporting.overviewReport'),
            description: t('projects.reporting.overviewReportDesc'),
            icon: FileTextIcon,
        },
        {
            id: 'progress',
            title: t('projects.reporting.timelineReport'),
            description: t('projects.reporting.timelineReportDesc'),
            icon: ClockIcon,
            buttonColor: 'bg-green-500 hover:bg-green-600'
        },
        {
            id: 'tasks',
            title: t('projects.reporting.tasksReport'),
            description: t('projects.reporting.tasksReportDesc'),
            icon: ClipboardListIcon,
        },
        {
            id: 'budget',
            title: t('projects.reporting.budgetReport'),
            description: t('projects.reporting.budgetReportDesc'),
            icon: BarChartIcon,
        },
    ];
    
    const getTabClass = (tabId: string) => {
        return activeTab === tabId
          ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300';
    };

    return (
        <>
            <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
                <nav className="-mb-px flex space-x-6 rtl:space-x-reverse" aria-label={t('common.tabs')}>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${getTabClass('create')}`}
                    >
                        {t('reporting.tabs.create')}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${getTabClass('history')}`}
                    >
                        {t('reporting.tabs.history')}
                    </button>
                </nav>
            </div>
            
            {activeTab === 'create' && (
                 <div className="animate-fade-in">
                    <AiCard title={t('projects.reporting.reportCardsTitle')}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {reportCards.map(card => (
                                <div key={card.id} className="relative bg-gray-50 dark:bg-slate-800/50 p-6 rounded-lg flex flex-col items-start border dark:border-slate-700">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newFav = favorite === card.id ? null : card.id;
                                            setFavorite(newFav);
                                            localStorage.setItem('favoriteReport', newFav || '');
                                            window.dispatchEvent(new Event('storage'));
                                        }}
                                        className="favorite-star"
                                        title={favorite === card.id ? t('projects.reporting.favorite.unfavorite') : t('projects.reporting.favorite.setAsFavorite')}
                                        style={{color: favorite === card.id ? '#fbbf24' : '#d1d5db'}}
                                    >
                                        ★
                                    </button>
                                    <div className="flex items-center gap-3 mb-2">
                                        <card.icon />
                                        <h3 className="text-lg font-bold">{card.title}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">{card.description}</p>
                                    <button 
                                        onClick={() => setOpenModal(card.id)}
                                        className={`mt-4 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${card.buttonColor || 'bg-primary hover:bg-primary-dark'}`}
                                    >
                                        {t('projects.reporting.viewReport')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </AiCard>
                </div>
            )}
            
            {activeTab === 'history' && (
                 <div className="animate-fade-in">
                     <AiCard title={t('reporting.tabs.history')}>
                         <div className="text-center py-16 px-6">
                            <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-2">
                                {t('reporting.history.comingSoon')}
                            </h3>
                        </div>
                    </AiCard>
                </div>
            )}


            <ReportModal
                isOpen={openModal === 'overview'}
                onClose={() => setOpenModal(null)}
                title={t('projects.reporting.modal.overview.title')}
            >
                <OverviewReport project={project} />
            </ReportModal>
            
            <ReportModal
                isOpen={openModal === 'tasks'}
                onClose={() => setOpenModal(null)}
                title={t('projects.reporting.modal.tasks.title')}
            >
                <TasksReport project={project} />
            </ReportModal>

            <ReportModal
                isOpen={openModal === 'budget'}
                onClose={() => setOpenModal(null)}
                title={t('projects.reporting.modal.budget.title')}
            >
                <BudgetReport project={project} />
            </ReportModal>
            
             <ReportModal
                isOpen={openModal === 'progress'}
                onClose={() => setOpenModal(null)}
                title={t('projects.reporting.modal.timeline.title')}
            >
                <div className="space-y-6">
                    <div className="text-center border-b dark:border-slate-700 pb-4 mb-4">
                        <h1 className="text-2xl font-bold">{project.name[language]}</h1>
                        <p className="text-gray-500">{t('projects.reporting.modal.timeline.title')}</p>
                    </div>
                    <dl className="max-w-md mx-auto">
                        <InfoRow label={t('projects.reporting.modal.timeline.startDate')}>{formatDate(project.plannedStartDate, language)}</InfoRow>
                        <InfoRow label={t('projects.reporting.modal.timeline.endDate')}>{formatDate(project.plannedEndDate, language)}</InfoRow>
                        <InfoRow label={t('projects.reporting.modal.timeline.totalDays')}>{formatNumber(totalDays, language)}</InfoRow>
                        <InfoRow label={t('projects.reporting.modal.timeline.elapsedDays')}>{formatNumber(elapsedDays, language)}</InfoRow>
                        <InfoRow label={t('projects.reporting.modal.timeline.timeElapsed')}>{timeElapsedPercent}%</InfoRow>
                        <InfoRow label={t('projects.reporting.modal.timeline.completionProgress')}>{completionProgress}%</InfoRow>
                        <InfoRow label={t('projects.reporting.modal.timeline.status')}>
                            <span className={`font-bold text-lg ${statusInfo.color}`}>{statusInfo.icon} {statusInfo.text}</span>
                        </InfoRow>
                    </dl>
                </div>
            </ReportModal>
        </>
    );
};

export default ReportsTab;