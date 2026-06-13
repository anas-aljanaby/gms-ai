import React, { useMemo } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useTheme } from '../../../contexts/DashboardContext';
import type { GrcRisk } from '../../../types';
import { getMatrixCellColor } from './utils';

interface RiskMatrixProps {
  risks: GrcRisk[];
  onCellClick: (cell: { impact: number; probability: number }) => void;
  activeCell: { impact: number; probability: number } | null;
}

const RiskMatrix: React.FC<RiskMatrixProps> = ({ risks, onCellClick, activeCell }) => {
  const { t } = useLocalization(['common', 'grc', 'projects']);
  const { theme } = useTheme();

  const grid = useMemo(() => {
    const counts = Array.from({ length: 5 }, () => Array(5).fill(0));
    risks.forEach((risk) => {
      const impactIdx = risk.impact - 1;
      const probIdx = risk.probability - 1;
      if (counts[impactIdx]?.[probIdx] !== undefined) {
        counts[impactIdx][probIdx]++;
      }
    });
    return counts;
  }, [risks]);

  return (
    <div className="bg-card dark:bg-dark-card p-4 rounded-xl shadow-soft border dark:border-slate-700/50 max-w-md mx-auto">
      <h3 className="font-bold text-lg mb-2 text-center text-foreground dark:text-dark-foreground">
        {t('grc.dashboard.riskMatrix')}
      </h3>
      <div className="flex">
        <div className="flex items-center justify-center pr-1 rtl:pr-0 rtl:pl-1">
          <div className="transform -rotate-90 whitespace-nowrap font-bold text-sm text-gray-600 dark:text-gray-400">
            {t('projects.risks.impact')}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex">
            <div className="grid grid-rows-5 text-xs font-bold text-gray-500 dark:text-gray-400 w-6 flex-shrink-0">
              {[5, 4, 3, 2, 1].map((n) => (
                <div key={n} className="flex items-center justify-center">
                  {n}
                </div>
              ))}
            </div>
            <div className="flex-grow grid grid-cols-5 grid-rows-5 gap-1 aspect-square">
              {grid
                .slice()
                .reverse()
                .map((row, rowIdx) =>
                  row.map((count, colIdx) => {
                    const impact = 5 - rowIdx;
                    const probability = colIdx + 1;
                    const score = impact * probability;
                    const { bg, text } = getMatrixCellColor(score, theme);
                    const isActive =
                      activeCell?.impact === impact && activeCell?.probability === probability;

                    return (
                      <button
                        key={`${rowIdx}-${colIdx}`}
                        type="button"
                        onClick={() => onCellClick({ impact, probability })}
                        className={`flex items-center justify-center rounded-sm transition-all ${
                          isActive ? 'ring-2 ring-primary scale-110' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: bg }}
                        title={t('grc.dashboard.riskCount', { count })}
                      >
                        {count > 0 && <span className={`font-bold text-lg ${text}`}>{count}</span>}
                      </button>
                    );
                  }),
                )}
            </div>
          </div>
          <div className="ml-6 rtl:ml-0 rtl:mr-6">
            <div className="grid grid-cols-5 text-center text-xs font-bold mt-1 text-gray-500 dark:text-gray-400">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            <div className="text-center font-bold text-sm mt-1 text-gray-600 dark:text-gray-400">
              {t('projects.risks.probability')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;
