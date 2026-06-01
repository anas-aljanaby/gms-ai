import React from 'react';
import { HandCoins, TrendingUp, Clock, FolderKanban, HeartHandshake, Users } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import { useFormatting } from '../../hooks/useFormatting';
import { useFinancialOverview } from '../../hooks/useFinancialOverview';
import { useProjects } from '../../hooks/useProjects';
import { useDonors } from '../../hooks/useDonors';
import { useBeneficiaries } from '../../hooks/useBeneficiaries';
import StatCard from '../dashboard/overview/StatCard';
import StrategicCompass from '../dashboard/overview/StrategicCompass';
import RevenueExpensesChart from '../dashboard/overview/RevenueExpensesChart';
import FundAllocation from '../dashboard/overview/FundAllocation';
import ProjectsHealth from '../dashboard/overview/ProjectsHealth';
import RecentActivity from '../dashboard/overview/RecentActivity';
import AttentionAlerts from '../dashboard/overview/AttentionAlerts';

interface DashboardProps {
  setActiveModule: (module: string) => void;
}

/**
 * Dashboard - لوحة القيادة الرئيسية: نظرة تنفيذية شاملة على بيانات المنظمة الفعلية.
 */
const Dashboard: React.FC<DashboardProps> = ({ setActiveModule }) => {
  const { t } = useLocalization(['dashboard']);
  const { formatCurrency: fCurrency, formatNumber: fNumber } = useFormatting();

  const { data: financials, isLoading: loadingFinancials } = useFinancialOverview();
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { data: donors, isLoading: loadingDonors } = useDonors();
  const { data: beneficiaries, isLoading: loadingBeneficiaries } = useBeneficiaries();

  const activeProjects = (projects ?? []).filter((p) => p.stage !== 'closure').length;
  const activeBeneficiaries = (beneficiaries ?? []).filter((b) => b.status === 'active').length;
  const activeDonors = (donors ?? []).filter((d) => d.status === 'Active').length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-dark-foreground">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.overview.subtitle')}</p>
      </header>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label={t('dashboard.overview.kpis.totalRaised')}
          value={fCurrency(financials?.totalRevenue ?? 0)}
          icon={<HandCoins size={20} />}
          accent="green"
          loading={loadingFinancials}
          onClick={() => setActiveModule('financials')}
        />
        <StatCard
          label={t('dashboard.overview.kpis.netIncome')}
          value={fCurrency(financials?.netIncome ?? 0)}
          icon={<TrendingUp size={20} />}
          accent="primary"
          loading={loadingFinancials}
          onClick={() => setActiveModule('financials')}
        />
        <StatCard
          label={t('dashboard.overview.kpis.outstandingPledges')}
          value={fCurrency(financials?.outstandingPledges ?? 0)}
          icon={<Clock size={20} />}
          accent="amber"
          loading={loadingFinancials}
          onClick={() => setActiveModule('financials')}
        />
        <StatCard
          label={t('dashboard.overview.kpis.activeProjects')}
          value={fNumber(activeProjects)}
          icon={<FolderKanban size={20} />}
          accent="sky"
          loading={loadingProjects}
          onClick={() => setActiveModule('projects')}
        />
        <StatCard
          label={t('dashboard.overview.kpis.beneficiaries')}
          value={fNumber(activeBeneficiaries)}
          icon={<HeartHandshake size={20} />}
          accent="violet"
          loading={loadingBeneficiaries}
          onClick={() => setActiveModule('beneficiaries')}
        />
        <StatCard
          label={t('dashboard.overview.kpis.activeDonors')}
          value={fNumber(activeDonors)}
          icon={<Users size={20} />}
          accent="red"
          loading={loadingDonors}
          onClick={() => setActiveModule('donors')}
        />
      </div>

      {/* Strategic compass (Bousala) */}
      <StrategicCompass setActiveModule={setActiveModule} />

      {/* Financial health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueExpensesChart setActiveModule={setActiveModule} />
        </div>
        <FundAllocation setActiveModule={setActiveModule} />
      </div>

      {/* Operational row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProjectsHealth setActiveModule={setActiveModule} />
        <RecentActivity setActiveModule={setActiveModule} />
        <AttentionAlerts />
      </div>
    </div>
  );
};

export default Dashboard;
