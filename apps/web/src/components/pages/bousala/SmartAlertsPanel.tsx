import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../../../hooks/useLocalization';
import type { BousalaGoal } from '../../../types';
import { AlertTriangle, X as XIcon, Bot } from 'lucide-react';
import { playFeedbackSound } from '../../../lib/audioFeedback';
import { GoogleGenAI } from "@google/genai";
import Spinner from '../../common/Spinner';

// Define the structure for an alert
interface SmartAlert {
    id: string;
    goalId: string;
    goalTitle: string;
    severity: 'critical' | 'warning';
    messages: string[];
    recommendation?: string;
    isGeneratingRecommendation?: boolean;
    date: string;
}

interface SmartAlertsPanelProps {
    goals: BousalaGoal[];
    isVoiceFeedbackEnabled: boolean;
    severityThreshold: number;
    aiAutoRecommendationsEnabled: boolean;
}

const SmartAlertsPanel: React.FC<SmartAlertsPanelProps> = ({ goals, isVoiceFeedbackEnabled, severityThreshold, aiAutoRecommendationsEnabled }) => {
    const { t, language } = useLocalization();
    const [alerts, setAlerts] = useState<SmartAlert[]>([]);
    const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

    const generateAlerts = useCallback(() => {
        const newAlerts: SmartAlert[] = [];
        goals.forEach(goal => {
            const alertMessages: string[] = [];
            let severity: 'critical' | 'warning' = 'warning';

            if (goal.prediction && goal.prediction.probability < severityThreshold) {
                alertMessages.push(t('bousala.alerts.lowProbability', { probability: goal.prediction.probability }));
                if (goal.prediction.probability < 50) { // Critical is < 50
                    severity = 'critical';
                }
            }

            goal.kpis?.forEach(kpi => {
                if (kpi.target > 0 && kpi.value < kpi.target * 0.5) {
                     alertMessages.push(t('bousala.alerts.kpiBelowHalf', { kpiTitle: kpi.title }));
                    severity = 'critical';
                }
                if (kpi.trend === 'down') {
                    alertMessages.push(t('bousala.alerts.kpiDownward', { kpiTitle: kpi.title }));
                }
            });

            if (alertMessages.length > 0) {
                newAlerts.push({
                    id: goal.id,
                    goalId: goal.id,
                    goalTitle: goal.title,
                    severity: severity,
                    messages: [...new Set(alertMessages)],
                    date: new Date().toISOString(),
                });
            }
        });
        
        const hasNewUndismissedAlerts = newAlerts.some(newAlert => 
            !alerts.some(oldAlert => oldAlert.id === newAlert.id) && 
            !dismissedAlerts.has(newAlert.id)
        );

        if (isVoiceFeedbackEnabled && hasNewUndismissedAlerts) {
            playFeedbackSound('warning');
        }

        setAlerts(currentAlerts => {
            // Merge new alerts with existing ones to preserve recommendations
            return newAlerts.map(newAlert => {
                const oldAlert = currentAlerts.find(a => a.id === newAlert.id);
                const messagesChanged = !oldAlert || JSON.stringify(oldAlert.messages) !== JSON.stringify(newAlert.messages);
                
                return {
                    ...newAlert,
                    recommendation: messagesChanged ? undefined : oldAlert.recommendation,
                    isGeneratingRecommendation: messagesChanged ? true : (oldAlert?.isGeneratingRecommendation || false),
                };
            });
        });
    }, [goals, isVoiceFeedbackEnabled, dismissedAlerts, alerts, severityThreshold, t]);

    useEffect(() => {
        generateAlerts();
        const interval = setInterval(generateAlerts, 30000); // Re-evaluate every 30 seconds
        return () => clearInterval(interval);
    }, [goals, isVoiceFeedbackEnabled, dismissedAlerts]);
    
    const generateRecommendation = useCallback(async (alert: SmartAlert, goal: BousalaGoal) => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const systemInstruction = `You are an AI assistant providing concise, actionable recommendations in ${language} for a non-profit's goal management system. Your response should be a single sentence, direct and clear. Do not add any introductory text.`;
            
            const context = `
                Goal: "${goal.title}"
                Description: "${goal.description}"
                Current Progress: ${goal.progress}%
                Alerts Triggered:
                - ${alert.messages.join('\n- ')}
            `;
            
            const prompt = `Based on the following data, provide a single-sentence recommendation in ${language} to address the issues.
            
            ${context}
            `;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { systemInstruction } });
            
            const recommendationText = response.text;
            
            setAlerts(prevAlerts => prevAlerts.map(a => 
                a.id === alert.id 
                    ? { ...a, recommendation: recommendationText, isGeneratingRecommendation: false } 
                    : a
            ));

        } catch (error) {
            console.error("Failed to generate AI recommendation:", error);
            setAlerts(prevAlerts => prevAlerts.map(a => 
                a.id === alert.id 
                    ? { ...a, recommendation: t('bousala.alerts.recommendationFailed'), isGeneratingRecommendation: false } 
                    : a
            ));
        }
    }, [language, t]);

    useEffect(() => {
        if (aiAutoRecommendationsEnabled) {
            alerts.forEach(alert => {
                if (alert.isGeneratingRecommendation) {
                    const goal = goals.find(g => g.id === alert.goalId);
                    if (goal) {
                        generateRecommendation(alert, goal);
                    }
                }
            });
        } else {
            if (alerts.some(a => a.isGeneratingRecommendation || a.recommendation)) {
                setAlerts(prev => prev.map(a => ({...a, isGeneratingRecommendation: false, recommendation: undefined})));
            }
        }
    }, [alerts, goals, generateRecommendation, aiAutoRecommendationsEnabled]);


    const handleDismiss = (alertId: string) => {
        setDismissedAlerts(prev => new Set(prev).add(alertId));
    };

    const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

    if (visibleAlerts.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-3"
        >
            {visibleAlerts.map(alert => {
                const isCritical = alert.severity === 'critical';
                const colors = isCritical
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-500'
                    : 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 border-orange-500';

                return (
                    <AnimatePresence key={alert.id}>
                         <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className={`p-4 rounded-lg flex items-start justify-between gap-4 border-l-4 ${colors}`}
                        >
                            <div className="flex-grow">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold" dir="auto">{t('bousala.alerts.smartAlertFor', { title: alert.goalTitle })}</h4>
                                        <ul className="list-disc list-inside text-sm mt-1">
                                            {alert.messages.map((msg, i) => <li key={i} dir="auto">{msg}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                {aiAutoRecommendationsEnabled && (alert.isGeneratingRecommendation ? (
                                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                        <Spinner size="w-3 h-3" />
                                        <span>{t('bousala.alerts.generatingRecommendation')}</span>
                                    </div>
                                ) : alert.recommendation && (
                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-4 border-blue-400">
                                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                            <Bot size={16} />
                                            {t('bousala.aiPanel.recommendations')}:
                                        </p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1" dir="auto">{alert.recommendation}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleDismiss(alert.id)} className="p-1 rounded-full opacity-70 hover:opacity-100 flex-shrink-0">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </AnimatePresence>
                );
            })}
        </motion.div>
    );
};

export default SmartAlertsPanel;
