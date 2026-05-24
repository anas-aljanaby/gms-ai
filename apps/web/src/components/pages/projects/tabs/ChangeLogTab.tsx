import React, { useState } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project, ChangeRequest, ChangeRequestStatus } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { formatDate } from '../../../../lib/utils';
import { PlusCircleIcon } from '../../../icons/GenericIcons';
import { X, Check } from 'lucide-react';

interface ChangeLogTabProps {
    project: Project;
    onUpdate?: (updated: Project) => void;
}

interface ChangeForm {
    description: string;
    requester: string;
    scopeImpact: string;
    timeImpact: string;
    costImpact: string;
}

const emptyForm = (): ChangeForm => ({ description: '', requester: '', scopeImpact: '', timeImpact: '', costImpact: '' });

const ChangeLogTab: React.FC<ChangeLogTabProps> = ({ project, onUpdate }) => {
    const { t, language } = useLocalization(['projects']);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<ChangeForm>(emptyForm());

    const handleSave = () => {
        if (!form.description.trim()) return;
        const newRequest: ChangeRequest = {
            id: `CR-${String(project.changeLog.length + 1).padStart(3, '0')}`,
            description: form.description.trim(),
            requester: form.requester.trim(),
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            impact: {
                ...(form.scopeImpact.trim() && { scope: form.scopeImpact.trim() }),
                ...(form.timeImpact.trim() && { time: form.timeImpact.trim() }),
                ...(form.costImpact.trim() && { cost: form.costImpact.trim() }),
            },
        };
        onUpdate?.({ ...project, changeLog: [...project.changeLog, newRequest] });
        setModalOpen(false);
        setForm(emptyForm());
    };

    const StatusBadge: React.FC<{ status: ChangeRequestStatus }> = ({ status }) => {
        const styles: Record<ChangeRequestStatus, string> = {
            'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'approved': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
            'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
            'implemented': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{t(`projects.changeLog.statuses.${status}`)}</span>;
    };

    const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-dark-foreground focus:ring-1 focus:ring-primary";
    const labelClass = "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1";

    return (
        <>
            <AiCard title={t('projects.changeLog.title')}>
                <div className="flex justify-end mb-4">
                    <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors">
                        <PlusCircleIcon /> {t('projects.changeLog.requestChange')}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start">
                        <thead className="text-start text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="p-2 text-start">{t('projects.changeLog.id')}</th>
                                <th className="p-2 text-start">{t('projects.changeLog.description')}</th>
                                <th className="p-2 text-start">{t('projects.changeLog.requester')}</th>
                                <th className="p-2 text-start">{t('projects.changeLog.date')}</th>
                                <th className="p-2 text-start">{t('projects.changeLog.impact')}</th>
                                <th className="p-2 text-start">{t('projects.changeLog.status')}</th>
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
                                        {req.impact.scope && <div><strong>{t('projects.changeLog.scopeImpact')}:</strong> {req.impact.scope}</div>}
                                        {req.impact.time && <div><strong>{t('projects.changeLog.timeImpact')}:</strong> {req.impact.time}</div>}
                                        {req.impact.cost && <div><strong>{t('projects.changeLog.costImpact')}:</strong> {req.impact.cost}</div>}
                                    </td>
                                    <td className="p-2"><StatusBadge status={req.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AiCard>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-slate-700 p-6 w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold">{t('projects.changeLog.requestChange')}</h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className={labelClass}>{t('projects.changeLog.description')}</label>
                                <textarea rows={3} className={inputClass} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.changeLog.requester')}</label>
                                <input className={inputClass} value={form.requester} onChange={e => setForm(f => ({ ...f, requester: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className={labelClass}>{t('projects.changeLog.scopeImpact')}</label>
                                    <input className={inputClass} value={form.scopeImpact} onChange={e => setForm(f => ({ ...f, scopeImpact: e.target.value }))} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('projects.changeLog.timeImpact')}</label>
                                    <input className={inputClass} value={form.timeImpact} onChange={e => setForm(f => ({ ...f, timeImpact: e.target.value }))} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('projects.changeLog.costImpact')}</label>
                                    <input className={inputClass} value={form.costImpact} onChange={e => setForm(f => ({ ...f, costImpact: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-5">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">{t('common.cancel')}</button>
                            <button onClick={handleSave} disabled={!form.description.trim()} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50">
                                <Check size={14} /> {t('common.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChangeLogTab;
