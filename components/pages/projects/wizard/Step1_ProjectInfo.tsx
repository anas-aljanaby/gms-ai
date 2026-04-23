
import React, { useState } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project, Language, ProjectType, ProjectLifecycleStageId } from '../../../../types';

interface Step1Props {
    data: Partial<Omit<Project, 'id'>>;
    updateData: (update: Partial<Omit<Project, 'id'>>) => void;
}

const FormField: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);

const Step1_ProjectInfo: React.FC<Step1Props> = ({ data, updateData }) => {
    const { t } = useLocalization();
    const [activeLang, setActiveLang] = useState<Language>('en');

    const handleNameChange = (lang: Language, value: string) => {
        updateData({ name: { ...data.name, [lang]: value } as Record<Language, string> });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('location.')) {
            const locKey = name.split('.')[1];
            updateData({ location: { ...data.location, [locKey]: value } as Project['location'] });
        } else {
            updateData({ [name]: value });
        }
    };
    
    const projectTypes: ProjectType[] = ['humanitarian', 'development', 'health', 'education', 'infrastructure'];
    const projectStages: ProjectLifecycleStageId[] = ['design', 'planning', 'implementation', 'monitoring', 'closure'];

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <FormField label={t('projects.wizard.form.name')} className="col-span-2">
                <div>
                    <div className="flex border-b">
                        {(['en', 'ar'] as Language[]).map(lang => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => setActiveLang(lang)}
                                className={`px-4 py-2 text-sm font-medium ${activeLang === lang ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <div className="pt-2">
                         <input
                            type="text"
                            value={data.name?.[activeLang] || ''}
                            onChange={e => handleNameChange(activeLang, e.target.value)}
                            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                        />
                    </div>
                </div>
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField label={t('projects.wizard.form.code')}>
                    <input type="text" disabled value="PROJ-2024-003" className="w-full p-2 border rounded-md bg-gray-200 dark:bg-slate-900 dark:border-slate-700 cursor-not-allowed" />
                </FormField>
                <FormField label={t('projects.wizard.form.type')}>
                    <select name="type" value={data.type} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                        {projectTypes.map(type => <option key={type} value={type}>{t(`projects.types.${type}`)}</option>)}
                    </select>
                </FormField>
                 <FormField label={t('projects.wizard.form.stage')}>
                    <select name="stage" value={data.stage} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                       {projectStages.map(stage => <option key={stage} value={stage}>{t(`projects.stages.${stage}`)}</option>)}
                    </select>
                </FormField>
                 <FormField label={t('projects.wizard.form.startDate')}>
                    <input type="date" name="plannedStartDate" value={data.plannedStartDate} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700" />
                </FormField>
                <FormField label={t('projects.wizard.form.endDate')}>
                    <input type="date" name="plannedEndDate" value={data.plannedEndDate} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700" />
                </FormField>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField label={t('projects.wizard.form.country')}>
                    <select name="location.country" value={data.location?.country} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                        <option value="Turkey">{t('projects.countries.turkey')}</option>
                        <option value="Syria">{t('projects.countries.syria')}</option>
                        <option value="Lebanon">{t('projects.countries.lebanon')}</option>
                        <option value="Uganda">{t('projects.countries.uganda')}</option>
                    </select>
                </FormField>
                <FormField label={t('projects.wizard.form.city')}>
                    <input type="text" name="location.city" value={data.location?.city} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700" />
                </FormField>
                <FormField label={t('projects.wizard.form.region')}>
                    <input type="text" name="location.region" value={data.location?.region || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700" />
                </FormField>
             </div>
        </div>
    );
};

export default Step1_ProjectInfo;
