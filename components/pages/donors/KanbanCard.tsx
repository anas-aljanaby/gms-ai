
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Donor, DonorTask, AiSuggestion } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { MoreHorizontalIcon, SparklesIcon } from '../../icons/GenericIcons';
import { TaskIcon, DonationIcon } from '../../icons/ActionIcons';
import AiActionModal from './AiActionModal';

interface KanbanCardProps {
    donor: Donor;
    dispatch: React.Dispatch<any>;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ donor, dispatch }) => {
    const { t, language, dir } = useLocalization();
    const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(true);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);

    useEffect(() => {
        const getSuggestion = async () => {
            setIsLoadingSuggestion(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const systemInstruction = `You are a non-profit relationship manager AI. Given donor data, suggest the single 'next best action'. Respond in the user's language which is ${language}. Your response MUST be a valid JSON object with 'action' (a short imperative phrase like "Send a thank you email") and 'rationale' (a brief explanation).`;
                const prompt = `Donor: ${JSON.stringify({ name: donor.name, stage: donor.stage, totalDonated: donor.totalDonated, lastContact: donor.lastContact, relationshipHealth: donor.relationshipHealth, donorCategory: donor.donorCategory })}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        systemInstruction,
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                action: { type: Type.STRING },
                                rationale: { type: Type.STRING }
                            },
                            required: ['action', 'rationale']
                        }
                    }
                });
                const result = JSON.parse(response.text.trim());
                setAiSuggestion(result);
            } catch (error) {
                console.error("Failed to get AI suggestion:", error);
                setAiSuggestion(null);
            } finally {
                setIsLoadingSuggestion(false);
            }
        };

        getSuggestion();
    }, [donor, language]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('donorId', donor.id.toString());
    };

    const handleTaskToggle = (taskId: string, completed: boolean) => {
        dispatch({ type: 'SET_TASK_COMPLETED', payload: { donorId: donor.id, taskId, completed } });
    };

    const healthColors = {
        'Good': 'border-green-500',
        'Moderate': 'border-yellow-500',
        'At Risk': 'border-red-500',
    };
    
    const openTasks = donor.tasks.filter(task => !task.completed);
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <AiActionModal 
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                donor={donor}
                suggestion={aiSuggestion}
            />
            <div
                draggable
                onDragStart={handleDragStart}
                className={`flex flex-col space-y-3 bg-card dark:bg-dark-card rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow cursor-grab border-s-4 ${healthColors[donor.relationshipHealth]}`}
                aria-label={t('donors.card.ariaLabel', { name: donor.name })}
            >
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                        <img src={donor.avatar} alt={donor.name} className="w-10 h-10 rounded-full flex-shrink-0" loading="lazy" />
                        <div className="flex-grow">
                            <h3 className="font-bold text-base text-foreground dark:text-dark-foreground whitespace-normal">{donor.name}</h3>
                            <p className="text-xs text-gray-500">{donor.country}</p>
                        </div>
                    </div>
                    <button className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 flex-shrink-0" aria-label={t('donors.card.moreOptions')}>
                        <MoreHorizontalIcon />
                    </button>
                </div>

                {/* Financials */}
                <div className="flex justify-between text-sm bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">{t('donors.card.potential')}: </span>
                        <span className="font-bold text-foreground dark:text-dark-foreground">{formatCurrency(donor.potentialGift, language)}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">{t('donors.card.donated')}: </span>
                        <span className="font-bold text-foreground dark:text-dark-foreground">{formatCurrency(donor.totalDonated, language)}</span>
                    </div>
                </div>

                {/* AI Suggestion */}
                <div className="p-3 rounded-lg bg-primary-light/50 dark:bg-primary/20 border-l-4 border-primary dark:border-secondary">
                    <h4 className="text-xs font-bold uppercase text-primary dark:text-secondary mb-2 flex items-center gap-1">
                        <SparklesIcon className="w-4 h-4" /> {t('donors.ai_suggestion.title')}
                    </h4>
                    {isLoadingSuggestion ? (
                        <div className="h-10 flex items-center text-xs">{t('donors.ai_suggestion.loading')}</div>
                    ) : aiSuggestion ? (
                        <div>
                            <p className="font-bold text-sm text-primary-dark dark:text-white">💡 {aiSuggestion.action}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{t('donors.ai_suggestion.rationale')}: {aiSuggestion.rationale}</p>
                             <button onClick={() => setIsActionModalOpen(true)} className="mt-2 text-xs font-bold text-white bg-primary dark:bg-secondary px-3 py-1 rounded-full hover:bg-primary-dark">
                                {t('donors.ai_suggestion.start')}
                            </button>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">{t('donors.ai_suggestion.error')}</p>
                    )}
                </div>

                {/* Tasks */}
                {openTasks.length > 0 && (
                    <div className="">
                        <h4 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 mb-2">{t('donors.card.openTasks')}</h4>
                        <ul className="space-y-2 text-sm">
                            {openTasks.map(task => {
                                 const isOverdue = task.dueDate < today;
                                 return (
                                    <li key={task.id} className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={(e) => handleTaskToggle(task.id, e.target.checked)}
                                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary mt-0.5 flex-shrink-0"
                                        />
                                        <div className="flex-grow">
                                            <p className={`leading-tight whitespace-normal ${isOverdue ? 'text-red-600 dark:text-red-500' : 'text-foreground dark:text-dark-foreground'}`}>{task.text}</p>
                                            <p className={`text-xs ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {isOverdue && <span className="font-extrabold">{t('donors.card.overdue')}! </span>}
                                                {t('donors.card.due')} {formatDate(task.dueDate, language)}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                
                {/* Spacer to push actions to bottom */}
                <div className="flex-grow min-h-[0.25rem]"></div>

                {/* Quick Actions */}
                 <div className="flex justify-end gap-1 border-t dark:border-slate-700 pt-2">
                     <button className="p-2 rounded-full text-gray-500 hover:text-primary hover:bg-gray-200 dark:hover:bg-slate-700" title={t('donors.card.addTask')}>
                         <TaskIcon />
                     </button>
                     <button className="p-2 rounded-full text-gray-500 hover:text-primary hover:bg-gray-200 dark:hover:bg-slate-700" title={t('donors.card.addDonation')}>
                         <DonationIcon />
                     </button>
                </div>
            </div>
        </>
    );
};

export default KanbanCard;
