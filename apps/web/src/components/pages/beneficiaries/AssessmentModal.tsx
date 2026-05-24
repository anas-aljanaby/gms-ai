import React, { useEffect, useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { BeneficiaryType, NeedsAssessment } from '../../../types';
import ModalPortal from '../../common/ModalPortal';
import { XIcon } from '../../icons/GenericIcons';

export type AssessmentFormInput = Pick<
    NeedsAssessment,
    'povertyScore' | 'foodSecurity' | 'housingStatus' | 'medicalNeeds' | 'educationalNeeds' | 'notes'
>;

interface AssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AssessmentFormInput) => void;
    beneficiaryType: BeneficiaryType;
    initialItem?: NeedsAssessment | null;
    isSubmitting?: boolean;
}

const defaultFormData = (): AssessmentFormInput => ({
    povertyScore: 3,
    foodSecurity: 'secure',
    housingStatus: 'stable',
    medicalNeeds: '',
    educationalNeeds: '',
    notes: '',
});

const formFromItem = (item: NeedsAssessment): AssessmentFormInput => ({
    povertyScore: item.povertyScore,
    foodSecurity: item.foodSecurity,
    housingStatus: item.housingStatus,
    medicalNeeds: item.medicalNeeds || '',
    educationalNeeds: item.educationalNeeds || '',
    notes: item.notes || '',
});

const AssessmentModal: React.FC<AssessmentModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    beneficiaryType,
    initialItem = null,
    isSubmitting = false,
}) => {
    const { t } = useLocalization(['common', 'beneficiaries']);
    const isEdit = !!initialItem;
    const [formData, setFormData] = useState<AssessmentFormInput>(defaultFormData);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialItem ? formFromItem(initialItem) : defaultFormData());
        }
    }, [isOpen, initialItem]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        onSubmit({
            ...formData,
            povertyScore: Number(formData.povertyScore),
        });
        if (!isEdit) {
            setFormData(defaultFormData());
        }
    };

    if (!isOpen) return null;

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose}>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">
                        {isEdit ? t('beneficiaries.assessment.editAssessment') : t('beneficiaries.assessment.newAssessment')}
                    </h2>
                    <button onClick={onClose} disabled={isSubmitting} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50" aria-label={t('common.close')}>
                        <XIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-dark-foreground">
                                {t('beneficiaries.assessment.povertyScore')} ({formData.povertyScore})
                            </label>
                            <input
                                type="range"
                                name="povertyScore"
                                min="1"
                                max="5"
                                value={formData.povertyScore}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                className="w-full mt-1"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-dark-foreground">{t('beneficiaries.assessment.foodSecurity')}</label>
                                <select
                                    name="foodSecurity"
                                    value={formData.foodSecurity}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-900 dark:border-slate-700"
                                >
                                    <option value="secure">{t('beneficiaries.assessment.foodStatus.secure')}</option>
                                    <option value="at_risk">{t('beneficiaries.assessment.foodStatus.at_risk')}</option>
                                    <option value="insecure">{t('beneficiaries.assessment.foodStatus.insecure')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground dark:text-dark-foreground">{t('beneficiaries.assessment.housing')}</label>
                                <select
                                    name="housingStatus"
                                    value={formData.housingStatus}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-900 dark:border-slate-700"
                                >
                                    <option value="stable">{t('beneficiaries.assessment.housingStatus.stable')}</option>
                                    <option value="unstable">{t('beneficiaries.assessment.housingStatus.unstable')}</option>
                                </select>
                            </div>
                        </div>
                        {beneficiaryType !== 'family' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-foreground dark:text-dark-foreground">{t('beneficiaries.assessment.educational')}</label>
                                    <textarea
                                        name="educationalNeeds"
                                        value={formData.educationalNeeds}
                                        onChange={handleInputChange}
                                        rows={2}
                                        disabled={isSubmitting}
                                        className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-900 dark:border-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground dark:text-dark-foreground">{t('beneficiaries.assessment.medical')}</label>
                                    <textarea
                                        name="medicalNeeds"
                                        value={formData.medicalNeeds}
                                        onChange={handleInputChange}
                                        rows={2}
                                        disabled={isSubmitting}
                                        className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-900 dark:border-slate-700"
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-dark-foreground">{t('beneficiaries.assessment.notes')}</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                disabled={isSubmitting}
                                className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-slate-900 dark:border-slate-700"
                            />
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3 border-t dark:border-slate-700">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold disabled:opacity-50">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold disabled:opacity-60">
                            {isSubmitting
                                ? t('beneficiaries.assessment.actions.analyzing')
                                : isEdit
                                  ? t('common.save')
                                  : t('beneficiaries.assessment.actions.saveWithSuggestions')}
                        </button>
                    </div>
                </form>
            </div>
        </ModalPortal>
    );
};

export default AssessmentModal;
