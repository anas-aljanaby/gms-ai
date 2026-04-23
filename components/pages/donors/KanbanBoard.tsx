import React from 'react';
import type { Donor, DonorStageId } from '../../../types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
    donors: Donor[];
    stages: { id: DonorStageId; titleKey: string; color: string; border: string; }[];
    onDragEnd: (donorId: number, targetStageId: DonorStageId) => void;
    dispatch: React.Dispatch<any>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ donors, stages, onDragEnd, dispatch }) => {
    return (
        <div className="flex-grow pb-4">
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))]">
                {stages.map(stage => {
                    const stageDonors = donors.filter(d => d.stage === stage.id);
                    return (
                        <KanbanColumn
                            key={stage.id}
                            stage={stage}
                            donors={stageDonors}
                            onDragEnd={onDragEnd}
                            dispatch={dispatch}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default KanbanBoard;