import React from 'react';
import {
  Scale,
  ThumbsDown,
  FileText,
  Flame,
  Siren,
  CalendarClock,
  ClipboardCheck,
} from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatDate } from '../../../lib/utils';
import type { Assessment, ComplianceStatus, GrcData } from '../../../types';
import StatCard from './StatCard';
import AiCard from '../ai/AiCard';

interface OverviewTabProps {
  grcData: GrcData;
}

const ComplianceStatusBadge: React.FC<{ status: ComplianceStatus }> = ({ status }) => {
  const { t } = useLocalization(['grc']);
  const styles: Record<ComplianceStatus, string> = {
    compliant: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'partially-compliant': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'non-compliant': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'not-assessed': 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>
      {t(`grc.compliance.statuses.${status.replace('-', '_')}`)}
    </span>
  );
};

const OverviewTab: React.FC<OverviewTabProps> = ({ grcData }) => {
  const { t, language } = useLocalization(['common', 'grc']);

  const stats = {
    activePolicies: grcData.policies.filter((p) => p.status === 'active').length,
    activeRisks: grcData.risks.filter((r) => r.status !== 'closed').length,
    highRisks: grcData.risks.filter((r) => r.level === 'High' || r.level === 'Critical').length,
    nonCompliant: grcData.assessments.filter((a) => a.status === 'non-compliant').length,
    pendingDecisions: grcData.decisions.filter((d) => d.status === 'pending').length,
  };

  const latestAssessmentFor = (requirementId: string): Assessment | undefined =>
    grcData.assessments
      .filter((a) => a.requirementId === requirementId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const upcomingDeadlines = [...grcData.requirements]
    .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())
    .slice(0, 5);

  const pendingDecisions = grcData.decisions
    .filter((d) => d.status === 'pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title={t('grc.dashboard.pendingDecisions')}
          value={stats.pendingDecisions}
          icon={<Scale />}
        />
        <StatCard
          title={t('grc.dashboard.nonCompliant')}
          value={stats.nonCompliant}
          icon={<ThumbsDown />}
        />
        <StatCard
          title={t('grc.dashboard.highRisks')}
          value={stats.highRisks}
          icon={<Siren className="text-red-500" />}
        />
        <StatCard
          title={t('grc.dashboard.activeRisks')}
          value={stats.activeRisks}
          icon={<Flame />}
        />
        <StatCard
          title={t('grc.dashboard.activePolicies')}
          value={stats.activePolicies}
          icon={<FileText />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AiCard
          title={t('grc.overview.upcomingDeadlines')}
          icon={<CalendarClock className="w-5 h-5 text-primary dark:text-secondary" />}
        >
          {upcomingDeadlines.length === 0 ? (
            <p className="text-center py-6 text-sm text-gray-500">{t('common.noResults')}</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-slate-700">
              {upcomingDeadlines.map((req) => {
                const status = latestAssessmentFor(req.id)?.status ?? 'not-assessed';
                return (
                  <li key={req.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="font-semibold truncate text-foreground dark:text-dark-foreground">
                        {req.title[language]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {req.sourceName[language]} · {formatDate(req.nextDueDate, language)}
                      </p>
                    </div>
                    <ComplianceStatusBadge status={status} />
                  </li>
                );
              })}
            </ul>
          )}
        </AiCard>

        <AiCard
          title={t('grc.overview.pendingDecisions')}
          icon={<ClipboardCheck className="w-5 h-5 text-primary dark:text-secondary" />}
        >
          {pendingDecisions.length === 0 ? (
            <p className="text-center py-6 text-sm text-gray-500">{t('common.noResults')}</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-slate-700">
              {pendingDecisions.map((decision) => (
                <li key={decision.id} className="flex items-center justify-between gap-4 py-3">
                  <p className="font-semibold truncate text-foreground dark:text-dark-foreground">
                    {decision.title[language]}
                  </p>
                  <span className="text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {formatDate(decision.date, language)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AiCard>
      </div>
    </div>
  );
};

export default OverviewTab;
