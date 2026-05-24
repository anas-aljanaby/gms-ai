/** Common countries for Gulf/MENA non-profits. Values are stored as English names in the DB. */
export const DEFAULT_COUNTRY_OPTIONS = [
    'Algeria',
    'Bahrain',
    'Bangladesh',
    'Canada',
    'Egypt',
    'France',
    'Germany',
    'Indonesia',
    'Iraq',
    'Jordan',
    'Kuwait',
    'Lebanon',
    'Libya',
    'Malaysia',
    'Morocco',
    'Oman',
    'Pakistan',
    'Palestine',
    'Qatar',
    'Saudi Arabia',
    'Sudan',
    'Syria',
    'Tunisia',
    'Turkey',
    'UAE',
    'UK',
    'USA',
    'Yemen',
] as const;

type SupportedLanguage = 'en' | 'ar';

type CountryMetadata = {
    value: (typeof DEFAULT_COUNTRY_OPTIONS)[number];
    arLabel: string;
    aliases?: string[];
};

const COUNTRY_METADATA: CountryMetadata[] = [
    { value: 'Algeria', arLabel: 'الجزائر' },
    { value: 'Bahrain', arLabel: 'البحرين' },
    { value: 'Bangladesh', arLabel: 'بنغلاديش' },
    { value: 'Canada', arLabel: 'كندا' },
    { value: 'Egypt', arLabel: 'مصر' },
    { value: 'France', arLabel: 'فرنسا' },
    { value: 'Germany', arLabel: 'ألمانيا' },
    { value: 'Indonesia', arLabel: 'إندونيسيا' },
    { value: 'Iraq', arLabel: 'العراق' },
    { value: 'Jordan', arLabel: 'الأردن' },
    { value: 'Kuwait', arLabel: 'الكويت' },
    { value: 'Lebanon', arLabel: 'لبنان' },
    { value: 'Libya', arLabel: 'ليبيا' },
    { value: 'Malaysia', arLabel: 'ماليزيا' },
    { value: 'Morocco', arLabel: 'المغرب' },
    { value: 'Oman', arLabel: 'عمان' },
    { value: 'Pakistan', arLabel: 'باكستان' },
    { value: 'Palestine', arLabel: 'فلسطين' },
    { value: 'Qatar', arLabel: 'قطر' },
    { value: 'Saudi Arabia', arLabel: 'السعودية', aliases: ['KSA', 'Kingdom of Saudi Arabia', 'المملكة العربية السعودية'] },
    { value: 'Sudan', arLabel: 'السودان' },
    { value: 'Syria', arLabel: 'سوريا' },
    { value: 'Tunisia', arLabel: 'تونس' },
    { value: 'Turkey', arLabel: 'تركيا' },
    { value: 'UAE', arLabel: 'الإمارات', aliases: ['United Arab Emirates', 'الامارات', 'الإمارات العربية المتحدة', 'الامارات العربية المتحدة'] },
    { value: 'UK', arLabel: 'المملكة المتحدة', aliases: ['United Kingdom', 'Britain', 'Great Britain'] },
    { value: 'USA', arLabel: 'الولايات المتحدة', aliases: ['United States', 'United States of America', 'US'] },
    { value: 'Yemen', arLabel: 'اليمن' },
];

const COUNTRY_BY_CANONICAL = new Map(COUNTRY_METADATA.map((country) => [country.value, country] as const));

const ARABIC_DIACRITICS_REGEX = /[\u064B-\u065F\u0670]/g;

export function normalizeCountrySearchTerm(term: string): string {
    return term
        .trim()
        .toLocaleLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(ARABIC_DIACRITICS_REGEX, '')
        .replace(/[أإآ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ');
}

const COUNTRY_ALIAS_TO_CANONICAL = new Map<string, string>();
COUNTRY_METADATA.forEach((country) => {
    [country.value, country.arLabel, ...(country.aliases ?? [])].forEach((alias) => {
        const normalized = normalizeCountrySearchTerm(alias);
        if (normalized) COUNTRY_ALIAS_TO_CANONICAL.set(normalized, country.value);
    });
});

export function resolveCountryToCanonical(countryValue: string): string | null {
    const normalized = normalizeCountrySearchTerm(countryValue);
    if (!normalized) return null;
    return COUNTRY_ALIAS_TO_CANONICAL.get(normalized) ?? null;
}

export function getCountryDisplayName(countryValue: string | undefined, language: SupportedLanguage): string {
    const raw = countryValue?.trim() ?? '';
    if (!raw) return '';
    const canonical = resolveCountryToCanonical(raw) ?? raw;
    const metadata = COUNTRY_BY_CANONICAL.get(canonical as (typeof DEFAULT_COUNTRY_OPTIONS)[number]);
    if (language === 'ar' && metadata?.arLabel) return metadata.arLabel;
    return canonical;
}

export function mergeCountryOptions(existing: string[] = []): string[] {
    const normalizedExisting = existing
        .map((country) => country.trim())
        .filter(Boolean)
        .map((country) => resolveCountryToCanonical(country) ?? country);
    const merged = new Set<string>([...DEFAULT_COUNTRY_OPTIONS, ...normalizedExisting]);
    return Array.from(merged).sort((a, b) => a.localeCompare(b));
}

export type CountryComboboxOption = {
    canonical: string;
    enLabel: string;
    arLabel?: string;
    label: string;
    searchTerms: string[];
};

export function buildCountryComboboxOptions(existing: string[] = [], language: SupportedLanguage = 'en'): CountryComboboxOption[] {
    return mergeCountryOptions(existing).map((country) => {
        const metadata = COUNTRY_BY_CANONICAL.get(country as (typeof DEFAULT_COUNTRY_OPTIONS)[number]);
        const label = language === 'ar' && metadata?.arLabel ? metadata.arLabel : country;
        const searchTerms = Array.from(
            new Set([
                country,
                metadata?.arLabel,
                ...(metadata?.aliases ?? []),
            ].filter(Boolean) as string[])
        );
        return {
            canonical: country,
            enLabel: country,
            arLabel: metadata?.arLabel,
            label,
            searchTerms,
        };
    });
}
