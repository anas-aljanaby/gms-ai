import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';

const SankeyDiagram: React.FC = () => {
    const { t } = useLocalization();

    return (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-slate-800 rounded-lg p-4">
            <p className="text-gray-500">{t('placeholder.underConstruction', { moduleName: 'Sankey Diagram' })}</p>
        </div>
    );
};

export default SankeyDiagram;
