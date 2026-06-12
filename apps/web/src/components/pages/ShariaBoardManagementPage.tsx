import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { ShariaBoardIcon } from '../icons/ModuleIcons';
import Tabs from '../common/Tabs';
import PortalTab from './sharia_board/PortalTab';
import MeetingsTab from './sharia_board/MeetingsTab';
import MembersTab from './sharia_board/MembersTab';

const ShariaBoardManagementPage: React.FC = () => {
  const { t } = useLocalization(['common', 'compliance', 'sharia', 'sidebar', 'misc', 'projects']);

  const [activeTab, setActiveTab] = useState('portal');

  const tabs = [
    { id: 'portal', label: t('sharia.board.tabs.portal') },
    { id: 'meetings', label: t('sharia.board.tabs.meetings') },
    { id: 'members', label: t('sharia.board.tabs.members') },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'members':
        return <MembersTab />;
      case 'meetings':
        return <MeetingsTab />;
      case 'portal':
        return <PortalTab />;
      default:
        return (
          <div className="p-8 text-center bg-card dark:bg-dark-card rounded-lg">
            {t('placeholder.underConstruction', { moduleName: activeTab })}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground flex items-center gap-3">
        <ShariaBoardIcon className="w-8 h-8" />
        {t('sharia.board.title')}
      </h1>

      <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />

      <div className="mt-6">{renderTab()}</div>
    </div>
  );
};

export default ShariaBoardManagementPage;
