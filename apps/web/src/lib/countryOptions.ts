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

export function mergeCountryOptions(existing: string[] = []): string[] {
    const merged = new Set<string>([...DEFAULT_COUNTRY_OPTIONS, ...existing.filter((c) => c.trim())]);
    return Array.from(merged).sort((a, b) => a.localeCompare(b));
}
