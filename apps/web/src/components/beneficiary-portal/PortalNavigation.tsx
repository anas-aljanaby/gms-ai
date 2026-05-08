import React from 'react';
import { Home, User, GraduationCap, Wallet, Building2, Handshake } from 'lucide-react';

interface NavigationTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface PortalNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const PortalNavigation: React.FC<PortalNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: NavigationTab[] = [
    { id: 'overview', label: 'نظرة عامة', icon: <Home size={18} /> },
    { id: 'profile', label: 'ملفي', icon: <User size={18} /> },
    { id: 'academic', label: 'الأكاديمي', icon: <GraduationCap size={18} /> },
    { id: 'financial', label: 'المالي', icon: <Wallet size={18} /> },
    { id: 'housing', label: 'السكن', icon: <Building2 size={18} /> },
    { id: 'community', label: 'المجتمع', icon: <Handshake size={18} /> },
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
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalNavigation;