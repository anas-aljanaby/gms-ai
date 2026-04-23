import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project, ProjectKPI } from '../../../../types';
import { PlusCircleIcon, XIcon } from '../../../icons/GenericIcons';

interface Step3Props {
    data: Partial<Omit<Project, 'id'>>;
    updateData: (update: Partial<Omit<Project, 'id'>>) => void;
    setProjectData: React.Dispatch<React.SetStateAction<Partial<Omit<Project, 'id'>>>>;
}

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);

const Step3_GoalsAndOutcomes: React.FC<Step3Props> = ({ data, updateData, setProjectData }) => {
    const { t } = useLocalization();

    const handleListChange = (listName: 'objectives' | 'expectedOutcomes', index: number, value: string) => {
        const newList = [...(data[listName] || [])];
        newList[index] = value;
        updateData({ [listName]: newList });
    };

    const addListItem = (listName: 'objectives' | 'expectedOutcomes') => {
        const newList = [...(data[listName] || []), ''];
        updateData({ [listName]: newList });
    };

    const removeListItem = (listName: 'objectives' | 'expectedOutcomes', index: number) => {
        const newList = (data[listName] || []).filter((_, i) => i !== index);
        updateData({ [listName]: newList });
    };
    
    const handleKpiChange = (index: number, field: keyof ProjectKPI, value: string) => {
        setProjectData(prev => {
            const newKpis = [...(prev.kpis || [])];
            if (newKpis[index]) {
                const updatedKpi = { ...newKpis[index], [field]: value };
                newKpis[index] = updatedKpi;
            }
            return { ...prev, kpis: newKpis };
        });
    };

    const addKpi = () => {
        setProjectData(prev => ({
            ...prev,
            kpis: [...(prev.kpis || []), { id: `kpi-${Date.now()}`, name: '', unit: 'number', target: '' }],
        }));
    };

    const removeKpi = (index: number) => {
        setProjectData(prev => ({
            ...prev,
            kpis: (prev.kpis || []).filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <FormField label={t('projects.wizard.form.goal')}>
                <textarea
                    value={data.goal || ''}
                    onChange={e => updateData({ goal: e.target.value })}
                    rows={3}
                    className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                />
            </FormField>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('projects.wizard.form.objective')}</label>
                {(data.objectives || []).map((obj, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            value={obj}
                            onChange={e => handleListChange('objectives', index, e.target.value)}
                            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                        />
                        {(data.objectives || []).length > 1 && (
                            <button type="button" onClick={() => removeListItem('objectives', index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                <XIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => addListItem('objectives')} className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <PlusCircleIcon /> {t('projects.wizard.form.addObjective')}
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('projects.wizard.form.outcome')}</label>
                {(data.expectedOutcomes || []).map((out, index) => (
                     <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            value={out}
                            onChange={e => handleListChange('expectedOutcomes', index, e.target.value)}
                            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                        />
                        {(data.expectedOutcomes || []).length > 1 && (
                            <button type="button" onClick={() => removeListItem('expectedOutcomes', index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                <XIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => addListItem('expectedOutcomes')} className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <PlusCircleIcon /> {t('projects.wizard.form.addOutcome')}
                </button>
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('projects.wizard.form.kpi')}</label>
                {(data.kpis || []).map((kpi, index) => (
                    <div key={kpi.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <div className="col-span-11 md:col-span-5">
                            <input
                                type="text"
                                placeholder={t('projects.wizard.form.kpiName')}
                                value={kpi.name}
                                onChange={e => handleKpiChange(index, 'name', e.target.value)}
                                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                            />
                        </div>
                        <div className="col-span-6 md:col-span-3">
                             <select
                                value={kpi.unit}
                                onChange={e => handleKpiChange(index, 'unit', e.target.value)}
                                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                            >
                                <option value="number">Number</option>
                                <option value="percentage">Percentage</option>
                                <option value="text">Text</option>
                            </select>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                             <input
                                type="text"
                                placeholder={t('projects.wizard.form.kpiTarget')}
                                value={kpi.target}
                                onChange={e => handleKpiChange(index, 'target', e.target.value)}
                                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
                            />
                        </div>
                         <div className="col-span-1 flex justify-end">
                            {(data.kpis || []).length > 1 && (
                                <button type="button" onClick={() => removeKpi(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                    <XIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                 <button type="button" onClick={addKpi} className="flex items-center gap-2 text-sm font-semibold text-primary mt-2">
                    <PlusCircleIcon /> {t('projects.wizard.form.addKpi')}
                </button>
            </div>
        </div>
    );
};

export default Step3_GoalsAndOutcomes;