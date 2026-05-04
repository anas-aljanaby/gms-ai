import React from 'react';
import { motion } from 'framer-motion';
import type { InstitutionalDonor, GrantmakerRelationshipStatus, PriorityLevel } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatDate, formatCurrency } from '../../../lib/utils';
import { TrendingUp, CheckCircle, MessageSquare, Smile, TrendingDown } from 'lucide-react';
import Sparkline from '../../common/Sparkline';

interface InfoRowProps {
  labelKey: string;
  value: React.ReactNode;
}

const AnalyticsKpiCard: React.FC<{ icon: React.ReactNode, title: string, value: string, trend: number, trendDirection: 'up' | 'down' | 'neutral', positiveIsUp?: boolean }> = ({ icon, title, value, trend, trendDirection, positiveIsUp = true }) => {
    const isPositive = positiveIsUp ? trendDirection === 'up' : trendDirection === 'down';
    const trendColor = trendDirection === 'neutral' ? 'text-gray-500' : isPositive ? 'text-green-500' : 'text-red-500';
    const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl"
        >
            <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-200 dark:bg-slate-700 rounded-lg">{icon}</div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h4>
                    <p className="text-2xl font-bold text-foreground dark:text-dark-foreground">{value}</p>
                </div>
            </div>
            {trendDirection !== 'neutral' && (
                <div className={`mt-2 flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
                    <TrendIcon size={16} />
                    <span>{trend}% vs. previous period</span>
                </div>
            )}
        </motion.div>
    );
};

const AnalyticsDashboard: React.FC = () => {
    const { t } = useLocalization(['common', 'institutional_donors']);
    const analyticsData = {
      donationGrowth: 15.2,
      projectCompletion: 92,
      communicationFrequency: 45, // days
      satisfactionScore: 4.8
    };

    return (
        <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-inner border dark:border-slate-700/50">
            <h3 className="text-xl font-bold mb-4">{t('institutional_donors.analyticsDashboard.title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsKpiCard 
                    icon={<TrendingUp className="text-green-500" />} 
                    title={t('institutional_donors.analyticsDashboard.donationGrowth')}
                    value={`${analyticsData.donationGrowth}%`}
                    trend={analyticsData.donationGrowth}
                    trendDirection="up"
                />
                <AnalyticsKpiCard 
                    icon={<CheckCircle className="text-blue-500" />} 
                    title={t('institutional_donors.analyticsDashboard.projectCompletion')}
                    value={`${analyticsData.projectCompletion}%`}
                    trend={2}
                    trendDirection="up"
                />
                 <AnalyticsKpiCard 
                    icon={<MessageSquare className="text-purple-500" />} 
                    title={t('institutional_donors.analyticsDashboard.communicationFrequency')}
                    value={`${analyticsData.communicationFrequency} days`}
                    trend={5}
                    trendDirection="down"
                    positiveIsUp={false}
                />
                 <AnalyticsKpiCard 
                    icon={<Smile className="text-yellow-500" />} 
                    title={t('institutional_donors.analyticsDashboard.satisfactionScore')}
                    value={`${analyticsData.satisfactionScore} / 5`}
                    trend={0.1}
                    trendDirection="up"
                />
            </div>
        </div>
    );
};

const DetailOverviewTabInstitutional: React.FC<{ donor: InstitutionalDonor }> = ({ donor }) => {
    const { t, language } = useLocalization(['common', 'institutional_donors']);

    const InfoRow: React.FC<InfoRowProps> = ({ labelKey, value }) => {
        return (
            <div className="flex justify-between items-baseline text-sm">
                <p className="text-gray-500 dark:text-gray-400">{t(labelKey)}</p>
                <p className="font-semibold text-foreground dark:text-dark-foreground">{value}</p>
            </div>
        );
    };

    const StatusBadge: React.FC<{ status: GrantmakerRelationshipStatus }> = ({ status }) => {
        const styles: Record<GrantmakerRelationshipStatus, string> = {
            'Cold': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            'Prospect': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            'Cultivating': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            'Active': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            'Stewardship': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{t(`institutional_donors.statuses.${status}`)}</span>;
    };
    
    const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
        const styles: Record<PriorityLevel, string> = {
            'High': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            'Medium': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
            'Low': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[priority]}`}>{t(`institutional_donors.priorities.${priority}`)}</span>;
    };

    const creationYear = new Date(donor.createdDate).getFullYear();
    const donationsThisYear = donor.totalGrantsAwarded / 4; // Mock value for demo
    const change = 25; // Mock value
    
    const donationData1 = [125, 130, 150, 140, 180, 170, 190];
    const donationData2 = [500, 520, 510, 550, 540, 580, 600];

    return (
        <div className="space-y-6">
            <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-inner border dark:border-slate-700/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                    {/* First Column */}
                    <div className="space-y-4">
                        <InfoRow labelKey="institutional_donors.detail.status" value={<StatusBadge status={donor.relationshipStatus} />} />
                        <InfoRow labelKey="institutional_donors.detail.assignedManager" value={donor.assignedManager} />
                        <InfoRow labelKey="institutional_donors.detail.priority" value={<PriorityBadge priority={donor.priority} />} />
                    </div>

                    {/* Second Column */}
                    <div className="space-y-4">
                        <InfoRow labelKey="institutional_donors.detail.totalAwarded" value={formatCurrency(donor.totalGrantsAwarded, language, 'USD')} />
                        <InfoRow labelKey="institutional_donors.detail.activeGrants" value={donor.activeGrants} />
                        <InfoRow 
                          labelKey="institutional_donors.detail.nextDeadline" 
                          value={donor.nextDeadline ? formatDate(donor.nextDeadline, language) : 'N/A'} 
                        />
                    </div>
                    
                    {/* Third Column */}
                    <div className="space-y-4">
                        <InfoRow labelKey="institutional_donors.detail.type" value={t(`institutional_donors.types.${donor.type}`)} />
                        <InfoRow labelKey="institutional_donors.detail.country" value={`${donor.country}${donor.city ? `, ${donor.city}` : ''}`} />
                        <InfoRow labelKey="institutional_donors.detail.registrationNumber" value={donor.registrationNumber || 'N/A'} />
                        <InfoRow labelKey="institutional_donors.detail.establishmentDate" value={donor.establishmentDate ? formatDate(donor.establishmentDate, language) : 'N/A'} />
                    </div>
                </div>
            </div>

            <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-inner border dark:border-slate-700/50">
                <h3 className="text-xl font-bold mb-4">{t('institutional_donors.detail.donationsTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 flex flex-col justify-between overflow-hidden">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500">{t('institutional_donors.detail.donationsThisYear')}</h4>
                            <p className="text-3xl font-bold my-2">{formatCurrency(donationsThisYear, language, 'USD')}</p>
                            <div className="flex items-center gap-1 text-sm font-semibold text-green-500">
                                <TrendingUp size={16} />
                                <span>{change}% {t('institutional_donors.detail.vsLastYear')}</span>
                            </div>
                        </div>
                        <div className="mt-4 h-16 -mx-4 -mb-4">
                            <Sparkline data={donationData1} color="#10B981" />
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 flex flex-col justify-between overflow-hidden">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500">{t('institutional_donors.detail.totalDonations')}</h4>
                            <p className="text-3xl font-bold my-2">{formatCurrency(donor.totalGrantsAwarded, language, 'USD')}</p>
                            <span className="text-xs text-gray-400">{t('institutional_donors.detail.sinceYear', { year: creationYear })}</span>
                        </div>
                         <div className="mt-4 h-16 -mx-4 -mb-4">
                            <Sparkline data={donationData2} color="#3B82F6" />
                        </div>
                    </div>
                </div>
            </div>
            
            <AnalyticsDashboard />
        </div>
    );
};

export default DetailOverviewTabInstitutional;
