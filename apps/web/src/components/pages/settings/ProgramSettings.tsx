import React, { useState, type ReactNode } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { ProgramSettingsSubCategory } from '../../../types';
import SettingsCard from './SettingsCard';
import ToggleSwitch from './ToggleSwitch';
import { MOCK_PROGRAM_DATA } from '../../../data/programData';
import { Building2, Globe, UsersRound, RefreshCw, Crosshair } from 'lucide-react';

const categoryColorClasses: Record<string, string> = {
    blue: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-200',
    red: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-200',
    orange: 'border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900/60 dark:bg-orange-900/20 dark:text-orange-200',
    green: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-200',
};

const ProgramSettings: React.FC = () => {
    const { t, dir, pickLocalized } = useLocalization();
    const [activeSubCategory, setActiveSubCategory] = useState<ProgramSettingsSubCategory>('structure');
    const [sdgs, setSdgs] = useState(MOCK_PROGRAM_DATA.sdgs);

    const subCategories: { id: ProgramSettingsSubCategory; icon: ReactNode }[] = [
        { id: 'structure', icon: <Building2 size={18} /> },
        { id: 'geography', icon: <Globe size={18} /> },
        { id: 'beneficiaries', icon: <UsersRound size={18} /> },
        { id: 'lifecycle', icon: <RefreshCw size={18} /> },
        { id: 'frameworks', icon: <Crosshair size={18} /> },
    ];

    const renderGeographyTree = (node: { id: string; name: string; children: Array<any> }, depth = 0): React.ReactNode => (
        <div key={node.id} className={depth === 0 ? '' : 'mt-2'}>
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800/50" style={{ marginInlineStart: depth * 16 }}>
                <span className="font-medium">{node.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {node.children.length ? t('settings.programSettings.geography.childCount', { count: node.children.length }) : t('settings.programSettings.geography.leaf')}
                </span>
            </div>
            {node.children.map(child => renderGeographyTree(child, depth + 1))}
        </div>
    );

    const renderActiveSubCategory = () => {
        switch (activeSubCategory) {
            case 'structure':
                return (
                    <SettingsCard title={t('settings.programSettings.structure.categoriesTitle')} description={t('settings.programSettings.structure.categoriesDesc')}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {MOCK_PROGRAM_DATA.categories.map(category => (
                                <div key={category.id} className={`rounded-lg border p-4 ${categoryColorClasses[category.color] ?? categoryColorClasses.blue}`}>
                                    <h4 className="font-semibold">{pickLocalized(category.name)}</h4>
                                    <p className="mt-1 text-sm opacity-80">{pickLocalized(category.description)}</p>
                                </div>
                            ))}
                        </div>
                    </SettingsCard>
                );
            case 'geography':
                return (
                    <SettingsCard title={t('settings.programSettings.geography.title')} description={t('settings.programSettings.geography.desc')}>
                        <div className="space-y-3">
                            {MOCK_PROGRAM_DATA.geographies.map(geo => renderGeographyTree(geo))}
                        </div>
                    </SettingsCard>
                );
            case 'beneficiaries':
                return (
                    <SettingsCard title={t('settings.programSettings.beneficiaries.title')} description={t('settings.programSettings.beneficiaries.desc')}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {MOCK_PROGRAM_DATA.beneficiaryGroups.map(group => (
                                <div key={group.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
                                    <p className="font-semibold text-foreground dark:text-dark-foreground">{pickLocalized(group.name)}</p>
                                </div>
                            ))}
                        </div>
                    </SettingsCard>
                );
            case 'lifecycle':
                return (
                    <SettingsCard title={t('settings.programSettings.lifecycle.title')} description={t('settings.programSettings.lifecycle.desc')}>
                        <div className="space-y-3">
                            {MOCK_PROGRAM_DATA.lifecycleStages.map(stage => (
                                <div key={stage.id} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{stage.order}</div>
                                    <div>
                                        <h4 className="font-semibold text-foreground dark:text-dark-foreground">{pickLocalized(stage.name)}</h4>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{pickLocalized(stage.description)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SettingsCard>
                );
            case 'frameworks':
                return (
                    <SettingsCard title={t('settings.programSettings.frameworks.sdgTitle')} description={t('settings.programSettings.frameworks.sdgDesc')}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {sdgs.map(sdg => (
                                <div key={sdg.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
                                    <div className="mb-3 flex items-start gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white" style={{ backgroundColor: sdg.color }}>
                                            {sdg.id}
                                        </span>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-foreground dark:text-dark-foreground">{sdg.name}</h4>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{sdg.description}</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch
                                        label={t('settings.programSettings.frameworks.enableSdg')}
                                        name={`sdg-${sdg.id}`}
                                        isChecked={sdg.isEnabled}
                                        onToggle={(_, checked) => setSdgs(prev => prev.map(item => item.id === sdg.id ? { ...item, isEnabled: checked } : item))}
                                    />
                                </div>
                            ))}
                        </div>
                    </SettingsCard>
                );
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-4">{t('settings.programSettings.title')}</h2>
            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="lg:w-1/4">
                    <nav className="space-y-1">
                        {subCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveSubCategory(cat.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors text-left ${
                                    activeSubCategory === cat.id
                                    ? 'bg-primary-light/80 text-primary-dark font-semibold dark:bg-primary/20 dark:text-secondary-light'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700/50'
                                } ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                            >
                                <span className="text-lg">{cat.icon}</span>
                                <span>{t(`settings.programSettings.subCategories.${cat.id}`)}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 space-y-6">
                    {renderActiveSubCategory()}
                     <div className="flex justify-end pt-4">
                        <button className="px-6 py-2.5 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary-dark transition-colors">
                            {t('settings.saveChanges')}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProgramSettings;
