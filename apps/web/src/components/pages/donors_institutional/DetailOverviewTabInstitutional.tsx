import React from 'react';
import type { InstitutionalDonor, GrantmakerRelationshipStatus, PriorityLevel } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency, formatDate, formatNumber, formatRelativeTime } from '../../../lib/utils';
import { Building2, CalendarClock, CircleDollarSign, Flag, Globe2, Handshake, MapPin, Sparkles, UserRound, WalletCards } from 'lucide-react';

const Panel: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
    <section className={`min-w-0 rounded-xl border border-gray-200/80 bg-card p-5 shadow-sm dark:border-slate-700/70 dark:bg-dark-card ${className}`}>
        <div className="mb-4 flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary dark:bg-primary/20 dark:text-secondary">{icon}</div>
            <h3 className="truncate text-base font-bold text-foreground dark:text-dark-foreground">{title}</h3>
        </div>
        {children}
    </section>
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

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <div className="mt-1 break-words text-sm font-bold leading-6 text-foreground dark:text-dark-foreground">{value || 'N/A'}</div>
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

const ChipList: React.FC<{ items: string[]; emptyText: string; tone?: React.ComponentProps<typeof Chip>['tone'] }> = ({ items, emptyText, tone = 'neutral' }) => {
    if (items.length === 0) return <span className="text-sm text-gray-500 dark:text-gray-400">{emptyText}</span>;

    return (
        <div className="flex flex-wrap gap-2">
            {items.map(item => <Chip key={item} tone={tone}>{item}</Chip>)}
        </div>
    );
};

const StatusBadge: React.FC<{ status: GrantmakerRelationshipStatus }> = ({ status }) => {
    const { t } = useLocalization(['institutional_donors']);
    const tones: Record<GrantmakerRelationshipStatus, React.ComponentProps<typeof Chip>['tone']> = {
        Cold: 'neutral',
        Prospect: 'blue',
        Cultivating: 'amber',
        Active: 'green',
        Stewardship: 'purple',
    };

    return <Chip tone={tones[status]}>{t(`institutional_donors.statuses.${status}`)}</Chip>;
};

const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
    const { t } = useLocalization(['institutional_donors']);
    const tones: Record<PriorityLevel, React.ComponentProps<typeof Chip>['tone']> = {
        High: 'red',
        Medium: 'amber',
        Low: 'green',
    };

    return <Chip tone={tones[priority]}>{t(`institutional_donors.priorities.${priority}`)}</Chip>;
};

const DetailOverviewTabInstitutional: React.FC<{ donor: InstitutionalDonor }> = ({ donor }) => {
    const { t, language } = useLocalization(['common', 'institutional_donors']);
    const organizationName = donor.organizationName[language] || donor.organizationName.en;
    const location = [donor.city, donor.country].filter(Boolean).join(', ');
    const nextDeadlineDate = donor.nextDeadline ? new Date(donor.nextDeadline) : null;
    const nextDeadlineState = nextDeadlineDate
        ? nextDeadlineDate.getTime() < Date.now()
            ? t('institutional_donors.detail.deadlinePassed', 'Deadline passed')
            : formatRelativeTime(donor.nextDeadline, language)
        : t('institutional_donors.detail.noDeadline', 'No deadline set');
    const donationsThisYear = donor.totalGrantsAwarded / 4;
    const completionRate = Math.min(98, Math.max(65, Math.round(82 + donor.activeGrants / 20)));

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard title={t('institutional_donors.detail.totalAwarded')} value={formatCurrency(donor.totalGrantsAwarded, language, 'USD')} icon={<CircleDollarSign size={19} />} accent="text-emerald-600 dark:text-emerald-300" />
                <MetricCard title={t('institutional_donors.detail.activeGrants')} value={formatNumber(donor.activeGrants, language)} icon={<WalletCards size={19} />} accent="text-blue-600 dark:text-blue-300" />
                <MetricCard title={t('institutional_donors.detail.nextDeadline')} value={donor.nextDeadline ? formatDate(donor.nextDeadline, language) : 'N/A'} icon={<CalendarClock size={19} />} subtext={nextDeadlineState} accent="text-amber-600 dark:text-amber-300" />
                <MetricCard title={t('institutional_donors.detail.priority')} value={<PriorityBadge priority={donor.priority} />} icon={<Flag size={19} />} accent="text-red-600 dark:text-red-300" />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                <Panel title={t('institutional_donors.detail.relationshipBrief', 'Relationship Brief')} icon={<Handshake size={18} />}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoRow label={t('institutional_donors.detail.status')} value={<StatusBadge status={donor.relationshipStatus} />} />
                        <InfoRow label={t('institutional_donors.detail.assignedManager')} value={donor.assignedManager} />
                        <InfoRow label={t('institutional_donors.detail.primaryContact', 'Primary Contact')} value={donor.primaryContact.name} />
                        <InfoRow label={t('institutional_donors.detail.email')} value={<a href={`mailto:${donor.primaryContact.email}`} className="text-primary hover:underline dark:text-secondary">{donor.primaryContact.email}</a>} />
                        <InfoRow label={t('institutional_donors.detail.lastContact', 'Last Contact')} value={donor.lastContactDate ? formatRelativeTime(donor.lastContactDate, language) : 'N/A'} />
                        <InfoRow label={t('institutional_donors.detail.type')} value={t(`institutional_donors.types.${donor.type}`)} />
                    </div>
                </Panel>

                <Panel title={t('institutional_donors.detail.nextMove', 'Next Move')} icon={<Sparkles size={18} />}>
                    <div className="rounded-lg bg-primary-light/60 p-4 dark:bg-primary/10">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary dark:text-secondary">{organizationName}</p>
                        <p className="mt-2 break-words text-base font-bold leading-6 text-foreground dark:text-dark-foreground">
                            {donor.nextDeadline
                                ? t('institutional_donors.detail.prepareDeadline', { date: formatDate(donor.nextDeadline, language), defaultValue: `Prepare next submission before ${formatDate(donor.nextDeadline, language)}.` })
                                : t('institutional_donors.detail.scheduleStewardship', 'Schedule a stewardship touchpoint and confirm the next funding window.')}
                        </p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <InfoRow label={t('institutional_donors.detail.donationsThisYear')} value={formatCurrency(donationsThisYear, language, 'USD')} />
                        <InfoRow label={t('institutional_donors.analyticsDashboard.projectCompletion')} value={`${formatNumber(completionRate, language)}%`} />
                    </div>
                </Panel>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <Panel title={t('institutional_donors.detail.focusFit', 'Focus Fit')} icon={<Globe2 size={18} />} className="xl:col-span-1">
                    <div className="space-y-4">
                        <div>
                            <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('institutional_donors.columns.focus')}</p>
                            <ChipList items={donor.focusAreas} emptyText="N/A" tone="blue" />
                        </div>
                        <div>
                            <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('institutional_donors.detail.geographicFocus', 'Geographic Focus')}</p>
                            <ChipList items={donor.geographicFocus} emptyText="N/A" tone="green" />
                        </div>
                    </div>
                </Panel>

                <Panel title={t('institutional_donors.detail.organizationProfile', 'Organization Profile')} icon={<Building2 size={18} />} className="xl:col-span-2">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoRow label={t('institutional_donors.detail.country')} value={<span className="inline-flex items-center gap-1"><MapPin size={14} /> {location || donor.country}</span>} />
                        <InfoRow label={t('institutional_donors.detail.registrationNumber')} value={donor.registrationNumber || 'N/A'} />
                        <InfoRow label={t('institutional_donors.detail.establishmentDate')} value={donor.establishmentDate ? formatDate(donor.establishmentDate, language) : 'N/A'} />
                        <InfoRow label={t('institutional_donors.detail.createdDate', 'Added To CRM')} value={formatDate(donor.createdDate, language)} />
                    </div>
                </Panel>
            </div>

            <Panel title={t('institutional_donors.analyticsDashboard.title')} icon={<UserRound size={18} />}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <InfoRow label={t('institutional_donors.analyticsDashboard.donationGrowth')} value="+15.2%" />
                    <InfoRow label={t('institutional_donors.analyticsDashboard.projectCompletion')} value={`${formatNumber(completionRate, language)}%`} />
                    <InfoRow label={t('institutional_donors.analyticsDashboard.communicationFrequency')} value={t('institutional_donors.detail.every45Days', 'Every 45 days')} />
                    <InfoRow label={t('institutional_donors.analyticsDashboard.satisfactionScore')} value="4.8 / 5" />
                </div>
            </Panel>
        </div>
    );
};

export default DetailOverviewTabInstitutional;
