import React, { useState } from 'react';
import { CirclePlus } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatDate } from '../../../lib/utils';
import type { Decision, Policy } from '../../../types';
import AiCard from '../ai/AiCard';
import NewPolicyModal from './NewPolicyModal';
import NewDecisionModal from './NewDecisionModal';

interface GovernanceTabProps {
  policies: Policy[];
  decisions: Decision[];
}

const PolicyStatusBadge: React.FC<{ status: Policy['status'] }> = ({ status }) => {
  const { t } = useLocalization(['grc']);
  const styles: Record<Policy['status'], string> = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
      {t(`grc.governance.statuses.${status}`)}
    </span>
  );
};

const DecisionStatusBadge: React.FC<{ status: Decision['status'] }> = ({ status }) => {
  const { t } = useLocalization(['grc']);
  const styles: Record<Decision['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    implemented: 'bg-blue-100 text-blue-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
      {t(`grc.governance.decision_statuses.${status}`)}
    </span>
  );
};

const GovernanceTab: React.FC<GovernanceTabProps> = ({ policies, decisions }) => {
  const { t, language } = useLocalization(['common', 'grc']);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <AiCard title={t('grc.governance.policies')}>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setIsPolicyModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg"
            >
              <CirclePlus size={16} />
              {t('grc.governance.newPolicy')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-2">{t('grc.governance.table.policyTitle')}</th>
                  <th className="p-2">{t('grc.governance.table.category')}</th>
                  <th className="p-2">{t('grc.governance.table.version')}</th>
                  <th className="p-2">{t('grc.governance.table.status')}</th>
                  <th className="p-2">{t('grc.governance.table.reviewDate')}</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.id} className="border-t dark:border-slate-700">
                    <td className="p-2 font-semibold text-foreground dark:text-dark-foreground">
                      {policy.title[language]}
                    </td>
                    <td className="p-2 text-foreground dark:text-dark-foreground">
                      {t(`grc.governance.policyCategories.${policy.category}`, policy.category)}
                    </td>
                    <td className="p-2 text-foreground dark:text-dark-foreground">{policy.version}</td>
                    <td className="p-2">
                      <PolicyStatusBadge status={policy.status} />
                    </td>
                    <td className="p-2 text-foreground dark:text-dark-foreground">
                      {formatDate(policy.reviewDate, language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AiCard>

        <AiCard title={t('grc.governance.decisions')}>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setIsDecisionModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg"
            >
              <CirclePlus size={16} />
              {t('grc.governance.newDecision')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-2">{t('grc.governance.table.decisionTitle')}</th>
                  <th className="p-2">{t('grc.governance.table.date')}</th>
                  <th className="p-2">{t('grc.governance.table.status')}</th>
                </tr>
              </thead>
              <tbody>
                {decisions.map((decision) => (
                  <tr key={decision.id} className="border-t dark:border-slate-700">
                    <td className="p-2 font-semibold text-foreground dark:text-dark-foreground">
                      {decision.title[language]}
                    </td>
                    <td className="p-2 text-foreground dark:text-dark-foreground">
                      {formatDate(decision.date, language)}
                    </td>
                    <td className="p-2">
                      <DecisionStatusBadge status={decision.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AiCard>
      </div>

      <NewPolicyModal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} />
      <NewDecisionModal isOpen={isDecisionModalOpen} onClose={() => setIsDecisionModalOpen(false)} />
    </>
  );
};

export default GovernanceTab;
