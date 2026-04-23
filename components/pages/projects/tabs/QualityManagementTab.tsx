import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project, QualityStandard, LessonLearned } from '../../../../types';
import AiCard from '../../ai/AiCard';

interface QualityManagementTabProps {
    project: Project;
}

const QualityStandardCard: React.FC<{ standard: QualityStandard }> = ({ standard }) => {
    const { t } = useLocalization();
    return (
        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border dark:border-slate-700">
            <h5 className="font-bold">{standard.name}</h5>
            <p className="text-xs text-gray-500 mb-2">{standard.description}</p>
            <h6 className="text-sm font-semibold mb-1">{t('projects.quality.checklist')}</h6>
            <ul className="space-y-1 text-sm">
                {standard.checklist.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <input type="checkbox" checked={item.checked} readOnly className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                        <span>{item.item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const LessonLearnedCard: React.FC<{ lesson: LessonLearned }> = ({ lesson }) => {
    const { t } = useLocalization();
    const isPositive = lesson.category === 'positive';
    return (
        <div className={`p-4 border-s-4 rounded-e-lg ${isPositive ? 'bg-green-50 border-green-500 dark:bg-green-900/20' : 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20'}`}>
            <p className="text-sm text-gray-700 dark:text-gray-300">{lesson.description}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">{t('projects.quality.recommendation')}: <span className="font-normal italic">{lesson.recommendation}</span></p>
        </div>
    );
};

const QualityManagementTab: React.FC<QualityManagementTabProps> = ({ project }) => {
    const { t } = useLocalization();
    const { standards, lessonsLearned } = project.qualityManagement;

    const deliverableStandards = standards.filter(s => s.type === 'deliverable');
    const processStandards = standards.filter(s => s.type === 'process');
    const positiveLessons = lessonsLearned.filter(l => l.category === 'positive');
    const negativeLessons = lessonsLearned.filter(l => l.category === 'negative');

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
        </div>
    );
};

export default QualityManagementTab;