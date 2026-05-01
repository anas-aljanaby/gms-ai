import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useToast } from '../../hooks/useToast';
import { MOCK_TUTORIALS } from '../../data/helpData';
import { MousePointerClick } from 'lucide-react';

const InteractiveTutorialsSection: React.FC = () => {
    const { t, language } = useLocalization();
    const toast = useToast();
    
    const interactiveTutorials = MOCK_TUTORIALS.filter(t => t.type === 'interactive');

    const handleStartTutorial = () => {
        toast.showInfo(t('help.interactive.comingSoonMessage'), { title: t('help.interactive.comingSoonTitle') });
    };

    return (
        <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
            <h2 className="text-2xl font-bold mb-4">{t('help.interactive.title')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('help.interactive.description')}</p>
            <div className="space-y-4">
                {interactiveTutorials.map(tut => (
                    <div key={tut.id} className="p-4 border dark:border-slate-700 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 rounded-lg">
                                <MousePointerClick className="w-6 h-6"/>
                            </div>
                            <div>
                                <h3 className="font-bold">{tut.title[language]}</h3>
                                <p className="text-xs text-gray-500">{t('help.interactive.duration', { duration: tut.duration })}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleStartTutorial}
                            className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg w-full sm:w-auto"
                        >
                            {t('help.interactive.start')}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InteractiveTutorialsSection;