import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { GrcRiskStatus } from '../../../types';

const statusStyles: Record<GrcRiskStatus, string> = {
  identified: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  mitigating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  monitored: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const RiskStatusBadge: React.FC<{ status: GrcRiskStatus }> = ({ status }) => {
  const { t } = useLocalization(['grc']);
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
      {t(`grc.risk.statuses.${status}`)}
    </span>
  );
};

export default RiskStatusBadge;
