import React, { useMemo } from 'react';
import type { Beneficiary } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatNumber } from '../../../lib/utils';

interface BeneficiaryStatsStripProps {
  beneficiaries: Beneficiary[];
}

const BeneficiaryStatsStrip: React.FC<BeneficiaryStatsStripProps> = ({ beneficiaries }) => {
  const { t, language } = useLocalization(['beneficiaries']);

  const stats = useMemo(() => {
    const total = beneficiaries.length;
    const active = beneficiaries.filter((b) => b.status === 'active').length;
    const sponsored = beneficiaries.filter((b) => b.supportType === 'sponsorship').length;
    const directSupport = beneficiaries.filter((b) => b.supportType === 'direct-support').length;

    return [
      { label: t('beneficiaries.stats.total'), value: formatNumber(total, language) },
      { label: t('beneficiaries.stats.active'), value: formatNumber(active, language) },
      { label: t('beneficiaries.stats.sponsored'), value: formatNumber(sponsored, language) },
      { label: t('beneficiaries.stats.directSupport'), value: formatNumber(directSupport, language) },
    ];
  }, [beneficiaries, t, language]);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-gray-200/80 bg-card px-4 py-3 shadow-soft dark:border-slate-700/70 dark:bg-dark-card">
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          {index > 0 && <span className="hidden text-gray-300 dark:text-slate-600 sm:inline">|</span>}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}:</span>
            <span className="text-sm font-bold text-foreground dark:text-dark-foreground">{stat.value}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BeneficiaryStatsStrip;
