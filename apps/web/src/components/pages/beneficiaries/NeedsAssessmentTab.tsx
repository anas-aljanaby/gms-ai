import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Beneficiary, NeedsAssessment } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import { formatDate } from '../../../lib/utils';
import { PlusCircle, FileText, Pencil, Trash2 } from 'lucide-react';
import AssessmentModal, { type AssessmentFormInput } from './AssessmentModal';
import ConfirmationModal from '../../common/ConfirmationModal';
import { generateAiContent, parseAiJson } from '../../../lib/ai';
import {
    createOptimisticId,
    isOptimisticId,
    OPTIMISTIC_HIGHLIGHT_MS,
} from '../../../lib/optimisticSubmit';

const OPTIMISTIC_ASSESSMENT_PREFIX = 'optimistic-assessment-';

// TODO: Replace with real API when programs module is activated
const AVAILABLE_PROGRAMS = [
    { id: 'PROGRAM_FOOD_AID', description: 'Provides monthly food packages.' },
    { id: 'PROGRAM_HOUSING_SUPPORT', description: 'Assists with rent or finding shelter.' },
    { id: 'PROGRAM_HEALTH_CARE', description: 'Covers basic medical check-ups and treatments.' },
    { id: 'PROGRAM_EDU_SUPPORT', description: 'Provides scholarships or school supplies.' },
    { id: 'PROGRAM_TECH_GRANT', description: 'Grants for educational technology like laptops.' },
];

function isOptimisticAssessment(id: string): boolean {
    return isOptimisticId(id, OPTIMISTIC_ASSESSMENT_PREFIX);
}

interface NeedsAssessmentTabProps {
    beneficiary: Beneficiary;
    onUpdate: (beneficiary: Beneficiary) => void;
}

const povertyScoreColor = (score: number) => {
    if (score <= 2) return 'text-green-600 dark:text-green-400';
    if (score <= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
};

const NeedsAssessmentTab: React.FC<NeedsAssessmentTabProps> = ({ beneficiary, onUpdate }) => {
    const { t, language } = useLocalization(['common', 'beneficiaries']);
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState<NeedsAssessment | null>(null);
    const [assessmentToRemove, setAssessmentToRemove] = useState<NeedsAssessment | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const assessmentsRef = useRef(beneficiary.assessments);

    useEffect(() => {
        assessmentsRef.current = beneficiary.assessments;
    }, [beneficiary.assessments]);

    useEffect(() => {
        return () => {
            if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
        };
    }, []);

    const flashHighlight = useCallback((id: string) => {
        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
        setHighlightedId(id);
        highlightTimerRef.current = setTimeout(() => setHighlightedId(null), OPTIMISTIC_HIGHLIGHT_MS);
    }, []);

    const persistAssessments = useCallback(
        (assessments: NeedsAssessment[]) => {
            onUpdate({ ...beneficiary, assessments });
        },
        [beneficiary, onUpdate]
    );

    const fetchSuggestedPrograms = async (formData: AssessmentFormInput): Promise<string[]> => {
        try {
            const systemInstruction =
                "You are an expert social worker AI. Based on a needs assessment for a beneficiary, suggest a list of relevant program IDs from the provided list. Your response must be a JSON object with a single key 'suggestedProgramIds' which is an array of strings.";
            const prompt = `
            Beneficiary Assessment Data: ${JSON.stringify(formData)}
            Available Programs: ${JSON.stringify(AVAILABLE_PROGRAMS)}

            Analyze the data and suggest the most relevant program IDs.
            `;
            const responseText = await generateAiContent({
                contents: prompt,
                systemInstruction,
                responseMimeType: 'application/json',
            });
            const result = parseAiJson<{ suggestedProgramIds?: string[] }>(responseText);
            return result.suggestedProgramIds || [];
        } catch {
            return [];
        }
    };

    const validateForm = (formData: AssessmentFormInput): boolean => {
        const score = Number(formData.povertyScore);
        if (Number.isNaN(score) || score < 1 || score > 5) {
            toast.showError(t('beneficiaries.validation.invalidPovertyScore'));
            return false;
        }
        return true;
    };

    const handleCreateAssessment = (formData: AssessmentFormInput) => {
        if (!validateForm(formData)) return;

        const optimisticId = createOptimisticId(OPTIMISTIC_ASSESSMENT_PREFIX);
        const optimistic: NeedsAssessment = {
            ...formData,
            id: optimisticId,
            date: new Date().toISOString(),
            assessor: 'System User',
            suggestedPrograms: [],
        };

        persistAssessments([optimistic, ...assessmentsRef.current]);
        setIsModalOpen(false);
        setIsSubmitting(true);

        void (async () => {
            const suggestedPrograms = await fetchSuggestedPrograms(formData);
            const created: NeedsAssessment = {
                ...formData,
                id: `asm-${Date.now()}`,
                date: new Date().toISOString(),
                assessor: 'System User',
                suggestedPrograms,
            };

            persistAssessments([
                created,
                ...assessmentsRef.current.filter((a) => a.id !== optimisticId),
            ]);
            flashHighlight(created.id);
            toast.showSuccess(
                suggestedPrograms.length > 0
                    ? t('beneficiaries.assessment.toasts.savedWithSuggestions')
                    : t('beneficiaries.assessment.toasts.saved')
            );
        })().catch(() => {
            persistAssessments(assessmentsRef.current.filter((a) => a.id !== optimisticId));
            toast.showError(t('beneficiaries.assessment.toasts.saveFailed'));
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    const handleUpdateAssessment = (formData: AssessmentFormInput) => {
        if (!editingAssessment || !validateForm(formData)) return;

        const updated: NeedsAssessment = {
            ...editingAssessment,
            ...formData,
            povertyScore: Number(formData.povertyScore),
        };

        persistAssessments(
            assessmentsRef.current.map((a) => (a.id === editingAssessment.id ? updated : a))
        );
        setEditingAssessment(null);
        setIsModalOpen(false);
        flashHighlight(updated.id);
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const handleSubmit = (formData: AssessmentFormInput) => {
        if (editingAssessment) {
            handleUpdateAssessment(formData);
        } else {
            handleCreateAssessment(formData);
        }
    };

    const handleRemove = () => {
        if (!assessmentToRemove) return;
        persistAssessments(assessmentsRef.current.filter((a) => a.id !== assessmentToRemove.id));
        setAssessmentToRemove(null);
        toast.showSuccess(t('beneficiaries.actions.saved'));
    };

    const openAddModal = () => {
        setEditingAssessment(null);
        setIsModalOpen(true);
    };

    const openEditModal = (assessment: NeedsAssessment) => {
        setEditingAssessment(assessment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        setEditingAssessment(null);
    };

    const assessments = beneficiary.assessments;

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-foreground dark:text-dark-foreground">{t('beneficiaries.assessment.title')}</h3>
                    <button
                        onClick={openAddModal}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-dark rounded-lg transition-colors disabled:opacity-60"
                    >
                        <PlusCircle size={18} /> {t('beneficiaries.assessment.newAssessment')}
                    </button>
                </div>

                {assessments.length > 0 ? (
                    <div className="space-y-4">
                        {assessments.map((assessment) => {
                            const optimistic = isOptimisticAssessment(assessment.id);
                            const highlighted = highlightedId === assessment.id;
                            return (
                                <div
                                    key={assessment.id}
                                    className={`bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border dark:border-slate-700 ${
                                        optimistic
                                            ? 'opacity-70 animate-pulse bg-blue-50/60 dark:bg-blue-950/30'
                                            : highlighted
                                              ? 'ring-1 ring-inset ring-emerald-200/80 dark:ring-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40'
                                              : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-foreground dark:text-dark-foreground">
                                                {formatDate(assessment.date, language, 'long')}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {optimistic
                                                    ? t('common.saving')
                                                    : `${t('beneficiaries.assessment.by')}: ${assessment.assessor}`}
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="text-end">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('beneficiaries.assessment.povertyScore')}</p>
                                                <p className={`text-2xl font-bold ${povertyScoreColor(assessment.povertyScore)}`}>
                                                    {assessment.povertyScore}/5
                                                </p>
                                            </div>
                                            {!optimistic && (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => openEditModal(assessment)}
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-white/80 dark:hover:bg-slate-700"
                                                        aria-label={t('beneficiaries.assessment.editAssessment')}
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => setAssessmentToRemove(assessment)}
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        aria-label={t('beneficiaries.assessment.removeAssessment')}
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p><span className="font-medium">{t('beneficiaries.assessment.foodSecurity')}:</span> {t(`beneficiaries.assessment.foodStatus.${assessment.foodSecurity}`)}</p>
                                            <p><span className="font-medium">{t('beneficiaries.assessment.housing')}:</span> {t(`beneficiaries.assessment.housingStatus.${assessment.housingStatus}`)}</p>
                                            {assessment.medicalNeeds && <p><span className="font-medium">{t('beneficiaries.assessment.medical')}:</span> {assessment.medicalNeeds}</p>}
                                            {assessment.educationalNeeds && <p><span className="font-medium">{t('beneficiaries.assessment.educational')}:</span> {assessment.educationalNeeds}</p>}
                                            {assessment.notes && <p><span className="font-medium">{t('beneficiaries.assessment.notes')}:</span> {assessment.notes}</p>}
                                        </div>
                                        {assessment.suggestedPrograms && assessment.suggestedPrograms.length > 0 && (
                                            <div className="bg-primary-light/30 dark:bg-primary/10 p-3 rounded-lg">
                                                <p className="font-medium mb-1">{t('beneficiaries.assessment.suggestedPrograms')}</p>
                                                <ul className="list-disc list-inside space-y-0.5 text-sm">
                                                    {assessment.suggestedPrograms.map((prog) => <li key={prog}>{prog}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 px-6 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                        <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground mt-3">{t('beneficiaries.assessment.noAssessments')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('beneficiaries.assessment.noAssessmentsDesc')}</p>
                        <button
                            onClick={openAddModal}
                            disabled={isSubmitting}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary-dark transition-colors disabled:opacity-60"
                        >
                            <PlusCircle size={16} /> {t('beneficiaries.assessment.newAssessment')}
                        </button>
                    </div>
                )}
            </div>

            <AssessmentModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                beneficiaryType={beneficiary.beneficiaryType}
                initialItem={editingAssessment}
                isSubmitting={isSubmitting}
            />

            <ConfirmationModal
                isOpen={!!assessmentToRemove}
                onClose={() => setAssessmentToRemove(null)}
                onConfirm={handleRemove}
                title={t('beneficiaries.assessment.removeAssessment')}
                message={t('beneficiaries.assessment.removeConfirm')}
            />
        </>
    );
};

export default NeedsAssessmentTab;
