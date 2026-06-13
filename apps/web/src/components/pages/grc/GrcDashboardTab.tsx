import React from 'react';
import {
  Scale,
  ThumbsDown,
  FileText,
  Flame,
  Siren,
} from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { GrcData } from '../../../types';
import StatCard from './StatCard';
import RiskMatrix from './RiskMatrix';

interface GrcDashboardTabProps {
  grcData: GrcData;
}

const GrcDashboardTab: React.FC<GrcDashboardTabProps> = ({ grcData }) => {
  const { t } = useLocalization(['common', 'grc']);

  const stats = {
    activePolicies: grcData.policies.filter((p) => p.status === 'active').length,
    activeRisks: grcData.risks.filter((r) => r.status !== 'closed').length,
    highRisks: grcData.risks.filter((r) => r.level === 'High' || r.level === 'Critical').length,
    nonCompliant: grcData.assessments.filter((a) => a.status === 'non-compliant').length,
    pendingDecisions: grcData.decisions.filter((d) => d.status === 'pending').length,
  };

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

      <RiskMatrix risks={grcData.risks} onCellClick={() => {}} activeCell={null} />
    </div>
  );
};

export default GrcDashboardTab;
