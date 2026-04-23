
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import { useLocalization } from '../../../hooks/useLocalization';
import type { Stakeholder } from '../../../types';
import { X, Mail, Phone, Zap, MessageSquare, Briefcase, Calendar, Info, Shield, CheckCircle } from 'lucide-react';
import Spinner from '../../common/Spinner';

interface StakeholderDetailPanelProps {
    stakeholder: Stakeholder | null;
    onClose: () => void;
}

interface AiSuggestion {
    suggestion: string;
    rationale: string;
}

const Gauge: React.FC<{ value: number; label: string }> = ({ value, label }) => {
    // FIX: Replaced `getStrokeColor` which returned a hex value with `getColor` which returns a valid Tailwind CSS class name as expected by the `className` prop. This resolves the "Cannot find name 'getColor'" error.
    const getColor = (v: number) => {
        if (v >= 80) return 'stroke-green-500';
        if (v >= 60) return 'stroke-yellow-500';
        return 'stroke-red-500';
    };
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <svg className="w-16 h-16 transform -rotate-90">
                <circle
                    className="text-gray-200 dark:text-slate-700"
                    strokeWidth="5"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="32"
                    cy="32"
                />
                <circle
                    className={`transition-all duration-500 ${getColor(value)}`}
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="32"
                    cy="32"
                />
            </svg>
            <span className="text-xl font-bold -mt-10">{value}</span>
            <span className="text-xs text-gray-500 mt-5">{label}</span>
        </div>
    );
};

const ContactHistoryItem: React.FC<{ icon: React.ReactNode; title: string; date: string }> = ({ icon, title, date }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-primary dark:text-secondary">{icon}</div>
        <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-gray-500">{date}</p>
        </div>
    </div>
);

