import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { SearchIcon, ChevronDownIcon } from '../../icons/GenericIcons';
import { CsvIcon, JsonIcon, UploadIcon } from '../../icons/ActionIcons';
import { LayoutDashboard, Filter } from 'lucide-react';

interface DashboardControlsProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    countryFilter: string;
    onCountryChange: (value: string) => void;
    countryOptions: string[];
    onAddDonor: () => void;
    view: 'kanban' | 'funnel';
    onViewChange: (view: 'kanban' | 'funnel') => void;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
    searchTerm,
    onSearchChange,
    countryFilter,
    onCountryChange,
    countryOptions,
    onAddDonor,
    view,
    onViewChange
}) => {
    const { t, dir } = useLocalization(['common', 'donors']);
    const [isExportMenuOpen, setIsExportMenuOpen] = React.useState(false);
    const exportMenuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
            setIsExportMenuOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <div className="flex-shrink-0 p-4 mb-4 bg-card dark:bg-dark-card rounded-xl shadow-soft">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className={`absolute inset-y-0 flex items-center ${dir === 'ltr' ? 'ps-3' : 'pe-3'} pointer-events-none`}>
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t('donors.searchPlaceholder')}
                        className={`block w-full p-2.5 ${dir === 'ltr' ? 'ps-10' : 'pe-10'} text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 focus:ring-primary focus:border-primary`}
                    />
                </div>
                <select
                    value={countryFilter}
                    onChange={(e) => onCountryChange(e.target.value)}
                    className="p-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 focus:ring-primary focus:border-primary"
                >
                    {countryOptions.map(country => (
                        <option key={country} value={country}>{country === 'All' ? t('donors.allCountries') : country}</option>
                    ))}
                </select>
                <div className="p-1 bg-gray-100 dark:bg-slate-900 rounded-lg flex items-center">
                    <button onClick={() => onViewChange('kanban')} title={t('donorManagement.views.kanban')} className={`p-1.5 rounded-md ${view === 'kanban' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}><LayoutDashboard size={20}/></button>
                    <button onClick={() => onViewChange('funnel')} title={t('donorManagement.views.funnel')} className={`p-1.5 rounded-md ${view === 'funnel' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}><Filter size={20}/></button>
                </div>
                <button
                    onClick={onAddDonor}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-dark rounded-lg transition-colors"
                >
                    {t('donors.addDonor')}
                </button>
            </div>
        </div>
    );
};

export default DashboardControls;
