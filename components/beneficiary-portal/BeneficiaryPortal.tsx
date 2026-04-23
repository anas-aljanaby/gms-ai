import React, { useState } from 'react';
import PortalNavigation from './PortalNavigation';
import PortalDashboard from './PortalDashboard';
import ProfileSection from './ProfileSection';
import FinancialSection from './FinancialSection';
import CommunitySection from './CommunitySection';

const BeneficiaryPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return <PortalDashboard />;
      case 'profile':
        return <ProfileSection />;
      case 'academic':
        return <div className="p-6"><h2 className="text-2xl">القسم الأكاديمي - قريباً</h2></div>;
      case 'financial':
        return <FinancialSection />;
      case 'housing':
        return <div className="p-6"><h2 className="text-2xl">السكن والخدمات - قريباً</h2></div>;
      case 'community':
        return <CommunitySection />;
      default:
        return <PortalDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="text-3xl">🎓</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">بوابة المستفيد</h1>
                <p className="text-sm text-gray-500">أحمد محمد علي - طالب ماجستير</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="text-xl">⚙️</span>
              </button>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                أ
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <PortalNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default BeneficiaryPortal;