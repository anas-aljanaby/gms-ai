
import React, { useEffect, useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { Donor, AiSuggestion } from '../../../types';
import { XIcon, SparklesIcon } from '../../icons/GenericIcons';
import Spinner from '../../common/Spinner';
import { useToast } from '../../../hooks/useToast';

interface AiActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    donor: Donor | null;
    suggestion: AiSuggestion | null;
}

interface GeneratedContent {
    subject: string;
    body: string;
}

const buildDraftContent = (donor: Donor, suggestion: AiSuggestion, language: string): GeneratedContent => {
    if (language === 'ar') {
        return {
            subject: `متابعة بخصوص دعم ${donor.name}`,
            body: `عزيزي/عزيزتي ${donor.name},

أتمنى أن تكونوا بخير.

أردت التواصل معكم بخصوص الخطوة التالية المقترحة: ${suggestion.action}.

${suggestion.rationale}

نقدّر دعمكم واهتمامكم المستمر، ويسعدنا ترتيب الوقت المناسب للمتابعة أو مشاركة أي تفاصيل إضافية قد تساعد في اتخاذ الخطوة القادمة.

مع خالص التقدير،
فريق إدارة المانحين`,
        };
    }

    return {
        subject: `Following up with ${donor.name}`,
        body: `Dear ${donor.name},

I hope you are doing well.

I wanted to follow up with a suggested next step: ${suggestion.action}.

${suggestion.rationale}

We truly value your continued interest and support. I would be happy to share more details or arrange a convenient time to continue the conversation.

Warm regards,
Donor Relations Team`,
    };
};

const AiActionModal: React.FC<AiActionModalProps> = ({ isOpen, onClose, donor, suggestion }) => {
    const { t, language } = useLocalization(['common', 'donors']);
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [content, setContent] = useState<GeneratedContent | null>(null);

    useEffect(() => {
        if (isOpen && donor && suggestion) {
            setIsLoading(true);
            setContent(buildDraftContent(donor, suggestion, language));
            setIsLoading(false);
        }
    }, [isOpen, donor, suggestion, language]);

    if (!isOpen || !donor) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-2xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <SparklesIcon className="text-primary" /> {t('donors.ai_modal.title')}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label={t('common.close')}><XIcon /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Spinner text={t('donors.ai_modal.generating')} />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">{t('donors.ai_modal.to')}</label>
                                <input type="text" readOnly value={`${donor.name} <${donor.email}>`} className="w-full p-2 mt-1 border rounded-md bg-gray-100 dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">{t('donors.ai_modal.subject')}</label>
                                <input type="text" defaultValue={content?.subject} className="w-full p-2 mt-1 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">{t('donors.ai_modal.body')}</label>
                                <textarea defaultValue={content?.body} rows={12} className="w-full p-2 mt-1 border rounded-md" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('common.cancel')}</button>
                    <button type="button" onClick={() => toast.showSuccess(t('donors.ai_modal.emailSent'))} className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold">{t('donors.ai_modal.send')}</button>
                </div>
            </div>
        </div>
    );
};

export default AiActionModal;
