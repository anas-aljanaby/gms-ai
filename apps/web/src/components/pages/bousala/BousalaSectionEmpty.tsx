import React from 'react';
import { Target } from 'lucide-react';

interface BousalaSectionEmptyProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    compact?: boolean;
}

const BousalaSectionEmpty: React.FC<BousalaSectionEmptyProps> = ({
    title,
    description,
    actionLabel,
    onAction,
    compact = false,
}) => (
    <div
        className={`text-center rounded-xl border border-dashed border-gray-300 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-800/30 ${
            compact ? 'py-6 px-4' : 'py-10 px-6'
        }`}
    >
        <Target className={`mx-auto text-gray-400 ${compact ? 'w-8 h-8' : 'w-12 h-12'}`} />
        <p className={`font-semibold text-foreground dark:text-dark-foreground ${compact ? 'mt-2 text-sm' : 'mt-4 text-base'}`} dir="auto">
            {title}
        </p>
        <p className={`text-gray-500 dark:text-gray-400 max-w-md mx-auto ${compact ? 'mt-1 text-xs' : 'mt-2 text-sm'}`} dir="auto">
            {description}
        </p>
        {actionLabel && onAction && (
            <button
                type="button"
                onClick={onAction}
                className={`mt-4 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark ${
                    compact ? 'text-xs' : 'text-sm'
                }`}
            >
                {actionLabel}
            </button>
        )}
    </div>
);

export default BousalaSectionEmpty;
