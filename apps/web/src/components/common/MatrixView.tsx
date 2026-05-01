import React, { useState, useEffect } from 'react';
import type { Language } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';
import { useTheme } from '../../hooks/useTheme';

interface MatrixViewProps {
  mode: 'dark' | 'light';
}

const MatrixView: React.FC<MatrixViewProps> = ({ mode }) => {
  const { t, language } = useLocalization();
  const isRTL = language === 'ar';

  const canonicalColumns: string[] = ["governance", "finance", "programs", "resources"];
  const canonicalRows: string[] = ["performance", "risk", "compliance", "trend"];
  const displayColumns = isRTL ? [...canonicalColumns].reverse() : canonicalColumns;

  const mockData: any = {
    performance: {
      governance: { status: 'good', value: 95 },
      finance: { status: 'warning', value: 75 },
      programs: { status: 'good', value: 88 },
      resources: { status: 'danger', value: 45 }
    },
    risk: {
      governance: { status: 'warning', value: 60 },
      finance: { status: 'danger', value: 30 },
      programs: { status: 'good', value: 80 },
      resources: { status: 'warning', value: 65 }
    },
    compliance: {
      governance: { status: 'good', value: 100 },
      finance: { status: 'good', value: 92 },
      programs: { status: 'warning', value: 70 },
      resources: { status: 'good', value: 85 }
    },
    trend: {
      governance: { status: 'good', value: 90 },
      finance: { status: 'warning', value: 55 },
      programs: { status: 'danger', value: 50 },
      resources: { status: 'good', value: 78 }
    }
  };

  const statusColorMap: any = {
    good: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground mb-4">
        {t('matrix.title')}
      </h2>
      <div className="bg-card dark:bg-dark-card rounded-2xl shadow-soft overflow-hidden border border-gray-200 dark:border-slate-700/50">
        {/* Desktop Table View */}
        <table className="hidden md:table w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-slate-800">
            <tr>
                <th className="p-3 border-b border-r border-gray-200 dark:border-gray-700 w-1/5"></th>
                {displayColumns.map(colKey => (
                <th key={colKey} className="p-3 border-b border-r border-gray-200 dark:border-gray-700 font-bold text-center text-foreground dark:text-dark-foreground">
                    {t(`matrix.${colKey}`)}
                </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {canonicalRows.map(rowKey => (
                <tr key={rowKey} className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                <td className={`p-3 border-r border-gray-200 dark:border-gray-700 font-bold text-center text-foreground dark:text-dark-foreground`}>
                    {t(`matrix.${rowKey}`)}
                </td>
                {displayColumns.map(colKey => {
                    const cellData = mockData[rowKey]?.[colKey];
                    const colorClass = statusColorMap[cellData.status] || 'bg-gray-400';
                    return (
                    <td key={`${rowKey}-${colKey}`} className="p-3 border-r border-gray-200 dark:border-gray-700 text-center font-semibold text-lg">
                    <div className="relative group flex items-center justify-center gap-2">
                        <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 bg-foreground dark:bg-dark-card text-background dark:text-dark-foreground text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                            {`${t(`matrix.${rowKey}`)} - ${t(`matrix.${colKey}`)}: ${cellData.status.charAt(0).toUpperCase() + cellData.status.slice(1)} (${cellData.value})`}
                        </div>
                        <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                        <span className="text-foreground dark:text-dark-foreground">{cellData?.value}</span>
                    </div>
                    </td>
                    );
                })}
                </tr>
            ))}
            </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4 p-4">
            {canonicalRows.map(rowKey => (
            <div key={rowKey} className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground mb-3 text-start">{t(`matrix.${rowKey}`)}</h3>
                <div className="flex flex-col gap-2">
                {canonicalColumns.map(colKey => {
                    const cellData = mockData[rowKey]?.[colKey];
                    const colorClass = statusColorMap[cellData.status] || 'bg-gray-400';
                    
                    return (
                    <div key={`${rowKey}-${colKey}`} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-slate-800 rounded-md">
                        <span className="text-gray-600 dark:text-gray-400">{t(`matrix.${colKey}`)}</span>
                        <div className="relative group flex items-center justify-center gap-2 font-semibold">
                        <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 bg-foreground dark:bg-dark-card text-background dark:text-dark-foreground text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                            {`${t(`matrix.${rowKey}`)} - ${t(`matrix.${colKey}`)}: ${cellData.status.charAt(0).toUpperCase() + cellData.status.slice(1)} (${cellData.value})`}
                        </div>
                        <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                        <span className="text-foreground dark:text-dark-foreground">{cellData?.value}</span>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MatrixView;