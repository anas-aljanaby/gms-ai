
import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import SettingsCard from './SettingsCard';
import FormField from './FormField';
import ToggleSwitch from './ToggleSwitch';
import type { Language } from '../../../types';

interface OrganizationSettingsProps {
    enabledLanguages: Language[];
    onEnabledLanguagesChange: (langs: Language[]) => void;
}

const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({ enabledLanguages, onEnabledLanguagesChange }) => {
    const { t } = useLocalization();
    const [settings, setSettings] = useState({
        orgName: 'Global Relief Foundation',
        mission: 'To provide humanitarian aid and sustainable development solutions to communities in need.',
        primaryColor: '#3B82F6',
        fiscalYearStart: '2024-01-01',
        fiscalYearEnd: '2024-12-31',
        defaultLang: 'en',
        country: 'Turkey',
        timezone: 'Europe/Istanbul',
        currency: 'USD',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (name: string, checked: boolean) => {
        const lang = name as Language;
        let newEnabledLangs;
        if (checked) {
            newEnabledLangs = [...new Set([...enabledLanguages, lang])];
        } else {
            if (enabledLanguages.length <= 1) {
                // Prevent disabling the last language.
                return;
            }
            newEnabledLangs = enabledLanguages.filter(l => l !== lang);
        }
        onEnabledLanguagesChange(newEnabledLangs);
    };

    return (
        <div className="space-y-6">
            <SettingsCard
                title={t('settings.organization.profileTitle')}
                description={t('settings.organization.profileDesc')}
            >
                <FormField label={t('settings.organization.orgName')}>
                    <input type="text" name="orgName" value={settings.orgName} onChange={handleInputChange} />
                </FormField>
                <FormField label={t('settings.organization.mission')}>
                    <textarea name="mission" value={settings.mission} onChange={handleInputChange} rows={3} />
                </FormField>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormField label={t('settings.organization.uploadLogo')}>
                        <input type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary/20 dark:file:bg-primary/20 dark:file:text-secondary-light dark:hover:file:bg-primary/30"/>
                    </FormField>
                    <FormField label={t('settings.organization.primaryColor')}>
                        <div className="flex items-center gap-2">
                            <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleInputChange} className="w-10 h-10 p-1 bg-white border rounded-md cursor-pointer"/>
                            <input type="text" name="primaryColor" value={settings.primaryColor} onChange={handleInputChange} className="w-full"/>
                        </div>
                    </FormField>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label={t('settings.organization.fiscalYearStart')}>
                        <input type="date" name="fiscalYearStart" value={settings.fiscalYearStart} onChange={handleInputChange} />
                    </FormField>
                    <FormField label={t('settings.organization.fiscalYearEnd')}>
                        <input type="date" name="fiscalYearEnd" value={settings.fiscalYearEnd} onChange={handleInputChange} />
                    </FormField>
                </div>
            </SettingsCard>
            
            <SettingsCard
                title={t('settings.organization.langTitle')}
                description={t('settings.organization.langDesc')}
            >
                <FormField label={t('settings.organization.defaultLang')}>
                    <select name="defaultLang" value={settings.defaultLang} onChange={handleInputChange}>
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                    </select>
                </FormField>
                <div className="space-y-2 pt-2">
                    <ToggleSwitch label={t('settings.organization.enableEnglish')} name="en" isChecked={enabledLanguages.includes('en')} onToggle={handleToggleChange} />
                    <ToggleSwitch label={t('settings.organization.enableArabic')} name="ar" isChecked={enabledLanguages.includes('ar')} onToggle={handleToggleChange} />
                </div>
            </SettingsCard>
            
             <SettingsCard
                title={t('settings.organization.regionTitle')}
                description={t('settings.organization.regionDesc')}
            >
                <FormField label={t('settings.organization.country')}>
                    <select name="country" value={settings.country} onChange={handleInputChange}>
                        <option>Turkey</option>
                        <option>USA</option>
                        <option>Saudi Arabia</option>
                        <option>United Kingdom</option>
                    </select>
                </FormField>
                <FormField label={t('settings.organization.timezone')}>
                    <select name="timezone" value={settings.timezone} onChange={handleInputChange}>
                        <option>Europe/Istanbul</option>
                        <option>America/New_York</option>
                        <option>Asia/Riyadh</option>
                        <option>Europe/London</option>
                    </select>
                </FormField>
                <FormField label={t('settings.organization.primaryCurrency')}>
                    <select name="currency" value={settings.currency} onChange={handleInputChange}>
                        <option>USD</option>
                        <option>TRY</option>
                        <option>SAR</option>
                        <option>GBP</option>
                    </select>
                </FormField>
            </SettingsCard>

            <div className="flex justify-end pt-4">
                 <button className="px-6 py-2.5 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary-dark transition-colors">
                    {t('settings.saveChanges')}
                </button>
            </div>
        </div>
    );
};

export default OrganizationSettings;
