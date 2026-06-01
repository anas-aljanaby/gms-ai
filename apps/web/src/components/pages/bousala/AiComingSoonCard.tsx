import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';

const AiComingSoonCard: React.FC = () => {
    const { t } = useLocalization(['bousala']);

    return (
        <button
            type="button"
            disabled
            className="w-full text-start bg-card dark:bg-dark-card rounded-2xl shadow-soft border dark:border-slate-700/50 p-5 opacity-80 cursor-not-allowed"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Bot size={20} />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{t('bousala.ai.title')}</h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                            <Sparkles size={12} /> {t('bousala.ai.comingSoon')}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1" dir="auto">
                        {t('bousala.ai.description')}
                    </p>
                </div>
            </div>
        </button>
    );
};

export default AiComingSoonCard;
