import React from 'react';

interface NavigationTab {
  id: string;
  label: string;
  icon: string;
}

interface PortalNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const PortalNavigation: React.FC<PortalNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: NavigationTab[] = [
    { id: 'overview', label: 'نظرة عامة', icon: '🏠' },
    { id: 'profile', label: 'ملفي', icon: '👤' },
    { id: 'academic', label: 'الأكاديمي', icon: '🎓' },
    { id: 'financial', label: 'المالي', icon: '💰' },
    { id: 'housing', label: 'السكن', icon: '🏘️' },
    { id: 'community', label: 'المجتمع', icon: '🤝' },
  ];

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 space-x-reverse overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}
              `}
            >
              <span className="text-lg mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalNavigation;