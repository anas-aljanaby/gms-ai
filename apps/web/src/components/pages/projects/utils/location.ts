import type { Language, Project } from '../../../../types';
import { getCountryDisplayName } from '../../../../lib/countryOptions';

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

const localizeCountry = (country: string, t: TranslateFn, language: Language): string => {
    const key = COUNTRY_KEY_MAP[normalize(country)];
    if (key) return t(`projects.location.countries.${key}`, country);
    return getCountryDisplayName(country, language);
};

const localizeCity = (city: string, t: TranslateFn): string => {
    const key = CITY_KEY_MAP[normalize(city)];
    if (!key) return city;
    return t(`projects.location.cities.${key}`, city);
};

export const formatProjectLocation = (
    location: Project['location'] | undefined,
    t: TranslateFn,
    language: Language = 'en',
): string => {
    if (!location) return '';
    const city = location.city ? localizeCity(location.city, t) : '';
    const country = location.country ? localizeCountry(location.country, t, language) : '';
    if (!city && !country) return '';
    if (!city) return country;
    if (!country) return city;
    return language === 'ar' ? `${country}، ${city}` : `${city}, ${country}`;
};

const TARGET_BENEFICIARY_DESCRIPTION_KEYS: Record<string, string> = {
    '150 albanian youth and orphans': 'projects.beneficiariesTab.descriptions.albania150',
    '١٥٠ طالباً ويتيماً من المجتمع المحلي': 'projects.beneficiariesTab.descriptions.albania150',
    '5000 villagers across 10 communities': 'projects.beneficiariesTab.descriptions.villagers5000',
    '1000 youth annually': 'projects.beneficiariesTab.descriptions.youth1000',
};

export const getLocalizedTargetBeneficiaries = (
    text: string,
    t: TranslateFn,
    language: Language,
): string => {
  if (!text || language === 'en') return text;
  const key = TARGET_BENEFICIARY_DESCRIPTION_KEYS[normalize(text.replace(/\.$/, ''))];
  return key ? t(key) : text;
};
