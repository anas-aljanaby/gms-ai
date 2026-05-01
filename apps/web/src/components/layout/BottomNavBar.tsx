import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { DashboardIcon, DonorIcon, BousalaIcon, ProjectIcon } from '../icons/ModuleIcons';
import { GridIcon } from '../icons/GenericIcons';

interface BottomNavBarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  onMenuClick: () => void;
  notificationCount: number;
}

interface NavItemProps {
  isActive: boolean;
  Icon: React.FC<{ className?: string }>;
  label: string;
  onClick: () => void;
  badgeCount?: number;
  isMenu?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ isActive, Icon, label, onClick, badgeCount }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center w-full h-[60px] cursor-pointer group transition-all duration-300 ease-bounce-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Background Pill */}
      <div
        className={`absolute w-16 h-8 rounded-full transition-all duration-300 ease-bounce-out ${
          isActive
            ? 'opacity-100 scale-100 bg-primary-light dark:bg-primary/20'
            : 'opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-90 bg-gray-200 dark:bg-slate-700'
        }`}
      />

      {/* Icon */}
      <div
        className={`relative transition-all duration-300 ease-bounce-out ${
          isActive
            ? 'text-primary dark:text-secondary scale-110 -translate-y-1'
            : 'text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-secondary'
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>

      {/* Label */}
      <span
        className={`absolute bottom-1 text-[10px] font-bold transition-opacity duration-300 ${
          isActive
            ? 'opacity-100 text-primary dark:text-secondary'
            : 'opacity-0 group-hover:opacity-100 text-gray-600 dark:text-gray-300'
        }`}
      >
        {label}
      </span>

      {/* Badge */}
      {badgeCount && badgeCount > 0 && (
        <div
          style={{ animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
          className="absolute top-1 right-1/2 translate-x-4 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-card dark:border-dark-card"
        >
          {badgeCount > 9 ? '9+' : badgeCount}
        </div>
      )}
    </button>
  );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeModule, setActiveModule, onMenuClick, notificationCount }) => {
  const { t } = useLocalization();

  const navItems = [
    { key: 'dashboard', icon: DashboardIcon, label: t('sidebar.dashboard') },
    { key: 'bousala', icon: BousalaIcon, label: t('sidebar.bousala') },
    { key: 'donors', icon: DonorIcon, label: t('sidebar.donors') },
    { key: 'projects', icon: ProjectIcon, label: t('sidebar.projects') },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 h-[calc(64px+env(safe-area-inset-bottom))] bg-card/85 dark:bg-dark-card/85 backdrop-blur-xl border-t border-gray-200/80 dark:border-slate-800/80 shadow-[0_-2px_20px_rgba(0,0,0,0.08)] z-50 transition-colors duration-300"
      role="navigation"
      aria-label="Main"
    >
      <div className="flex justify-around items-center h-[64px] px-2">
        {navItems.map(item => (
          <NavItem
            key={item.key}
            isActive={activeModule === item.key}
            Icon={item.icon}
            label={item.label}
            onClick={() => setActiveModule(item.key)}
          />
        ))}
        <NavItem
          isActive={false}
          Icon={GridIcon}
          label={t('sidebar.more')}
          onClick={onMenuClick}
          badgeCount={notificationCount}
        />
      </div>
       <div style={{ height: 'env(safe-area-inset-bottom)' }} className="bg-transparent"></div>
    </nav>
  );
};

export default BottomNavBar;
