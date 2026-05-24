import type { ProjectLifecycleStageId, ProjectType } from '../../../../types';

export const projectInputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-dark-foreground focus:ring-1 focus:ring-primary focus:border-primary';

export const projectLabelClass =
    'block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1';

export const PROJECT_STAGES: ProjectLifecycleStageId[] = ['design', 'planning', 'implementation', 'monitoring', 'closure'];

export const PROJECT_TYPES: ProjectType[] = ['humanitarian', 'development', 'health', 'education', 'infrastructure'];
