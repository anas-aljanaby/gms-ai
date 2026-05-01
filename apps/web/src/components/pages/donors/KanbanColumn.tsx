import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency, formatNumber } from '../../../lib/utils';
import type { Donor, DonorStageId } from '../../../types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
    stage: { id: DonorStageId; titleKey: string; color: string; border: string; };
    donors: Donor[];
    onDragEnd: (donorId: number, targetStageId: DonorStageId) => void;
    dispatch: React.Dispatch<any>;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, donors, onDragEnd, dispatch }) => {
    const { t, language } = useLocalization();
    const [isDragOver, setIsDragOver] = useState(false);

    const totalPotential = donors.reduce((sum, donor) => sum + donor.potentialGift, 0);

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
            className={`h-full flex flex-col rounded-xl transition-colors ${isDragOver ? 'bg-primary-light/50 dark:bg-primary/20' : ''}`}
        >
            <div className={`flex justify-between items-center p-3 rounded-t-lg border-b-4 ${stage.border} ${stage.color}`}>
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-foreground dark:text-dark-foreground">{t(stage.titleKey)}</h2>
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full">
                        {formatNumber(donors.length, language)}
                    </span>
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{formatCurrency(totalPotential, language)}</span>
            </div>

            <div className="flex-grow p-2 space-y-3 overflow-y-auto bg-gray-100/50 dark:bg-dark-background/50 rounded-b-lg">
                {donors.map(donor => (
                    <KanbanCard key={donor.id} donor={donor} dispatch={dispatch} />
                ))}
            </div>
        </div>
    );
};

export default KanbanColumn;
