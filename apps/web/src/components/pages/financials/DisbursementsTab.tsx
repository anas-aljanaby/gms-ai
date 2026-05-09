import React, { useState, useMemo } from 'react';
import { DollarSign, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatCurrency, formatDate } from '../../../lib/utils';
import DataTable, { type Column } from './shared/DataTable';
import FilterBar, { type FilterDef } from './shared/FilterBar';
import StatusBadge from './shared/StatusBadge';
import FinancialKpiCard from './shared/FinancialKpiCard';
import { MOCK_DISBURSEMENTS } from '../../../data/financialsPageData';
import type {
  Disbursement,
  DisbursementType,
  DisbursementStatus,
} from '../../../types/financials';

const DISBURSEMENT_TYPES: DisbursementType[] = [
  'aid_payment',
  'sponsorship_stipend',
  'emergency_relief',
  'project_grant',
  'scholarship',
];

const DISBURSEMENT_STATUSES: DisbursementStatus[] = [
  'scheduled',
  'pending_approval',
  'approved',
  'processing',
  'completed',
  'failed',
  'cancelled',
];

const TYPE_BADGE_CLASSES: Record<DisbursementType, string> = {
  aid_payment: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  sponsorship_stipend: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  emergency_relief: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  project_grant: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  scholarship: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
};

const DisbursementsTab: React.FC = () => {
  const { t, language } = useLocalization();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // --- KPI calculations ---
  const kpiData = useMemo(() => {
    const totalDisbursed = MOCK_DISBURSEMENTS
      .filter((d) => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0);

    const pendingCount = MOCK_DISBURSEMENTS.filter(
      (d) => d.status === 'pending_approval' || d.status === 'approved' || d.status === 'processing'
    ).length;

    const scheduledThisMonth = MOCK_DISBURSEMENTS.filter(
      (d) => d.status === 'scheduled'
    ).length;

    const failedCount = MOCK_DISBURSEMENTS.filter(
      (d) => d.status === 'failed'
    ).length;

    return { totalDisbursed, pendingCount, scheduledThisMonth, failedCount };
  }, []);

  // --- Filters ---
  const filters: FilterDef[] = useMemo(
    () => [
      {
        key: 'type',
        label: t('financials.disbursements.allTypes'),
        options: DISBURSEMENT_TYPES.map((dt) => ({
          value: dt,
          label: t(`financials.disbursementType.${dt}`),
        })),
        value: typeFilter,
        onChange: setTypeFilter,
      },
      {
        key: 'status',
        label: t('financials.disbursements.allStatuses'),
        options: DISBURSEMENT_STATUSES.map((s) => ({
          value: s,
          label: t(`financials.status.${s}`),
        })),
        value: statusFilter,
        onChange: setStatusFilter,
      },
    ],
    [t, typeFilter, statusFilter]
  );

  const filteredData = useMemo(() => {
    return MOCK_DISBURSEMENTS.filter((dis) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName =
          dis.beneficiaryName[language].toLowerCase().includes(term);
        if (!matchesName) return false;
      }
      if (typeFilter && dis.type !== typeFilter) return false;
      if (statusFilter && dis.status !== statusFilter) return false;
      return true;
    });
  }, [searchTerm, typeFilter, statusFilter, language]);

  // --- Table columns ---
  const columns: Column<Disbursement>[] = useMemo(
    () => [
      {
        key: 'scheduledDate',
        label: t('financials.disbursements.date'),
        sortable: true,
        render: (row) => (
          <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {formatDate(row.scheduledDate, language, 'medium')}
          </span>
        ),
      },
      {
        key: 'beneficiaryName',
        label: t('financials.disbursements.beneficiary'),
        render: (row) => (
          <span className="text-sm font-medium text-foreground dark:text-dark-foreground">
            {row.beneficiaryName[language]}
          </span>
        ),
      },
      {
        key: 'type',
        label: t('financials.disbursements.type'),
        render: (row) => (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE_CLASSES[row.type]}`}
          >
            {t(`financials.disbursementType.${row.type}`)}
          </span>
        ),
      },
      {
        key: 'amount',
        label: t('financials.disbursements.amount'),
        sortable: true,
        align: 'right',
        render: (row) => (
          <span className="text-sm font-semibold text-foreground dark:text-dark-foreground whitespace-nowrap">
            {formatCurrency(row.amount, language)}
          </span>
        ),
      },
      {
        key: 'method',
        label: t('financials.disbursements.method'),
        render: (row) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t(`financials.method.${row.method}`)}
          </span>
        ),
      },
      {
        key: 'projectName',
        label: t('financials.disbursements.project'),
        render: (row) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {row.projectName?.[language] || '—'}
          </span>
        ),
      },
      {
        key: 'status',
        label: t('financials.disbursements.status'),
        render: (row) => <StatusBadge status={row.status} />,
      },
    ],
    [t, language]
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialKpiCard
          title={t('financials.disbursements.totalDisbursed')}
          value={formatCurrency(kpiData.totalDisbursed, language)}
          icon={DollarSign}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <FinancialKpiCard
          title={t('financials.disbursements.pendingCount')}
          value={kpiData.pendingCount}
          icon={Clock}
          colorClass="text-amber-600 dark:text-amber-400"
          bgClass="bg-amber-100 dark:bg-amber-900/30"
        />
        <FinancialKpiCard
          title={t('financials.disbursements.scheduledThisMonth')}
          value={kpiData.scheduledThisMonth}
          icon={Calendar}
          colorClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-100 dark:bg-blue-900/30"
        />
        <FinancialKpiCard
          title={t('financials.disbursements.failedCount')}
          value={kpiData.failedCount}
          icon={AlertTriangle}
          colorClass="text-red-600 dark:text-red-400"
          bgClass="bg-red-100 dark:bg-red-900/30"
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t('financials.disbursements.searchPlaceholder')}
        filters={filters}
      />

      {/* Table */}
      <DataTable<Disbursement>
        columns={columns}
        data={filteredData}
        emptyMessage={t('financials.disbursements.noDisbursements')}
      />
    </div>
  );
};

export default DisbursementsTab;
