
import type { Language } from '../types';

// --- Caching for Intl Formatters ---
const numberFormatCache = new Map<string, Intl.NumberFormat>();
const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();
const relativeTimeFormatCache = new Map<string, Intl.RelativeTimeFormat>();

const getLocale = (language: Language): string => {
  return language === 'ar' ? 'ar-SA' : 'en-US';
};

/**
 * formatNumber - Formats a number according to language and options.
 * Handles decimals, currency, and percentages.
 * @param {number} num The number to format.
 * @param {Language} language The language code ('en', 'ar').
 * @param {Intl.NumberFormatOptions} [options={}] Options for formatting.
 * @returns {string} The formatted number string.
 */
export const formatNumber = (num: number, language: Language, options: Intl.NumberFormatOptions = {}): string => {
  const locale = getLocale(language);
  const cacheKey = `${locale}-${JSON.stringify(options)}`;

  try {
    if (!numberFormatCache.has(cacheKey)) {
      const finalOptions = { ...options };
      if (language === 'ar') {
        (finalOptions as any).numberingSystem = 'arab';
      }
      numberFormatCache.set(cacheKey, new Intl.NumberFormat(locale, finalOptions));
    }
    return numberFormatCache.get(cacheKey)!.format(num);
  } catch (error) {
    console.error("Error formatting number:", error);
    return String(num); // Fallback
  }
};

/**
 * formatCurrency - Formats a number as a currency string.
 * @param {number} amount The amount.
 * @param {Language} language The language code.
 * @param {string} [currency='USD'] The ISO currency code.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount: number, language: Language, currency: string = 'USD'): string => {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    // Keep integer display for USD amounts without decimals for consistency with previous behavior
    if (currency === 'USD' && (amount % 1 === 0)) {
        options.minimumFractionDigits = 0;
        options.maximumFractionDigits = 0;
    }
    return formatNumber(amount, language, options);
};

/**
 * formatPercentage - Formats a decimal number as a percentage.
 * @param {number} value The decimal value (e.g., 0.156).
 * @param {Language} language The language code.
 * @param {Intl.NumberFormatOptions} [options] Additional formatting options.
 * @returns {string} The formatted percentage string.
 */
export const formatPercentage = (value: number, language: Language, options: Intl.NumberFormatOptions = {}): string => {
    const finalOptions: Intl.NumberFormatOptions = {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        ...options,
    };
    return formatNumber(value, language, finalOptions);
};

type DateFormatPreset = 'short' | 'medium' | 'long' | 'full';

/**
 * formatDate - Formats a date string according to language and format presets.
 * @param {string} dateString The ISO date string.
 * @param {Language} language The language code.
 * @param {DateFormatPreset | Intl.DateTimeFormatOptions} [format='medium'] The format preset or a custom options object.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateString: string, language: Language, format: DateFormatPreset | Intl.DateTimeFormatOptions = 'medium'): string => {
  if (!dateString) return 'N/A';
  
  const locale = getLocale(language);
  const date = new Date(dateString);

  let options: Intl.DateTimeFormatOptions;

  if (typeof format === 'string') {
    const presets: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
      short: { year: '2-digit', month: 'numeric', day: 'numeric' },
      medium: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    };
    options = presets[format] || presets['medium'];
  } else {
    options = format;
  }
  
  const finalOptions = {...options};

  if (language === 'ar') {
    (finalOptions as any).numberingSystem = 'arab';
    // Example: To enable Hijri calendar, uncomment the line below or pass it in options
    (finalOptions as any).calendar = 'islamic-umalqura';
  }

  const cacheKey = `${locale}-${JSON.stringify(finalOptions)}`;
  
  try {
    if (!dateTimeFormatCache.has(cacheKey)) {
        dateTimeFormatCache.set(cacheKey, new Intl.DateTimeFormat(locale, finalOptions));
    }
    return dateTimeFormatCache.get(cacheKey)!.format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return date.toLocaleDateString(); // Fallback
  }
};

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 4.34524, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Number.POSITIVE_INFINITY, name: 'years' },
];

/**
 * formatRelativeTime - Formats a date string as a relative time (e.g., "5 minutes ago").
 * @param {string} dateString The ISO date string.
 * @param {Language} language The language code.
 * @returns {string} The formatted relative time string.
 */
export const formatRelativeTime = (dateString: string, language: Language): string => {
    if (!dateString) return 'N/A';

    const locale = getLocale(language);
    const date = new Date(dateString);
    const now = new Date();
    let duration = (date.getTime() - now.getTime()) / 1000;

    const cacheKey = `${locale}-numeric`;
    
    try {
        if (!relativeTimeFormatCache.has(cacheKey)) {
            relativeTimeFormatCache.set(cacheKey, new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }));
        }
        const formatter = relativeTimeFormatCache.get(cacheKey)!;

        for (let i = 0; i < DIVISIONS.length; i++) {
            const division = DIVISIONS[i];
            if (Math.abs(duration) < division.amount) {
                return formatter.format(Math.round(duration), division.name);
            }
            duration /= division.amount;
        }
        return date.toLocaleDateString(); // Fallback for very old dates
    } catch (error) {
        console.error("Error formatting relative time:", error);
        return date.toLocaleDateString(); // Fallback
    }
};


/**
 * getDonorCategoryLabel - Gets the translated label for a donor category.
 * @param {string} category The category key (e.g., 'HeroDonor').
 * @param {(key: string, fallback?: string) => string} t The translation function.
 * @returns {string} The translated label.
 */
export const getDonorCategoryLabel = (category: string, t: (key: string, fallback?: string) => string): string => {
    if (!category) return '';
    const categoryKey = category.replace(/ /g, '');
    return t(`donorIntelligence.categories.${categoryKey}`, category);
};
