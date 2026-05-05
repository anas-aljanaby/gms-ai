import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency, formatNumber } from '../../../lib/utils';
import type { Donor, DonorStageId } from '../../../types';
import KanbanCard from './KanbanCard';
import type { DonorKanbanStage } from './KanbanBoard';

interface KanbanColumnProps {
    stage: DonorKanbanStage;
    donors: Donor[];
    onDragEnd: (donorId: number, targetStageId: DonorStageId) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, donors, onDragEnd }) => {
    const { t, language } = useLocalization(['common', 'donors']);
    const [isDragOver, setIsDragOver] = useState(false);

    const totalPotential = donors.reduce((sum, donor) => sum + donor.potentialGift, 0);
    const donorsMissingNextTask = donors.filter(donor => !donor.tasks.some(task => !task.completed)).length;

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const donorId = parseInt(e.dataTransfer.getData('donorId'), 10);
        if (donorId) {
            onDragEnd(donorId, stage.id);
        }
    };
    
    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`h-full min-w-[21rem] max-w-[21rem] snap-start flex flex-col rounded-lg transition-colors ${isDragOver ? 'bg-primary-light/50 dark:bg-primary/20' : ''}`}
        >
            <div className={`p-3 rounded-t-lg border-b-4 ${stage.border} ${stage.color}`}>
                <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="font-bold text-foreground dark:text-dark-foreground truncate">{t(stage.titleKey)}</h2>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-black/20 px-2 py-0.5 rounded-full">
                                {formatNumber(donors.length, language)}
                            </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t('donors.kanban.columnPotential')}: {formatCurrency(totalPotential, language)}
                        </p>
                    </div>
                    {donorsMissingNextTask > 0 && (
                        <span className="shrink-0 rounded-full bg-white/70 dark:bg-black/20 px-2 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-200">
                            {formatNumber(donorsMissingNextTask, language)} {t('donors.kanban.noNextActionShort')}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-grow p-2 space-y-3 overflow-y-auto bg-gray-100/50 dark:bg-dark-background/50 rounded-b-lg min-h-[28rem]">
                {donors.map(donor => (
                    <KanbanCard key={donor.id} donor={donor} />
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
