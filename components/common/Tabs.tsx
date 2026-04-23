import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
}


/**
 * Tabs - مكون لعرض شريط تبويبات قابل للتمرير أفقيًا.
 * 
 * @component
 * @param {TabsProps} props - الخصائص.
 * @returns {JSX.Element} - مكون React
 * 
 * @example
 * const tabs = [{ id: 'overview', label: 'Overview' }, { id: 'details', label: 'Details' }];
 * const [activeTab, setActiveTab] = useState('overview');
 * <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
 */
const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick }) => {
    const { dir } = useLocalization();

    return (
        <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className={`-mb-px flex gap-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''} overflow-x-auto`}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabClick(tab.id)}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                            activeTab === tab.id
                                ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                        }`}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Tabs;
