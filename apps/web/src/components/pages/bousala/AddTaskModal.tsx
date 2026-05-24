import React, { useState, useEffect } from 'react';
import ModalPortal from '../../common/ModalPortal';
import Spinner from '../../common/Spinner';
import { useLocalization } from '../../../hooks/useLocalization';
import { X as XIcon } from 'lucide-react';
import type { BousalaGoal } from '../../../types';

export type AddTaskFormData = {
    title: string;
    goalId: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
};

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (taskData: AddTaskFormData) => void | Promise<void>;
    goals: BousalaGoal[];
    initialData?: { title?: string; goalId?: string; priority?: string } | null;
}

type FormErrors = {
    title?: string;
    goalId?: string;
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd, goals, initialData }) => {
    const { t, dir } = useLocalization(['common', 'bousala']);
    const [title, setTitle] = useState('');
    const [goalId, setGoalId] = useState('');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setErrors({});
        setIsSubmitting(false);
        if (initialData) {
            setTitle(initialData.title || '');
            setGoalId(initialData.goalId || goals[0]?.id || '');
            const p = initialData.priority;
            setPriority(p === 'high' || p === 'low' ? p : 'medium');
        } else {
            setTitle('');
            setGoalId(goals[0]?.id || '');
            setDueDate(new Date().toISOString().split('T')[0]);
            setPriority('medium');
        }
    }, [isOpen, initialData, goals]);

    const validate = (): boolean => {
        const next: FormErrors = {};
        if (!title.trim()) {
            next.title = t('bousala.addTaskModal.titleAndGoalRequired');
        }
        if (!goalId) {
            next.goalId = goals.length === 0
                ? t('bousala.addTaskModal.noGoalsAvailable')
                : t('bousala.addTaskModal.titleAndGoalRequired');
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await Promise.resolve(onAdd({ title: title.trim(), goalId, dueDate, priority }));
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const noGoals = goals.length === 0;

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose} dir={dir}>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold">{t('bousala.addTaskModal.title')}</h2>
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {noGoals && (
                            <p className="text-sm text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3">
                                {t('bousala.addTaskModal.noGoalsAvailable')}
                            </p>
                        )}
                        <div>
                            <label className="block text-sm font-medium">{t('bousala.addTaskModal.taskTitle')}</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: undefined })); }}
                                disabled={isSubmitting || noGoals}
                                className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 disabled:opacity-50"
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">{t('bousala.addTaskModal.relatedGoal')}</label>
                            <select
                                value={goalId}
                                onChange={e => { setGoalId(e.target.value); if (errors.goalId) setErrors(prev => ({ ...prev, goalId: undefined })); }}
                                disabled={isSubmitting || noGoals}
                                className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 disabled:opacity-50"
                            >
                                {goals.map(g => <option key={g.id} value={g.id} dir="auto">{g.title}</option>)}
                            </select>
                            {errors.goalId && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.goalId}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">{t('bousala.addTaskModal.dueDate')}</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                    disabled={isSubmitting || noGoals}
                                    className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">{t('bousala.addTaskModal.priority')}</label>
                                <select
                                    value={priority}
                                    onChange={e => setPriority(e.target.value as AddTaskFormData['priority'])}
                                    disabled={isSubmitting || noGoals}
                                    className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 disabled:opacity-50"
                                >
                                    <option value="high">{t('bousala.addTaskModal.priorities.high')}</option>
                                    <option value="medium">{t('bousala.addTaskModal.priorities.medium')}</option>
                                    <option value="low">{t('bousala.addTaskModal.priorities.low')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold disabled:opacity-50">{t('common.cancel')}</button>
                        <button type="submit" disabled={isSubmitting || noGoals} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:bg-gray-400 inline-flex items-center gap-2">
                            {isSubmitting && <Spinner size="w-4 h-4" />}
                            {isSubmitting ? t('bousala.addTaskModal.saving') : t('bousala.addTaskModal.save')}
                        </button>
                    </div>
                </form>
            </div>
        </ModalPortal>
    );
};

export default AddTaskModal;
