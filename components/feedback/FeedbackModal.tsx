import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useLocalization } from '../../hooks/useLocalization';
import { useToast } from '../../hooks/useToast';
import { XIcon } from '../icons/GenericIcons';
import { Bug, Lightbulb, MessageCircle, CheckCircle, Camera } from 'lucide-react';
import StarRatingInput from '../common/StarRatingInput';
import Spinner from '../common/Spinner';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'type' | 'form' | 'success';
type FeedbackType = 'bug' | 'feature' | 'general';

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLocalization();
    const toast = useToast();
    const modalRoot = document.getElementById('modal-root');

    const [step, setStep] = useState<Step>('type');
    const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
    const [rating, setRating] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetState = () => {
        setStep('type');
        setFeedbackType(null);
        setRating(0);
        setFormData({});
        setScreenshot(null);
        setIsSubmitting(false);
    };
    
    const handleClose = () => {
        resetState();
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            resetState();
        }
    }, [isOpen]);

    const handleTypeSelect = (type: FeedbackType) => {
        setFeedbackType(type);
        setStep('form');
    };
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleScreenshot = async () => {
        const elementToCapture = document.getElementById('root');
        if (!elementToCapture) return;

        try {
            const canvas = await html2canvas(elementToCapture, {
                useCORS: true,
                onclone: (doc) => {
                    const modal = doc.querySelector('[role="dialog"]');
                    if (modal) (modal as HTMLElement).style.visibility = 'hidden';
                }
            });
            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            setScreenshot(imageDataUrl);
            toast.showSuccess(t('feedback.screenshot_captured'));
        } catch (error) {
            console.error("Screenshot failed:", error);
            toast.showError("Failed to capture screenshot.");
        }
    };
    
    const handleSubmit = () => {
        setIsSubmitting(true);
        const submissionData = {
            type: feedbackType,
            rating,
            details: formData,
            screenshot,
            meta: {
                url: window.location.hash,
                browser: navigator.userAgent,
                screen: `${window.innerWidth}x${window.innerHeight}`,
            }
        };
        
        console.log("Feedback Submitted:", submissionData);

        setTimeout(() => {
            setIsSubmitting(false);
            setStep('success');
            setTimeout(handleClose, 3000);
        }, 1500);
    };

    const TypeButton: React.FC<{ type: FeedbackType; icon: React.ReactNode; }> = ({ type, icon }) => (
        <button onClick={() => handleTypeSelect(type)} className="w-full p-6 border-2 dark:border-slate-700 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:border-primary transition-colors">
            <div className="text-3xl text-primary mx-auto mb-2">{icon}</div>
            <h4 className="font-bold">{t(`feedback.type_${type}`)}</h4>
            <p className="text-xs text-gray-500">{t(`feedback.type_${type}_desc`)}</p>
        </button>
    );

    const renderContent = () => {
        switch (step) {
            case 'type':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-center">{t('feedback.step1Title')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TypeButton type="bug" icon={<Bug />} />
                            <TypeButton type="feature" icon={<Lightbulb />} />
                            <TypeButton type="general" icon={<MessageCircle />} />
                        </div>
                        <div className="text-center pt-4 border-t dark:border-slate-700">
                            <h4 className="font-semibold mb-2">{t('feedback.satisfaction')}</h4>
                            <StarRatingInput rating={rating} setRating={setRating} />
                        </div>
                    </div>
                );
            case 'form':
                if (!feedbackType) return null;
                const formTitles = { bug: t('feedback.bug_form_title'), feature: t('feedback.feature_form_title'), general: t('feedback.general_form_title') };
                return (
                    <div className="space-y-4">
                         <h3 className="text-xl font-bold">{formTitles[feedbackType]}</h3>
                         {feedbackType === 'bug' && (
                             <div className="space-y-4">
                                <textarea name="issue" onChange={handleFormChange} rows={5} placeholder={t('feedback.bug_issue_placeholder')} className="w-full p-2 border rounded-md" />
                                <label className="text-sm font-medium">{t('feedback.screenshot_label')}</label>
                                 <div className="flex gap-2">
                                    <button onClick={handleScreenshot} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"><Camera size={16}/> {t('feedback.screenshot_button')}</button>
                                    {screenshot && <img src={screenshot} alt="Screenshot preview" className="w-24 h-16 object-cover rounded-md border" />}
                                </div>
                                 <div className="text-xs text-gray-500 p-2 bg-gray-100 dark:bg-slate-800 rounded-md">
                                    <strong>{t('feedback.auto_data_label')}</strong> Browser, Page, Screen Size.
                                 </div>
                             </div>
                         )}
                         {feedbackType === 'feature' && (
                             <div className="space-y-4">
                                <textarea name="description" onChange={handleFormChange} rows={4} placeholder={t('feedback.feature_desc_placeholder')} className="w-full p-2 border rounded-md" />
                                <textarea name="reason" onChange={handleFormChange} rows={3} placeholder={t('feedback.feature_why_placeholder')} className="w-full p-2 border rounded-md" />
                                <label className="text-sm font-medium">{t('feedback.feature_priority_label')}</label>
                                <select name="priority" onChange={handleFormChange} className="w-full p-2 border rounded-md">
                                    <option value="low">{t('feedback.priorities.low')}</option>
                                    <option value="medium">{t('feedback.priorities.medium')}</option>
                                    <option value="high">{t('feedback.priorities.critical')}</option>
                                </select>
                             </div>
                         )}
                         {feedbackType === 'general' && (
                             <textarea name="comment" onChange={handleFormChange} rows={6} placeholder={t('feedback.general_placeholder')} className="w-full p-2 border rounded-md" />
                         )}
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center p-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold">{t('feedback.success_title')}</h3>
                        <p className="mt-2 text-gray-500">{t('feedback.success_message')}</p>
                    </div>
                )
        }
    };
    
    if (!isOpen || !modalRoot) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60]">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 modal-overlay" onClick={handleClose} />
                <div className="flex items-center justify-center min-h-screen p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="relative bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-2xl m-4 flex flex-col max-h-[90vh] feedback-modal-content"
                    >
                        <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0">
                            <h2 className="text-lg font-bold">{t('feedback.modalTitle')}</h2>
                            <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon /></button>
                        </header>
                        <main className="p-6 overflow-y-auto">
                            {renderContent()}
                        </main>
                        {step === 'form' && (
                            <footer className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-2xl flex justify-end gap-3 flex-shrink-0">
                                <button onClick={() => setStep('type')} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('common.cancel')}</button>
                                <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-secondary-dark flex items-center gap-2">
                                    {isSubmitting ? <Spinner size="w-4 h-4" /> : null}
                                    {isSubmitting ? t('feedback.submitting') : t('feedback.submit')}
                                </button>
                            </footer>
                        )}
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>,
        modalRoot
    );
};

export default FeedbackModal;