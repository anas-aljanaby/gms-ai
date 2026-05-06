import React from 'react';
import { CalendarClock, CheckCircle2, ClipboardList, MessageSquare, UserRound } from 'lucide-react';
import type { DonorProfileInteraction, DonorProfileSummary, DonorProfileTask, IndividualDonor } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { formatDate, formatRelativeTime } from '../../../../lib/utils';
import { Chip, EmptyPanel, InfoRow, RelationshipHealthChip, Section } from './profileUi';

interface DonorRelationshipActivityTabProps {
    donor: IndividualDonor;
    summary: DonorProfileSummary;
    tasks: DonorProfileTask[];
    interactions: DonorProfileInteraction[];
    isLoading?: boolean;
}

const DonorRelationshipActivityTab: React.FC<DonorRelationshipActivityTabProps> = ({ donor, summary, tasks, interactions, isLoading }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);
    const donorName = summary.donor.full_name_ar && language === 'ar' ? summary.donor.full_name_ar : summary.donor.full_name_en;
    const openTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="space-y-5">
                <Section title={t('individual_donors.detailView.identity')} icon={<UserRound size={18} />}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoRow label={t('individual_donors.detailView.fullName')} value={donorName} />
                        <InfoRow label={t('individual_donors.columns.status')} value={summary.donor.status} />
                        <InfoRow label={t('individual_donors.columns.owner')} value={summary.relationship.owner || 'Unassigned'} />
                        <InfoRow label={t('individual_donors.columns.relationshipHealth')} value={<RelationshipHealthChip health={summary.relationship.health} />} />
                        <InfoRow label={t('individual_donors.columns.country')} value={[donor.city, summary.donor.country].filter(Boolean).join(', ')} />
                        <InfoRow label={t('individual_donors.detailView.preferredLanguage')} value={donor.preferred_language?.toUpperCase() || 'N/A'} />
                    </div>
                    <div className="mt-5 border-t border-gray-200 pt-4 dark:border-slate-700">
                        <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('individual_donors.columns.tags')}</p>
                        {summary.donor.tags.length ? (
                            <div className="flex flex-wrap gap-2">{summary.donor.tags.map((tag) => <Chip key={tag} tone="blue">{tag}</Chip>)}</div>
                        ) : <p className="text-sm text-gray-500 dark:text-gray-400">{t('individual_donors.relationship.noTags')}</p>}
                    </div>
                </Section>

                <Section title={t('individual_donors.detailView.relationshipState', 'Relationship State')} icon={<CalendarClock size={18} />}>
                    <div className="space-y-4">
                        <InfoRow label={t('individual_donors.columns.pipelineStage')} value={t(`donors.stages.${summary.relationship.pipelineStage}`, summary.relationship.pipelineStage)} />
                        <InfoRow label={t('individual_donors.detailView.stageEntered', 'Stage entered')} value={summary.relationship.stageEnteredAt ? formatDate(summary.relationship.stageEnteredAt, language) : 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.healthSource', 'Health source')} value={summary.computed.relationshipHealthSource} muted />
                    </div>
                </Section>
            </div>

            <div className="space-y-5">
                <Section title={t('individual_donors.detailView.openTasks')} icon={<ClipboardList size={18} />}>
                    {isLoading ? (
                        <div className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />
                    ) : openTasks.length === 0 ? (
                        <EmptyPanel text={t('individual_donors.detailView.noOpenTasks')} />
                    ) : (
                        <div className="space-y-3">
                            {openTasks.map((task) => (
                                <div key={task.id} className="flex min-w-0 flex-col justify-between gap-3 rounded-lg border border-gray-200 p-4 dark:border-slate-700 sm:flex-row sm:items-start">
                                    <div className="min-w-0">
                                        <p className="break-words font-bold text-foreground dark:text-dark-foreground">{task.text}</p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{task.type} / {task.assigned_to || 'Unassigned'}</p>
                                    </div>
                                    <span className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-bold ${task.due_date && task.due_date < today ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300'}`}>
                                        {task.due_date ? formatDate(task.due_date, language) : 'N/A'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                <Section title={t('individual_donors.detailView.communicationHistory')} icon={<MessageSquare size={18} />}>
                    {interactions.length === 0 ? (
                        <EmptyPanel text={t('individual_donors.detailView.noCommunications')} />
                    ) : (
                        <div className="space-y-3">
                            {interactions.map((interaction) => (
                                <div key={interaction.id} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="break-words font-bold text-foreground dark:text-dark-foreground">{interaction.subject}</p>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{interaction.interaction_type} / {interaction.status}</p>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{interaction.occurred_at ? formatRelativeTime(interaction.occurred_at, language) : 'N/A'}</span>
                                    </div>
                                    {interaction.notes && <p className="mt-3 break-words text-sm text-gray-600 dark:text-gray-300">{interaction.notes}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                {completedTasks.length > 0 && (
                    <Section title={t('individual_donors.detailView.completedTasks')} icon={<CheckCircle2 size={18} />}>
                        <div className="space-y-2">
                            {completedTasks.map((task) => (
                                <div key={task.id} className="rounded-lg bg-gray-50 p-3 text-sm font-semibold text-gray-600 dark:bg-slate-800/60 dark:text-gray-300">{task.text}</div>
                            ))}
                        </div>
                    </Section>
                )}
            </div>
        </div>
    );
};

export default DonorRelationshipActivityTab;
