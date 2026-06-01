import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useFormatting } from '../../../hooks/useFormatting';
import { useProjects } from '../../../hooks/useProjects';
import type { ProjectLifecycleStageId } from '../../../types';
import DashboardCard from './DashboardCard';

interface ProjectsHealthProps {
  setActiveModule: (module: string) => void;
}

const STAGES: ProjectLifecycleStageId[] = ['design', 'planning', 'implementation', 'monitoring', 'closure'];
const STAGE_COLORS: Record<ProjectLifecycleStageId, string> = {
  design: 'bg-violet-500',
  planning: 'bg-sky-500',
  implementation: 'bg-primary',
  monitoring: 'bg-amber-500',
  closure: 'bg-green-500',
};

/**
 * ProjectsHealth - توزيع المشاريع حسب المرحلة وعدد المشاريع المتعثرة (فوق الميزانية أو متأخرة).
 */
const ProjectsHealth: React.FC<ProjectsHealthProps> = ({ setActiveModule }) => {
  const { t } = useLocalization(['dashboard']);
  const { formatNumber: fNumber } = useFormatting();
  const { data: projects, isLoading } = useProjects();

  const list = projects ?? [];
  const active = list.filter((p) => p.stage !== 'closure');
  const now = Date.now();
  const atRisk = list.filter(
    (p) =>
      p.stage !== 'closure' &&
      (p.spent > p.budget || (new Date(p.plannedEndDate).getTime() < now && p.progress < 100)),
  ).length;

  const byStage = STAGES.map((stage) => ({ stage, count: list.filter((p) => p.stage === stage).length }));
  const max = Math.max(1, ...byStage.map((s) => s.count));

  return (
    <DashboardCard
      title={t('dashboard.overview.projects.title')}
      action={{ label: t('dashboard.overview.projects.viewAll'), onClick: () => setActiveModule('projects') }}
    >
      {isLoading ? (
        <div className="h-48 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
      ) : list.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          {t('dashboard.overview.projects.empty')}
        </p>
      ) : (
        <>
          <div className="flex items-end gap-6 mb-5">
            <div>
              <p className="text-3xl font-bold text-foreground dark:text-dark-foreground tabular-nums">
                {fNumber(active.length)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.overview.projects.active')}</p>
            </div>
            {atRisk > 0 && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <AlertTriangle size={16} />
                <span className="text-sm font-semibold">
                  {t('dashboard.overview.projects.atRisk', { count: atRisk })}
                </span>
              </div>
            )}
          </div>
          <ul className="space-y-3">
            {byStage.map(({ stage, count }) => (
              <li key={stage} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm text-gray-600 dark:text-gray-300">
                  {t(`dashboard.overview.projects.stages.${stage}`)}
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${STAGE_COLORS[stage]}`}
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-end text-sm font-semibold text-foreground dark:text-dark-foreground tabular-nums">
                  {fNumber(count)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </DashboardCard>
  );
};

export default ProjectsHealth;
