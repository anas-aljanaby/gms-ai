import React, { useMemo } from 'react';
import { Target, PlusCircle, ChevronRight } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatNumber } from '../../../lib/utils';
import { BousalaIcon } from '../../icons/ModuleIcons';
import type { BousalaGoal, BousalaDirection } from '../../../types';
import StrategicDirectionCard from './StrategicDirectionCard';
import StatusBadge from './StatusBadge';
import ImpactRollup from './ImpactRollup';
import AiComingSoonCard from './AiComingSoonCard';
import BousalaSectionEmpty from './BousalaSectionEmpty';

interface BousalaOverviewProps {
    goals: BousalaGoal[];
    direction?: BousalaDirection;
    canEditDirection: boolean;
    canManage: boolean;
    isSavingDirection: boolean;
    onSaveDirection: (data: BousalaDirection) => void | Promise<void>;
    onAddGoal: () => void;
    onSelectGoal: (goalId: string) => void;
    setActiveModule: (module: string) => void;
}

function goalHealth(progress: number): 'onTrack' | 'atRisk' | 'offTrack' {
    if (progress >= 60) return 'onTrack';
    if (progress >= 30) return 'atRisk';
    return 'offTrack';
}

const BousalaOverview: React.FC<BousalaOverviewProps> = ({
    goals,
    direction,
    canEditDirection,
    canManage,
    isSavingDirection,
    onSaveDirection,
    onAddGoal,
    onSelectGoal,
    setActiveModule,
}) => {
    const { t, language } = useLocalization(['common', 'bousala']);

    const health = useMemo(() => {
        const counts = { onTrack: 0, atRisk: 0, offTrack: 0 };
        for (const goal of goals) counts[goalHealth(goal.progress)] += 1;
        const avgProgress = goals.length
            ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
            : 0;
        return { ...counts, avgProgress, total: goals.length };
    }, [goals]);

    const healthTiles = [
        { key: 'total', label: t('bousala.health.totalGoals'), value: health.total, className: 'text-foreground dark:text-dark-foreground' },
        { key: 'onTrack', label: t('bousala.health.onTrack'), value: health.onTrack, className: 'text-green-600 dark:text-green-400' },
        { key: 'atRisk', label: t('bousala.health.atRisk'), value: health.atRisk, className: 'text-amber-600 dark:text-amber-400' },
        { key: 'offTrack', label: t('bousala.health.offTrack'), value: health.offTrack, className: 'text-red-600 dark:text-red-400' },
        { key: 'avgProgress', label: t('bousala.health.avgProgress'), value: `${formatNumber(health.avgProgress, language)}%`, className: 'text-primary dark:text-secondary' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <BousalaIcon className="w-10 h-10" />
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-dark-foreground">{t('bousala.title')}</h1>
                        <p className="text-gray-500 text-sm mt-1">{t('bousala.linkedModules')}</p>
                    </div>
                </div>
                {canManage && (
                    <button
                        onClick={onAddGoal}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:brightness-110"
                    >
                        <PlusCircle size={16} /> {t('bousala.overview.addGoal')}
                    </button>
                )}
            </div>

            {(direction || canEditDirection) && (
                <StrategicDirectionCard
                    direction={direction}
                    canEdit={canEditDirection}
                    isSaving={isSavingDirection}
                    onSave={onSaveDirection}
                />
            )}

            <ImpactRollup setActiveModule={setActiveModule} />

            {goals.length === 0 ? (
                <BousalaSectionEmpty
                    title={t('bousala.empty.noGoals.title')}
                    description={t('bousala.empty.noGoals.description')}
                    actionLabel={canManage ? t('bousala.empty.noGoals.action') : undefined}
                    onAction={canManage ? onAddGoal : undefined}
                />
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                        {healthTiles.map((tile) => (
                            <div key={tile.key} className="bg-card dark:bg-dark-card rounded-xl shadow-soft border dark:border-slate-700/50 p-4">
                                <p className={`text-2xl font-bold tabular-nums ${tile.className}`}>{tile.value}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tile.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {goals.map((goal) => (
                            <button
                                key={goal.id}
                                type="button"
                                onClick={() => onSelectGoal(goal.id)}
                                className="w-full text-start bg-card dark:bg-dark-card rounded-xl shadow-soft border dark:border-slate-700/50 p-5 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <Target className="w-7 h-7 text-primary dark:text-secondary flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-bold text-lg truncate" dir="auto">{goal.title}</h3>
                                            <StatusBadge status={goal.status} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {goal.responsiblePerson && (
                                                <span dir="auto">{goal.responsiblePerson} · </span>
                                            )}
                                            {formatNumber(goal.kpis?.length ?? 0, language)} {t('bousala.overview.kpisLabel')} · {formatNumber(goal.linkedProjects.length, language)} {t('bousala.overview.projectsLabel')}
                                        </p>
                                    </div>
                                    <div className="hidden sm:block w-40 flex-shrink-0">
                                        <div className="flex justify-between text-xs font-semibold mb-1">
                                            <span>{t('bousala.common.progressLabel')}</span>
                                            <span>{formatNumber(goal.progress, language)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: `${goal.progress}%` }} />
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 rtl:rotate-180" />
                                </div>
                            </button>
                        ))}
                    </div>

                    <AiComingSoonCard />
                </div>
            )}
        </div>
    );
};

export default BousalaOverview;
