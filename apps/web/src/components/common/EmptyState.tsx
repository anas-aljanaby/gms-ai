





import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { SearchIcon, WrenchIcon } from '../icons/GenericIcons';
import { LockIcon } from '../icons/ActionIcons';
import { BarChart3 as BarChartIcon } from 'lucide-react';

type EmptyStateType = 'NoData' | 'NoResults' | 'NoPermission' | 'Maintenance';

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction, className }) => {
    const { t } = useLocalization();

    // FIX: Completed the config object to include all variants of EmptyStateType.
    const config: Record<EmptyStateType, {
        icon: React.ReactNode;
        title: string;
        subtitle?: string | null;
        buttonText?: string | null;
    }> = {
        NoData: {
            icon: <BarChartIcon className="w-20 h-20 text-gray-400" />,
            title: t('emptyState.noData.title'),
            buttonText: t('emptyState.noData.button'),
        },
        NoResults: {
            icon: <SearchIcon className="w-20 h-20 text-gray-400" />,
            title: t('emptyState.noResults.title'),
            subtitle: t('emptyState.noResults.subtitle'),
            buttonText: t('emptyState.noResults.button'),
        },
        NoPermission: {
            icon: <LockIcon className="w-20 h-20 text-gray-400" />,
            title: t('emptyState.noPermission.title'),
            subtitle: t('emptyState.noPermission.subtitle'),
        },
        Maintenance: {
            icon: <WrenchIcon className="w-20 h-20 text-gray-400" />,
            title: t('emptyState.maintenance.title'),
            subtitle: t('emptyState.maintenance.subtitle'),
        },
    };

    const currentConfig = config[type];

    return (
        <div className={`text-center py-16 px-6 bg-card dark:bg-dark-card rounded-2xl shadow-inner ${className || ''}`}>
            {currentConfig.icon}
            <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mt-4">{currentConfig.title}</h3>
            {currentConfig.subtitle && <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">{currentConfig.subtitle}</p>}
            {onAction && currentConfig.buttonText && (
                <button
                    onClick={onAction}
                    className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark font-semibold"
                >
                    {currentConfig.buttonText}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
