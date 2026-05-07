import { useCallback } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { useLocalization } from './useLocalization';
import { formatDate, formatTime, formatNumber, formatCurrency, formatPercentage } from '../lib/utils';
import type { DateFormat } from '../types';

type DateFormatPreset = 'short' | 'medium' | 'long' | 'full';

/**
 * useFormatting - Returns format functions pre-bound to the current language,
 * date format (gregorian/hijri), and time format (12h/24h) from global settings.
 */
export const useFormatting = () => {
    const { state } = useDashboard();
    const { language } = useLocalization();

    const fDate = useCallback(
        (dateString: string, format?: DateFormatPreset | Intl.DateTimeFormatOptions) =>
            formatDate(dateString, language, format ?? 'medium', state.dateFormat),
        [language, state.dateFormat]
    );

    const fTime = useCallback(
        (timeString: string) => formatTime(timeString, language, state.timeFormat),
        [language, state.timeFormat]
    );

    const fNumber = useCallback(
        (num: number, options?: Intl.NumberFormatOptions) => formatNumber(num, language, options),
        [language]
    );

    const fCurrency = useCallback(
        (amount: number, currency?: string) => formatCurrency(amount, language, currency),
        [language]
    );

    const fPercent = useCallback(
        (value: number, options?: Intl.NumberFormatOptions) => formatPercentage(value, language, options),
        [language]
    );

    return {
        formatDate: fDate,
        formatTime: fTime,
        formatNumber: fNumber,
        formatCurrency: fCurrency,
        formatPercentage: fPercent,
        dateFormat: state.dateFormat as DateFormat,
        timeFormat: state.timeFormat,
    };
};
