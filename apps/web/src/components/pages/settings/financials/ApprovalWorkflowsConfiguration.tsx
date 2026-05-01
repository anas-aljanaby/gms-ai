
import React, { useState, useMemo } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import { MOCK_WORKFLOWS, MOCK_AUTH_LIMITS } from '../../../../data/financialData';
import type { ApprovalWorkflow, AuthorizationLimit, TransactionType } from '../../../../types';
import SettingsCard from '../SettingsCard';
import ToggleSwitch from '../ToggleSwitch';
import { RoleIcon, UserIcon, ManagerIcon, ArrowDownIcon } from '../../../icons/WorkflowIcons';
import { EditIcon } from '../../../icons/ActionIcons';
import { PlusCircleIcon } from '../../../icons/GenericIcons';
import { formatCurrency } from '../../../../lib/utils';

const ApprovalWorkflowsConfiguration: React.FC = () => {
    const { t, language, dir } = useLocalization();
    const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>(MOCK_WORKFLOWS);
    const [authLimits, setAuthLimits] = useState<AuthorizationLimit[]>(MOCK_AUTH_LIMITS);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<TransactionType | null>(null);

    const selectedWorkflow = useMemo(() => {
        return workflows.find(w => w.id === selectedWorkflowId);
    }, [workflows, selectedWorkflowId]);

    const handleWorkflowToggle = (workflowId: string, isEnabled: boolean) => {
        setWorkflows(prev => prev.map(w => w.id === workflowId ? { ...w, isEnabled } : w));
    };

    const ApproverIcon = ({ type }: { type: 'role' | 'user' | 'reportingManager' }) => {
        switch (type) {
            case 'role': return <RoleIcon />;
            case 'user': return <UserIcon />;
            case 'reportingManager': return <ManagerIcon />;
            default: return null;
        }
    };
    
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground dark:text-dark-foreground">{t('financialSettings.workflows.title')}</h3>

            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="lg:w-1/3">
                    <SettingsCard title={t('financialSettings.workflows.availableWorkflows')} description={t('financialSettings.workflows.availableWorkflowsDesc')}>
                        <div className="p-0 space-y-2">
                           {workflows.map(wf => (
                                <div key={wf.id} className={`p-3 rounded-lg border-l-4 transition-colors ${selectedWorkflowId === wf.id ? 'bg-primary-light/50 border-primary' : 'hover:bg-gray-100 dark:hover:bg-slate-800/50 border-transparent'}`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold">{wf.name[language]}</h4>
                                            <p className="text-xs text-gray-500">{wf.description[language]}</p>
                                        </div>
                                        <button onClick={() => setSelectedWorkflowId(wf.id)} className="px-3 py-1 text-xs font-semibold bg-white dark:bg-slate-700 rounded-full shadow-sm hover:bg-gray-200">
                                            {t('financialSettings.workflows.configure')}
                                        </button>
                                    </div>
                                </div>
                           ))}
                        </div>
                    </SettingsCard>
                </aside>
                <main className="flex-1">
                    {selectedWorkflow ? (
                         <div className="space-y-6">
                            <SettingsCard
                                title={t('financialSettings.workflows.workflowConfiguration')}
                                description={selectedWorkflow.description[language]}
                            >
                                <ToggleSwitch
                                    label={t('financialSettings.workflows.workflowEnabled')}
                                    name={selectedWorkflow.id}
                                    isChecked={selectedWorkflow.isEnabled}
                                    onToggle={(name, checked) => handleWorkflowToggle(name, checked)}
                                />
                            </SettingsCard>

                            <SettingsCard title={t('financialSettings.workflows.approvalSteps')} description={t('financialSettings.workflows.approvalStepsDesc')}>
                                <div className="space-y-2">
                                   {selectedWorkflow.steps.map((step, index) => (
                                       <React.Fragment key={step.id}>
                                            <div className="bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg border dark:border-slate-700">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">{step.stepNumber}</span>
                                                        </div>
                                                        <div className="text-sm">
                                                            <p className="font-semibold text-gray-500 dark:text-gray-400">{t('financialSettings.workflows.when')}</p>
                                                             <p className="font-bold text-foreground dark:text-dark-foreground">
                                                                {step.condition ? `${t('financialSettings.workflows.amount')} ${t(`financialSettings.workflows.operators.${step.condition.operator}`)} ${formatCurrency(step.condition.value, language)}` : t('financialSettings.workflows.anyAmount')}
                                                            </p>
                                                            <p className="mt-2 font-semibold text-gray-500 dark:text-gray-400">{t('financialSettings.workflows.then')}</p>
                                                            <div className="flex items-center gap-2 font-bold text-foreground dark:text-dark-foreground">
                                                                <ApproverIcon type={step.approverType} />
                                                                <span>{t(`financialSettings.workflows.approverTypes.${step.approverType}`)} ({step.approverId}) {t('financialSettings.workflows.approve')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                     <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><EditIcon/></button>
                                                </div>
                                            </div>
                                           {index < selectedWorkflow.steps.length - 1 && (
                                                <div className="flex justify-center">
                                                    <ArrowDownIcon />
                                                </div>
                                           )}
                                       </React.Fragment>
                                   ))}
                                    <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                                        <PlusCircleIcon />
                                        {t('financialSettings.workflows.addStep')}
                                    </button>
                                </div>
                            </SettingsCard>

                            <SettingsCard title={t('financialSettings.workflows.authorizationLimits')} description={t('financialSettings.workflows.authorizationLimitsDesc')}>
                               <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="text-left text-gray-500 dark:text-gray-400">
                                            <tr>
                                                <th className="p-2">{t('financialSettings.workflows.role')}</th>
                                                <th className="p-2">{t('financialSettings.workflows.limitAmount')}</th>
                                                <th className="p-2 text-right">{t('financialSettings.workflows.actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {authLimits.filter(l => l.transactionType === selectedWorkflowId).map(limit => (
                                                <tr key={limit.id} className="border-t dark:border-slate-700">
                                                    <td className="p-2 font-semibold text-foreground dark:text-dark-foreground">{limit.roleId}</td>
                                                    <td className="p-2 text-foreground dark:text-dark-foreground">{formatCurrency(limit.limitAmount, language)}</td>
                                                    <td className="p-2 text-right"><button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><EditIcon /></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                               </div>
                               <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm font-medium border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                                    {t('financialSettings.workflows.addLimit')}
                                </button>
                            </SettingsCard>
                         </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-card dark:bg-dark-card rounded-2xl shadow-inner">
                            <div className="text-4xl mb-4">👈</div>
                            <h3 className="text-xl font-bold text-foreground dark:text-dark-foreground">{t('financialSettings.workflows.noWorkflowSelected')}</h3>
                            <p className="max-w-sm text-gray-500 dark:text-gray-400">{t('financialSettings.workflows.noWorkflowSelectedDesc')}</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ApprovalWorkflowsConfiguration;
