import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { XIcon } from '../../icons/GenericIcons';

interface SendEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (data: { to: string; subject: string; body: string }) => void;
    donorEmail: string;
}

const SendEmailModal: React.FC<SendEmailModalProps> = ({ isOpen, onClose, onSend, donorEmail }) => {
    const { t } = useLocalization(['common', 'individual_donors']);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSend({ to: donorEmail, subject, body });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-2xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold">{t('modals.send_email.title')}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium">{t('modals.send_email.to')}</label>
                            <input type="email" value={donorEmail} readOnly className="w-full p-2 mt-1 border rounded-md bg-gray-100 dark:bg-slate-800 dark:border-slate-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">{t('modals.send_email.subject')}</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">{t('modals.send_email.body')}</label>
                            <textarea value={body} onChange={e => setBody(e.target.value)} rows={10} className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700" />
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-xl flex justify-end gap-3 flex-shrink-0">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('common.cancel')}</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold">{t('modals.send_email.send')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendEmailModal;
