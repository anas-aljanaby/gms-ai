import React from 'react';
import { HandCoins, TrendingUp, Clock, FolderKanban, HeartHandshake, Users } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import { useFormatting } from '../../hooks/useFormatting';
import { useFinancialOverview } from '../../hooks/useFinancialOverview';
import { useProjects } from '../../hooks/useProjects';
import { useDonors } from '../../hooks/useDonors';
import { useBeneficiaries } from '../../hooks/useBeneficiaries';
import KpiChip from '../dashboard/overview/KpiChip';
import StrategicCompass from '../dashboard/overview/StrategicCompass';
import RevenueExpensesChart from '../dashboard/overview/RevenueExpensesChart';
import FundAllocation from '../dashboard/overview/FundAllocation';
import ProjectsHealth from '../dashboard/overview/ProjectsHealth';
import RecentActivity from '../dashboard/overview/RecentActivity';
import AttentionAlerts from '../dashboard/overview/AttentionAlerts';
import QuickActions from '../dashboard/overview/QuickActions';

interface DashboardProps {
  setActiveModule: (module: string) => void;
}

/** Month-over-month change (%) from the last two points of a real series. */
const momChange = (series: number[]): number | undefined => {
  if (series.length < 2) return undefined;
  const prev = series[series.length - 2];
  const last = series[series.length - 1];
  if (!prev) return undefined;
  return ((last - prev) / Math.abs(prev)) * 100;
};

/**
 * Dashboard - لوحة القيادة الرئيسية: نظرة تنفيذية مكثفة على بيانات المنظمة الفعلية.
 */
const Dashboard: React.FC<DashboardProps> = ({ setActiveModule }) => {
  const { t } = useLocalization(['dashboard']);
  const { formatCurrency: fCurrency, formatNumber: fNumber } = useFormatting();

  const { data: financials, isLoading: loadingFinancials } = useFinancialOverview();
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { data: donors, isLoading: loadingDonors } = useDonors();
  const { data: beneficiaries, isLoading: loadingBeneficiaries } = useBeneficiaries();

  const projectList = projects ?? [];
  const activeProjects = projectList.filter((p) => p.stage !== 'closure').length;
  const activeBeneficiaries = (beneficiaries ?? []).filter((b) => b.status === 'active').length;
  const activeDonors = (donors ?? []).filter((d) => d.status === 'Active').length;

  const now = Date.now();
  const atRiskProjects = projectList.filter(
    (p) =>
      p.stage !== 'closure' &&
      (p.spent > p.budget || (new Date(p.plannedEndDate).getTime() < now && p.progress < 100)),
  ).length;

  const monthly = financials?.monthlyData ?? [];
  const revenueSeries = monthly.map((m) => m.revenue);
  const netSeries = monthly.map((m) => m.netIncome);
  const vsLast = t('dashboard.vsLastPeriod');

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-dark-foreground">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.overview.subtitle')}</p>
      </header>

      {/* KPI chips */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiChip
          label={t('dashboard.overview.kpis.totalRaised')}
          value={fCurrency(financials?.totalRevenue ?? 0)}
          icon={<HandCoins size={18} />}
          accent="green"
          trend={revenueSeries}
          change={momChange(revenueSeries)}
          changeLabel={vsLast}
          loading={loadingFinancials}
          onClick={() => setActiveModule('financials')}
        />
        <KpiChip
          label={t('dashboard.overview.kpis.netIncome')}
          value={fCurrency(financials?.netIncome ?? 0)}
          icon={<TrendingUp size={18} />}
          accent="primary"
          trend={netSeries}
          change={momChange(netSeries)}
          changeLabel={vsLast}
          loading={loadingFinancials}
          onClick={() => setActiveModule('financials')}
        />
        <KpiChip
          label={t('dashboard.overview.kpis.outstandingPledges')}
          value={fCurrency(financials?.outstandingPledges ?? 0)}
          icon={<Clock size={18} />}
          accent="amber"
          loading={loadingFinancials}
          onClick={() => setActiveModule('financials')}
        />
        <KpiChip
          label={t('dashboard.overview.kpis.activeProjects')}
          value={fNumber(activeProjects)}
          icon={<FolderKanban size={18} />}
          accent="sky"
          sub={atRiskProjects > 0 ? t('dashboard.overview.projects.atRisk', { count: atRiskProjects }) : undefined}
          loading={loadingProjects}
          onClick={() => setActiveModule('projects')}
        />
        <KpiChip
          label={t('dashboard.overview.kpis.beneficiaries')}
          value={fNumber(activeBeneficiaries)}
          icon={<HeartHandshake size={18} />}
          accent="violet"
          loading={loadingBeneficiaries}
          onClick={() => setActiveModule('beneficiaries')}
        />
        <KpiChip
          label={t('dashboard.overview.kpis.activeDonors')}
          value={fNumber(activeDonors)}
          icon={<Users size={18} />}
          accent="red"
          loading={loadingDonors}
          onClick={() => setActiveModule('donors')}
        />
      </div>

      {/* Strategic compass (Bousala) */}
      <StrategicCompass setActiveModule={setActiveModule} />

      {/* Main content + side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <main className="lg:col-span-2 space-y-8">
          <RevenueExpensesChart setActiveModule={setActiveModule} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <ProjectsHealth setActiveModule={setActiveModule} />
            <FundAllocation setActiveModule={setActiveModule} />
          </div>
        </main>

        <aside className="space-y-8">
          <QuickActions setActiveModule={setActiveModule} />
          <AttentionAlerts />
          <RecentActivity setActiveModule={setActiveModule} />
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
