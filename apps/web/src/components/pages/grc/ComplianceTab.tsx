import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatDate } from '../../../lib/utils';
import type { Assessment, ComplianceRequirement, ComplianceStatus } from '../../../types';
import AiCard from '../ai/AiCard';

interface ComplianceTabProps {
  requirements: ComplianceRequirement[];
  assessments: Assessment[];
}

const ComplianceStatusBadge: React.FC<{ status: ComplianceStatus }> = ({ status }) => {
  const { t } = useLocalization(['grc']);
  const styles: Record<ComplianceStatus, string> = {
    compliant: 'bg-green-100 text-green-800',
    'partially-compliant': 'bg-yellow-100 text-yellow-800',
    'non-compliant': 'bg-red-100 text-red-800',
    'not-assessed': 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
      {t(`grc.compliance.statuses.${status.replace('-', '_')}`)}
    </span>
  );
};

const ComplianceTab: React.FC<ComplianceTabProps> = ({ requirements, assessments }) => {
  const { t, language } = useLocalization(['common', 'grc']);

  return (
    <AiCard title={t('grc.compliance.title')}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
            <tr>
              <th className="p-2">{t('grc.compliance.table.requirement')}</th>
              <th className="p-2">{t('grc.compliance.table.source')}</th>
              <th className="p-2">{t('grc.compliance.table.status')}</th>
              <th className="p-2">{t('grc.compliance.table.lastAssessed')}</th>
              <th className="p-2">{t('grc.compliance.table.nextDue')}</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((req) => {
              const latestAssessment = assessments
                .filter((a) => a.requirementId === req.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

              return (
                <tr key={req.id} className="border-t dark:border-slate-700">
                  <td className="p-2 font-semibold max-w-sm text-foreground dark:text-dark-foreground">
                    {req.title[language]}
                  </td>
                  <td className="p-2 text-foreground dark:text-dark-foreground">
                    {req.sourceName[language]}
                  </td>
                  <td className="p-2">
                    <ComplianceStatusBadge
                      status={latestAssessment?.status ?? 'not-assessed'}
                    />
                  </td>
                  <td className="p-2 text-foreground dark:text-dark-foreground">
                    {latestAssessment ? formatDate(latestAssessment.date, language) : 'N/A'}
                  </td>
                  <td className="p-2 text-foreground dark:text-dark-foreground">
                    {formatDate(req.nextDueDate, language)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AiCard>
  );
};

export default ComplianceTab;
