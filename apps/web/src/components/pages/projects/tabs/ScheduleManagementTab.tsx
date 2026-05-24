import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { sortProjectTasksByStart } from '../../../../lib/projectTaskOptimistic';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project, GanttTask } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { CheckCircle2, Clock, Circle, PlusCircle, Pencil, Trash2, X, Check } from 'lucide-react';
import { isOptimisticProjectTask, useProjectTasks } from '../../../../hooks/useProjects';
import { useToast } from '../../../../hooks/useToast';
import { OPTIMISTIC_HIGHLIGHT_MS } from '../../../../lib/optimisticSubmit';
import AddProjectTaskModal, { type AddProjectTaskPayload } from '../AddProjectTaskModal';

interface ScheduleManagementTabProps {
    project: Project;
    onUpdate?: (updated: Project) => void;
}

interface TaskForm {
    name: string;
    start: string;
    end: string;
    progress: number;
}

const emptyTaskForm = (): TaskForm => ({ name: '', start: '', end: '', progress: 0 });

const progressColor = (progress: number) => {
    if (progress === 100) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-amber-500';
    return 'bg-gray-200 dark:bg-slate-700';
};

const statusIcon = (progress: number) => {
    if (progress === 100) return <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />;
    if (progress > 0) return <Clock size={14} className="text-amber-500 shrink-0" />;
    return <Circle size={14} className="text-gray-300 dark:text-slate-600 shrink-0" />;
};

