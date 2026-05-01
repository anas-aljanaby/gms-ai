import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project, ProjectTeamMember, RACI } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { formatDate } from '../../../../lib/utils';

interface HumanResourcesTabProps {
    project: Project;
}

const TeamMemberCard: React.FC<{ member: ProjectTeamMember }> = ({ member }) => {
    const { t } = useLocalization();
    return (
        <div className="bg-card dark:bg-dark-card/50 p-4 rounded-xl shadow-soft text-center">
            <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-primary-light" loading="lazy" />
            <h5 className="font-bold text-foreground dark:text-dark-foreground">{member.name}</h5>
            <p className="text-sm text-gray-500">{member.projectRole}</p>
            <p className="text-xs font-semibold text-primary mt-1">{t('projects.hr.effort')}: {member.effort}%</p>
        </div>
    );
}

const RACICell: React.FC<{ value?: RACI }> = ({ value }) => {
    if (!value) return <td className="p-2 text-center text-gray-400">-</td>;
    
    const styles: Record<RACI, { bg: string, text: string, titleKey: string }> = {
        'R': { bg: 'bg-blue-500', text: 'text-white', titleKey: 'projects.hr.responsible' },
        'A': { bg: 'bg-green-500', text: 'text-white', titleKey: 'projects.hr.accountable' },
        'C': { bg: 'bg-yellow-100', text: 'text-yellow-800', titleKey: 'projects.hr.consulted' },
        'I': { bg: 'bg-gray-200', text: 'text-gray-800', titleKey: 'projects.hr.informed' },
    };
    const { bg, text, titleKey } = styles[value];
    const { t } = useLocalization();

    return (
        <td className="p-1 text-center">
            <span title={t(titleKey)} className={`inline-block w-6 h-6 leading-6 rounded-full text-xs font-bold ${bg} ${text}`}>
                {value}
            </span>
        </td>
    );
};

const HumanResourcesTab: React.FC<HumanResourcesTabProps> = ({ project }) => {
    const { t, language } = useLocalization();
    const wbsTasks = [
        project.wbs.children?.[0].children?.[0],
        project.wbs.children?.[0].children?.[1],
        project.wbs.children?.[1],
    ].filter(Boolean);

    return (
        <div className="space-y-6">
            <AiCard title={t('projects.hr.projectTeam')}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {project.humanResources.projectTeam.map(member => (
                        <TeamMemberCard key={member.userId} member={member} />
                    ))}
                </div>
            </AiCard>

             <AiCard title={t('projects.hr.raciMatrix')}>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-start text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="p-2">{t('projects.hr.task')}</th>
                                {project.humanResources.projectTeam.map(member => (
                                    <th key={member.userId} className="p-2 text-center">{member.name.split(' ')[0]}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {wbsTasks.map(task => (
                                <tr key={task!.id} className="border-t dark:border-slate-700">
                                    <td className="p-2 font-semibold">{task!.name}</td>
                                    {project.humanResources.projectTeam.map(member => (
                                        <RACICell key={member.userId} value={project.humanResources.raciMatrix[task!.id]?.[member.userId]} />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AiCard>

             <AiCard title={t('projects.hr.timesheet')}>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-start text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="p-2">{t('projects.hr.member')}</th>
                                <th className="p-2">{t('projects.hr.task')}</th>
                                <th className="p-2">{t('common.date')}</th>
                                <th className="p-2 text-end">{t('projects.hr.hours')}</th>
                            </tr>
                        </thead>
                        <tbody>
                           {project.humanResources.timesheet.map(entry => {
                               const member = project.humanResources.projectTeam.find(m => m.userId === entry.userId);
                               const task = wbsTasks.find(t => t!.id === entry.wbsId);
                               return (
                                <tr key={entry.id} className="border-t dark:border-slate-700">
                                    <td className="p-2 font-semibold">{member?.name}</td>
                                    <td className="p-2">{task?.name}</td>
                                    <td className="p-2">{formatDate(entry.date, language)}</td>
                                    <td className="p-2 text-end font-bold">{entry.hours}</td>
                                </tr>
                               )
                           })}
                        </tbody>
                    </table>
                </div>
            </AiCard>
        </div>
    );
};

export default HumanResourcesTab;