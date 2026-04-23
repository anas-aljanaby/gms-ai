import React from 'react';
import type { Beneficiary, ProgramProject } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  project?: ProgramProject;
  onClick: () => void;
}

const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({ beneficiary, project, onClick }) => {
  const { t, language } = useLocalization();

  const typeStyles = {
    'sponsorship': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'direct-support': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  };
  
  const getSubtitle = (beneficiary: Beneficiary) => {
    switch (beneficiary.beneficiaryType) {
        case 'student':
            return beneficiary.profile?.academicInfo?.level?.[language] || beneficiary.country;
        case 'family':
            const memberCount = beneficiary.profile?.customData?.['عدد أفراد الأسرة'];
            return memberCount ? `أسرة مكونة من ${memberCount} أفراد` : beneficiary.country;
        case 'orphan':
            const grade = beneficiary.profile?.customData?.['المرحلة الدراسية'];
            return grade || beneficiary.country;
        default:
            return beneficiary.country;
    }
  };


  return (
    <div 
      onClick={onClick}
      className="bg-card dark:bg-dark-card rounded-2xl shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-4 flex flex-col items-center text-center cursor-pointer"
    >
      <img
        src={beneficiary.photo}
        alt={beneficiary.name}
        className="w-24 h-24 rounded-full mb-3 border-4 border-white dark:border-slate-700 shadow-md"
        loading="lazy"
      />
      <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground">{beneficiary.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 h-5 truncate">{getSubtitle(beneficiary)}</p>
      <div className="flex items-center gap-2 mb-3">
         <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${typeStyles[beneficiary.type]}`}>
            {t(beneficiary.type === 'sponsorship' ? 'beneficiaries.sponsorships' : 'beneficiaries.directSupport')}
        </span>
      </div>
      <div className="flex-grow"></div>
      <div className="w-full pt-3 mt-3 border-t dark:border-slate-700 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex justify-between items-center">
            <span>🌍 {beneficiary.country}</span>
            <span className="font-semibold truncate max-w-[120px] text-right">
                {beneficiary.type === 'sponsorship' 
                    ? t('beneficiaries.card.sponsoredStudent') 
                    : project?.name[language] || t('beneficiaries.card.directSupport')}
            </span>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryCard;
