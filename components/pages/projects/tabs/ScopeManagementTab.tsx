import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';
import type { Project } from '../../../../types';
import AiCard from '../../ai/AiCard';
import WbsTree from '../shared/WbsTree';

interface ScopeManagementTabProps {
    project: Project;
}

const ScopeStatementSection: React.FC<{ title: string, items: string[] }> = ({ title, items }) => (
    <div>
        <h4 className="font-bold text-lg mb-2 text-foreground dark:text-dark-foreground">{title}</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);

const ScopeManagementTab: React.FC<ScopeManagementTabProps> = ({ project }) => {
    const { t } = useLocalization();

    return (
        <div className="space-y-6">
            <AiCard title={t('projects.scope.statement')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ScopeStatementSection title={t('projects.scope.inScope')} items={project.scopeStatement.inScope} />
                    <ScopeStatementSection title={t('projects.scope.outOfScope')} items={project.scopeStatement.outOfScope} />
                    <ScopeStatementSection title={t('projects.scope.assumptions')} items={project.scopeStatement.assumptions} />
                    <ScopeStatementSection title={t('projects.scope.constraints')} items={project.scopeStatement.constraints} />
                </div>
            </AiCard>
            
            <AiCard title={t('projects.scope.wbs')}>
                <WbsTree node={project.wbs} />
            </AiCard>
        </div>
    );
};

export default ScopeManagementTab;
