import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project, Risk, RiskLevel } from '../../../../types';
import AiCard from '../../ai/AiCard';

interface RiskManagementTabProps {
    project: Project;
}

const levelMap: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2 };
const scoreMap: Record<RiskLevel, number> = { low: 1, medium: 2, high: 3 };

const RiskManagementTab: React.FC<RiskManagementTabProps> = ({ project }) => {
    const { t } = useLocalization();
    const risks = project.riskManagement.riskRegister;

    const riskMatrix: (Risk[])[][] = [[], [], []];
    risks.forEach(risk => {
        const impactIndex = levelMap[risk.impact];
        const probIndex = levelMap[risk.probability];
        if (!riskMatrix[impactIndex]) riskMatrix[impactIndex] = [[],[],[]];
        if (!riskMatrix[impactIndex][probIndex]) riskMatrix[impactIndex][probIndex] = [];
        riskMatrix[impactIndex][probIndex].push(risk);
    });

    const getRiskScore = (risk: Risk) => scoreMap[risk.probability] * scoreMap[risk.impact];
    const topRisks = [...risks].sort((a, b) => getRiskScore(b) - getRiskScore(a)).slice(0, 5);
    
    const matrixColors = [
        ['bg-green-100 dark:bg-green-900/40', 'bg-yellow-100 dark:bg-yellow-900/40', 'bg-orange-100 dark:bg-orange-900/40'],
        ['bg-yellow-100 dark:bg-yellow-900/40', 'bg-orange-100 dark:bg-orange-900/40', 'bg-red-100 dark:bg-red-900/40'],
        ['bg-orange-100 dark:bg-orange-900/40', 'bg-red-100 dark:bg-red-900/40', 'bg-red-200 dark:bg-red-900/60'],
    ];

    const LevelBadge: React.FC<{level: RiskLevel}> = ({level}) => {
        const styles = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-0.5 text-xs font-semibold rounded ${styles[level]}`}>{t(`projects.risks.levels.${level}`)}</span>;
    }

    return (
        <div className="space-y-6">
            <AiCard title={t('projects.risks.dashboard')}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-center mb-2">{t('projects.risks.matrix')}</h4>
                        <div className="flex">
                            <div className="flex flex-col-reverse justify-around text-xs font-bold -mr-2">
                                {(['low', 'medium', 'high'] as RiskLevel[]).map(level => <div key={level} className="transform -rotate-90 ">{t(`projects.risks.levels.${level}`)}</div>)}
                                <div className="transform -rotate-90 font-bold text-sm">{t('projects.risks.impact')}</div>
                            </div>
                            <div className="flex-grow">
                                <div className="grid grid-cols-3 grid-rows-3 gap-1 aspect-square border-2 dark:border-slate-600 p-1 rounded-md">
                                    {riskMatrix.slice().reverse().map((row, i) =>
                                        row.map((cell, j) => (
                                            <div key={`${2-i}-${j}`} className={`flex items-center justify-center p-1 rounded-sm ${matrixColors[2-i][j]}`}>
                                                {cell?.length > 0 && <span className="font-bold text-lg">{cell.length}</span>}
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="grid grid-cols-3 text-center text-xs font-bold mt-1">
                                    {(['low', 'medium', 'high'] as RiskLevel[]).map(level => <span key={level}>{t(`projects.risks.levels.${level}`)}</span>)}
                                </div>
                                 <div className="text-center font-bold text-sm mt-1">{t('projects.risks.probability')}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-center mb-2">{t('projects.risks.topRisks')}</h4>
                        <ul className="space-y-2">
                            {topRisks.map(risk => (
                                <li key={risk.id} className="p-2 bg-gray-50 dark:bg-slate-800/50 rounded-md text-sm">
                                    <p className="font-semibold truncate">{risk.description}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                        <span>Score: <span className="font-bold text-foreground dark:text-dark-foreground">{getRiskScore(risk)}</span></span>
                                        <LevelBadge level={risk.impact} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </AiCard>

            <AiCard title={t('projects.risks.register')}>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-start text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="p-2">{t('projects.risks.description')}</th>
                                <th className="p-2">{t('projects.risks.category')}</th>
                                <th className="p-2">{t('projects.risks.impact')}</th>
                                <th className="p-2">{t('projects.risks.probability')}</th>
                                <th className="p-2">{t('projects.risks.response')}</th>
                                <th className="p-2">{t('projects.risks.owner')}</th>
                                <th className="p-2">{t('projects.risks.status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {risks.map(risk => (
                                <tr key={risk.id} className="border-t dark:border-slate-700">
                                    <td className="p-2 max-w-xs">{risk.description}</td>
                                    <td className="p-2">{t(`projects.risks.categories.${risk.category}`)}</td>
                                    <td className="p-2"><LevelBadge level={risk.impact}/></td>
                                    <td className="p-2"><LevelBadge level={risk.probability}/></td>
                                    <td className="p-2">{t(`projects.risks.responses.${risk.responseStrategy}`)}</td>
                                    <td className="p-2">{risk.owner}</td>
                                    <td className="p-2">{t(`projects.risks.statuses.${risk.status}`)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AiCard>
        </div>
    );
};

export default RiskManagementTab;
