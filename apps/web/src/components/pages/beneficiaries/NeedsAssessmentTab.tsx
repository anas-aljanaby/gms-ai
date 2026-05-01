import React, { useState } from 'react';
import type { Beneficiary, NeedsAssessment } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatDate, formatNumber } from '../../../lib/utils';
import { PlusCircle, FileText, Bot } from 'lucide-react';
import AssessmentModal from './AssessmentModal';

interface NeedsAssessmentTabProps {
    beneficiary: Beneficiary;
    onUpdate: (beneficiary: Beneficiary) => void;
}

const NeedsAssessmentTab: React.FC<NeedsAssessmentTabProps> = ({ beneficiary, onUpdate }) => {
    const { t } = useLocalization();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveAssessment = (newAssessment: NeedsAssessment) => {
        const updatedBeneficiary = {
            ...beneficiary,
            assessments: [newAssessment, ...(beneficiary.assessments || [])],
        };
        onUpdate(updatedBeneficiary);
        setIsModalOpen(false);
    };

    const assessments = beneficiary.assessments || [];

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">سجل تقييم الاحتياجات</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-dark rounded-lg transition-colors"
                    >
                        <PlusCircle size={18} /> إجراء تقييم جديد
                    </button>
                </div>

                {assessments.length > 0 ? (
                    <div className="space-y-4">
                        {assessments.map(assessment => (
                            <div key={assessment.id} className="bg-card dark:bg-dark-card/50 p-4 rounded-xl shadow-soft border dark:border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-primary dark:text-secondary">تقييم {formatDate(assessment.date, 'ar')}</h3>
                                        <p className="text-xs text-gray-500">بواسطة: {assessment.assessor}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">درجة الفقر</p>
                                        <p className="text-2xl font-bold text-red-500">{assessment.povertyScore}/5</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <h4 className="font-semibold mb-2">ملخص الاحتياجات</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {assessment.medicalNeeds && <li><strong>طبي:</strong> {assessment.medicalNeeds}</li>}
                                            {assessment.educationalNeeds && <li><strong>تعليمي:</strong> {assessment.educationalNeeds}</li>}
                                            <li><strong>أمن غذائي:</strong> {assessment.foodSecurity}</li>
                                            <li><strong>حالة السكن:</strong> {assessment.housingStatus}</li>
                                        </ul>
                                    </div>
                                    <div className="bg-primary-light/30 dark:bg-primary/10 p-3 rounded-lg">
                                        <h4 className="font-semibold mb-2 flex items-center gap-2"><Bot size={16}/> برامج مقترحة (AI)</h4>
                                        <ul className="list-disc list-inside space-y-1 text-primary-dark dark:text-secondary-light font-medium">
                                            {assessment.suggestedPrograms?.map(prog => <li key={prog}>{prog}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-card dark:bg-dark-card rounded-2xl shadow-inner">
                        <FileText className="w-16 h-16 mx-auto text-gray-400" />
                        <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mt-4">لا توجد تقييمات</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">ابدأ بإجراء تقييم جديد لتحديد احتياجات المستفيد.</p>
                    </div>
                )}
            </div>
            <AssessmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAssessment}
                beneficiaryType={beneficiary.beneficiaryType}
            />
        </>
    );
};

export default NeedsAssessmentTab;