import React, { useEffect, useState } from 'react';
import type { GanttTask } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import ModalPortal from '../../common/ModalPortal';
import { Check, X } from 'lucide-react';

export type AddProjectTaskPayload = Omit<GanttTask, 'id'>;

interface AddProjectTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: AddProjectTaskPayload) => void;
}

type TaskForm = {
    name: string;
    start: string;
    end: string;
    progress: number;
};

type FormErrors = {
    name?: string;
    start?: string;
    end?: string;
};

const emptyForm = (): TaskForm => ({ name: '', start: '', end: '', progress: 0 });

const AddProjectTaskModal: React.FC<AddProjectTaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useLocalization(['common', 'projects']);
    const [form, setForm] = useState<TaskForm>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (!isOpen) return;
        setForm(emptyForm());
        setErrors({});
    }, [isOpen]);

    const clearError = (field: keyof FormErrors) => {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const validate = (): boolean => {
        const next: FormErrors = {};
        if (!form.name.trim()) {
            next.name = t('projects.schedule.errors.nameRequired');
        }
        if (!form.start) {
            next.start = t('projects.schedule.errors.startRequired');
        }
        if (!form.end) {
            next.end = t('projects.schedule.errors.endRequired');
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit({
            name: form.name.trim(),
            start: form.start,
            end: form.end,
            progress: form.progress,
        });
        setForm(emptyForm());
        setErrors({});
        onClose();
    };

    const inputClass = (field: keyof FormErrors) =>
        `w-full rounded-lg border bg-white px-3 py-1.5 text-sm dark:bg-slate-800 dark:text-dark-foreground focus:ring-1 focus:ring-primary ${
            errors[field]
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-slate-600'
        }`;
    const labelClass = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1';

    if (!isOpen) return null;

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose}>
            <div
                className="bg-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-slate-700 p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold">{t('projects.schedule.addTask')}</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label={t('common.close')}>
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-slate-600 dark:bg-slate-800/40 dark:text-gray-300 mb-3">
                        <span className="text-red-500">*</span> {t('projects.schedule.requiredHint')}
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className={labelClass}>
                                {t('projects.schedule.taskName')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={inputClass('name')}
                                value={form.name}
                                onChange={(e) => {
                                    setForm((f) => ({ ...f, name: e.target.value }));
                                    clearError('name');
                                }}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>
                                    {t('projects.schedule.startDate')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    className={inputClass('start')}
                                    value={form.start}
                                    onChange={(e) => {
                                        setForm((f) => ({ ...f, start: e.target.value }));
                                        clearError('start');
                                    }}
                                />
                                {errors.start && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.start}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>
                                    {t('projects.schedule.endDate')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    className={inputClass('end')}
                                    value={form.end}
                                    onChange={(e) => {
                                        setForm((f) => ({ ...f, end: e.target.value }));
                                        clearError('end');
                                    }}
                                />
                                {errors.end && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.end}</p>}
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>{t('projects.list.progress')} ({form.progress}%)</label>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                className="w-full"
                                value={form.progress}
                                onChange={(e) => setForm((f) => ({ ...f, progress: Number(e.target.value) }))}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-5">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg">
                            <Check size={14} /> {t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </ModalPortal>
    );
};

export default AddProjectTaskModal;
