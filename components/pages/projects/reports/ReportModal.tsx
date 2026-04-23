import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useLocalization } from '../../../../hooks/useLocalization';
import { XIcon } from '../../../icons/GenericIcons';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, title, children }) => {
    const { t } = useLocalization();
    const modalRoot = document.getElementById('modal-root');
    const [shareLink, setShareLink] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !modalRoot) return null;

    const handlePrint = () => {
        window.print();
    };
    
    const handleShare = () => {
        const id = Math.random().toString(36).substr(2, 9);
        const link = window.location.origin + '/reports/share/' + id;
        setShareLink(link);
        setShowShareModal(true);
    };

    const ShareModal: React.FC<{ link: string; onClose: () => void }> = ({ link, onClose: closeShareModal }) => {
        const [isCopied, setIsCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(link).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        };

        return (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60] animate-fade-in-fast" onClick={closeShareModal}>
                <div className="bg-card dark:bg-dark-card rounded-lg shadow-xl w-full max-w-sm m-4 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                    <h4 className="font-bold text-lg">{t('common.shareReport')}</h4>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={link} 
                            readOnly 
                            onClick={(e) => e.currentTarget.select()}
                            className="w-full p-2 border rounded-md bg-gray-100 dark:bg-slate-800 dark:border-slate-600 pr-20"
                        />
                        <button 
                            onClick={handleCopy} 
                            className={`absolute right-1 top-1 bottom-1 px-3 text-sm font-semibold rounded transition-colors ${isCopied ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300'}`}
                        >
                            {isCopied ? t('common.copied') : t('common.copy')}
                        </button>
                    </div>
                    <p className="text-xs text-center text-gray-500">{t('common.validFor7Days')}</p>
                </div>
            </div>
        );
    };


    return ReactDOM.createPortal(
        <>
            <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
                <div className="fixed inset-0 bg-black/60 modal-overlay animate-fade-in" onClick={onClose} />
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div 
                        className="relative bg-card dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[90vh] report-modal-content animate-slide-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 hide-on-print">
                            <h2 className="text-xl font-bold">{title}</h2>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" aria-label={t('projects.reporting.closeModal')}>
                                <XIcon />
                            </button>
                        </header>
                        <main className="p-6 overflow-y-auto printable-content">
                            {children}
                        </main>
                        <footer className="px-6 py-4 bg-gray-50 dark:bg-dark-card/50 rounded-b-2xl flex justify-end gap-3 flex-shrink-0 hide-on-print">
                            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-sm font-semibold">{t('common.close')}</button>
                            <button onClick={() => alert(t('projects.reporting.exportComingSoon'))} className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold">{t('common.export')}</button>
                            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-secondary-dark transition-colors">
                                📤 {t('common.share')}
                            </button>
                            <button onClick={handlePrint} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold">{t('projects.reporting.printReport')}</button>
                        </footer>
                    </div>
                </div>
            </div>
            {showShareModal && <ShareModal link={shareLink} onClose={() => setShowShareModal(false)} />}
        </>,
        modalRoot
    );
};

export default ReportModal;
