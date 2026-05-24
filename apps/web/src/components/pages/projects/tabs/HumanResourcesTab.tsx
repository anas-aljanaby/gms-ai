import React, { useEffect, useState } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useToast } from '../../../../hooks/useToast';
import type { Project } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { Pencil, Check, X } from 'lucide-react';

interface HumanResourcesTabProps {
    project: Project;
    onUpdate?: (updated: Project) => void;
}

const HumanResourcesTab: React.FC<HumanResourcesTabProps> = ({ project, onUpdate }) => {
    const { t } = useLocalization(['common', 'projects']);
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [primaryContact, setPrimaryContact] = useState(project.stakeholders?.primaryContact || '');

    useEffect(() => {
        if (!isEditing) setPrimaryContact(project.stakeholders?.primaryContact || '');
    }, [project.stakeholders?.primaryContact, isEditing]);

    const handleSave = () => {
        onUpdate?.({
            ...project,
            stakeholders: { ...project.stakeholders, primaryContact: primaryContact.trim() },
        });
        setIsEditing(false);
        toast.showSuccess(t('projects.updateSuccess', 'Project updated successfully'));
    };

    const handleCancel = () => {
        setPrimaryContact(project.stakeholders?.primaryContact || '');
        setIsEditing(false);
    };

    const inputClass = 'w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-dark-foreground focus:ring-1 focus:ring-primary';

    return (
        <div className="space-y-6">
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{t('projects.reporting.modal.overview.manager')}</h3>
                    {onUpdate && (
                        !isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                                <Pencil size={13} /> {t('common.edit')}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={handleCancel} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-red-600 rounded-lg">
                                    <X size={13} /> {t('common.cancel')}
                                </button>
                                <button onClick={handleSave} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-lg">
                                    <Check size={13} /> {t('common.save')}
                                </button>
                            </div>
                        )
                    )}
                </div>
                {!isEditing ? (
                    <p className="text-sm font-semibold text-foreground dark:text-dark-foreground">
                        {project.stakeholders?.primaryContact || '—'}
                    </p>
                ) : (
                    <input
                        className={inputClass}
                        value={primaryContact}
                        onChange={e => setPrimaryContact(e.target.value)}
                        placeholder={t('projects.wizard.form.manager', 'Project Manager')}
                    />
                )}
            </div>

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
        </div>
    );
};

export default HumanResourcesTab;
