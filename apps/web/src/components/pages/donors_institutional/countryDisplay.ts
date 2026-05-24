type TranslateFn = (key: string, defaultValue?: string) => string;

const normalize = (value: string) => value.trim().toLowerCase();

const COUNTRY_KEY_MAP: Record<string, string> = {
    algeria: 'algeria',
    bahrain: 'bahrain',
    bangladesh: 'bangladesh',
    belgium: 'belgium',
    canada: 'canada',
    egypt: 'egypt',
    france: 'france',
    germany: 'germany',
    indonesia: 'indonesia',
    iraq: 'iraq',
    italy: 'italy',
    jordan: 'jordan',
    kuwait: 'kuwait',
    lebanon: 'lebanon',
    libya: 'libya',
    malaysia: 'malaysia',
    morocco: 'morocco',
    oman: 'oman',
    pakistan: 'pakistan',
    palestine: 'palestine',
    qatar: 'qatar',
    'saudi arabia': 'saudiArabia',
    spain: 'spain',
    sudan: 'sudan',
    switzerland: 'switzerland',
    syria: 'syria',
    tunisia: 'tunisia',
    turkey: 'turkey',
    uae: 'uae',
    uk: 'uk',
    'united kingdom': 'unitedKingdom',
    usa: 'usa',
    yemen: 'yemen',
    japan: 'japan',
};

export function formatInstitutionalCountry(country: string | undefined, t: TranslateFn): string {
    if (!country?.trim()) return '';
    const key = COUNTRY_KEY_MAP[normalize(country)];
    if (!key) return country;
    return t(`institutional_donors.countries.${key}`, country);
}

export function formatInstitutionalLocation(
    city: string | undefined,
    country: string | undefined,
    t: TranslateFn,
): string {
    const parts = [city?.trim(), country ? formatInstitutionalCountry(country, t) : ''].filter(Boolean);
    return parts.join(', ');
}
