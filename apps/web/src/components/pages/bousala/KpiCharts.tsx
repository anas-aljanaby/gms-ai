

import React, { useState, useMemo } from 'react';
import {
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
    LineChart, Line,
    PieChart, Pie, Cell,
} from 'recharts';
import { useLocalization } from '../../../hooks/useLocalization';
import { useTheme } from '../../../hooks/useTheme';
import type { BousalaGoal, BousalaKpi } from '../../../types';

interface KpiChartsProps {
    goals: BousalaGoal[];
}

// Mock time series data for the line chart (keyed by KPI title from seed data)
const mockKpiHistory: Record<string, { date: string; value: number }[]> = {
    'عدد المستفيدين الفعليين من البرامج التعليمية': [
        { date: 'يناير', value: 180 }, { date: 'فبراير', value: 210 }, { date: 'مارس', value: 235 },
        { date: 'أبريل', value: 260 }, { date: 'مايو', value: 285 },
    ],
    'نسبة تحقيق مخرجات الربع الحالي': [
        { date: 'يناير', value: 58 }, { date: 'فبراير', value: 62 }, { date: 'مارس', value: 66 },
        { date: 'أبريل', value: 69 }, { date: 'مايو', value: 72 },
    ],
    'نسبة الالتزام بالخطة الزمنية': [
        { date: 'يناير', value: 62 }, { date: 'فبراير', value: 64 }, { date: 'مارس', value: 65 },
        { date: 'أبريل', value: 67 }, { date: 'مايو', value: 68 },
    ],
    'نسبة الصرف مقابل التقدم': [
        { date: 'يناير', value: 88 }, { date: 'فبراير', value: 86 }, { date: 'مارس', value: 85 },
        { date: 'أبريل', value: 83 }, { date: 'مايو', value: 82 },
    ],
    'معدل إغلاق المهام في الوقت المحدد': [
        { date: 'يناير', value: 66 }, { date: 'فبراير', value: 68 }, { date: 'مارس', value: 70 },
        { date: 'أبريل', value: 72 }, { date: 'مايو', value: 74 },
    ],
    'نسبة المشاريع ذات التقارير المنتظمة': [
        { date: 'يناير', value: 42 }, { date: 'فبراير', value: 46 }, { date: 'مارس', value: 50 },
        { date: 'أبريل', value: 54 }, { date: 'مايو', value: 58 },
    ],
};

const KpiCharts: React.FC<KpiChartsProps> = ({ goals }) => {
    const { t, language } = useLocalization();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#334155';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    const allKpis = useMemo(() => goals.flatMap(g => g.kpis || []), [goals]);
    
    const [selectedKpiId, setSelectedKpiId] = useState<string>(allKpis[0]?.id || '');

    const barChartData = useMemo(() => allKpis.map(kpi => ({
        // FIX: Changed kpi.titleKey to kpi.title and removed t() wrapper.
        name: kpi.title,
        [t('bousala.kpiCharts.actual')]: kpi.value,
        [t('bousala.kpiCharts.target')]: kpi.target,
    })), [allKpis, t]);
    
    const lineChartData = useMemo(() => {
        const selected = allKpis.find(kpi => kpi.id === selectedKpiId);
        if (!selected) return [];
        return mockKpiHistory[selectedKpiId] ?? mockKpiHistory[selected.title] ?? [];
    }, [allKpis, selectedKpiId]);

    const pieChartData = useMemo(() => {
        const achieved = allKpis.filter(kpi => kpi.value >= kpi.target).length;
        const notAchieved = allKpis.length - achieved;
        return [
            { name: t('bousala.kpiCharts.achieved'), value: achieved },
            { name: t('bousala.kpiCharts.notAchieved'), value: notAchieved },
        ];
    }, [allKpis, t]);
    const PIE_COLORS = ['hsl(145, 63%, 49%)', 'hsl(210, 40%, 50%)'];
    
    const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2 rounded-lg border border-gray-200 dark:border-slate-700 shadow-lg text-sm">
              <p className="font-bold">{label}</p>
              {payload.map((p: any, i: number) => (
                  <p key={i} style={{ color: p.color }}>{`${p.name}: ${p.value}`}</p>
              ))}
            </div>
          );
        }
        return null;
    };

    return (
        <div className="space-y-8">
            {/* Bar Chart */}
            <div>
                <h4 className="font-bold text-lg mb-2">{t('bousala.kpiCharts.actualVsTarget')}</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 10 }} />
                        <YAxis tick={{ fill: textColor }} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey={t('bousala.kpiCharts.actual')} fill="hsl(145, 63%, 49%)" />
                        <Bar dataKey={t('bousala.kpiCharts.target')} fill="hsl(210, 40%, 50%)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Line Chart */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                         <h4 className="font-bold text-lg">{t('bousala.kpiCharts.trendOverTime')}</h4>
                         <select 
                            value={selectedKpiId}
                            onChange={(e) => setSelectedKpiId(e.target.value)}
                            className="p-1 text-xs border rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-600"
                        >
                            {/* FIX: Changed t(kpi.titleKey) to kpi.title. */}
                            {allKpis.map(kpi => <option key={kpi.id} value={kpi.id}>{kpi.title}</option>)}
                         </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 12 }} />
                            <YAxis tick={{ fill: textColor }} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="hsl(210, 40%, 50%)" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                 {/* Pie Chart */}
                <div>
                    <h4 className="font-bold text-lg mb-2 text-center">{t('bousala.kpiCharts.achievedTargetsPercent')}</h4>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie 
                                data={pieChartData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                outerRadius={100} 
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default KpiCharts;