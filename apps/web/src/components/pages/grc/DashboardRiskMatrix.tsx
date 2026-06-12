import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import type { GrcRisk } from '../../../types';

interface DashboardRiskMatrixProps {
  risks: GrcRisk[];
}

const impactMap: Record<number, 'low' | 'medium' | 'high'> = {
  1: 'low',
  2: 'low',
  3: 'medium',
  4: 'high',
  5: 'high',
};

const levelIndex = { low: 0, medium: 1, high: 2 };

const cellColors = [
  ['bg-green-100 dark:bg-green-900/40', 'bg-yellow-100 dark:bg-yellow-900/40', 'bg-orange-100 dark:bg-orange-900/40'],
  ['bg-yellow-100 dark:bg-yellow-900/40', 'bg-orange-100 dark:bg-orange-900/40', 'bg-red-100 dark:bg-red-900/40'],
  ['bg-orange-100 dark:bg-orange-900/40', 'bg-red-100 dark:bg-red-900/40', 'bg-red-200 dark:bg-red-900/60'],
];

const DashboardRiskMatrix: React.FC<DashboardRiskMatrixProps> = ({ risks }) => {
  const { t } = useLocalization(['common', 'grc', 'projects']);

  const grid: GrcRisk[][][] = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => []),
  );

  risks.forEach((risk) => {
    const impactLevel = impactMap[risk.impact] || 'low';
    const probLevel = impactMap[risk.probability] || 'low';
    const row = levelIndex[impactLevel];
    const col = levelIndex[probLevel];
    grid[row]?.[col]?.push(risk);
  });

  return (
    <div>
      <h4 className="font-bold text-center mb-2">{t('grc.dashboard.riskMatrix')}</h4>
      <div className="flex">
        <div className="flex flex-col-reverse justify-around text-xs font-bold -mr-2 items-center">
          {(['low', 'medium', 'high'] as const).map((level) => (
            <div key={level} className="transform -rotate-90">
              {t(`projects.risks.levels.${level}`)}
            </div>
          ))}
          <div className="transform -rotate-90 font-bold text-sm text-gray-600 dark:text-gray-400">
            {t('projects.risks.impact')}
          </div>
        </div>
        <div className="flex-grow">
          <div className="grid grid-cols-3 grid-rows-3 gap-1 aspect-square border-2 dark:border-slate-600 p-1 rounded-md">
            {grid
              .slice()
              .reverse()
              .map((row, rowIdx) =>
                row.map((cell, colIdx) => (
                  <div
                    key={`${2 - rowIdx}-${colIdx}`}
                    className={`flex items-center justify-center p-1 rounded-sm ${cellColors[2 - rowIdx][colIdx]}`}
                  >
                    {cell.length > 0 && (
                      <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
                        {cell.length}
                      </span>
                    )}
                  </div>
                )),
              )}
          </div>
          <div className="grid grid-cols-3 text-center text-xs font-bold mt-1">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <span key={level}>{t(`projects.risks.levels.${level}`)}</span>
            ))}
          </div>
          <div className="text-center font-bold text-sm mt-1 text-gray-600 dark:text-gray-400">
            {t('projects.risks.probability')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRiskMatrix;
