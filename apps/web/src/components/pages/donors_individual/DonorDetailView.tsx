import React, { useState } from 'react';
import type { Communication, Donation, DonorTask, IndividualDonor } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import Tabs from '../../common/Tabs';
import { formatCurrency, formatDate, formatNumber, formatRelativeTime, getDonorCategoryLabel } from '../../../lib/utils';
import {
    AlertTriangle,
    ArrowLeft,
    CalendarClock,
    ClipboardList,
    Clock,
    DollarSign,
    FileText,
    Gift,
    HeartHandshake,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Sparkles,
    Target,
    UserRound,
    WalletCards,
} from 'lucide-react';
import { MOCK_DONATIONS } from '../../../data/donationsData';
import { MOCK_COMMUNICATIONS } from '../../../data/communicationsData';
import LogInteractionModal from './LogInteractionModal';
import SendEmailModal from './SendEmailModal';

interface DonorDetailViewProps {
    donor: IndividualDonor;
    onBack: () => void;
}

const EmptyPanel: React.FC<{ text: string }> = ({ text }) => (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white/70 p-8 text-center text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-900/30 dark:text-gray-400">{text}</div>
);

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
    <section className={`min-w-0 rounded-xl border border-gray-200/80 bg-card p-5 shadow-sm dark:border-slate-700/70 dark:bg-dark-card ${className}`}>
        <div className="mb-4 flex min-w-0 items-center gap-3">
            {icon && <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary dark:bg-primary/20 dark:text-secondary">{icon}</div>}
            <h3 className="truncate text-base font-bold text-foreground dark:text-dark-foreground">{title}</h3>
        </div>
        {children}
    </section>
);

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <div className="mt-1 break-words text-sm font-bold leading-6 text-foreground dark:text-dark-foreground">{value || 'N/A'}</div>
    </div>
);

