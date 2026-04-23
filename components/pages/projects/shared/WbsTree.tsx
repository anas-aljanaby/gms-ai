import React from 'react';
import type { WbsNode, WbsNodeType } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { ProjectIcon } from '../../../icons/ModuleIcons';
import { FolderIcon } from '../../../icons/DocumentIcons';
import { TaskIcon } from '../../../icons/ActionIcons';

const nodeTypeConfig: Record<WbsNodeType, { icon: React.FC; color: string; labelKey: string }> = {
    deliverable: { icon: ProjectIcon, color: 'text-blue-600 dark:text-blue-400', labelKey: 'projects.scope.deliverable' },
    'work-package': { icon: FolderIcon, color: 'text-yellow-600 dark:text-yellow-400', labelKey: 'projects.scope.workPackage' },
    task: { icon: TaskIcon, color: 'text-green-600 dark:text-green-400', labelKey: 'projects.scope.task' },
};

const WbsNodeComponent: React.FC<{ node: WbsNode; level: number }> = ({ node, level }) => {
    const { t } = useLocalization();
    const config = nodeTypeConfig[node.type];
    const Icon = config.icon;

    return (
        <div style={{ paddingLeft: `${level * 1.5}rem` }}>
            <div className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-slate-700/50 last:border-b-0">
                <span className={config.color}><Icon /></span>
                <div className="flex-grow">
                    <p className="font-semibold text-foreground dark:text-dark-foreground">{node.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{t(config.labelKey)}</p>
                </div>
            </div>
            {node.children && node.children.length > 0 && (
                <div>
                    {node.children.map(child => (
                        <WbsNodeComponent key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

interface WbsTreeProps {
    node: WbsNode;
}

const WbsTree: React.FC<WbsTreeProps> = ({ node }) => {
    return (
        <div className="w-full">
            <WbsNodeComponent node={node} level={0} />
        </div>
    );
};

export default WbsTree;