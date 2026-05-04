import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { DonorStatus, DonorTier } from '../../../types';

export const StatusBadge: React.FC<{ status: DonorStatus }> = ({ status }) => {
    const { t } = useLocalization(['common', 'individual_donors']);
    const statusKey = status.replace(/ /g, '');
    const styles: Record<DonorStatus, string> = {
        'Active': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Lapsed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'On Hold': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        'Deceased': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{t(`individual_donors.statuses.${statusKey}`)}</span>;
};

export const TierBadge: React.FC<{ tier: DonorTier }> = ({ tier }) => {
    const { t } = useLocalization(['common', 'individual_donors']);
    const tierKey = tier.replace(/ /g, '');
    const styles: Record<DonorTier, string> = {
        'Bronze': 'text-orange-700 dark:text-orange-400',
        'Silver': 'text-gray-500 dark:text-gray-400',
        'Gold': 'text-yellow-500 dark:text-yellow-400',
        'Platinum': 'text-blue-500 dark:text-blue-400',
        'Major Donor': 'text-purple-600 dark:text-purple-400'
    };
    return <span className={`font-bold ${styles[tier]}`}>{t(`individual_donors.tiers.${tierKey}`)}</span>;
};
