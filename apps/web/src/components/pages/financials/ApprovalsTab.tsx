import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useToast } from '../../../hooks/useToast';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { MOCK_APPROVAL_ITEMS } from '../../../data/financialsPageData';
import type { ApprovalItem, ApprovalItemType } from '../../../types/financials';

const TYPE_COLORS: Record<ApprovalItemType, string> = {
  expense: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  disbursement: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  purchase_requisition: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  journal_entry: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  budget_amendment: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  refund: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const ApprovalsTab: React.FC = () => {
  const { t, language } = useLocalization();
  const { showSuccess, showError } = useToast();
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>(MOCK_APPROVAL_ITEMS);

  const pendingCount = useMemo(
    () => approvalItems.filter((item) => item.status === 'pending').length,
    [approvalItems]
  );

  const approvedCount = useMemo(
    () => approvalItems.filter((item) => item.status === 'approved').length,
    [approvalItems]
  );

  const handleApprove = (id: string) => {
    setApprovalItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'approved' as const } : item
      )
    );
    showSuccess(t('financials.approvals.approve') + ' - ' + t('financials.status.approved'));
  };

  const handleReject = (id: string) => {
    setApprovalItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'rejected' as const } : item
      )
    );
    showError(t('financials.approvals.reject') + ' - ' + t('financials.status.rejected'));
  };

  const isDueSoon = (dueDate?: string): boolean => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 2 && diffDays >= 0;
  };

  const isOverdue = (dueDate?: string): boolean => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatTypeLabel = (type: ApprovalItemType): string => {
    return t(`financials.approvalType.${type}`);
  };

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="flex gap-4">
        <div className="flex-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
            {pendingCount}
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-300">
            {t('financials.approvals.pending')}
          </p>
        </div>
        <div className="flex-1 rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3">
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">
            {approvedCount}
          </p>
          <p className="text-sm text-green-600 dark:text-green-300">
            {t('financials.approvals.approvedToday')}
          </p>
        </div>
        <div className="flex-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {pendingCount}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-300">
            {t('financials.approvals.myPending')}
          </p>
        </div>
      </div>

      {/* Approval Cards */}
      <div className="space-y-4">
        {approvalItems.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t('financials.approvals.noApprovals')}
          </div>
        )}

        {approvalItems.map((item) => (
          <div
            key={item.id}
            className="bg-card dark:bg-dark-card rounded-xl border border-gray-200 dark:border-slate-700/50 p-5"
          >
            {/* Top row: Type badge + Priority badge + Due date */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[item.type]}`}
              >
                {formatTypeLabel(item.type)}
              </span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[item.priority]}`}
              >
                {t(`financials.priority.${item.priority}`)}
              </span>
              {item.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    isOverdue(item.dueDate)
                      ? 'text-red-600 dark:text-red-400'
                      : isDueSoon(item.dueDate)
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(item.dueDate, language, 'medium')}
                </span>
              )}
              {item.status !== 'pending' && (
                <span
                  className={`ms-auto inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : item.status === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}
                >
                  {t(`financials.status.${item.status}`)}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-foreground dark:text-dark-foreground mb-1">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {item.description}
            </p>

            {/* Info row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>
                {t('financials.approvals.requestedBy')}: {item.requestedBy}
              </span>
              <span>{formatDate(item.requestedDate, language, 'medium')}</span>
              <span className="font-semibold text-foreground dark:text-dark-foreground">
                {formatCurrency(item.amount, language)}
              </span>
            </div>

            {/* Workflow Progress */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: item.totalSteps }, (_, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i < item.currentStep
                        ? 'bg-primary'
                        : 'bg-gray-200 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t('financials.approvals.step', {
                  current: item.currentStep,
                  total: item.totalSteps,
                })}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {item.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t('financials.approvals.approve')}
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    {t('financials.approvals.reject')}
                  </button>
                </>
              )}
              <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                <Eye className="w-4 h-4" />
                {t('financials.approvals.viewDetails')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalsTab;
