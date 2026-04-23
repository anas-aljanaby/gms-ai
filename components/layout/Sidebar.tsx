import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../../hooks/useLocalization';
import { SIDEBAR_MODULES } from '../../constants';
import { SettingsIcon, LogoutIcon } from '../icons/ModuleIcons';
import { ChevronDownIcon } from '../icons/GenericIcons';
import type { Role } from '../../types';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  role: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, role }) => {
  const { t, dir, language } = useLocalization();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const visibleModules = useMemo(() => SIDEBAR_MODULES.filter(module => {
    if (module.key === 'bousala') {
      return role === 'Admin' || role === 'Manager';
    }
    return true;
  }), [role]);

  useEffect(() => {
    const parentMenu = visibleModules.find(m => m.submenu && m.submenu.some((sub: any) => sub.key === activeModule));
    if (parentMenu) {
        setOpenSubmenu(parentMenu.key);
    }
  }, [activeModule, visibleModules]);

  const NavItem: React.FC<{ moduleKey: string, icon: React.FC, onClick: () => void, isActive: boolean }> = ({ moduleKey, icon: Icon, onClick, isActive }) => {
    const activeClass = isActive ? 'bg-primary-light/50 dark:bg-primary/20 text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50';
    return (
      <li>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onClick(); }}
          className={`flex items-center p-3 rounded-lg transition-colors duration-200 overflow-hidden ${activeClass} rtl:flex-row-reverse`}
        >
          <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
            <Icon />
          </div>
          <span className={`mx-4 font-medium whitespace-nowrap`}>{t(`sidebar.${moduleKey}`)}</span>
        </a>
      </li>
    );
  };

  return (
    <nav className={`hidden md:flex flex-col h-full bg-card dark:bg-dark-card border-e dark:border-slate-800 transition-all duration-300 ease-in-out w-20 hover:w-64 group sidebar-nav`}>
      <div className={`flex items-center h-20 px-4 group-hover:px-6 transition-all duration-300 border-b dark:border-slate-800 overflow-hidden rtl:flex-row-reverse`}>
        <div className="flex items-center justify-center min-w-[3rem] h-12 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex-shrink-0">
            <span className="text-2xl font-bold">M</span>
        </div>
        <h1 className={`text-xl font-bold text-foreground dark:text-dark-foreground mx-3 whitespace-nowrap`}>MSS.2</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 group-hover:p-4 transition-all duration-300">
        <ul className="space-y-1">
          {visibleModules.map((module) => {
            if (module.submenu) {
              const isSubmenuOpen = openSubmenu === module.key;
              const isActive = module.submenu.some((sub: any) => sub.key === activeModule);
              const Icon = module.icon;
              return (
                <li key={module.key}>
                  <button
                    onClick={() => setOpenSubmenu(isSubmenuOpen ? null : module.key)}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 text-left rtl:flex-row-reverse ${isActive ? 'text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'} hover:bg-gray-100 dark:hover:bg-gray-700/50`}
                  >
                    <div className="flex items-center justify-center w-6 h-6 flex-shrink-0"><Icon /></div>
                    <span className="mx-4 font-medium whitespace-nowrap">{t(`sidebar.${module.key}`)}</span>
                    <ChevronDownIcon className={`w-4 h-4 ms-auto transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isSubmenuOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden ps-8 rtl:ps-0 rtl:pe-8 pt-1 space-y-1"
                      >
                        {module.submenu.map((subItem: any) => (
                          <li key={subItem.key}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setActiveModule(subItem.key); }}
                                className={`block p-2 rounded-md text-sm font-medium ${activeModule === subItem.key ? 'bg-primary-light/50 text-primary-dark dark:bg-primary/20 dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                            >
                              {t(`sidebar.${subItem.key}`)}
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            } else {
              return <NavItem key={module.key} moduleKey={module.key} icon={module.icon} isActive={activeModule === module.key} onClick={() => setActiveModule(module.key)} />;
            }
          })}
        </ul>
      </div>

      <div className="p-2 group-hover:p-4 transition-all duration-300 border-t dark:border-slate-800">
        <ul className="space-y-2">
            <NavItem
              moduleKey="logout"
              icon={LogoutIcon}
              isActive={false}
              onClick={() => {}}
            />
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;