
import React from 'react';
import type { IndividualDonor, Donation, Communication } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency, formatDate, formatRelativeTime } from '../../../lib/utils';
import { getDonorCategoryLabel } from '../../../lib/utils';
import { DollarSign, Gift, Hash, Calendar, Zap, MessageSquare, Clock, Mail } from 'lucide-react';
import { channelIcons } from '../../icons/ChannelIcons';

interface DetailOverviewTabProps {
    donor: IndividualDonor;
    donations: Donation[];
    communications: Communication[];
}

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; subtext?: string }> = ({ title, value, icon, subtext }) => (
    <div className="bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-light dark:bg-primary/20 text-primary dark:text-secondary rounded-lg">{icon}</div>
            <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h4>
                <p className="text-2xl font-bold">{value}</p>
                {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
            </div>
        </div>
    </div>
);

const InfoItem: React.FC<{ label: string; value: React.ReactNode; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-primary dark:text-secondary mt-1">{icon}</div>
        <div>
            <p className="text-xs font-semibold text-gray-500">{label}</p>
            <p className="font-bold">{value || 'N/A'}</p>
        </div>
    </div>
);


const DetailOverviewTab: React.FC<DetailOverviewTabProps> = ({ donor, donations, communications }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);

    const avgGift = donor.donationsCount && donor.donationsCount > 0 ? donor.totalDonations / donor.donationsCount : 0;
    
    const allActivities = [
        ...donations.map(d => ({ type: 'donation', date: d.date, data: d })),
        ...communications.map(c => ({ type: 'communication', date: c.sent_at, data: c })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    const BestTimeIcon = donor.preferred_contact_channel ? channelIcons[donor.preferred_contact_channel] : Mail;
    const bestTimeString = donor.best_contact_time ? `${donor.best_contact_day_of_week}s at ${donor.best_contact_time}` : 'Not enough data';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <KpiCard title={t('individual_donors.kpi.ltv')} value={formatCurrency(donor.totalDonations, language)} icon={<DollarSign size={20}/>} />
                    <KpiCard title={t('individual_donors.kpi.avgGift')} value={formatCurrency(avgGift, language)} icon={<Gift size={20}/>} />
                    <KpiCard title={t('individual_donors.kpi.totalGifts')} value={String(donor.donationsCount || 0)} icon={<Hash size={20}/>} />
                    <KpiCard title={t('individual_donors.kpi.donorSince')} value={formatDate(donor.donorSince, language, 'long')} icon={<Calendar size={20}/>} />
                </div>

                {/* Recent Activity */}
                <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-soft">
                    <h3 className="font-bold text-lg mb-4">{t('individual_donors.recentActivity')}</h3>
                    <div className="space-y-4">
                        {allActivities.map((activity, index) => (
                             <div key={index} className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                                        {activity.type === 'donation' ? <Gift size={16}/> : <MessageSquare size={16}/>}
                                    </div>
                                    {index < allActivities.length - 1 && <div className="w-px h-8 bg-gray-200 dark:bg-slate-700"></div>}
                                </div>
                                <div className="pb-4">
                                    <p className="font-semibold text-sm">
                                        {activity.type === 'donation' 
                                            ? `Donation of ${formatCurrency((activity.data as Donation).amount, language)}` 
                                            : `Sent ${(activity.data as Communication).communication_type}: "${(activity.data as Communication).subject}"`
                                        }
                                    </p>
                                    <p className="text-xs text-gray-500">{formatRelativeTime(activity.date, language)}</p>
                                </div>
                            </div>
                        ))}
                         {allActivities.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>}
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
                 {/* Donor Intelligence */}
                <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-soft">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Zap size={20}/> {t('donorIntelligence.title')}</h3>
                     <div className="space-y-4">
                        <InfoItem label={t('donorIntelligence.table.category')} value={getDonorCategoryLabel(donor.donorCategory || 'General Donor', t)} icon={<Zap size={16}/>} />
                        <InfoItem label={t('optimalContactTiming.table.engagement')} value={`${donor.engagement_score || 0}/100`} icon={<Zap size={16}/>} />
                        <InfoItem label={t('donorIntelligence.table.preferredProgram')} value={donor.primaryProgramInterest} icon={<Zap size={16}/>} />
                    </div>
                </div>

                 {/* Optimal Contact */}
                <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-soft">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Clock size={20}/> {t('sidebar.optimal_contact_timing')}</h3>
                    <div className="space-y-4">
                        <InfoItem label={t('optimalContactTiming.table.bestTime')} value={bestTimeString} icon={<BestTimeIcon className="w-4 h-4"/>} />
                        <InfoItem label={t('optimalContactTiming.table.nextDonation')} value={donor.next_predicted_donation_date ? formatDate(donor.next_predicted_donation_date, language) : 'N/A'} icon={<Calendar size={16}/>} />
                        <InfoItem label={t('optimalContactTiming.table.predictedAmount')} value={donor.next_predicted_amount ? formatCurrency(donor.next_predicted_amount, language) : 'N/A'} icon={<DollarSign size={16}/>} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailOverviewTab;
