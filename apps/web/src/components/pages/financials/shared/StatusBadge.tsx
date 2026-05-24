import React from 'react';
import { useLocalization } from '../../../../hooks/useLocalization';

type ColorMapping = {
  bg: string;
  text: string;
  darkBg: string;
  darkText: string;
};

const COLOR_MAP: Record<string, ColorMapping> = {
  green: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    darkBg: 'dark:bg-green-900/30',
    darkText: 'dark:text-green-300',
  },
  yellow: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    darkBg: 'dark:bg-amber-900/30',
    darkText: 'dark:text-amber-300',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    darkBg: 'dark:bg-red-900/30',
    darkText: 'dark:text-red-300',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    darkBg: 'dark:bg-blue-900/30',
    darkText: 'dark:text-blue-300',
  },
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    darkBg: 'dark:bg-gray-700',
    darkText: 'dark:text-gray-300',
  },
};

const STATUS_COLORS: Record<string, ColorMapping> = {
  posted: COLOR_MAP.green,
  reconciled: COLOR_MAP.green,
  completed: COLOR_MAP.green,
  fulfilled: COLOR_MAP.green,
  approved: COLOR_MAP.green,
  paid: COLOR_MAP.green,
  received: COLOR_MAP.green,
  sent: COLOR_MAP.green,
  active: COLOR_MAP.green,
  generated: COLOR_MAP.green,

  pending: COLOR_MAP.yellow,
  pending_approval: COLOR_MAP.yellow,
  processing: COLOR_MAP.yellow,
  scheduled: COLOR_MAP.yellow,
  partial: COLOR_MAP.yellow,
  partially_fulfilled: COLOR_MAP.yellow,
  draft: COLOR_MAP.yellow,

  voided: COLOR_MAP.red,
  failed: COLOR_MAP.red,
  overdue: COLOR_MAP.red,
  rejected: COLOR_MAP.red,
  written_off: COLOR_MAP.red,
  over_budget: COLOR_MAP.red,
  danger: COLOR_MAP.red,

  escalated: COLOR_MAP.blue,

  cancelled: COLOR_MAP.gray,
  closed: COLOR_MAP.gray,
  suspended: COLOR_MAP.gray,
};

// "approved" defaults green but maps blue in the "approval" variant
const VARIANT_OVERRIDES: Record<string, Record<string, ColorMapping>> = {
  approval: {
    approved: COLOR_MAP.blue,
  },
};

interface StatusBadgeProps {
  status: string;
  variant?: string;
  /** Translation group under financials — defaults to status */
  i18nGroup?: 'status' | 'category';
}

function formatStatusLabel(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant, i18nGroup = 'status' }) => {
  const { t } = useLocalization(['financials']);
  const key = status.toLowerCase();
  const variantColors = variant ? VARIANT_OVERRIDES[variant]?.[key] : undefined;
  const colors = variantColors ?? STATUS_COLORS[key] ?? COLOR_MAP.gray;
  const label = t(`financials.${i18nGroup}.${key}`, formatStatusLabel(status));

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
