
import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { SearchIcon, ChevronDownIcon } from '../../icons/GenericIcons';
import { CalendarIcon } from '../../icons/ActionIcons';
import { HrIcon } from '../../../components/icons/ModuleIcons'; // Placeholder for Card view
import { List } from 'lucide-react';

interface DonorsControlsProps {
    view: 'list' | 'card' | 'map';
    onViewChange: (view: 'list' | 'card' | 'map') => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onAddDonor: () => void;
    onFiltersToggle: () => void;
}

const DonorsControls: React.FC<DonorsControlsProps> = ({
    view, onViewChange, searchTerm, onSearchChange, onAddDonor, onFiltersToggle
}) => {
    const { t, dir } = useLocalization();

    const ViewButton: React.FC<{
        label: string;
        icon: React.ReactNode;
        isActive: boolean;
        onClick: () => void;
    }> = ({ label, icon, isActive, onClick }) => (
        <button
            onClick={onClick}
            title={label}
            className={`p-2 rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}`}
        >
            {icon}
        </button>
    );

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
                        placeholder={t('individual_donors.searchPlaceholder')}
                        className={`block w-full p-2.5 ${dir === 'ltr' ? 'ps-10' : 'pe-10'} text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 focus:ring-primary focus:border-primary`}
                    />
                </div>

                <div className="flex items-center gap-2">
                     <button onClick={onFiltersToggle} className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        {t('individual_donors.filters')}
                    </button>
                    <div className="p-1 bg-gray-100 dark:bg-slate-900 rounded-lg flex items-center">
                        <ViewButton label={t('individual_donors.listView')} icon={<List />} isActive={view === 'list'} onClick={() => onViewChange('list')} />
                        <ViewButton label={t('individual_donors.cardView')} icon={<HrIcon />} isActive={view === 'card'} onClick={() => onViewChange('card')} />
                        <ViewButton label={t('individual_donors.mapView')} icon={<CalendarIcon />} isActive={view === 'map'} onClick={() => onViewChange('map')} />
                    </div>
                </div>
                 <button onClick={onAddDonor} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-dark rounded-lg transition-colors">
                    {t('individual_donors.addDonor')}
                </button>
            </div>
        </div>
    );
};

export default DonorsControls;
