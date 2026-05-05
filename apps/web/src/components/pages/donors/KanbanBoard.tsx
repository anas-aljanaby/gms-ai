import React from 'react';
import type { Donor, DonorStageId } from '../../../types';
import KanbanColumn from './KanbanColumn';

export interface DonorKanbanStage {
    id: DonorStageId;
    titleKey: string;
    color: string;
    border: string;
}

interface KanbanBoardProps {
    donors: Donor[];
    stages: DonorKanbanStage[];
    onDragEnd: (donorId: number, targetStageId: DonorStageId) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ donors, stages, onDragEnd }) => {
    return (
        <div className="flex-grow pb-4">
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
                {stages.map(stage => {
                    const stageDonors = donors.filter(d => d.stage === stage.id);
                    return (
                        <KanbanColumn
                            key={stage.id}
                            stage={stage}
                            donors={stageDonors}
                            onDragEnd={onDragEnd}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default KanbanBoard;
