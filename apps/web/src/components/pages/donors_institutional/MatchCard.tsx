
import React from 'react';
import { motion } from 'framer-motion';
import { useLocalization } from '../../../hooks/useLocalization';
import type { InstitutionalDonor } from '../../../types';
import ProgressRing from '../../common/ProgressRing';
import { Eye, FileText } from 'lucide-react';

interface Match {
    donorId: string;
    alignmentScore: number;
    matchingCriteria: string[];
}

interface MatchCardProps {
    donor: InstitutionalDonor;
    match: Match;
    onViewProfile: () => void;
    onPrepareDraft: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ donor, match, onViewProfile, onPrepareDraft }) => {
    const { t, language } = useLocalization();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 flex flex-col"
        >
            <div className="p-4 flex items-center gap-4 border-b dark:border-slate-700/50">
                <img src={donor.logo} alt={donor.organizationName.en} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                <div>
                    <h4 className="font-bold text-foreground dark:text-dark-foreground">{donor.organizationName[language] || donor.organizationName.en}</h4>
                    <p className="text-xs text-gray-500">{t(`institutional_donors.types.${donor.type}`)}</p>
                </div>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-center items-center">
                <ProgressRing 
                    percentage={match.alignmentScore} 
                    label={t('institutional_donors.opportunities.alignmentScore')}
                    color={match.alignmentScore > 89 ? '#10B981' : match.alignmentScore > 69 ? '#F59E0B' : '#6B7280'}
                    size={120}
                />
                <div className="mt-4 text-center">
                    <h5 className="text-sm font-semibold mb-1">{t('institutional_donors.opportunities.matchingCriteria')}</h5>
                    <div className="flex flex-wrap justify-center gap-1">
                        {match.matchingCriteria.map((crit, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded-full">{crit}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-dark-card/50 rounded-b-2xl border-t dark:border-slate-700/50 flex gap-2">
                <button onClick={onViewProfile} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold border rounded-lg hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">
                    <Eye size={16} /> {t('institutional_donors.card.viewProfile')}
                </button>
                <button onClick={onPrepareDraft} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark">
                    <FileText size={16} /> {t('institutional_donors.opportunities.prepareDraft')}
                </button>
            </div>
        </motion.div>
    );
};

export default MatchCard;
