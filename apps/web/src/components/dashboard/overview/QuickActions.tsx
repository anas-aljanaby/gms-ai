import React from 'react';
import { HandCoins, FolderPlus, HeartHandshake, Compass, FileBarChart, Users } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import DashboardCard from './DashboardCard';

interface QuickActionsProps {
  setActiveModule: (module: string) => void;
}

const ACTIONS: { id: string; labelKey: string; icon: React.ReactNode; module: string }[] = [
  { id: 'recordDonation', labelKey: 'dashboard.overview.quickActions.recordDonation', icon: <HandCoins size={20} />, module: 'financials' },
  { id: 'addProject', labelKey: 'dashboard.overview.quickActions.addProject', icon: <FolderPlus size={20} />, module: 'projects' },
  { id: 'addBeneficiary', labelKey: 'dashboard.overview.quickActions.addBeneficiary', icon: <HeartHandshake size={20} />, module: 'beneficiaries' },
  { id: 'manageDonors', labelKey: 'dashboard.overview.quickActions.manageDonors', icon: <Users size={20} />, module: 'donors' },
  { id: 'openBousala', labelKey: 'dashboard.overview.quickActions.openBousala', icon: <Compass size={20} />, module: 'bousala' },
  { id: 'viewReports', labelKey: 'dashboard.overview.quickActions.viewReports', icon: <FileBarChart size={20} />, module: 'reports' },
];

/**
 * QuickActions - اختصارات سريعة للانتقال إلى أهم تدفقات العمل من لوحة القيادة.
 */
const QuickActions: React.FC<QuickActionsProps> = ({ setActiveModule }) => {
  const { t } = useLocalization(['dashboard']);

  return (
    <DashboardCard title={t('dashboard.overview.quickActions.title')}>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => setActiveModule(action.module)}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/60 hover:border-primary/30 transition-colors text-center"
          >
            <span className="p-2 rounded-lg bg-primary/10 text-primary">{action.icon}</span>
            <span className="text-xs font-semibold text-foreground dark:text-dark-foreground">{t(action.labelKey)}</span>
          </button>
        ))}
      </div>
    </DashboardCard>
  );
};

export default QuickActions;
