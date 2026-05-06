import React from 'react';
import { DollarSign, Gift, ReceiptText, Target, TrendingUp, WalletCards } from 'lucide-react';
import type { DonorProfileSummary, ProfileDonation } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { formatCurrency, formatDate, formatRelativeTime } from '../../../../lib/utils';
import { Chip, EmptyPanel, InfoRow, MetricCard, Section } from './profileUi';

interface DonorGivingTabProps {
    summary: DonorProfileSummary;
    donations: ProfileDonation[];
    isLoading?: boolean;
}

const GivingStatusChip: React.FC<{ status: DonorProfileSummary['giving']['currentGivingStatus'] }> = ({ status }) => {
    const label = {
        active: 'Active',
        lapsed: 'Lapsed',
        recurring: 'Recurring',
        pledge_open: 'Pledge open',
        no_gifts: 'No gifts',
    }[status];
    const tone = status === 'active' || status === 'recurring' ? 'green' : status === 'lapsed' ? 'amber' : 'neutral';
    return <Chip tone={tone}>{label}</Chip>;
};

const DonorGivingTab: React.FC<DonorGivingTabProps> = ({ summary, donations, isLoading }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);
    const suggestedAsk = summary.computed.suggestedAskAmount;
    const askAvailable = suggestedAsk !== null && suggestedAsk > 0;

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard title={t('individual_donors.columns.totalDonations')} value={formatCurrency(summary.giving.lifetimeGiving, language)} icon={<DollarSign size={19} />} accent="text-emerald-600 dark:text-emerald-300" />
                <MetricCard title={t('individual_donors.columns.lastGift')} value={summary.giving.lastGiftAmount !== null ? formatCurrency(summary.giving.lastGiftAmount, language) : 'N/A'} icon={<Gift size={19} />} subtext={summary.giving.lastGiftDate ? formatRelativeTime(summary.giving.lastGiftDate, language) : undefined} accent="text-blue-600 dark:text-blue-300" />
                <MetricCard title={t('individual_donors.kpi.avgGift')} value={summary.giving.averageGift !== null ? formatCurrency(summary.giving.averageGift, language) : 'N/A'} icon={<TrendingUp size={19} />} accent="text-amber-600 dark:text-amber-300" />
                <MetricCard title={t('individual_donors.detailView.currentGivingStatus', 'Giving Status')} value={<GivingStatusChip status={summary.giving.currentGivingStatus} />} icon={<WalletCards size={19} />} accent="text-primary dark:text-secondary" />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(290px,0.65fr)_minmax(0,1.35fr)]">
                <Section title={t('individual_donors.detailView.pipelineAsk')} icon={<Target size={18} />}>
                    <div className="space-y-4">
                        <InfoRow label={t('individual_donors.columns.pipelineStage')} value={t(`donors.stages.${summary.relationship.pipelineStage}`, summary.relationship.pipelineStage)} />
                        <InfoRow
                            label={t('donors.kanban.suggestedAsk')}
                            value={askAvailable ? formatCurrency(suggestedAsk, language) : <Chip>Not enough data</Chip>}
                        />
                        <div className="rounded-lg bg-gray-50 p-4 text-sm font-semibold leading-6 text-gray-600 dark:bg-slate-900/40 dark:text-gray-300">
                            {askAvailable
                                ? t('individual_donors.detailView.askRationale', { defaultValue: 'Suggested ask is manager-provided for this MVP profile.' })
                                : t('individual_donors.detailView.askUnavailable', { defaultValue: 'Suggested ask is unavailable until there is a defensible calculation or a manager override.' })}
                        </div>
                        <InfoRow label={t('individual_donors.detailView.source', 'Source')} value={`${summary.computed.suggestedAskSource} / ${summary.computed.suggestedAskConfidence}`} muted />
                    </div>
                </Section>

                <Section title={t('individual_donors.detailView.donationHistory')} icon={<ReceiptText size={18} />}>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[0, 1, 2].map((item) => <div key={item} className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />)}
                        </div>
                    ) : donations.length === 0 ? (
                        <EmptyPanel text={t('individual_donors.detailView.noDonations')} />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-sm">
                                <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th className="px-3 py-2 text-start">{t('individual_donors.detailView.date')}</th>
                                        <th className="px-3 py-2 text-start">{t('individual_donors.detailView.program')}</th>
                                        <th className="px-3 py-2 text-start">{t('individual_donors.detailView.payment', 'Payment')}</th>
                                        <th className="px-3 py-2 text-start">{t('individual_donors.detailView.status', 'Status')}</th>
                                        <th className="px-3 py-2 text-end">{t('individual_donors.detailView.amount')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {donations.map((donation) => (
                                        <tr key={donation.id}>
                                            <td className="px-3 py-3 whitespace-nowrap">{donation.date ? formatDate(donation.date, language) : 'N/A'}</td>
                                            <td className="px-3 py-3">
                                                <p className="font-bold text-foreground dark:text-dark-foreground">{donation.designation || donation.program || 'General'}</p>
                                                {donation.campaign && <p className="text-xs text-gray-500 dark:text-gray-400">{donation.campaign}</p>}
                                            </td>
                                            <td className="px-3 py-3">{donation.payment_method || 'N/A'}</td>
                                            <td className="px-3 py-3">
                                                <div className="flex flex-wrap gap-2">
                                                    <Chip tone={donation.status === 'posted' ? 'green' : 'amber'}>{donation.status}</Chip>
                                                    {donation.refund_state !== 'none' && <Chip tone="red">{donation.refund_state}</Chip>}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-end font-bold">{formatCurrency(donation.amount, language)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Section>
            </div>
        </div>
    );
};

export default DonorGivingTab;
