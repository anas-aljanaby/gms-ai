import React from 'react';
import { motion } from 'framer-motion';
import { useLocalization } from '../../../hooks/useLocalization';
import type { IndividualDonor } from '../../../types';
import { formatDate, formatCurrency } from '../../../lib/utils';
import { StatusBadge, TierBadge } from './DonorBadges';
import { Activity, Calendar, HeartPulse, UserRound } from 'lucide-react';

interface DonorCardProps {
    donor: IndividualDonor;
    onClick: () => void;
}

const DonorCard: React.FC<DonorCardProps> = ({ donor, onClick }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);
    const openTasks = donor.relationshipTasks?.filter(task => !task.completed) || [];
    const today = new Date().toISOString().split('T')[0];
    const nextTask = openTasks.slice().sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    const isUrgent = nextTask ? nextTask.dueDate < today : false;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className="bg-card dark:bg-dark-card rounded-lg shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-5 flex flex-col cursor-pointer border border-gray-200/70 dark:border-slate-700/60"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4 min-w-0">
                    <img src={donor.avatar} alt={donor.fullName[language] || donor.fullName.en} className="w-16 h-16 rounded-full object-cover" loading="lazy" />
                    <div className="min-w-0">
                        <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground">{donor.fullName[language] || donor.fullName.en}</h3>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                            {[donor.country, donor.donorType && t(`donors.types.${donor.donorType.replace(/ /g, '')}`, donor.donorType)].filter(Boolean).join(' / ')}
                        </p>
                    </div>
                </div>
                <StatusBadge status={donor.status} />
            </div>

            <div className="mt-4 flex-grow space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md bg-gray-50 p-2 dark:bg-slate-800/60">
                        <span className="block text-xs text-gray-500">{t('individual_donors.columns.totalDonations')}</span>
                        <span className="font-bold text-foreground dark:text-dark-foreground">{formatCurrency(donor.totalDonations, language)}</span>
                    </div>
                    <div className="rounded-md bg-gray-50 p-2 dark:bg-slate-800/60">
                        <span className="block text-xs text-gray-500">{t('individual_donors.columns.lastGift')}</span>
                        <span className="font-bold text-foreground dark:text-dark-foreground">{donor.lastDonationDate ? formatDate(donor.lastDonationDate, language, 'short') : 'N/A'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <UserRound size={16} className="text-primary"/>
                    <span className="font-semibold">{t('individual_donors.columns.owner')}:</span>
                    <span className="font-bold text-foreground dark:text-dark-foreground">{donor.assignedManager}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Activity size={16} className="text-primary"/>
                    <span className="font-semibold">{t('individual_donors.columns.pipelineStage')}:</span>
                    <span className="font-bold text-foreground dark:text-dark-foreground">{donor.relationshipStage ? t(`donors.stages.${donor.relationshipStage}`) : t('individual_donors.relationship.noStage')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <HeartPulse size={16} className="text-primary"/>
                    <span className="font-semibold">{t('individual_donors.columns.relationshipHealth')}:</span>
                    <span className="font-bold text-foreground dark:text-dark-foreground">{donor.relationshipHealth || 'N/A'}</span>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
                {donor.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-slate-800 dark:text-gray-300">{tag}</span>
                ))}
            </div>

            {nextTask && (
                <div className={`mt-4 rounded-md border p-2 text-xs ${isUrgent ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200' : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-gray-300'}`}>
                    <div className="flex items-center gap-2 font-bold">
                        <Calendar size={14} />
                        <span className="truncate">{nextTask.text}</span>
                    </div>
                    <p className="mt-1">{formatDate(nextTask.dueDate, language)}</p>
                </div>
            )}

            <div className="mt-4 pt-4 border-t dark:border-slate-700 flex items-center justify-between">
                <TierBadge tier={donor.tier} />
                {donor.relationshipLikelihood && (
                    <span className="rounded-full bg-primary-light px-2 py-1 text-xs font-bold text-primary dark:bg-primary/20 dark:text-secondary">
                        {t(`donors.likelihood.${donor.relationshipLikelihood}`)}
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default DonorCard;