const StakeholderDetailPanel: React.FC<StakeholderDetailPanelProps> = ({ stakeholder, onClose }) => {
    const { t, language, dir } = useLocalization();
    const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const panelVariants = {
        hidden: { x: dir === 'rtl' ? '-100%' : '100%' },
        visible: { x: 0 },
    };

    const handleGenerateSuggestions = async () => {
        if (!stakeholder) return;
        setIsLoading(true);
        setError(null);
        setAiSuggestions([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const systemInstruction = `You are a professional non-profit relationship manager. Based on the stakeholder data provided, generate 2-3 concise, actionable next steps to improve or maintain the relationship. Respond in the language of the user's request, which is ${language}. Your response MUST be a valid JSON object with a single key 'suggestions' which is an array of objects. Each object in the array must have two keys: 'suggestion' (a string) and 'rationale' (a string). Do not include any text outside of the JSON object, including markdown fences.`;
            
            const prompt = `User's language: ${language}. Stakeholder Data: ${JSON.stringify({
                name: stakeholder.name[language], type: stakeholder.type, healthScore: stakeholder.healthScore, riskLevel: stakeholder.riskLevel, lastContact: stakeholder.lastContact, engagementScore: stakeholder.engagementScore
            })}`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                }
            });

            const jsonText = response.text.trim();
            const result = JSON.parse(jsonText);
            setAiSuggestions(result.suggestions || []);

        } catch (err) {
            console.error("Error generating suggestions:", err);
            setError(t('stakeholder_management.detailPanel.suggestionsError'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const riskProfileConfig = {
        supporter: { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: t('stakeholder_management.riskProfile.supporter') },
        neutral: { icon: <Info className="w-4 h-4 text-gray-500" />, text: t('stakeholder_management.riskProfile.neutral') },
        blocker: { icon: <Shield className="w-4 h-4 text-red-500" />, text: t('stakeholder_management.riskProfile.blocker') },
    };

    return (
        <AnimatePresence>
            {stakeholder && (
                <div className="fixed inset-0 z-40" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        initial="hidden" animate="visible" exit="hidden" variants={panelVariants}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`fixed top-0 h-full w-full max-w-md bg-card dark:bg-dark-card shadow-xl flex flex-col ${dir === 'rtl' ? 'left-0' : 'right-0'}`}
                    >
                        <header className="p-4 flex justify-between items-center border-b dark:border-slate-700 flex-shrink-0">
                            <h2 className="text-lg font-bold">{stakeholder.name[language]}</h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><X /></button>
                        </header>
                        <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                            <section>
                                <h3 className="font-semibold text-gray-500 mb-2">{t('stakeholder_management.detailPanel.summary')}</h3>
                                <div className="space-y-2 text-sm">
                                    <p className="flex items-center gap-2"><Mail size={16} />{stakeholder.email}</p>
                                    <p className="flex items-center gap-2"><Phone size={16} />{stakeholder.phone}</p>
                                    <p className="flex items-center gap-2 capitalize"><Info size={16} />{t('stakeholder_management.classificationLabel')}: {t(`stakeholder_management.classification.${stakeholder.classification}`)}</p>
                                </div>
                            </section>

                             <section>
                                <h3 className="font-semibold text-gray-500 mb-4 text-center">{t('stakeholder_management.detailPanel.metrics')}</h3>
                                <div className="flex justify-around items-center">
                                    <Gauge value={stakeholder.healthScore} label={t('stakeholder_management.table.relationshipHealth')} />
                                    <Gauge value={stakeholder.engagementScore} label={t('stakeholder_management.engagementScore')} />
                                </div>
                                <div className="mt-4 p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg flex justify-center items-center gap-4">
                                     <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-semibold">{t('stakeholder_management.card.needs')}:</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {stakeholder.needs.map(need => <span key={need} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{need}</span>)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-semibold">{t('stakeholder_management.riskProfileLabel')}:</h4>
                                        <div className="flex items-center gap-1 text-sm font-medium">
                                            {riskProfileConfig[stakeholder.riskProfile].icon}
                                            <span>{riskProfileConfig[stakeholder.riskProfile].text}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            
                            <section>
                                <h3 className="font-semibold text-gray-500 mb-2">{t('stakeholder_management.detailPanel.contactHistory')}</h3>
                                <div className="space-y-4">
                                    <ContactHistoryItem icon={<MessageSquare size={16} />} title={t('stakeholder_management.detailPanel.contact_types.email')} date={t('stakeholder_management.timeAgo.twoWeeks')} />
                                    <ContactHistoryItem icon={<Briefcase size={16} />} title={t('stakeholder_management.detailPanel.contact_types.meeting')} date={t('stakeholder_management.timeAgo.oneMonth')} />
                                    <ContactHistoryItem icon={<Phone size={16} />} title={t('stakeholder_management.detailPanel.contact_types.call')} date={t('stakeholder_management.timeAgo.threeMonths')} />
                                </div>
                            </section>
                            <section>
                                <h3 className="font-semibold text-gray-500 mb-2">{t('stakeholder_management.detailPanel.aiActionCenter')}</h3>
                                <div className="bg-primary-light/40 dark:bg-primary/10 p-4 rounded-lg text-center space-y-3">
                                    {!isLoading && aiSuggestions.length === 0 && !error && (
                                         <button onClick={handleGenerateSuggestions} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg"><Zap size={16}/> {t('stakeholder_management.detailPanel.generateSuggestions')}</button>
                                    )}
                                    {isLoading && <Spinner text={t('stakeholder_management.detailPanel.generating')} />}
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    {aiSuggestions.length > 0 && (
                                        <div className="space-y-3 text-left">
                                            {aiSuggestions.map((s, i) => (
                                                <div key={i} className="bg-card/50 dark:bg-dark-card/50 p-3 rounded-md">
                                                    <p className="font-semibold text-sm">{s.suggestion}</p>
                                                    <p className="text-xs text-gray-500">{s.rationale}</p>
                                                </div>
                                            ))}
                                             <button onClick={handleGenerateSuggestions} className="w-full text-xs font-semibold text-primary mt-2">{t('smart_messaging.preview.regenerate')}</button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StakeholderDetailPanel;
