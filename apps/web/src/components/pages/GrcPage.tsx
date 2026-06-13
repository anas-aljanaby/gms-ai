import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_GRC_DATA } from '../../data/grcData';
import type { GrcData } from '../../types';
import { GrcIcon } from '../icons/ModuleIcons';
import Tabs from '../common/Tabs';
import OverviewTab from './grc/OverviewTab';
import GovernanceTab from './grc/GovernanceTab';
import RiskTab from './grc/RiskTab';
import ComplianceTab from './grc/ComplianceTab';
import ScreeningTab from './grc/ScreeningTab';
import AuditTab from './grc/AuditTab';

interface GrcPageProps {
  grcData?: GrcData;
  dispatchGrcAction?: React.Dispatch<unknown>;
}

const GrcPage: React.FC<GrcPageProps> = ({ grcData = MOCK_GRC_DATA }) => {
  const { t } = useLocalization(['common', 'grc', 'projects', 'sidebar', 'compliance']);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: t('grc.tabs.overview') },
    { id: 'governance', label: t('grc.tabs.governance') },
    { id: 'risk', label: t('grc.tabs.risk') },
    { id: 'compliance', label: t('grc.tabs.compliance') },
    { id: 'screening', label: t('grc.tabs.screening') },
    { id: 'audit', label: t('grc.tabs.audit') },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab grcData={grcData} />;
      case 'governance':
        return <GovernanceTab policies={grcData.policies} decisions={grcData.decisions} />;
      case 'risk':
        return <RiskTab risks={grcData.risks} />;
      case 'compliance':
        return (
          <ComplianceTab
            requirements={grcData.requirements}
            assessments={grcData.assessments}
          />
        );
      case 'screening':
        return <ScreeningTab />;
      case 'audit':
        return <AuditTab log={grcData.auditLog} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground flex items-center gap-3">
        <GrcIcon />
        {t('sidebar.grc')}
      </h1>

      <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />

      <div className="mt-6">{renderActiveTab()}</div>
    </div>
  );
};

export default GrcPage;
