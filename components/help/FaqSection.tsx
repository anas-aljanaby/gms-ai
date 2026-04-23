import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_FAQS } from '../../data/helpData';
import type { FaqItem } from '../../types';
import { ChevronDown } from 'lucide-react';

interface FaqSectionProps {
    searchTerm: string;
}

const FaqEntry: React.FC<{ item: FaqItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useLocalization();

    return (
        <div className="border-b dark:border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4"
                aria-expanded={isOpen}
            >
                <span className="font-semibold">{item.question[language]}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4 text-gray-600 dark:text-gray-400">
                            {item.answer[language]}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FaqSection: React.FC<FaqSectionProps> = ({ searchTerm }) => {
    const { t, language } = useLocalization();
    const [activeCategory, setActiveCategory] = useState<'general' | 'donors' | 'projects'>('general');
    
    const filteredFaqs = useMemo(() => {
        return MOCK_FAQS.filter(faq => {
            const matchesCategory = faq.category === activeCategory;
            const matchesSearch = searchTerm 
                ? faq.question[language].toLowerCase().includes(searchTerm.toLowerCase()) || 
                  faq.answer[language].toLowerCase().includes(searchTerm.toLowerCase())
                : true;
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory, language]);

    const categories = ['general', 'donors', 'projects'];

    return (
        <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
            <h2 className="text-2xl font-bold mb-4">{t('help.faq.title')}</h2>
            <div className="flex gap-2 border-b dark:border-slate-700 mb-4">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat as any)}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 ${activeCategory === cat ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
                    >
                        {t(`help.faq.categories.${cat}`)}
                    </button>
                ))}
            </div>
            
            <div className="space-y-2">
                {filteredFaqs.map(faq => <FaqEntry key={faq.id} item={faq} />)}
                {filteredFaqs.length === 0 && (
                    <p className="text-center py-8 text-gray-500">{t('help.faq.noResults')}</p>
                )}
            </div>
        </div>
    );
};

export default FaqSection;