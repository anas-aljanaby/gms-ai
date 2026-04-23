
import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project } from '../../../../types';
import { formatCurrency, formatDate } from '../../../../lib/utils';
import AiCard from '../../ai/AiCard';
import { MOCK_PROGRAM_DATA } from '../../../../data/programData';
import Tooltip from '../../../common/Tooltip';

interface ProjectOverviewTabProps {
    project: Project;
}

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm font-semibold text-foreground dark:text-dark-foreground">{value}</dd>
    </div>
);

const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({ project }) => {
    const { t, language } = useLocalization();

    const scheduleStatus = project.costManagement.financialSummary.spi >= 1 ? 'On Track' : 'At Risk';
    const budgetStatus = project.costManagement.financialSummary.cpi >= 1 ? 'On Track' : 'Over Budget';
    const activeRisks = project.riskManagement.riskRegister.filter(r => r.status === 'open' || r.status === 'in-progress').length;
    
    const { sdgs } = MOCK_PROGRAM_DATA;
    const alignedSdgs = sdgs.filter(sdg => project.sdgGoals?.includes(sdg.id));

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Project Vitals */}
            <AiCard title={t('projects.reporting.modal.overview.projectInfo')}>
                <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                    <InfoItem label={t('projects.reporting.modal.overview.manager')} value={project.stakeholders.primaryContact} />
                    <InfoItem label={t('projects.reporting.modal.overview.dates')} value={`${formatDate(project.plannedStartDate, language)} - ${formatDate(project.plannedEndDate, language)}`} />
                    <InfoItem label="Location" value={`${project.location.city}, ${project.location.country}`} />
                    <InfoItem label={t('projects.wizard.form.donor')} value={project.stakeholders.donor} />
                     <div className="col-span-2">
                        <InfoItem label="Goal" value={project.goal} />
                    </div>
                </dl>
            </AiCard>

            {/* Key Metrics */}
            <AiCard title={t('projects.monitoring.kpis')}>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-3xl font-bold text-primary dark:text-secondary">{project.progress}%</p>
                        <p className="text-sm font-semibold text-gray-500">{t('projects.monitoring.overallCompletion')}</p>
                    </div>
                    <div>
                        <p className={`text-3xl font-bold ${budgetStatus === 'On Track' ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(project.spent, language)}</p>
                        <p className="text-sm font-semibold text-gray-500">{t('projects.monitoring.budgetStatus')}</p>
                    </div>
                     <div>
                        <p className={`text-3xl font-bold ${scheduleStatus === 'On Track' ? 'text-green-500' : 'text-red-500'}`}>{scheduleStatus}</p>
                        <p className="text-sm font-semibold text-gray-500">{t('projects.monitoring.scheduleStatus')}</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-yellow-500">{activeRisks}</p>
                        <p className="text-sm font-semibold text-gray-500">{t('projects.monitoring.activeRisks')}</p>
                    </div>
                 </div>
            </AiCard>

            {/* Sustainable Development Goals */}
            {alignedSdgs.length > 0 && (
                <AiCard title={t('projects.overview.sdgTitle')}>
                    <div className="flex flex-wrap gap-4">
                        {alignedSdgs.map(sdg => (
                            <Tooltip key={sdg.id} text={`SDG ${sdg.id}: ${sdg.name}`}>
                                <div 
                                    className="w-20 h-20 rounded-lg flex flex-col items-center justify-center text-white font-bold text-center transition-transform hover:scale-110"
                                    style={{ backgroundColor: sdg.color }}
                                >
                                    <img src={`https://via.placeholder.com/40/${sdg.color.substring(1)}/FFFFFF?text=SDG`} alt={`SDG ${sdg.id}`} className="w-8 h-8 mb-1 rounded-sm" />
                                    <span>{sdg.id}</span>
                                </div>
                            </Tooltip>
                        ))}
                    </div>
                </AiCard>
            )}

             {/* Project Team */}
            <AiCard title={t('projects.hr.projectTeam')}>
                <div className="flex -space-x-2 overflow-hidden">
                    {project.humanResources.projectTeam.map(member => (
                        <img key={member.userId} className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-dark-card" src={member.photo} alt={member.name} title={member.name} />
                    ))}
                </div>
            </AiCard>

        </div>
    );
};

export default ProjectOverviewTab;
