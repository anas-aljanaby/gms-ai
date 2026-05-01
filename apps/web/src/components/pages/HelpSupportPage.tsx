
import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { SearchIcon } from '../icons/GenericIcons';
import { HelpCircle } from 'lucide-react';
import FaqSection from '../help/FaqSection';
import VideoTutorialsSection from '../help/VideoTutorialsSection';
import InteractiveTutorialsSection from '../help/InteractiveTutorialsSection';

const HelpSupportPage: React.FC = () => {
    const { t } = useLocalization();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="text-center">
                <div className="inline-block p-4 bg-primary-light dark:bg-primary/20 rounded-full mb-4">
                    <HelpCircle className="w-12 h-12 text-primary dark:text-secondary" />
                </div>
                <h1 className="text-4xl font-bold text-foreground dark:text-dark-foreground">{t('help.title')}</h1>
                <p className="mt-2 max-w-2xl mx-auto text-gray-500 dark:text-gray-400">{t('help.subtitle')}</p>
            </header>

            <div className="max-w-3xl mx-auto">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none rtl:left-auto rtl:right-0 rtl:pr-4">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('common.searchPlaceholder')}
                        className="w-full p-4 pl-12 rtl:pr-12 rtl:pl-4 text-lg border rounded-full bg-card dark:bg-dark-card dark:border-slate-600 focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            <FaqSection searchTerm={searchTerm} />
            <VideoTutorialsSection />
            <InteractiveTutorialsSection />
        </div>
    );
};

export default HelpSupportPage;
