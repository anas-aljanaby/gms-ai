import React from 'react';
import { motion } from 'framer-motion';
import { useLocalization } from '../../../hooks/useLocalization';
import type { IndividualDonor } from '../../../types';
import { formatDate, formatCurrency } from '../../../lib/utils';
import { StatusBadge, TierBadge } from './DonorBadges';
import { DollarSign, Calendar } from 'lucide-react';

interface DonorCardProps {
    donor: IndividualDonor;
    onClick: () => void;
}

const DonorCard: React.FC<DonorCardProps> = ({ donor, onClick }) => {
    const { t, language } = useLocalization(['common', 'individual_donors']);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className="bg-card dark:bg-dark-card rounded-2xl shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-5 flex flex-col cursor-pointer"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <img src={donor.avatar} alt={donor.fullName[language] || donor.fullName.en} className="w-16 h-16 rounded-full" loading="lazy" />
                    <div>
                        <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground">{donor.fullName[language] || donor.fullName.en}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{donor.country}</p>
                    </div>
                </div>
                <StatusBadge status={donor.status} />
            </div>

            <div className="mt-4 flex-grow space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign size={16} className="text-primary"/>
                    <span className="font-semibold">{t('individual_donors.columns.totalDonations')}:</span>
                    <span className="font-bold text-foreground dark:text-dark-foreground">{formatCurrency(donor.totalDonations, language)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar size={16} className="text-primary"/>
                    <span className="font-semibold">{t('individual_donors.columns.lastDonationDate')}:</span>
                    <span className="font-bold text-foreground dark:text-dark-foreground">{donor.lastDonationDate ? formatDate(donor.lastDonationDate, language) : 'N/A'}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t dark:border-slate-700 flex justify-end">
                <TierBadge tier={donor.tier} />
            </div>
        </motion.div>
    );
};

export default DonorCard;
