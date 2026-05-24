import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project } from '../../../../types';
import AiCard from '../../ai/AiCard';

interface HumanResourcesTabProps {
    project: Project;
}

const HumanResourcesTab: React.FC<HumanResourcesTabProps> = ({ project }) => {
    const { t } = useLocalization(['projects']);

    return (
        <AiCard title={t('projects.hr.projectTeam')}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {project.humanResources.projectTeam.map(member => (
                    <div key={member.userId} className="bg-card dark:bg-dark-card/50 p-4 rounded-xl shadow-soft text-center">
                        <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-primary-light" loading="lazy" />
                        <h5 className="font-bold text-foreground dark:text-dark-foreground">{member.name}</h5>
                        <p className="text-sm text-gray-500">{member.projectRole}</p>
                        <p className="text-xs font-semibold text-primary mt-1">{t('projects.hr.effort')}: {member.effort}%</p>
                    </div>
                ))}
                {project.humanResources.projectTeam.length === 0 && (
                    <p className="col-span-full text-sm text-gray-400 text-center py-6">{t('common.noData', 'No team members assigned.')}</p>
                )}
            </div>
        </AiCard>
    );
};

export default HumanResourcesTab;