const MetricCard: React.FC<{ title: string; value: React.ReactNode; icon: React.ReactNode; subtext?: React.ReactNode; accent?: string }> = ({ title, value, icon, subtext, accent = 'text-primary dark:text-secondary' }) => (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-card p-4 shadow-sm dark:border-slate-700/70 dark:bg-dark-card">
        <div className="flex min-w-0 items-start gap-3">
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 ${accent}`}>{icon}</div>
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</p>
                <div className="mt-1 break-words text-xl font-bold leading-tight text-foreground dark:text-dark-foreground">{value}</div>
                {subtext && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtext}</p>}
            </div>
        </div>
    </div>
);

const Chip: React.FC<{ children: React.ReactNode; tone?: 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'purple' }> = ({ children, tone = 'neutral' }) => {
    const tones = {
        neutral: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-200',
        blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/25 dark:text-blue-200',
        green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-200',
        amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/25 dark:text-amber-200',
        red: 'bg-red-50 text-red-700 dark:bg-red-900/25 dark:text-red-200',
        purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/25 dark:text-purple-200',
    };

    return <span className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
};

const ChipList: React.FC<{ items?: string[]; emptyText: string; tone?: React.ComponentProps<typeof Chip>['tone'] }> = ({ items = [], emptyText, tone = 'neutral' }) => {
    if (items.length === 0) return <span className="text-sm text-gray-500 dark:text-gray-400">{emptyText}</span>;

    return (
        <div className="flex min-w-0 flex-wrap gap-2">
            {items.map(item => <Chip key={item} tone={tone}>{item}</Chip>)}
        </div>
    );
};

const DonationsTab: React.FC<{ donations: Donation[] }> = ({ donations }) => {
    const { t, language } = useLocalization(['common', 'individual_donors']);

    if (donations.length === 0) return <EmptyPanel text={t('individual_donors.detailView.noDonations')} />;

    return (
        <Section title={t('individual_donors.detailView.donationHistory')}>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                    <thead className="text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-3 py-2 text-start">{t('individual_donors.detailView.date')}</th>
                            <th className="px-3 py-2 text-start">{t('individual_donors.detailView.program')}</th>
                            <th className="px-3 py-2 text-end">{t('individual_donors.detailView.amount')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {donations.map(donation => (
                            <tr key={donation.id}>
                                <td className="px-3 py-3">{formatDate(donation.date, language)}</td>
                                <td className="px-3 py-3 font-semibold">{donation.program}</td>
                                <td className="px-3 py-3 text-end font-bold">{formatCurrency(donation.amount, language)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );
};

const CommunicationsTab: React.FC<{ communications: Communication[] }> = ({ communications }) => {
    const { t, language } = useLocalization(['common', 'individual_donors']);

    if (communications.length === 0) return <EmptyPanel text={t('individual_donors.detailView.noCommunications')} />;

    return (
        <Section title={t('individual_donors.detailView.communicationHistory')}>
            <div className="space-y-3">
                {communications.map(communication => (
                    <div key={communication.communication_id} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-md bg-primary-light p-2 text-primary dark:bg-primary/20 dark:text-secondary">
                                    {communication.communication_type === 'call' ? <Phone size={16} /> : communication.communication_type === 'email' ? <Mail size={16} /> : <MessageSquare size={16} />}
                                </div>
                                <div>
                                    <p className="font-bold text-foreground dark:text-dark-foreground">{communication.subject}</p>
                                    <p className="text-xs text-gray-500">{communication.communication_type} / {communication.status}</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-gray-500">{formatRelativeTime(communication.sent_at, language)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const TasksTab: React.FC<{ tasks: DonorTask[] }> = ({ tasks }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);
    const openTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    const today = new Date().toISOString().split('T')[0];

    if (tasks.length === 0) return <EmptyPanel text={t('individual_donors.detailView.noTasks')} />;

    return (
        <div className="space-y-4">
            <Section title={t('individual_donors.detailView.openTasks')}>
                <div className="space-y-3">
                    {openTasks.map(task => (
                        <div key={task.id} className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                            <div>
                                <p className="font-bold">{task.text}</p>
                                <p className="text-xs text-gray-500">{task.type} / {task.assignedTo}</p>
                            </div>
                            <span className={`rounded-full px-2 py-1 text-xs font-bold ${task.dueDate < today ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300'}`}>
                                {formatDate(task.dueDate, language)}
                            </span>
                        </div>
                    ))}
                    {openTasks.length === 0 && <EmptyPanel text={t('individual_donors.detailView.noOpenTasks')} />}
                </div>
            </Section>
            {completedTasks.length > 0 && (
                <Section title={t('individual_donors.detailView.completedTasks')}>
                    <div className="space-y-2">
                        {completedTasks.map(task => (
                            <div key={task.id} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-slate-800/60 dark:text-gray-300">{task.text}</div>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
};

const getNextOpenTask = (tasks: DonorTask[] = []) => (
    tasks
        .filter(task => !task.completed)
        .slice()
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
);

const RelationshipHealthChip: React.FC<{ health?: IndividualDonor['relationshipHealth'] }> = ({ health }) => {
    if (!health) return <span>N/A</span>;
    const tone = health === 'Good' ? 'green' : health === 'At Risk' ? 'red' : 'amber';
    return <Chip tone={tone}>{health}</Chip>;
};

const RecentActivityList: React.FC<{ donations: Donation[]; communications: Communication[] }> = ({ donations, communications }) => {
    const { t, language } = useLocalization(['common', 'individual_donors']);
    const allActivities = [
        ...donations.map(donation => ({ id: donation.id, kind: 'donation' as const, date: donation.date, label: donation.program, amount: donation.amount })),
        ...communications.map(communication => ({ id: communication.communication_id, kind: 'communication' as const, date: communication.sent_at, label: communication.subject, channel: communication.communication_type })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    if (allActivities.length === 0) return <EmptyPanel text={t('individual_donors.detailView.noActivity', 'No recent activity recorded yet.')} />;

    return (
        <div className="space-y-3">
            {allActivities.map(activity => (
                <div key={`${activity.kind}-${activity.id}`} className="flex min-w-0 items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/30">
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm dark:bg-slate-800 dark:text-secondary">
                        {activity.kind === 'donation' ? <Gift size={17} /> : <MessageSquare size={17} />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold text-foreground dark:text-dark-foreground">
                            {activity.kind === 'donation'
                                ? t('individual_donors.detailView.activityDonation', { amount: formatCurrency(activity.amount, language), program: activity.label, defaultValue: `${formatCurrency(activity.amount, language)} donation to ${activity.label}` })
                                : t('individual_donors.detailView.activityCommunication', { channel: activity.channel, subject: activity.label, defaultValue: `${activity.channel} about ${activity.label}` })}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatRelativeTime(activity.date, language)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const OverviewTab: React.FC<{ donor: IndividualDonor; donations: Donation[]; communications: Communication[] }> = ({ donor, donations, communications }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);
    const openTasks = donor.relationshipTasks?.filter(task => !task.completed) || [];
    const nextTask = getNextOpenTask(donor.relationshipTasks);
    const stageLabel = donor.relationshipStage ? t(`donors.stages.${donor.relationshipStage}`) : 'N/A';
    const bestContact = donor.best_contact_time ? [donor.best_contact_day_of_week, donor.best_contact_time].filter(Boolean).join(' ') : 'N/A';

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard title={t('individual_donors.kpi.ltv')} value={formatCurrency(donor.totalDonations, language)} icon={<DollarSign size={19} />} accent="text-emerald-600 dark:text-emerald-300" />
                <MetricCard title={t('individual_donors.kpi.totalGifts')} value={formatNumber(donor.donationsCount || donations.length, language)} icon={<Gift size={19} />} accent="text-blue-600 dark:text-blue-300" />
                <MetricCard title={t('individual_donors.columns.pipelineStage')} value={stageLabel} icon={<Target size={19} />} subtext={donor.stageEnteredAt ? formatRelativeTime(donor.stageEnteredAt, language) : undefined} accent="text-amber-600 dark:text-amber-300" />
                <MetricCard title={t('individual_donors.columns.openTasks')} value={formatNumber(openTasks.length, language)} icon={<ClipboardList size={19} />} subtext={nextTask ? formatDate(nextTask.dueDate, language) : t('donors.kanban.noNextAction')} accent="text-purple-600 dark:text-purple-300" />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
                <Section title={t('individual_donors.detailView.engagementPlan', 'Engagement Plan')} icon={<HeartHandshake size={18} />}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="rounded-lg bg-primary-light/60 p-4 dark:bg-primary/10">
                            <p className="text-xs font-semibold uppercase tracking-wide text-primary dark:text-secondary">{t('individual_donors.columns.nextAction')}</p>
                            <p className="mt-2 break-words text-base font-bold text-foreground dark:text-dark-foreground">{nextTask?.text || donor.recommendedNextStep || t('donors.kanban.noNextAction')}</p>
                            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                                {nextTask ? `${t('donors.card.due')}: ${formatDate(nextTask.dueDate, language)}` : t('individual_donors.detailView.createNextAction', 'Create a clear next action for this donor.')}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoRow label={t('individual_donors.columns.owner')} value={donor.assignedManager} />
                            <InfoRow label={t('individual_donors.columns.relationshipHealth')} value={<RelationshipHealthChip health={donor.relationshipHealth} />} />
                            <InfoRow label={t('donors.kanban.likelihood')} value={donor.relationshipLikelihood ? t(`donors.likelihood.${donor.relationshipLikelihood}`) : 'N/A'} />
                            <InfoRow label={t('individual_donors.columns.lastContact')} value={donor.lastContactDate ? formatRelativeTime(donor.lastContactDate, language) : 'N/A'} />
                        </div>
                    </div>
                </Section>

                <Section title={t('individual_donors.detailView.contactInfo')} icon={<Phone size={18} />}>
                    <div className="space-y-4">
                        <InfoRow label={t('individual_donors.modal.email')} value={<a href={`mailto:${donor.email}`} className="text-primary hover:underline dark:text-secondary">{donor.email}</a>} />
                        <InfoRow label={t('individual_donors.modal.phone')} value={<a href={`tel:${donor.phone}`} className="text-primary hover:underline dark:text-secondary">{donor.phone}</a>} />
                        <InfoRow label="WhatsApp" value={donor.whatsapp || donor.phone} />
                        <InfoRow label={t('individual_donors.detailView.bestContact')} value={bestContact} />
                    </div>
                </Section>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <Section title={t('individual_donors.detailView.givingHistory')} icon={<WalletCards size={18} />} className="xl:col-span-1">
                    <div className="space-y-4">
                        <InfoRow label={t('individual_donors.columns.lastGift')} value={donor.lastDonationDate ? formatDate(donor.lastDonationDate, language) : 'N/A'} />
                        <InfoRow label={t('individual_donors.kpi.avgGift')} value={formatCurrency(donor.avgGift || 0, language)} />
                        <InfoRow label={t('individual_donors.detailView.programsSupported')} value={<ChipList items={donor.programsSupported} emptyText="N/A" tone="green" />} />
                    </div>
                </Section>
                <Section title={t('individual_donors.recentActivity')} icon={<Clock size={18} />} className="xl:col-span-2">
                    <RecentActivityList donations={donations} communications={communications} />
                </Section>
            </div>
        </div>
    );
};

const GivingProfileTab: React.FC<{ donor: IndividualDonor; donations: Donation[] }> = ({ donor, donations }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard title={t('individual_donors.columns.totalDonations')} value={formatCurrency(donor.totalDonations, language)} icon={<DollarSign size={19} />} accent="text-emerald-600 dark:text-emerald-300" />
                <MetricCard title={t('individual_donors.detailView.largestGift')} value={formatCurrency(donor.largestGift || 0, language)} icon={<Gift size={19} />} accent="text-blue-600 dark:text-blue-300" />
                <MetricCard title={t('donors.card.potential')} value={formatCurrency(donor.potentialGift || 0, language)} icon={<Target size={19} />} accent="text-amber-600 dark:text-amber-300" />
                <MetricCard title={t('donors.kanban.suggestedAsk')} value={formatCurrency(donor.suggestedAskAmount || 0, language)} icon={<WalletCards size={19} />} accent="text-purple-600 dark:text-purple-300" />
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <Section title={t('individual_donors.detailView.pipelineAsk')} icon={<Target size={18} />}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                        <InfoRow label={t('individual_donors.detailView.currentProposal')} value={donor.currentProposal || 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.askDate')} value={donor.askDate ? formatDate(donor.askDate, language) : 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.pledgeStatus')} value={donor.pledgeStatus || 'N/A'} />
                        <InfoRow label={t('individual_donors.detailView.expectedClose')} value={donor.expectedCloseDate ? formatDate(donor.expectedCloseDate, language) : 'N/A'} />
                    </div>
                </Section>
                <DonationsTab donations={donations} />
            </div>
        </div>
    );
};

const RelationshipProfileTab: React.FC<{ donor: IndividualDonor }> = ({ donor }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors', 'misc']);
    const donorName = donor.fullName[language] || donor.fullName.en;

    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
            <div className="space-y-5">
                <Section title={t('individual_donors.detailView.identity')} icon={<UserRound size={18} />}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoRow label={t('individual_donors.detailView.fullName')} value={donorName} />
                        <InfoRow label={t('individual_donors.columns.donorType')} value={donor.donorType ? t(`donors.types.${donor.donorType.replace(/ /g, '')}`, donor.donorType) : 'N/A'} />
                        <InfoRow label={t('individual_donors.columns.status')} value={donor.status} />
                        <InfoRow label={t('individual_donors.detailView.preferredLanguage')} value={donor.preferred_language?.toUpperCase() || 'N/A'} />
                        <InfoRow label={t('individual_donors.columns.country')} value={[donor.city, donor.country].filter(Boolean).join(', ')} />
                        <InfoRow label={t('individual_donors.detailView.address')} value={donor.address || 'N/A'} />
                    </div>
                    <div className="mt-5 border-t border-gray-200 pt-4 dark:border-slate-700">
                        <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('individual_donors.columns.tags')}</p>
                        <ChipList items={donor.tags} emptyText={t('individual_donors.relationship.noTags')} tone="blue" />
                    </div>
                </Section>

                <Section title={t('individual_donors.detailView.notesIntelligence')} icon={<Sparkles size={18} />}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoRow label={t('donorIntelligence.table.category')} value={getDonorCategoryLabel(donor.donorCategory || 'General Donor', t)} />
                            <InfoRow label={t('individual_donors.detailView.recommendedNextStep')} value={donor.recommendedNextStep || 'N/A'} />
                        </div>
                        {donor.relationshipNotes && <p className="rounded-lg bg-gray-50 p-4 text-sm font-semibold leading-6 text-gray-700 dark:bg-slate-900/40 dark:text-gray-200">{donor.relationshipNotes}</p>}
                        <div className="space-y-2">
                            {donor.aiInsights?.map(insight => (
                                <div key={insight} className="flex gap-3 rounded-lg bg-primary-light/60 p-3 text-sm font-semibold text-primary dark:bg-primary/15 dark:text-secondary">
                                    <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
                                    <span className="break-words">{insight}</span>
                                </div>
                            ))}
                            {donor.riskSignals?.map(signal => (
                                <div key={signal} className="flex gap-3 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-200">
                                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                                    <span className="break-words">{signal}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>
            </div>

            <Section title={t('individual_donors.detailView.stageTimeline')} icon={<CalendarClock size={18} />}>
                <div className="space-y-4">
                    {(donor.stageHistory || []).map((entry, index) => (
                        <div key={`${entry.stage}-${entry.enteredAt}-${index}`} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary dark:bg-primary/20 dark:text-secondary"><CalendarClock size={15} /></div>
                                {index < (donor.stageHistory?.length || 0) - 1 && <div className="h-10 w-px bg-gray-200 dark:bg-slate-700" />}
                            </div>
                            <div className="min-w-0 pb-3">
                                <p className="break-words font-bold text-foreground dark:text-dark-foreground">{t(`donors.stages.${entry.stage}`)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(entry.enteredAt, language)}</p>
                                {entry.note && <p className="mt-1 break-words text-xs text-gray-500 dark:text-gray-400">{entry.note}</p>}
                            </div>
                        </div>
                    ))}
                    {(donor.stageHistory || []).length === 0 && <EmptyPanel text={t('individual_donors.detailView.noStageHistory', 'No stage history yet.')} />}
                </div>
            </Section>
        </div>
    );
};

const ActivityProfileTab: React.FC<{ tasks: DonorTask[]; communications: Communication[] }> = ({ tasks, communications }) => (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <TasksTab tasks={tasks} />
        <CommunicationsTab communications={communications} />
    </div>
);

const DonorDocumentsTab: React.FC<{ donor: IndividualDonor }> = ({ donor }) => {
    const { t, language } = useLocalization(['common', 'individual_donors']);

    return (
        <Section title={t('individual_donors.detailView.documents')} icon={<FileText size={18} />}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {donor.documents && donor.documents.length > 0 ? donor.documents.map(document => (
                    <div key={document.id} className="flex min-w-0 items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/30">
                        <FileText size={18} className="mt-1 flex-shrink-0 text-primary dark:text-secondary" />
                        <div className="min-w-0">
                            <p className="break-words font-bold text-foreground dark:text-dark-foreground">{document.title}</p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{document.type} / {formatDate(document.date, language)}</p>
                        </div>
                    </div>
                )) : <div className="md:col-span-2 xl:col-span-3"><EmptyPanel text={t('individual_donors.detailView.noDocuments')} /></div>}
            </div>
        </Section>
    );
};


const DonorDetailView: React.FC<DonorDetailViewProps> = ({ donor, onBack }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'misc']);
    const toast = useToast();
    const [activeTab, setActiveTab] = React.useState('overview');
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const handleLogInteraction = (interaction: any) => {
        console.log('Logging interaction:', interaction);
        toast.showSuccess('Interaction logged successfully.');
        setIsLogModalOpen(false);
    };

    const handleSendEmail = (emailData: any) => {
        console.log('Sending email:', emailData);
        toast.showSuccess(`Email sent to ${emailData.to}.`);
        setIsEmailModalOpen(false);
    };

    const StatusBadge: React.FC<{ status: IndividualDonor['status'] }> = ({ status }) => {
        const statusKey = status.replace(/ /g, '');
        const styles: Record<IndividualDonor['status'], string> = {
            'Active': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            'Lapsed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'On Hold': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            'Deceased': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
            'Disqualified': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{t(`individual_donors.statuses.${statusKey}`)}</span>;
    };
    
    const TierBadge: React.FC<{ tier: IndividualDonor['tier'] }> = ({ tier }) => {
        const tierKey = tier.replace(/ /g, '');
        const styles: Record<string, string> = {
            'Bronze': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
            'Silver': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
            'Gold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'Platinum': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
            'MajorDonor': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
        };
        const styleClass = styles[tierKey] || styles['Bronze'];
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styleClass}`}>{t(`individual_donors.tiers.${tierKey}`)}</span>;
    };

    const tabs = [
        { id: 'overview', label: t('individual_donors.detailView.overview') },
        { id: 'giving', label: t('individual_donors.detailView.giving', 'Giving') },
        { id: 'relationship', label: t('individual_donors.detailView.relationship', 'Relationship') },
        { id: 'activity', label: t('individual_donors.detailView.activity', 'Activity') },
        { id: 'documents', label: t('individual_donors.detailView.documents') },
    ];

    const renderTabContent = () => {
        // This data would normally be filtered by a hook, but for now we filter it here
        const donorDonations = MOCK_DONATIONS.filter(d => d.donorId === donor.id);
        const donorCommunications = MOCK_COMMUNICATIONS.filter(c => c.donor_id === donor.id);

        switch(activeTab) {
            case 'overview':
                return <OverviewTab donor={donor} donations={donorDonations} communications={donorCommunications} />;
            case 'giving':
                return <GivingProfileTab donor={donor} donations={donorDonations} />;
            case 'relationship':
                return <RelationshipProfileTab donor={donor} />;
            case 'activity':
                return <ActivityProfileTab tasks={donor.relationshipTasks || []} communications={donorCommunications} />;
            case 'documents':
                return <DonorDocumentsTab donor={donor} />;
            default:
                return <div className="text-center p-8">{t('placeholder.underConstruction')}</div>
        }
    };

    return (
        <>
            <div className="animate-fade-in space-y-4 pb-24 md:pb-0">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('individual_donors.backToList')}
                </button>

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-card shadow-soft dark:border-slate-700/60 dark:bg-dark-card">
                    <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_auto]">
                        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                            <img src={donor.avatar} alt={donor.fullName[language]} className="h-20 w-20 flex-shrink-0 rounded-2xl border-4 border-primary-light object-cover dark:border-primary/20 sm:h-24 sm:w-24" />
                            <div className="min-w-0">
                                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <h1 className="break-words text-2xl font-bold leading-tight text-foreground dark:text-dark-foreground sm:text-3xl">{donor.fullName[language] || donor.fullName.en}</h1>
                                        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                            <MapPin size={15} /> {[donor.city, donor.country].filter(Boolean).join(', ') || donor.country}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <TierBadge tier={donor.tier} />
                                    <StatusBadge status={donor.status} />
                                    {donor.relationshipStage && <Chip tone="blue">{t(`donors.stages.${donor.relationshipStage}`)}</Chip>}
                                    {donor.relationshipHealth && <RelationshipHealthChip health={donor.relationshipHealth} />}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:w-80 xl:grid-cols-1">
                            <button onClick={() => setIsEmailModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary-dark">
                                <Mail size={16} /> {t('individual_donors.detailView.sendEmail')}
                            </button>
                            <button onClick={() => setIsLogModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">
                                <MessageSquare size={16} /> {t('individual_donors.detailView.logInteraction')}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-gray-200 bg-gray-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/20 xl:grid-cols-4">
                        <InfoRow label={t('individual_donors.columns.totalDonations')} value={formatCurrency(donor.totalDonations, language)} />
                        <InfoRow label={t('individual_donors.columns.owner')} value={donor.assignedManager} />
                        <InfoRow label={t('individual_donors.columns.lastContact')} value={donor.lastContactDate ? formatRelativeTime(donor.lastContactDate, language) : 'N/A'} />
                        <InfoRow label={t('individual_donors.columns.nextAction')} value={getNextOpenTask(donor.relationshipTasks)?.text || donor.recommendedNextStep || t('donors.kanban.noNextAction')} />
                    </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-card shadow-sm dark:border-slate-700/60 dark:bg-dark-card">
                    <div className="px-4 pt-2 sm:px-6">
                        <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
                    </div>
                    <div className="rounded-b-2xl bg-gray-50/70 p-4 dark:bg-dark-background/30 sm:p-6">
                        {renderTabContent()}
                    </div>
                </section>
            </div>

            <LogInteractionModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onLog={handleLogInteraction}
            />
            <SendEmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSend={handleSendEmail}
                donorEmail={donor.email}
            />
        </>
    );
};

export default DonorDetailView;
