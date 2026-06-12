import type { GrcRiskLevel } from '../../../types';

export function getRiskLevelBadgeStyles(level: GrcRiskLevel | string) {
  switch (level) {
    case 'Critical':
      return { text: 'text-red-800', bg: 'bg-red-100' };
    case 'High':
      return { text: 'text-orange-800', bg: 'bg-orange-100' };
    case 'Medium':
      return { text: 'text-yellow-800', bg: 'bg-yellow-100' };
    case 'Low':
      return { text: 'text-blue-800', bg: 'bg-blue-100' };
    default:
      return { text: 'text-gray-800', bg: 'bg-gray-100' };
  }
}

export function getRiskLevelCardStyles(level: GrcRiskLevel | string) {
  switch (level) {
    case 'Critical':
      return {
        text: 'text-red-800 dark:text-red-200',
        bg: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-500',
      };
    case 'High':
      return {
        text: 'text-orange-800 dark:text-orange-200',
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        border: 'border-orange-500',
      };
    case 'Medium':
      return {
        text: 'text-yellow-800 dark:text-yellow-200',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        border: 'border-yellow-500',
      };
    case 'Low':
      return {
        text: 'text-blue-800 dark:text-blue-200',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-500',
      };
    default:
      return {
        text: 'text-gray-800 dark:text-gray-300',
        bg: 'bg-gray-100 dark:bg-slate-700',
        border: 'border-gray-500',
      };
  }
}

export function getMatrixCellColor(score: number, theme: 'light' | 'dark') {
  const hue = 120 - 115 * ((score - 1) / 24);
  const saturation = '90%';
  const lightness = theme === 'dark' ? '45%' : '55%';
  const text = theme === 'dark' ? 'text-white' : 'text-gray-900';
  return { bg: `hsl(${hue}, ${saturation}, ${lightness})`, text };
}
