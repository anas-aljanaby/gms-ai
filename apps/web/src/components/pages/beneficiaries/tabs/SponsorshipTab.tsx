import React from 'react';
import type { Beneficiary, SponsorshipInfo } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { formatCurrency, formatDate } from '../../../../lib/utils';
import { HeartHandshake, Calendar, DollarSign, User, Info } from 'lucide-react';

const InfoRow: React.FC<{ label: string; value?: string | number | null; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-start gap-3 min-w-0 p-3 rounded-lg bg-gray-50/80 dark:bg-slate-800/30">
        {icon && <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm dark:bg-slate-800 dark:text-secondary">{icon}</div>}
        <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
            <div className="mt-0.5 break-words text-sm font-bold leading-6 text-foreground dark:text-dark-foreground">{value ?? '—'}</div>
        </div>
    </div>
);

const SponsorshipTab: React.FC<{ beneficiary: Beneficiary }> = ({ beneficiary }) => {
    const { t, language } = useLocalization(['beneficiaries']);
    const p = beneficiary.profile;

    let sponsorship: SponsorshipInfo | undefined;
    if (p.type === 'student' || p.type === 'orphan' || p.type === 'hafiz') {
        sponsorship = p.sponsorship;
    }

    if (!sponsorship) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white/70 p-10 text-center dark:border-slate-700 dark:bg-slate-900/30">
                <HeartHandshake className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                <p className="mt-3 text-sm font-semibold text-gray-500 dark:text-gray-400">{t('beneficiaries.noSponsorshipData')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <section className="min-w-0 rounded-xl border border-gray-200/80 bg-card p-5 shadow-sm dark:border-slate-700/70 dark:bg-dark-card">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-300">
                        <HeartHandshake size={18} />
                    </div>
                    <h3 className="text-base font-bold text-foreground dark:text-dark-foreground">{t('beneficiaries.tabs.sponsorship')}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoRow
                        label={t('beneficiaries.fields.supportType')}
                        value={t(`beneficiaries.supportTypes.${beneficiary.supportType}`)}
                        icon={<HeartHandshake size={16} />}
                    />
                    {sponsorship.startDate && (
                        <InfoRow
                            label={t('beneficiaries.fields.startDate')}
                            value={formatDate(sponsorship.startDate, language, 'long')}
                            icon={<Calendar size={16} />}
                        />
                    )}
                    {sponsorship.monthlyAmount !== undefined && (
                        <InfoRow
                            label={t('beneficiaries.fields.monthlyAmount')}
                            value={`${formatCurrency(sponsorship.monthlyAmount, language)} ${sponsorship.currency ? `(${sponsorship.currency})` : ''}`}
                            icon={<DollarSign size={16} />}
                        />
                    )}
                    {sponsorship.donorId && (
                        <InfoRow
                            label={t('beneficiaries.fields.donorId')}
                            value={String(sponsorship.donorId)}
                            icon={<User size={16} />}
                        />
                    )}
                </div>
            </section>

            {/* Backend note */}
            <div className="flex items-start gap-3 rounded-lg border border-blue-200/60 bg-blue-50/50 p-4 dark:border-blue-800/30 dark:bg-blue-900/10">
                <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">{t('beneficiaries.sponsorshipNote')}</p>
            </div>
        </div>
    );
};

export default SponsorshipTab;
