import React, { useState } from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project, QualityStandard, LessonLearned } from '../../../../types';
import AiCard from '../../ai/AiCard';
import { PlusCircle, X, Check } from 'lucide-react';

interface QualityManagementTabProps {
    project: Project;
    onUpdate?: (updated: Project) => void;
}

interface LessonForm {
    category: 'positive' | 'negative';
    description: string;
    recommendation: string;
}

const emptyLessonForm = (): LessonForm => ({ category: 'positive', description: '', recommendation: '' });

const QualityManagementTab: React.FC<QualityManagementTabProps> = ({ project, onUpdate }) => {
    const { t } = useLocalization(['common', 'projects']);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<LessonForm>(emptyLessonForm());

    const { standards, lessonsLearned } = project.qualityManagement;

    const toggleChecklistItem = (standard: QualityStandard, itemIndex: number) => {
        const updatedStandards = standards.map(s => {
            if (s.id !== standard.id) return s;
            return {
                ...s,
                checklist: s.checklist.map((item, i) =>
                    i === itemIndex ? { ...item, checked: !item.checked } : item
                ),
            };
        });
        onUpdate?.({ ...project, qualityManagement: { ...project.qualityManagement, standards: updatedStandards } });
    };

    const handleSaveLesson = () => {
        if (!form.description.trim()) return;
        const newLesson: LessonLearned = {
            id: `lesson-${Date.now()}`,
            category: form.category,
            description: form.description.trim(),
            recommendation: form.recommendation.trim(),
        };
        onUpdate?.({ ...project, qualityManagement: { ...project.qualityManagement, lessonsLearned: [...lessonsLearned, newLesson] } });
        setModalOpen(false);
        setForm(emptyLessonForm());
    };

    const deliverableStandards = standards.filter(s => s.type === 'deliverable');
    const processStandards = standards.filter(s => s.type === 'process');
    const positiveLessons = lessonsLearned.filter(l => l.category === 'positive');
    const negativeLessons = lessonsLearned.filter(l => l.category === 'negative');

    const QualityStandardCard: React.FC<{ standard: QualityStandard }> = ({ standard }) => (
        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border dark:border-slate-700">
            <h5 className="font-bold">{standard.name}</h5>
            <p className="text-xs text-gray-500 mb-2">{standard.description}</p>
            <h6 className="text-sm font-semibold mb-1">{t('projects.quality.checklist')}</h6>
            <ul className="space-y-1 text-sm">
                {standard.checklist.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleChecklistItem(standard, index)}
                            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                        />
                        <span className={item.checked ? 'line-through text-gray-400' : ''}>{item.item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    const LessonLearnedCard: React.FC<{ lesson: LessonLearned }> = ({ lesson }) => {
        const isPositive = lesson.category === 'positive';
        return (
            <div className={`p-4 border-s-4 rounded-e-lg ${isPositive ? 'bg-green-50 border-green-500 dark:bg-green-900/20' : 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20'}`}>
                <p className="text-sm text-gray-700 dark:text-gray-300">{lesson.description}</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">{t('projects.quality.recommendation')}: <span className="font-normal italic">{lesson.recommendation}</span></p>
            </div>
        );
    };

    const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-dark-foreground focus:ring-1 focus:ring-primary";
    const labelClass = "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1";

    return (
        <div className="space-y-6">
            <AiCard title={t('projects.quality.standards')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-lg mb-2">{t('projects.quality.deliverableStandards')}</h4>
                        <div className="space-y-4">
                            {deliverableStandards.map(s => <QualityStandardCard key={s.id} standard={s} />)}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2">{t('projects.quality.processStandards')}</h4>
                        <div className="space-y-4">
                            {processStandards.map(s => <QualityStandardCard key={s.id} standard={s} />)}
                        </div>
                    </div>
                </div>
            </AiCard>

            <AiCard title={t('projects.quality.lessonsLearned')}>
                <div className="flex justify-end mb-4">
                    <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors">
                        <PlusCircle size={15} /> {t('projects.quality.addLesson')}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-green-600">{t('projects.quality.positive')}</h4>
                        <div className="space-y-4">
                            {positiveLessons.map(l => <LessonLearnedCard key={l.id} lesson={l} />)}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-yellow-600">{t('projects.quality.negative')}</h4>
                        <div className="space-y-4">
                            {negativeLessons.map(l => <LessonLearnedCard key={l.id} lesson={l} />)}
                        </div>
                    </div>
                </div>
            </AiCard>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-slate-700 p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold">{t('projects.quality.addLesson')}</h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className={labelClass}>{t('projects.quality.lessonCategory')}</label>
                                <select className={inputClass} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as 'positive' | 'negative' }))}>
                                    <option value="positive">{t('projects.quality.positive')}</option>
                                    <option value="negative">{t('projects.quality.negative')}</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.quality.lessonDescription')}</label>
                                <textarea rows={3} className={inputClass} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                            </div>
                            <div>
                                <label className={labelClass}>{t('projects.quality.recommendation')}</label>
                                <input className={inputClass} value={form.recommendation} onChange={e => setForm(f => ({ ...f, recommendation: e.target.value }))} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-5">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">{t('common.cancel')}</button>
                            <button onClick={handleSaveLesson} disabled={!form.description.trim()} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50">
                                <Check size={14} /> {t('common.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QualityManagementTab;
