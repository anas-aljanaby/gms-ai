import type { Project } from '../../../../types';

type TranslateFn = (key: string, fallbackOrOptions?: string | Record<string, unknown>) => string;

const COUNTRY_KEY_MAP: Record<string, string> = {
    turkey: 'turkey',
    syria: 'syria',
    lebanon: 'lebanon',
    uganda: 'uganda',
    albania: 'albania',
    yemen: 'yemen',
    niger: 'niger',
};

const CITY_KEY_MAP: Record<string, string> = {
    tirana: 'tirana',
    istanbul: 'istanbul',
    ataq: 'ataq',
    niger: 'niger',
    afrin: 'afrin',
    aleppo: 'aleppo',
    gulu: 'gulu',
    idlib: 'idlib',
};

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

const localizeCountry = (country: string, t: TranslateFn): string => {
    const key = COUNTRY_KEY_MAP[normalize(country)];
    if (!key) return country;
    return t(`projects.location.countries.${key}`, country);
};

const localizeCity = (city: string, t: TranslateFn): string => {
    const key = CITY_KEY_MAP[normalize(city)];
    if (!key) return city;
    return t(`projects.location.cities.${key}`, city);
};

export const formatProjectLocation = (location: Project['location'] | undefined, t: TranslateFn): string => {
    if (!location) return '';
    const city = location.city ? localizeCity(location.city, t) : '';
    const country = location.country ? localizeCountry(location.country, t) : '';
    return [city, country].filter(Boolean).join(', ');
};
