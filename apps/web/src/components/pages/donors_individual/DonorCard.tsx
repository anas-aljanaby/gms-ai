import React from 'react';
import { motion } from 'framer-motion';
import { useLocalization } from '../../../hooks/useLocalization';
import type { IndividualDonor } from '../../../types';
import { formatDate, formatCurrency } from '../../../lib/utils';
import { StatusBadge, TierBadge } from './DonorBadges';
import { Activity, Calendar, HeartPulse, UserRound } from 'lucide-react';
import { isOptimisticDonor } from '../../../hooks/useDonors';
import { getCountryDisplayName } from '../../../lib/countryOptions';

interface DonorCardProps {
    donor: IndividualDonor;
    highlighted?: boolean;
    onClick: () => void;
}

const tierAccentClasses: Record<IndividualDonor['tier'], string> = {
    Bronze: 'bg-orange-500',
    Silver: 'bg-slate-400',
    Gold: 'bg-amber-400',
    Platinum: 'bg-blue-500',
    'Major Donor': 'bg-purple-500',
};

const DonorCard: React.FC<DonorCardProps> = ({ donor, highlighted, onClick }) => {
    const { t, language } = useLocalization(['common', 'individual_donors', 'donors']);
    const optimistic = isOptimisticDonor(donor.id);
    const [imageFailed, setImageFailed] = React.useState(false);
    const openTasks = donor.relationshipTasks?.filter(task => !task.completed) || [];
    const today = new Date().toISOString().split('T')[0];
    const nextTask = openTasks.slice().sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    const isUrgent = nextTask ? nextTask.dueDate < today : false;
    const donorName = donor.fullName[language] || donor.fullName.en;
    const donorInitial = donorName.trim().charAt(0).toUpperCase() || '?';
    const donorType = donor.donorType ? t(`donors.types.${donor.donorType.replace(/ /g, '')}`, donor.donorType) : '';
    const stageLabel = donor.relationshipStage ? t(`donors.stages.${donor.relationshipStage}`) : t('individual_donors.relationship.noStage');
    const countryLabel = getCountryDisplayName(donor.country, language === 'ar' ? 'ar' : 'en');
    const visibleTags = donor.tags.slice(0, 2);
    const hiddenTagCount = Math.max(donor.tags.length - visibleTags.length, 0);
    const cardAccentClass = tierAccentClasses[donor.tier];

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
        }
    };

    const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
        <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                {icon}
                <span className="truncate">{label}</span>
            </div>
            <div className="truncate text-sm font-bold text-foreground dark:text-dark-foreground">
                {value}
            </div>
        </div>
    );

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={() => !optimistic && onClick()}
            onKeyDown={(event) => {
                if (!optimistic) handleKeyDown(event);
            }}
            role="button"
            tabIndex={optimistic ? -1 : 0}
            aria-label={t('donors.card.ariaLabel', { name: donorName })}
            className={`group relative overflow-hidden rounded-lg border border-gray-200/70 bg-card p-4 shadow-soft transition-all duration-300 focus:outline-none dark:border-slate-700/60 dark:bg-dark-card ${
                optimistic
                    ? 'opacity-70 animate-pulse cursor-default'
                    : highlighted
                        ? 'ring-2 ring-primary/40 dark:ring-secondary/40 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950'
                        : 'cursor-pointer hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950'
            }`}
        >
            <div className={`absolute inset-x-0 top-0 h-1 ${cardAccentClass}`} aria-hidden="true" />

            <div className="flex items-start justify-between gap-3 pt-1">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="relative flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-full bg-primary-light text-lg font-bold text-primary ring-2 ring-white dark:bg-primary/20 dark:text-secondary dark:ring-slate-800">
                        <span aria-hidden="true">{donorInitial}</span>
                        {!imageFailed && (
                            <img
                                src={donor.avatar}
                                alt={donorName}
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                                onError={() => setImageFailed(true)}
                            />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold leading-tight text-foreground dark:text-dark-foreground">{donorName}</h3>
                        <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                            {[countryLabel, donorType].filter(Boolean).join(' / ')}
                        </p>
                    </div>
                </div>
                <div className="shrink-0 whitespace-nowrap">
                    <StatusBadge status={donor.status} />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 divide-x divide-gray-200 rounded-md bg-gray-50/80 text-sm dark:divide-slate-700 dark:bg-slate-800/55 rtl:divide-x-reverse">
                <div className="min-w-0 px-3 py-2.5">
                    <span className="block truncate text-xs font-medium text-gray-500 dark:text-gray-400">{t('individual_donors.columns.totalDonations')}</span>
                    <span className="mt-1 block truncate text-base font-bold text-foreground dark:text-dark-foreground">{formatCurrency(donor.totalDonations, language)}</span>
                </div>
                <div className="min-w-0 px-3 py-2.5">
                    <span className="block truncate text-xs font-medium text-gray-500 dark:text-gray-400">{t('individual_donors.columns.lastGift')}</span>
                    <span className="mt-1 block truncate text-base font-bold text-foreground dark:text-dark-foreground">{donor.lastDonationDate ? formatDate(donor.lastDonationDate, language, 'short') : 'N/A'}</span>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                <DetailItem
                    icon={<UserRound size={14} className="shrink-0 text-primary" />}
                    label={t('individual_donors.columns.owner')}
                    value={donor.assignedManager}
                />
                <DetailItem
                    icon={<Activity size={14} className="shrink-0 text-primary" />}
                    label={t('individual_donors.columns.pipelineStage')}
                    value={stageLabel}
                />
                <DetailItem
                    icon={<HeartPulse size={14} className="shrink-0 text-primary" />}
                    label={t('individual_donors.columns.relationshipHealth')}
                    value={donor.relationshipHealth || 'N/A'}
                />
                <DetailItem
                    icon={<Calendar size={14} className="shrink-0 text-primary" />}
                    label={t('individual_donors.columns.openTasks')}
                    value={openTasks.length}
                />
            </div>

            {visibleTags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                    {visibleTags.map(tag => (
                        <span key={tag} className="max-w-full truncate rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-slate-800 dark:text-gray-300">{tag}</span>
                    ))}
                    {hiddenTagCount > 0 && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500 dark:bg-slate-800 dark:text-gray-400">+{hiddenTagCount}</span>
                    )}
                </div>
            )}

            {nextTask && (
                <div className={`mt-4 rounded-md border px-3 py-2 text-xs ${isUrgent ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200' : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-gray-300'}`}>
                    <div className="flex min-w-0 items-center gap-2 font-bold">
                        <Calendar size={14} className="shrink-0" />
                        <span className="truncate">{nextTask.text}</span>
                    </div>
                    <p className="mt-1 text-xs opacity-90">{formatDate(nextTask.dueDate, language)}</p>
                </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-slate-700">
                <div className="min-w-0 truncate">
                    <TierBadge tier={donor.tier} />
                </div>
                {donor.relationshipLikelihood && (
                    <span className="shrink-0 rounded-full bg-primary-light px-2.5 py-1 text-xs font-bold text-primary dark:bg-primary/20 dark:text-secondary">
                        {t(`donors.likelihood.${donor.relationshipLikelihood}`)}
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default DonorCard;
