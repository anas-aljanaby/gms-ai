import React, { useCallback, useMemo } from 'react';
import type { Beneficiary, BeneficiaryStatus, ProgramProject } from '../../../types';
import { useLocalization } from '../../../hooks/useLocalization';
import { formatDate } from '../../../lib/utils';
import DataTable, { type Column } from '../financials/shared/DataTable';
import BeneficiaryStatusBadge from './BeneficiaryStatusBadge';
import BeneficiaryRowActions from './BeneficiaryRowActions';
import { getBeneficiarySubtitle } from './beneficiaryUtils';
import { isOptimisticBeneficiary } from '../../../lib/beneficiaryOptimistic';

interface BeneficiaryDataTableProps {
  beneficiaries: Beneficiary[];
  projects: ProgramProject[];
  highlightedId?: string | null;
  onSelect: (beneficiary: Beneficiary) => void;
  onStatusChange: (beneficiary: Beneficiary, status: BeneficiaryStatus) => void;
  onRemove: (beneficiary: Beneficiary) => void;
}

const typeColor: Record<string, string> = {
  student: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  orphan: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  hafiz: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  family: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  institution: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  community: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
};

const BeneficiaryDataTable: React.FC<BeneficiaryDataTableProps> = ({
  beneficiaries,
  projects,
  highlightedId = null,
  onSelect,
  onStatusChange,
  onRemove,
}) => {
  const { t, language, pickLocalized } = useLocalization(['common', 'beneficiaries']);

  const getLastAidDate = (beneficiary: Beneficiary): string | null => {
    const aidLog = Array.isArray(beneficiary.aidLog) ? beneficiary.aidLog : [];
    if (!aidLog.length) return null;

    const delivered = aidLog
      .filter((aid) => aid.status === 'Delivered')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return delivered[0]?.date || null;
  };

  const columns: Column<Beneficiary>[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('beneficiaries.table.name'),
        sortable: true,
        render: (beneficiary) => {
          const name = pickLocalized(beneficiary.name);
          const optimistic = isOptimisticBeneficiary(beneficiary.id);
          const subtitle = optimistic ? t('common.saving') : getBeneficiarySubtitle(beneficiary, language, t);

          return (
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={beneficiary.photo}
                alt={name}
                className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground dark:text-dark-foreground">{name}</p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
              </div>
            </div>
          );
        },
      },
      {
        key: 'beneficiaryType',
        label: t('beneficiaries.table.type'),
        sortable: true,
        render: (beneficiary) => (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
              typeColor[beneficiary.beneficiaryType] || 'bg-gray-100 dark:bg-slate-700'
            }`}
          >
            {t(`beneficiaries.types.${beneficiary.beneficiaryType}`)}
          </span>
        ),
      },
      {
        key: 'status',
        label: t('beneficiaries.table.status'),
        sortable: true,
        render: (beneficiary) => <BeneficiaryStatusBadge status={beneficiary.status} />,
      },
      {
        key: 'country',
        label: t('beneficiaries.table.country'),
        sortable: true,
      },
      {
        key: 'projectId',
        label: t('beneficiaries.table.project'),
        render: (beneficiary) => {
          const project = projects.find((p) => p.id === beneficiary.projectId);
          return (
            <span className="block max-w-[180px] truncate text-sm text-gray-600 dark:text-gray-300">
              {project ? project.name[language] : '—'}
            </span>
          );
        },
      },
      {
        key: 'lastAid',
        label: t('beneficiaries.table.lastAid'),
        render: (beneficiary) => {
          const lastAid = getLastAidDate(beneficiary);
          return <span className="text-sm text-gray-500 dark:text-gray-400">{lastAid ? formatDate(lastAid, language) : '—'}</span>;
        },
      },
      {
        key: 'actions',
        label: '',
        align: 'right',
        render: (beneficiary) =>
          isOptimisticBeneficiary(beneficiary.id) ? (
            <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
          ) : (
          <div onClick={(event) => event.stopPropagation()}>
            <BeneficiaryRowActions
              beneficiary={beneficiary}
              onView={() => onSelect(beneficiary)}
              onChangeStatus={(status) => onStatusChange(beneficiary, status)}
              onRemove={() => onRemove(beneficiary)}
            />
          </div>
        ),
      },
    ],
    [language, onRemove, onSelect, onStatusChange, projects, t]
  );

  const getRowClassName = useCallback(
    (beneficiary: Beneficiary) => {
      if (isOptimisticBeneficiary(beneficiary.id)) {
        return 'opacity-70 animate-pulse bg-blue-50/60 dark:bg-blue-950/30';
      }
      if (highlightedId === beneficiary.id) {
        return 'bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-inset ring-emerald-200/80 dark:ring-emerald-800/60';
      }
      return '';
    },
    [highlightedId]
  );

  return (
    <DataTable
      columns={columns}
      data={beneficiaries}
      onRowClick={onSelect}
      getRowClassName={getRowClassName}
      emptyMessage={t('beneficiaries.noResults')}
    />
  );
};

export default BeneficiaryDataTable;
