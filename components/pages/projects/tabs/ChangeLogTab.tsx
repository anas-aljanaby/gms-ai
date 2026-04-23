import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project, ChangeRequestStatus } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { formatDate } from '../../../../lib/utils';
import { PlusCircleIcon } from '../../../icons/GenericIcons';

interface ChangeLogTabProps {
    project: Project;
}

const ChangeLogTab: React.FC<ChangeLogTabProps> = ({ project }) => {
    const { t, language } = useLocalization();

    const StatusBadge: React.FC<{ status: ChangeRequestStatus }> = ({ status }) => {
        const styles: Record<ChangeRequestStatus, string> = {
            'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'approved': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
            'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
            'implemented': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{t(`projects.changeLog.statuses.${status}`)}</span>;
    };

    return (
        <AiCard title={t('projects.changeLog.title')}>
            <div className="flex justify-end mb-4">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors">
                    <PlusCircleIcon /> {t('projects.changeLog.requestChange')}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-start">
                    <thead className="text-start text-gray-500 dark:text-gray-400">
                        <tr>
                            <th className="p-2">{t('projects.changeLog.id')}</th>
                            <th className="p-2">{t('projects.changeLog.description')}</th>
                            <th className="p-2">{t('projects.changeLog.requester')}</th>
                            <th className="p-2">{t('projects.changeLog.date')}</th>
                            <th className="p-2">{t('projects.changeLog.impact')}</th>
                            <th className="p-2">{t('projects.changeLog.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {project.changeLog.map(req => (
                            <tr key={req.id} className="border-t dark:border-slate-700">
                                <td className="p-2 font-mono text-xs">{req.id}</td>
                                <td className="p-2 max-w-sm">{req.description}</td>
                                <td className="p-2">{req.requester}</td>
                                <td className="p-2">{formatDate(req.date, language)}</td>
                                <td className="p-2 text-xs">
                                    {req.impact.scope && <div><strong>Scope:</strong> {req.impact.scope}</div>}
                                    {req.impact.time && <div><strong>Time:</strong> {req.impact.time}</div>}
                                    {req.impact.cost && <div><strong>Cost:</strong> {req.impact.cost}</div>}
                                </td>
                                <td className="p-2"><StatusBadge status={req.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AiCard>
    );
};

export default ChangeLogTab;