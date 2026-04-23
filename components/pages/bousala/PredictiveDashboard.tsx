import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocalization } from '../../../hooks/useLocalization';
import { useTheme } from '../../../hooks/useTheme';
import type { BousalaGoal, Language } from '../../../types';
import { formatNumber } from '../../../lib/utils';
import GaugeChart from '../../common/GaugeChart';
import AiCard from '../ai/AiCard';
import { AlertCircle, Bot, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface PredictiveDashboardProps {
    goals: BousalaGoal[];
}

const mockForecastHistory = [
    { name: 'Jan', forecast: 68 },
    { name: 'Feb', forecast: 72 },
    { name: 'Mar', forecast: 71 },
    { name: 'Apr', forecast: 75 },
    { name: 'May', forecast: 78 },
    { name: 'Jun', forecast: 81 },
    { name: 'Jul', forecast: 82 },
];


const PredictiveDashboard: React.FC<PredictiveDashboardProps> = ({ goals }) => {
    const { t } = useLocalization();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#334155';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';


    const overallForecast = useMemo(() => {
        const predictions = goals.map(g => g.prediction?.probability || 0).filter(p => p > 0);
        if (predictions.length === 0) return 0;
        return Math.round(predictions.reduce((a, b) => a + b, 0) / predictions.length);
    }, [goals]);

    const atRiskGoals = useMemo(() => {
        return goals
            .filter(g => g.prediction && g.prediction.probability < 70)
            .sort((a, b) => (a.prediction?.probability || 100) - (b.prediction?.probability || 100))
            .slice(0, 3);
    }, [goals]);
    
    const recommendations = useMemo(() => {
        return goals.map(g => g.prediction?.recommendation).filter(Boolean);
    }, [goals]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overall Forecast */}
                <div className="lg:col-span-1 bg-card dark:bg-dark-card/50 p-6 rounded-2xl shadow-soft border dark:border-slate-700 flex flex-col items-center justify-center">
                    <h3 className="font-bold text-lg mb-2">ملخص التوقعات الإجمالي</h3>
                    <GaugeChart value={overallForecast} label="احتمالية نجاح الأهداف" size={250} />
                </div>
                
                {/* Top At-Risk Goals */}
                <div className="lg:col-span-2 bg-card dark:bg-dark-card/50 p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><AlertCircle className="text-red-500" /> أبرز 3 أهداف في خطر</h3>
                     <div className="space-y-4">
                        {atRiskGoals.length > 0 ? atRiskGoals.map(goal => (
                             <div key={goal.id} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold" dir="auto">{goal.title}</h4>
                                    <span className="font-bold text-red-600">{goal.prediction?.probability}%</span>
                                </div>
                                 <p className="text-xs text-gray-500 mt-1" dir="auto">{goal.description}</p>
                            </div>
                        )) : <p className="text-center text-gray-500 py-10">لا توجد أهداف في خطر حالياً.</p>}
                     </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                 {/* Forecast Change Over Time */}
                <div className="lg:col-span-3 bg-card dark:bg-dark-card/50 p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
                    <h3 className="font-bold text-lg mb-4">تغير التوقعات بمرور الوقت</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <LineChart data={mockForecastHistory}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: textColor }} />
                            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: textColor }} />
                            <RechartsTooltip formatter={(value) => `${value}%`} />
                            <Legend />
                            <Line type="monotone" dataKey="forecast" name="متوسط احتمال النجاح" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                {/* AI Recommendation Summary */}
                <div className="lg:col-span-2 bg-card dark:bg-dark-card/50 p-6 rounded-2xl shadow-soft border dark:border-slate-700/50">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Bot className="text-primary"/> ملخص توصيات الذكاء الاصطناعي</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {recommendations.length > 0 ? recommendations.map((rec, i) => (
                            <div key={i} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                                <p dir="auto">{rec}</p>
                            </div>
                        )) : <p className="text-center text-gray-500 py-10">لا توجد توصيات متاحة حالياً.</p>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PredictiveDashboard;
