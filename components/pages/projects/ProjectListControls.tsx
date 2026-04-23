
import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { Search, List, LayoutGrid, Map as MapIcon } from 'lucide-react';

interface ProjectListControlsProps {
    view: 'list' | 'card' | 'map';
    onViewChange: (view: 'list' | 'card' | 'map') => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onFiltersToggle: () => void;
}

const ProjectListControls: React.FC<ProjectListControlsProps> = ({ view, onViewChange, searchTerm, onSearchChange, onFiltersToggle }) => {
    const { t } = useLocalization();

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
        <div className="p-4 bg-card dark:bg-dark-card rounded-xl shadow-soft border dark:border-slate-700/50">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative flex-grow w-full sm:w-auto">
                    <Search className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t('projects.search_placeholder')}
                        className="w-full p-2 pl-10 rtl:pr-10 border rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-slate-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onFiltersToggle} className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">
                        {t('projects.advanced_filters')}
                    </button>
                    <div className="p-1 bg-gray-100 dark:bg-slate-900 rounded-lg flex items-center">
                        <ViewButton label="List" icon={<List size={20} />} isActive={view === 'list'} onClick={() => onViewChange('list')} />
                        <ViewButton label="Card" icon={<LayoutGrid size={20} />} isActive={view === 'card'} onClick={() => onViewChange('card')} />
                        <ViewButton label="Map" icon={<MapIcon size={20} />} isActive={view === 'map'} onClick={() => onViewChange('map')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectListControls;