const ScheduleManagementTab: React.FC<ScheduleManagementTabProps> = ({ project, onUpdate }) => {
    const { t } = useLocalization(['projects', 'common']);
    const toast = useToast();
    const { data: tasksRaw = project.schedule, createTask, updateTask, deleteTask } = useProjectTasks(project.id);
    const tasks = useMemo(() => sortProjectTasksByStart(tasksRaw), [tasksRaw]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<GanttTask | null>(null);
    const [form, setForm] = useState<TaskForm>(emptyTaskForm());
    const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
    const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isDatesEditing, setIsDatesEditing] = useState(false);
    const [datesForm, setDatesForm] = useState({
        plannedStartDate: project.plannedStartDate?.split('T')[0] || '',
        plannedEndDate: project.plannedEndDate?.split('T')[0] || '',
    });

    useEffect(() => {
        if (!isDatesEditing) {
            setDatesForm({
                plannedStartDate: project.plannedStartDate?.split('T')[0] || '',
                plannedEndDate: project.plannedEndDate?.split('T')[0] || '',
            });
        }
    }, [project.plannedStartDate, project.plannedEndDate, isDatesEditing]);

    useEffect(() => {
        return () => {
            if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
        };
    }, []);

    const flashHighlight = useCallback((id: string) => {
        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
        setHighlightedTaskId(id);
        highlightTimerRef.current = setTimeout(() => setHighlightedTaskId(null), OPTIMISTIC_HIGHLIGHT_MS);
    }, []);

    const openEditModal = (task: GanttTask) => {
        setEditingTask(task);
        setForm({ name: task.name, start: task.start, end: task.end, progress: task.progress });
        setEditModalOpen(true);
    };

    const closeEditModal = () => setEditModalOpen(false);

    const handleAddTask = (payload: AddProjectTaskPayload) => {
        createTask(payload, {
            onSuccess: (created) => {
                flashHighlight(created.id);
                toast.showSuccess(t('projects.schedule.createSuccess'));
            },
            onError: () => {
                toast.showError(t('projects.schedule.createFailed'));
            },
        });
    };

    const handleSaveEdit = async () => {
        if (!editingTask || !form.name.trim()) return;
        try {
            await updateTask({ ...editingTask, ...form, name: form.name.trim() });
            closeEditModal();
        } catch {
            toast.showError(t('common.error', 'Something went wrong. Please try again.'));
        }
    };

    const handleDelete = (id: string) => {
        if (isOptimisticProjectTask(id)) return;
        void deleteTask(id).catch(() => {
            toast.showError(t('common.error', 'Something went wrong. Please try again.'));
        });
    };

    const handleDatesSave = () => {
        if (!datesForm.plannedStartDate || !datesForm.plannedEndDate) {
            toast.showError(t('projects.validation.datesRequired', 'Start and end dates are required'));
            return;
        }
        onUpdate?.({
            ...project,
            plannedStartDate: datesForm.plannedStartDate,
            plannedEndDate: datesForm.plannedEndDate,
        });
        setIsDatesEditing(false);
        toast.showSuccess(t('projects.updateSuccess', 'Project updated successfully'));
    };

    const handleDatesCancel = () => {
        setDatesForm({
            plannedStartDate: project.plannedStartDate?.split('T')[0] || '',
            plannedEndDate: project.plannedEndDate?.split('T')[0] || '',
        });
        setIsDatesEditing(false);
    };

    const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-dark-foreground focus:ring-1 focus:ring-primary";
    const labelClass = "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1";

    return (
        <div className="space-y-6">
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{t('projects.reporting.modal.overview.dates')}</h3>
                    {onUpdate && (
                        !isDatesEditing ? (
                            <button onClick={() => setIsDatesEditing(true)} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                                <Pencil size={13} /> {t('common.edit')}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={handleDatesCancel} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-red-600 rounded-lg">
                                    <X size={13} /> {t('common.cancel')}
                                </button>
                                <button onClick={handleDatesSave} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-lg">
                                    <Check size={13} /> {t('common.save')}
                                </button>
                            </div>
                        )
                    )}
                </div>
                {!isDatesEditing ? (
                    <p className="text-sm font-semibold text-foreground dark:text-dark-foreground">
                        {new Date(project.plannedStartDate).toLocaleDateString()} – {new Date(project.plannedEndDate).toLocaleDateString()}
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div>
                            <label className={labelClass}>{t('projects.wizard.form.startDate')}</label>
                            <input type="date" className={inputClass} value={datesForm.plannedStartDate} onChange={e => setDatesForm(f => ({ ...f, plannedStartDate: e.target.value }))} />
                        </div>
                        <div>
                            <label className={labelClass}>{t('projects.wizard.form.endDate')}</label>
                            <input type="date" className={inputClass} value={datesForm.plannedEndDate} onChange={e => setDatesForm(f => ({ ...f, plannedEndDate: e.target.value }))} />
                        </div>
                    </div>
                )}
            </div>

            <AiCard title={t('projects.schedule.gantt')}>
                <div className="flex justify-end mb-3">
                    <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors">
                        <PlusCircle size={15} /> {t('projects.schedule.addTask')}
                    </button>
                </div>
                <div className="space-y-1">
                    <div className="grid grid-cols-[1fr_2fr_100px_56px] gap-4 px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700/50">
                        <span>{t('projects.schedule.task')}</span>
                        <span>{t('projects.schedule.timeline')}</span>
                        <span className="text-end">{t('projects.list.progress')}</span>
                        <span></span>
                    </div>
                    {tasks.map(task => {
                        const optimistic = isOptimisticProjectTask(task.id);
                        const highlighted = highlightedTaskId === task.id;
                        return (
                            <div
                                key={task.id}
                                className={`grid grid-cols-[1fr_2fr_100px_56px] gap-4 items-center p-3 rounded-lg transition-colors group ${
                                    optimistic
                                        ? 'opacity-70 animate-pulse bg-blue-50/60 dark:bg-blue-950/30'
                                        : 'hover:bg-gray-50 dark:hover:bg-slate-800/40'
                                } ${highlighted ? 'ring-2 ring-emerald-300 dark:ring-emerald-700' : ''}`}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    {statusIcon(task.progress)}
                                    <div className="min-w-0">
                                        <span className="text-sm font-medium text-foreground dark:text-dark-foreground truncate block">{task.name}</span>
                                        {optimistic && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{t('projects.schedule.saving')}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all ${progressColor(task.progress)}`} style={{ width: `${Math.max(task.progress, 2)}%` }} />
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">{task.start} → {task.end}</span>
                                </div>
                                <span className="text-sm font-semibold text-end text-foreground dark:text-dark-foreground">{task.progress}%</span>
                                <div className={`flex items-center gap-1 transition-opacity ${optimistic ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <button onClick={() => openEditModal(task)} className="p-1 text-gray-400 hover:text-primary rounded">
                                        <Pencil size={13} />
                                    </button>
                                    <button onClick={() => handleDelete(task.id)} className="p-1 text-gray-400 hover:text-red-500 rounded">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </AiCard>

            <AddProjectTaskModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSubmit={handleAddTask}
            />

            {editModalOpen && editingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-slate-700 p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold">{t('projects.schedule.taskName')}</h3>
                            <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className={labelClass}>{t('projects.schedule.taskName')}</label>
                                <input className={inputClass} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>{t('projects.schedule.startDate')}</label>
                                    <input type="date" className={inputClass} value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('projects.schedule.endDate')}</label>
                                    <input type="date" className={inputClass} value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.list.progress')} ({form.progress}%)</label>
                                <input type="range" min={0} max={100} className="w-full" value={form.progress} onChange={e => setForm(f => ({ ...f, progress: Number(e.target.value) }))} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-5">
                            <button onClick={closeEditModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">{t('common.cancel')}</button>
                            <button onClick={handleSaveEdit} disabled={!form.name.trim()} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50">
                                <Check size={14} /> {t('common.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleManagementTab;
