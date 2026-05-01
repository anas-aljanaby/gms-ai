import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";
import type { Beneficiary, Milestone } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import { useTheme } from '../../../hooks/useTheme';
import { formatDate } from '../../../lib/utils';
import { CheckCircle, Loader, Circle, TrendingUp, BarChart2, Bot, Sparkles } from 'lucide-react';
import Spinner from '../../common/Spinner';

interface BeneficiaryJourneyTabProps {
    beneficiary: Beneficiary;
}

const MilestoneItem: React.FC<{ milestone: Milestone; isLast: boolean }> = ({ milestone, isLast }) => {
    const { language } = useLocalization();

    const statusConfig = {
        achieved: { icon: <CheckCircle className="w-5 h-5 text-white" />, color: 'bg-green-500' },
        'in-progress': { icon: <Loader className="w-5 h-5 text-white animate-spin" />, color: 'bg-blue-500' },
        pending: { icon: <Circle className="w-5 h-5 text-gray-500" />, color: 'bg-gray-300 dark:bg-slate-600' },
    };

    const { icon, color } = statusConfig[milestone.status];

    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${color}`}>
                    {icon}
                </div>
                {!isLast && <div className="w-0.5 flex-grow bg-gray-200 dark:bg-slate-700" />}
            </div>
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="pb-8 pt-1"
            >
                <p className="font-bold text-foreground dark:text-dark-foreground">{milestone.title[language]}</p>
                {milestone.date && <p className="text-sm text-gray-500">{formatDate(milestone.date, language, 'long')}</p>}
            </motion.div>
        </div>
    );
};

const ImpactChart: React.FC<{ beneficiary: Beneficiary }> = ({ beneficiary }) => {
    const { language } = useLocalization();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const gpaData = beneficiary.profile?.academicRecords?.reports
        ?.map((r: { date: string; gpa: number }) => ({
            date: formatDate(r.date, language, { month: 'short', year: '2-digit' }),
            GPA: r.gpa
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (!gpaData || gpaData.length < 2) return <p className="text-center text-sm text-gray-500 py-10">لا توجد بيانات كافية لعرض الرسم البياني.</p>;

    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gpaData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#4A5568" : "#E2E8F0"} />
                    <XAxis dataKey="date" tick={{ fill: isDark ? '#A0AEC0' : '#4A5568', fontSize: 12 }} />
                    <YAxis domain={[0, 4]} tick={{ fill: isDark ? '#A0AEC0' : '#4A5568' }} />
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }} />
                    <Legend />
                    <Line type="monotone" dataKey="GPA" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const BeneficiaryJourneyTab: React.FC<BeneficiaryJourneyTabProps> = ({ beneficiary }) => {
    const milestones = beneficiary.milestones || [];
    const hasImpactData = beneficiary.profile?.academicRecords?.reports?.length > 0;
    const toast = useToast();
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [insights, setInsights] = useState<{ analysis: string; prediction: string; recommendation: string } | null>(null);


    const handleGenerateInsights = async () => {
        setIsLoadingInsights(true);
        setInsights(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const systemInstruction = "You are an expert NGO case manager and academic advisor. Analyze the provided beneficiary data (milestones and academic progress) and generate a concise report in Arabic. The report should include a brief analysis of their journey, a prediction of their future performance, and one key actionable recommendation for their case manager. Provide the output as a JSON object with keys 'analysis', 'prediction', and 'recommendation'.";
            
            const prompt = `
                Beneficiary Data:
                - Milestones: ${JSON.stringify(beneficiary.milestones)}
                - GPA Trend: ${JSON.stringify(beneficiary.profile.academicRecords?.reports)}
            `;
            
             const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            analysis: { type: Type.STRING },
                            prediction: { type: Type.STRING },
                            recommendation: { type: Type.STRING }
                        },
                        required: ['analysis', 'prediction', 'recommendation']
                    }
                }
            });
            
            const result = JSON.parse(response.text.trim());
            setInsights(result);
        } catch (error) {
            console.error("AI Insight Generation Error:", error);
            toast.showError("Failed to generate AI insights.");
        } finally {
            setIsLoadingInsights(false);
        }
    };


    if (milestones.length === 0 && !hasImpactData) {
        return (
            <div className="text-center py-16 px-6 bg-card dark:bg-dark-card rounded-2xl shadow-inner">
                <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mt-4">لا توجد بيانات رحلة متاحة</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">لم يتم تحديد معالم أو مؤشرات أثر لهذا المستفيد بعد.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {milestones.length > 0 && (
                    <div className="lg:col-span-2 bg-card dark:bg-dark-card/50 p-6 rounded-xl shadow-soft border dark:border-slate-700">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp /> رحلة المستفيد</h3>
                        <div className="relative">
                            {milestones.map((milestone, index) => (
                                <MilestoneItem key={milestone.id} milestone={milestone} isLast={index === milestones.length - 1} />
                            ))}
                        </div>
                    </div>
                )}

                {hasImpactData && (
                    <div className={`bg-card dark:bg-dark-card/50 p-6 rounded-xl shadow-soft border dark:border-slate-700 ${milestones.length > 0 ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChart2 /> مؤشرات الأثر</h3>
                        <ImpactChart beneficiary={beneficiary} />
                    </div>
                )}
            </div>
             <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-soft p-6 border border-blue-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary dark:text-secondary-light">
                    <Sparkles />
                    رؤى ذكية وتحليلات
                </h3>
                {isLoadingInsights ? (
                    <div className="flex justify-center items-center h-48">
                        <Spinner text="جاري تحليل البيانات..." />
                    </div>
                ) : insights ? (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold">📊 التحليل</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{insights.analysis}</p>
                        </div>
                         <div>
                            <h4 className="font-bold">🔮 التوقع</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{insights.prediction}</p>
                        </div>
                         <div>
                            <h4 className="font-bold">💡 التوصية</h4>
                            <p className="text-sm font-semibold text-primary dark:text-secondary-light bg-primary-light/30 dark:bg-primary/10 p-3 rounded-lg">{insights.recommendation}</p>
                        </div>
                        <div className="text-center pt-2">
                             <button onClick={handleGenerateInsights} className="text-xs font-semibold text-gray-500 hover:underline">إعادة إنشاء</button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">احصل على تحليل مدعوم بالذكاء الاصطناعي لرحلة المستفيد والتوصيات المقترحة.</p>
                        <button onClick={handleGenerateInsights} className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                            <span className="flex items-center gap-2">
                                <Bot />
                                توليد الرؤى
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BeneficiaryJourneyTab;