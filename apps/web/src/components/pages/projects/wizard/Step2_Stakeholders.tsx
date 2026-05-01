
import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project } from '../../../../types';

interface Step2Props {
    data: Partial<Omit<Project, 'id'>>;
    updateData: (update: Partial<Omit<Project, 'id'>>) => void;
}

const FormField: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);

const Step2_Stakeholders: React.FC<Step2Props> = ({ data, updateData }) => {
    const { t } = useLocalization();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateData({ 
            stakeholders: { ...data.stakeholders, [name]: value } as Project['stakeholders']
        });
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
             <FormField label={t('projects.wizard.form.donor')}>
                <input 
                    type="text" 
                    name="donor" 
                    value={data.stakeholders?.donor || ''} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                />
            </FormField>
            <FormField label={t('projects.wizard.form.implementingPartner')}>
                <input 
                    type="text" 
                    name="implementingPartner" 
                    value={data.stakeholders?.implementingPartner || ''} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                />
            </FormField>
             <FormField label={t('projects.wizard.form.targetBeneficiaries')}>
                <textarea 
                    name="targetBeneficiaries" 
                    value={data.stakeholders?.targetBeneficiaries || ''} 
                    onChange={handleChange} 
                    rows={4}
                    className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                />
            </FormField>
            <FormField label={t('projects.wizard.form.primaryContact')}>
                <input 
                    type="text" 
                    name="primaryContact" 
                    value={data.stakeholders?.primaryContact || ''} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                />
            </FormField>
        </div>
    );
};

export default Step2_Stakeholders;
