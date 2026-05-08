import React, { useState, type ReactNode } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { ProgramSettingsSubCategory } from '../../../types';
import SettingsCard from './SettingsCard';
import ToggleSwitch from './ToggleSwitch';
import { MOCK_PROGRAM_DATA } from '../../../data/programData';
import { Building2, Globe, UsersRound, RefreshCw, Crosshair, TrendingUp, Construction } from 'lucide-react';

const ProgramSettings: React.FC = () => {
    const { t, dir } = useLocalization();
    const [activeSubCategory, setActiveSubCategory] = useState<ProgramSettingsSubCategory>('structure');

    const subCategories: { id: ProgramSettingsSubCategory; icon: ReactNode }[] = [
        { id: 'structure', icon: <Building2 size={18} /> },
        { id: 'geography', icon: <Globe size={18} /> },
        { id: 'beneficiaries', icon: <UsersRound size={18} /> },
        { id: 'lifecycle', icon: <RefreshCw size={18} /> },
        { id: 'frameworks', icon: <Crosshair size={18} /> },
        { id: 'indicators', icon: <TrendingUp size={18} /> },
        // { id: 'workflows', icon: <CheckSquare size={18} /> },
        // { id: 'partnerships', icon: <Handshake size={18} /> },
        // { id: 'safeguarding', icon: <Shield size={18} /> },
        // { id: 'templates', icon: <FileText size={18} /> },
    ];

    const renderActiveSubCategory = () => {
        switch (activeSubCategory) {
            // Cases for each sub-category will be added here
            default:
                return (
                    <SettingsCard title={t(`settings.programSettings.subCategories.${activeSubCategory}`)} description="">
                        <div className="text-center p-8">
                             <div className="mb-4 flex justify-center"><Construction size={36} /></div>
                             <p>{t('placeholder.underConstruction')}</p>
                        </div>
                    </SettingsCard>
                )
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
                   {/* This is a simplified version. A full implementation would have separate components */}
                    <SettingsCard title={t('settings.programSettings.structure.categoriesTitle')} description={t('settings.programSettings.structure.categoriesDesc')}>
                        <p className="text-sm">{t('settings.programSettings.structure.placeholder')}</p>
                    </SettingsCard>
                    <SettingsCard title={t('settings.programSettings.lifecycle.title')} description={t('settings.programSettings.lifecycle.desc')}>
                         <p className="text-sm">{t('settings.programSettings.lifecycle.placeholder')}</p>
                    </SettingsCard>
                    <SettingsCard title={t('settings.programSettings.frameworks.sdgTitle')} description={t('settings.programSettings.frameworks.sdgDesc')}>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {MOCK_PROGRAM_DATA.sdgs.map(sdg => (
                                <div key={sdg.id} className={`p-2 rounded-md text-white text-xs font-bold text-center aspect-square flex flex-col justify-center items-center`} style={{backgroundColor: sdg.color}}>
                                    <img src={`https://via.placeholder.com/40/${sdg.color.substring(1)}/FFFFFF?text=SDG`} alt={`SDG ${sdg.id}`} className="w-8 h-8 mb-1" />
                                    <span>{sdg.id}</span>
                                </div>
                            ))}
                        </div>
                    </SettingsCard>
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
