
import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { Project, Language, ProjectKPI } from '../../../types';
import { XIcon } from '../../icons/GenericIcons';
import WizardStepper from './wizard/WizardStepper';
import Step1_ProjectInfo from './wizard/Step1_ProjectInfo';
import Step2_Stakeholders from './wizard/Step2_Stakeholders';
import Step3_GoalsAndOutcomes from './wizard/Step3_GoalsAndOutcomes';

interface CreateProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Omit<Project, 'id'>) => void;
}

const CreateProjectWizard: React.FC<CreateProjectWizardProps> = ({ isOpen, onClose, onCreateProject }) => {
    const { t } = useLocalization();
    const [currentStep, setCurrentStep] = useState(1);
    
    // Initialize state for the new project with default values
    const [projectData, setProjectData] = useState<Partial<Omit<Project, 'id'>>>({
        name: { en: '', ar: '' },
        type: 'humanitarian',
        stage: 'design',
        plannedStartDate: '',
        plannedEndDate: '',
        location: { country: 'Turkey', city: '' },
        stakeholders: { donor: '', targetBeneficiaries: '', primaryContact: '' },
        goal: '',
        objectives: [''],
        expectedOutcomes: [''],
        kpis: [{ id: `kpi-${Date.now()}`, name: '', unit: 'number', target: '' }],
        progress: 0,
        budget: 0,
        spent: 0,
    });
    
    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const updateData = (update: Partial<Omit<Project, 'id'>>) => {
        setProjectData(prev => ({ ...prev, ...update }));
    };

    const handleCreate = () => {
        // Here you would have validation
        onCreateProject(projectData as Omit<Project, 'id'>);
    };

    if (!isOpen) return null;

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <Step1_ProjectInfo data={projectData} updateData={updateData} />;
            case 2: return <Step2_Stakeholders data={projectData} updateData={updateData} />;
            case 3: return <Step3_GoalsAndOutcomes data={projectData} updateData={updateData} setProjectData={setProjectData} />;
            default: return null;
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[95vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">{t('projects.wizard.title')}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label={t('common.close')}>
                        <XIcon />
                    </button>
                </div>

                <div className="p-6 border-b dark:border-slate-700 flex-shrink-0">
                    <WizardStepper currentStep={currentStep} />
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    {renderStepContent()}
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-2xl flex justify-between items-center flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">
                        {t('common.cancel')}
                    </button>
                    <div className="flex items-center gap-3">
                        <button onClick={handleBack} disabled={currentStep === 1} className="px-4 py-2 rounded-lg border dark:border-slate-600 text-sm font-semibold disabled:opacity-50">
                           &larr; {t('projects.wizard.back')}
                        </button>
                        {currentStep < 3 ? (
                            <button onClick={handleNext} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark">
                                {t('projects.wizard.next')} &rarr;
                            </button>
                        ) : (
                            <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-secondary-dark">
                                {t('projects.wizard.finish')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectWizard;
