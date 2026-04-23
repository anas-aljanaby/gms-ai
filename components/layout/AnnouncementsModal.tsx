import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_ANNOUNCEMENTS } from '../../data/announcementsData';
import { XIcon } from '../icons/GenericIcons';
import { formatDate } from '../../lib/utils';
import type { Announcement } from '../../types';

interface AnnouncementsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AnnouncementItem: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    const { language } = useLocalization();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 border-l-4 rounded-r-lg"
            style={{ borderColor: announcement.tag?.color || '#6B7280' }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3">
                        {announcement.tag && (
                            <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: announcement.tag.color }}>
                                {announcement.tag.text[language]}
                            </span>
                        )}
                        <p className="text-sm text-gray-500">{formatDate(announcement.date, language)}</p>
                    </div>
                    <h3 className="font-bold text-lg mt-1">{announcement.title[language]}</h3>
                </div>
                {announcement.isNew && (
                    <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">
                        NEW
                    </span>
                )}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{announcement.content[language]}</p>
        </motion.div>
    );
};

const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({ isOpen, onClose }) => {
    const { t, dir } = useLocalization();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: dir === 'rtl' ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: dir === 'rtl' ? '-100%' : '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`fixed top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-card dark:bg-dark-card shadow-2xl flex flex-col`}
                    >
                        <div className="p-4 flex justify-between items-center border-b dark:border-slate-700 flex-shrink-0">
                            <h2 className="text-lg font-bold">{t('onboarding.whatsNew.title')}</h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                                <XIcon className="w-5 h-5"/>
                            </button>
                        </div>
                        
                        <div className="flex-grow overflow-y-auto p-4 space-y-6">
                           {MOCK_ANNOUNCEMENTS.map(ann => <AnnouncementItem key={ann.id} announcement={ann} />)}
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AnnouncementsModal;