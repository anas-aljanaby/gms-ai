
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLocalization } from '../../../hooks/useLocalization';
import { useTheme } from '../../../hooks/useTheme';
import type { Project } from '../../../types';
import { MOCK_PROGRAM_DATA } from '../../../data/programData';
import { formatCurrency, formatNumber } from '../../../lib/utils';
import { useCountUp } from '../../../hooks/useCountUp';
import { Target, Users, DollarSign, BarChart3 as BarChartIcon } from 'lucide-react';

const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft border dark:border-slate-700/50">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-light dark:bg-primary/20 text-primary dark:text-secondary rounded-lg">{icon}</div>
            <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h4>
                <p className="text-3xl font-bold text-foreground dark:text-dark-foreground">{value}</p>
            </div>
        </div>
    </div>
);

const SDGAlignmentDashboard: React.FC<{ projects: Project[] }> = ({ projects }) => {
    const { t, language } = useLocalization();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [selectedSdg, setSelectedSdg] = useState<number | null>(null);

    const sdgData = MOCK_PROGRAM_DATA.sdgs;
    
    const projectsBySdg = useMemo(() => {
        const map = new Map<number, Project[]>();
        projects.forEach(p => {
            p.sdgGoals?.forEach(goalId => {
                if (!map.has(goalId)) {
                    map.set(goalId, []);
                }
                map.get(goalId)!.push(p);
            });
        });
        return map;
    }, [projects]);

    const stats = useMemo(() => {
        const alignedProjects = projects.filter(p => p.sdgGoals && p.sdgGoals.length > 0);
        const totalBudget = alignedProjects.reduce((sum, p) => sum + p.budget, 0);
        
        let mostTargetedSdgId = 0;
        let maxCount = 0;
        projectsBySdg.forEach((projs, sdgId) => {
            if (projs.length > maxCount) {
                maxCount = projs.length;
                mostTargetedSdgId = sdgId;
            }
        });
        const mostTargetedSdg = sdgData.find(s => s.id === mostTargetedSdgId);

        return {
            totalAligned: alignedProjects.length,
            totalBudget,
            mostTargeted: mostTargetedSdg ? `${mostTargetedSdg.id}` : 'N/A',
        };
    }, [projects, projectsBySdg, sdgData]);

    const budgetChartData = useMemo(() => {
        const data: { name: string; budget: number; color: string }[] = [];
        projectsBySdg.forEach((projs, sdgId) => {
            const sdg = sdgData.find(s => s.id === sdgId);
            if (sdg) {
                const totalBudget = projs.reduce((sum, p) => sum + p.budget, 0);
                if (totalBudget > 0) {
                     data.push({ name: `SDG ${sdg.id}`, budget: totalBudget, color: sdg.color });
                }
            }
        });
        return data.sort((a,b) => b.budget - a.budget);
    }, [projectsBySdg, sdgData]);
    
    const filteredProjects = selectedSdg ? projectsBySdg.get(selectedSdg) || [] : projects.filter(p => p.sdgGoals && p.sdgGoals.length > 0);
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title={t('sdg_analytics.kpi.aligned_projects')} value={formatNumber(useCountUp(stats.totalAligned, 1500), language)} icon={<Users />} />
                <KpiCard title={t('sdg_analytics.kpi.total_budget')} value={formatCurrency(useCountUp(stats.totalBudget, 1500), language)} icon={<DollarSign />} />
                <KpiCard title={t('sdg_analytics.kpi.most_targeted')} value={stats.mostTargeted} icon={<Target />} />
                <KpiCard title={t('sdg_analytics.kpi.alignment_score')} value={`${formatNumber(useCountUp(82, 1500), language)}%`} icon={<BarChartIcon />} />
            </div>

            <div className="bg-card dark:bg-dark-card rounded-xl p-4 shadow-soft border dark:border-slate-700/50">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">{t('sdg_analytics.grid.title')}</h3>
                    {selectedSdg && <button onClick={() => setSelectedSdg(null)} className="text-sm font-semibold text-primary">{t('sdg_analytics.grid.clear')}</button>}
                 </div>
                 <div className="grid grid-cols-6 md:grid-cols-9 lg:grid-cols-17 gap-2">
                    {sdgData.map(sdg => {
                        const projectCount = projectsBySdg.get(sdg.id)?.length || 0;
                        return (
                        <button 
                            key={sdg.id} 
                            onClick={() => setSelectedSdg(sdg.id)} 
                            className={`relative aspect-square rounded-md transition-all duration-300 transform hover:scale-110 ${selectedSdg === sdg.id ? 'ring-4 ring-offset-2 ring-primary dark:ring-secondary' : 'hover:shadow-lg'} ${projectCount === 0 ? 'grayscale opacity-50' : ''}`}
                            style={{backgroundColor: sdg.color}}
                            title={`SDG ${sdg.id}: ${sdg.name}`}
                        >
                            <span className="sr-only">{sdg.name}</span>
                            {projectCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center border-2" style={{borderColor: sdg.color}}>
                                    {projectCount}
                                </div>
                            )}
                        </button>
                    )})}
                 </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-card dark:bg-dark-card p-6 rounded-xl shadow-soft border dark:border-slate-700/50">
                    <h3 className="font-bold mb-4">{t('sdg_analytics.chart.title')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={budgetChartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'} />
                            <XAxis type="number" tickFormatter={(val) => formatCurrency(val, language, 'USD')} tick={{ fill: isDark ? '#A0AEC0' : '#4A5568' }} />
                            <YAxis type="category" dataKey="name" width={60} tick={{ fill: isDark ? '#A0AEC0' : '#4A5568' }} />
                            <Tooltip formatter={(value: unknown) => {
                                const numericValue = Number(value);
                                if (isNaN(numericValue)) {
                                    return String(value);
                                }
                                return formatCurrency(numericValue, language);
                            }} cursor={{fill: 'rgba(128,128,128,0.1)'}} />
                            <Bar dataKey="budget">
                                {budgetChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft border dark:border-slate-700/50">
                    <h3 className="font-bold mb-4">{selectedSdg ? t('sdg_analytics.list.title', { sdg: selectedSdg }) : t('sdg_analytics.list.title_all')}</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {filteredProjects.length > 0 ? filteredProjects.map(p => (
                             <div key={p.id} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                <p className="font-semibold truncate">{p.name[language]}</p>
                                <div className="flex justify-between text-xs mt-1">
                                    <span>{formatCurrency(p.budget, language)}</span>
                                    <span>Progress: {p.progress}%</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {p.sdgGoals?.map(goalId => (
                                        <div key={goalId} className="w-4 h-4 rounded-sm" style={{backgroundColor: sdgData.find(s=>s.id===goalId)?.color || '#ccc'}} title={`SDG ${goalId}`}></div>
                                    ))}
                                </div>
                            </div>
                        )) : <p className="text-sm text-center text-gray-500 py-10">{t('sdg_analytics.list.placeholder')}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SDGAlignmentDashboard;