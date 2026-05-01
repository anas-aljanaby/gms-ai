import React from 'react';
import type { Project } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { formatDate, formatNumber } from '../../../../lib/utils';

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex justify-between items-center py-3 border-b dark:border-slate-700 last:border-b-0">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="text-sm text-foreground dark:text-dark-foreground font-semibold">{children}</dd>
    </div>
);

const TimelineReport: React.FC<{ project: Project }> = ({ project }) => {
    const { t, language } = useLocalization();

    const startDate = new Date(project.plannedStartDate);
    const endDate = new Date(project.plannedEndDate);
    const today = new Date();

    const totalDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const elapsedDays = Math.max(0, Math.min(totalDays, Math.round((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))));
    const timeElapsedPercent = Math.round((elapsedDays / totalDays) * 100);
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

    const status = getStatus();

    return (
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
                    <span className={`font-bold text-lg ${status.color}`}>{status.icon} {status.text}</span>
                </InfoRow>
            </dl>
        </div>
    );
};

export default TimelineReport;
