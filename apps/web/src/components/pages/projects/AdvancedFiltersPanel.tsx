import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';

interface AdvancedFiltersPanelProps {
    isOpen: boolean;
}

const AdvancedFiltersPanel: React.FC<AdvancedFiltersPanelProps> = ({ isOpen }) => {
    const { t } = useLocalization();

    if (!isOpen) {
        return null;
    }

    return (
        <div className="p-4 mb-4 bg-gray-50 dark:bg-dark-card/50 rounded-xl border dark:border-slate-700 animate-fade-in-fast">
            <h3 className="font-semibold mb-4">{t('projects.advanced_filters')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <p className="text-gray-500 col-span-full text-center py-4">{t('placeholder.underConstruction')}</p>
            </div>
        </div>
    );
};

export default AdvancedFiltersPanel;
