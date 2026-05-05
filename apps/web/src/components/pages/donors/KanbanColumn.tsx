import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency, formatNumber } from '../../../lib/utils';
import type { Donor, DonorStageId } from '../../../types';
import KanbanCard from './KanbanCard';
import type { DonorKanbanStage, KanbanDensity } from './KanbanBoard';

interface KanbanColumnProps {
    stage: DonorKanbanStage;
    donors: Donor[];
    onDragEnd: (donorId: number, targetStageId: DonorStageId) => void;
    stages: DonorKanbanStage[];
    density: KanbanDensity;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, donors, onDragEnd, stages, density }) => {
    const { t, language } = useLocalization(['common', 'donors']);
    const [isFocused, setIsFocused] = useState(false);
    const { isOver, setNodeRef } = useDroppable({
        id: `stage:${stage.id}`,
        data: { type: 'stage', stageId: stage.id },
    });

    const totalPotential = donors.reduce((sum, donor) => sum + donor.potentialGift, 0);
    const donorsMissingNextTask = donors.filter(donor => !donor.tasks.some(task => !task.completed)).length;
    const isCompact = density === 'compact';
    const isActiveTarget = isOver || isFocused;
    
    return (
        <div
            ref={setNodeRef}
            id={`kanban-column-${stage.id}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`h-full flex flex-col rounded-lg border transition-colors ${
                isCompact ? 'min-w-[14.25rem] max-w-[14.25rem]' : 'min-w-[21rem] max-w-[21rem]'
            } ${
                isActiveTarget
                    ? 'border-primary bg-primary-light/50 shadow-inner dark:border-secondary dark:bg-primary/20'
                    : 'border-transparent'
            }`}
        >
            <div className={`${isCompact ? 'p-2.5' : 'p-3'} sticky top-0 z-10 rounded-t-lg border-b-4 ${stage.border} ${stage.color}`}>
                <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className={`${isCompact ? 'text-sm' : ''} font-bold text-foreground dark:text-dark-foreground truncate`}>{t(stage.titleKey)}</h2>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-black/20 px-2 py-0.5 rounded-full">
                                {formatNumber(donors.length, language)}
                            </span>
                        </div>
                        <p className={`${isCompact ? 'mt-0.5' : 'mt-1'} text-xs font-medium text-gray-500 dark:text-gray-400 truncate`}>
                            {t('donors.kanban.columnPotential')}: {formatCurrency(totalPotential, language)}
                        </p>
                    </div>
                    {donorsMissingNextTask > 0 && !isCompact && (
                        <span className="shrink-0 rounded-full bg-white/70 dark:bg-black/20 px-2 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-200">
                            {formatNumber(donorsMissingNextTask, language)} {t('donors.kanban.noNextActionShort')}
                        </span>
                    )}
                </div>
            </div>

            <div className={`flex-grow ${isCompact ? 'p-1.5 space-y-2 min-h-[24rem] max-h-[calc(100vh-22rem)]' : 'p-2 space-y-3 min-h-[28rem] max-h-[calc(100vh-20rem)]'} overflow-y-auto bg-gray-100/50 dark:bg-dark-background/50 rounded-b-lg`}>
                {donors.map(donor => (
                    <KanbanCard
                        key={donor.id}
                        donor={donor}
                        density={density}
                        stages={stages}
                        onMoveDonor={onDragEnd}
                    />
                ))}
                {donors.length === 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 dark:border-slate-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        {t('donors.kanban.emptyColumn')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
