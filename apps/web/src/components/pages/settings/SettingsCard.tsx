import React from 'react';

interface SettingsCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, children }) => {
    return (
        <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft overflow-hidden border border-gray-200 dark:border-slate-700/50">
            <div className="p-6 border-b dark:border-slate-700">
                <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground">{title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <div className="p-6 space-y-4 bg-gray-50/50 dark:bg-dark-background/20">
                {children}
            </div>
        </div>
    );
};

export default SettingsCard;
