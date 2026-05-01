
import React from 'react';
import type { Student } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { XIcon } from '../../../icons/GenericIcons';

interface StudentDetailsModalProps {
    student: Student | null;
    onClose: () => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student, onClose }) => {
    const { t } = useLocalization();

    if (!student) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">
                        {student.personalInfo.name.en}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label="Close modal">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">
                    <p className="text-center py-16 text-gray-500">{t('placeholder.underConstruction')}</p>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-2xl flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">
                        {t('common.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsModal;
