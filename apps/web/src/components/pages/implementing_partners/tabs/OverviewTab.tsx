import React from 'react';
import { Briefcase, CheckCircle, FileCheck, Mail, MapPin, Star, Tag, User } from 'lucide-react';
import type { Partner } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { formatCurrency } from '../../../../lib/utils';

const STATUS_STYLES: Record<string, string> = {
    'نشط': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'غير نشط': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'قيد المراجعة': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
};

interface OverviewRowProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

const OverviewRow: React.FC<OverviewRowProps> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-primary dark:text-secondary mt-0.5">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
            <div className="font-semibold text-foreground dark:text-dark-foreground">{value}</div>
        </div>
    </div>
);

interface OverviewTabProps {
    partner: Partner;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ partner }) => {
    const { t, language } = useLocalization(['partners']);

    const primaryContact = partner.contacts?.find((c) => c.isPrimary) ?? partner.contacts?.[0];
    const isEligible = partner.status === 'نشط';
    const hasAgreement = partner.status !== 'غير نشط';
    const complianceCurrent = partner.status !== 'قيد المراجعة';

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold">{t('partners.detail.overview.summaryTitle')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-slate-700/50 p-5 rounded-xl space-y-4">
                    <OverviewRow
                        icon={<CheckCircle size={18} />}
                        label={t('partners.detail.overview.statusEligibility')}
                        value={
                            <div className="space-y-1">
                                <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full ${STATUS_STYLES[partner.status] ?? ''}`}>
                                    {partner.status}
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {isEligible ? t('partners.detail.overview.eligible') : t('partners.detail.overview.notEligible')}
                                </p>
                            </div>
                        }
                    />
                    <OverviewRow
                        icon={<Tag size={18} />}
                        label={t('partners.detail.overview.sectorCountry')}
                        value={`${partner.sector} · ${partner.country}`}
                    />
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/50 p-5 rounded-xl space-y-4">
                    <OverviewRow
                        icon={<User size={18} />}
                        label={t('partners.detail.overview.primaryContact')}
                        value={
                            primaryContact ? (
                                <div>
                                    <p>{primaryContact.name}</p>
                                    <p className="text-sm text-gray-500 font-normal">{primaryContact.position}</p>
                                    <a href={`mailto:${primaryContact.email}`} className="text-sm text-primary hover:underline flex items-center gap-1 mt-1">
                                        <Mail size={14} /> {primaryContact.email}
                                    </a>
                                </div>
                            ) : (
                                <span className="text-gray-400 italic">{t('partners.detail.overview.noPrimaryContact')}</span>
                            )
                        }
                    />
                    <OverviewRow
                        icon={<Star size={18} />}
                        label={t('partners.detail.overview.latestPerformance')}
                        value={`${partner.rating.toFixed(1)} / 5.0`}
                    />
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/50 p-5 rounded-xl space-y-4">
                    <OverviewRow
                        icon={<FileCheck size={18} />}
                        label={t('partners.detail.overview.agreementStatus')}
                        value={hasAgreement ? t('partners.detail.overview.agreementActive') : t('partners.detail.overview.agreementNone')}
                    />
                    <OverviewRow
                        icon={<MapPin size={18} />}
                        label={t('partners.detail.overview.complianceStatus')}
                        value={complianceCurrent ? t('partners.detail.overview.complianceCurrent') : t('partners.detail.overview.compliancePending')}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl text-center">
                    <Briefcase className="mx-auto mb-2 text-blue-600" size={24} />
                    <p className="text-sm text-gray-500">{t('partners.detail.overview.activeProjects')}</p>
                    <p className="text-2xl font-bold">{partner.projectsInProgress}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl text-center">
                    <CheckCircle className="mx-auto mb-2 text-green-600" size={24} />
                    <p className="text-sm text-gray-500">{t('partners.detail.overview.completedProjects')}</p>
                    <p className="text-2xl font-bold">{partner.projectsCompleted}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl text-center">
                    <p className="text-sm text-gray-500">{t('partners.detail.overview.totalBudget')}</p>
                    <p className="text-2xl font-bold">{formatCurrency(partner.budget, language)}</p>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
