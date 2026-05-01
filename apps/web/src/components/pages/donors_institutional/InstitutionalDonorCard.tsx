import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { InstitutionalDonor, GrantmakerRelationshipStatus, PriorityLevel } from '../../../types';
import { formatDate, formatCurrency } from '../../../lib/utils';
import { Clock, Tag, DollarSign, Package, MapPin } from 'lucide-react';

interface InstitutionalDonorCardProps {
    donor: InstitutionalDonor;
    onSelect: (donor: InstitutionalDonor) => void;
}

const InstitutionalDonorCard: React.FC<InstitutionalDonorCardProps> = ({ donor, onSelect }) => {
    const { t, language } = useLocalization();

    const priorityClasses: Record<PriorityLevel, string> = {
        'High': 'border-red-500',
        'Medium': 'border-yellow-500',
        'Low': 'border-green-500',
    };
    
    const statusClasses: Record<GrantmakerRelationshipStatus, string> = {
        'Cold': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        'Prospect': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'Cultivating': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Active': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Stewardship': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    };

    return (
        <div 
            onClick={() => onSelect(donor)}
            className={`bg-card dark:bg-dark-card rounded-xl shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-s-4 ${priorityClasses[donor.priority]} flex flex-col cursor-pointer`}
        >
            <div className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <img src={donor.logo} alt={`${donor.organizationName[language] || donor.organizationName.en} logo`} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        <div>
                            <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground">{donor.organizationName[language] || donor.organizationName.en}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin size={12}/> {t(`institutional_donors.types.${donor.type}`)} &bull; {donor.country}
                            </p>
                        </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClasses[donor.relationshipStatus]}`}>
                        {t(`institutional_donors.statuses.${donor.relationshipStatus}`)}
                    </span>
                </div>

                <div className="mt-4">
                    <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1"><Tag size={14} /> {t('institutional_donors.columns.focus')}</h4>
                    <div className="flex flex-wrap gap-1">
                        {donor.focusAreas.slice(0, 3).map(area => (
                            <span key={area} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 rounded-full">{area}</span>
                        ))}
                        {donor.focusAreas.length > 3 && <span className="text-xs text-gray-400">+{donor.focusAreas.length - 3}</span>}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t dark:border-slate-700 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                        <DollarSign size={16} className="text-primary mt-1"/>
                        <div>
                            <p className="text-xs text-gray-500">{t('institutional_donors.columns.funding')}</p>
                            <p className="font-semibold">{formatCurrency(donor.totalGrantsAwarded, language)}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Package size={16} className="text-primary mt-1"/>
                        <div>
                            <p className="text-xs text-gray-500">{t('institutional_donors.active.other', { count: '' })}</p>
                            <p className="font-semibold">{donor.activeGrants}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl border-t dark:border-slate-700">
                 <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-primary"/>
                    <div>
                        <p className="text-xs text-gray-500">{t('institutional_donors.nextDeadline')}</p>
                        <p className="font-semibold">{donor.nextDeadline ? formatDate(donor.nextDeadline, language, 'medium') : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionalDonorCard;