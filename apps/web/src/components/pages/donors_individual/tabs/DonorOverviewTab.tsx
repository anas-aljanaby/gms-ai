import React from 'react';
import { CalendarClock, ClipboardList, Clock, DollarSign, Gift, HeartHandshake, MessageSquare, Phone, Target, WalletCards } from 'lucide-react';
import type { DonorProfileActivity, DonorProfileSummary } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { formatCurrency, formatDate, formatNumber, formatRelativeTime } from '../../../../lib/utils';
import { Chip, EmptyPanel, InfoRow, MetricCard, RelationshipHealthChip, Section } from './profileUi';

interface DonorOverviewTabProps {
    summary: DonorProfileSummary;
    onLogInteraction: () => void;
}

const ActivityIcon: React.FC<{ type: DonorProfileActivity['type'] }> = ({ type }) => {
    if (type === 'donation') return <Gift size={17} />;
    if (type === 'interaction') return <MessageSquare size={17} />;
    return <ClipboardList size={17} />;
};

const RecentActivityList: React.FC<{ activities: DonorProfileActivity[] }> = ({ activities }) => {
    const { t, language } = useLocalization(['common', 'individual_donors']);

    if (activities.length === 0) {
        return <EmptyPanel text={t('individual_donors.detailView.noActivity', 'No recent activity recorded yet.')} />;
    }

    return (
        <div className="space-y-3">
            {activities.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex min-w-0 items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/30">
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm dark:bg-slate-800 dark:text-secondary">
                        <ActivityIcon type={activity.type} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold text-foreground dark:text-dark-foreground">
                            {activity.type === 'donation' && activity.amount !== undefined
                                ? `${formatCurrency(activity.amount, language)} / ${activity.title}`
                                : activity.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {activity.occurred_at ? formatRelativeTime(activity.occurred_at, language) : t('common.unknown', 'Unknown')}
                            {activity.status ? ` / ${activity.status}` : ''}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const DonorOverviewTab: React.FC<DonorOverviewTabProps> = ({ summary, onLogInteraction }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);
    const stageLabel = summary.relationship.pipelineStage ? t(`donors.stages.${summary.relationship.pipelineStage}`, summary.relationship.pipelineStage) : 'N/A';
    const nextAction = summary.nextAction;

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard title={t('individual_donors.kpi.ltv')} value={formatCurrency(summary.giving.lifetimeGiving, language)} icon={<DollarSign size={19} />} accent="text-emerald-600 dark:text-emerald-300" />
                <MetricCard title={t('individual_donors.kpi.totalGifts')} value={formatNumber(summary.giving.totalGifts, language)} icon={<Gift size={19} />} accent="text-blue-600 dark:text-blue-300" />
                <MetricCard title={t('individual_donors.columns.pipelineStage')} value={stageLabel} icon={<Target size={19} />} subtext={summary.relationship.stageEnteredAt ? formatRelativeTime(summary.relationship.stageEnteredAt, language) : undefined} accent="text-amber-600 dark:text-amber-300" />
                <MetricCard title={t('individual_donors.columns.openTasks')} value={formatNumber(summary.relationship.openTaskCount, language)} icon={<ClipboardList size={19} />} subtext={nextAction?.due_date ? formatDate(nextAction.due_date, language) : t('donors.kanban.noNextAction')} accent="text-primary dark:text-secondary" />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
                <Section title={t('individual_donors.detailView.engagementPlan', 'Engagement Plan')} icon={<HeartHandshake size={18} />}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.65fr)]">
                        <div className="rounded-lg border border-primary/15 bg-primary-light/60 p-4 dark:bg-primary/10">
                            <p className="text-xs font-semibold uppercase text-primary dark:text-secondary">{t('individual_donors.columns.nextAction')}</p>
                            <p className="mt-2 break-words text-base font-bold text-foreground dark:text-dark-foreground">{nextAction?.text || t('donors.kanban.noNextAction')}</p>
                            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                                {nextAction?.due_date ? `${t('donors.card.due')}: ${formatDate(nextAction.due_date, language)}` : t('individual_donors.detailView.createNextAction', 'Create a clear next action for this donor.')}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            <InfoRow label={t('individual_donors.columns.owner')} value={summary.relationship.owner || 'Unassigned'} />
                            <InfoRow label={t('individual_donors.columns.relationshipHealth')} value={<RelationshipHealthChip health={summary.relationship.health} />} />
                            <InfoRow label={t('donors.kanban.likelihood')} value={summary.relationship.likelihood ? t(`donors.likelihood.${summary.relationship.likelihood}`) : <Chip>Not enough data</Chip>} />
                            <InfoRow label={t('individual_donors.columns.lastContact')} value={summary.relationship.lastContact?.occurred_at ? formatRelativeTime(summary.relationship.lastContact.occurred_at, language) : 'N/A'} />
                        </div>
                    </div>
                </Section>

                <Section title={t('individual_donors.detailView.contactInfo')} icon={<Phone size={18} />}>
                    <div className="space-y-4">
                        <InfoRow label={t('individual_donors.modal.email')} value={<a href={`mailto:${summary.donor.email}`} className="text-primary hover:underline dark:text-secondary">{summary.donor.email}</a>} />
                        <InfoRow label={t('individual_donors.modal.phone')} value={summary.donor.phone ? <a href={`tel:${summary.donor.phone}`} className="text-primary hover:underline dark:text-secondary">{summary.donor.phone}</a> : 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.ownerSource', 'Owner source')} value={summary.sourceMeta.pipeline} muted />
                    </div>
                </Section>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <Section title={t('individual_donors.detailView.givingHistory')} icon={<WalletCards size={18} />} className="xl:col-span-1">
                    <div className="space-y-4">
                        <InfoRow label={t('individual_donors.columns.lastGift')} value={summary.giving.lastGiftDate ? `${formatCurrency(summary.giving.lastGiftAmount || 0, language)} / ${formatDate(summary.giving.lastGiftDate, language)}` : 'N/A'} />
                        <InfoRow label={t('individual_donors.kpi.avgGift')} value={summary.giving.averageGift !== null ? formatCurrency(summary.giving.averageGift, language) : 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.programsSupported')} value={summary.giving.programsSupported.length ? <div className="flex flex-wrap gap-2">{summary.giving.programsSupported.map((program) => <Chip key={program} tone="green">{program}</Chip>)}</div> : 'N/A'} />
                    </div>
                </Section>
                <Section title={t('individual_donors.recentActivity')} icon={<Clock size={18} />} className="xl:col-span-2">
                    {summary.recentActivity.length === 0 ? (
                        <EmptyPanel
                            text={t('individual_donors.detailView.noActivity', 'No recent activity recorded yet.')}
                            action={<button onClick={onLogInteraction} className="rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-secondary-dark">{t('individual_donors.detailView.logInteraction')}</button>}
                        />
                    ) : <RecentActivityList activities={summary.recentActivity} />}
                </Section>
            </div>
        </div>
    );
};

export default DonorOverviewTab;
