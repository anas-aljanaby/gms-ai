
import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { Search, List, LayoutGrid } from 'lucide-react';

interface ProjectListControlsProps {
    view: 'list' | 'card';
    onViewChange: (view: 'list' | 'card') => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const ProjectListControls: React.FC<ProjectListControlsProps> = ({ view, onViewChange, searchTerm, onSearchChange }) => {
    const { t } = useLocalization();

    return (
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative flex-grow w-full sm:w-auto">
                <Search className="w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('projects.search_placeholder')}
                    className="w-full py-2 px-3 pl-9 rtl:pr-9 rtl:pl-3 text-sm border border-gray-200 dark:border-slate-600 rounded-lg bg-card dark:bg-dark-card focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
            </div>
            <div className="p-1 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center gap-0.5">
                <button
                    onClick={() => onViewChange('list')}
                    title={t('projects.views.list')}
                    className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-secondary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                    <List size={18} />
                </button>
                <button
                    onClick={() => onViewChange('card')}
                    title={t('projects.views.card')}
                    className={`p-2 rounded-md transition-colors ${view === 'card' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-secondary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                    <LayoutGrid size={18} />
                </button>
            </div>
        </div>
    );
};

export default ProjectListControls;
