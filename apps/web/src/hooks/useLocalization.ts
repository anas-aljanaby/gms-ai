import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../types';
import i18n, {
  DEFAULT_NAMESPACES,
  type AppNamespace,
  applyLanguageToDocument,
  getDirectionForLanguage,
  resolveNamespaceForKey,
} from '../lib/i18n';

/**
 * useLocalization - خطاف مخصص للوصول إلى وظائف الترجمة واللغة الحالية.
 * 
 * @returns {{ t: (key: string, options?: any) => string, language: 'en' | 'ar', setLanguage: (lang: 'en' | 'ar') => void, dir: 'ltr' | 'rtl' }} - كائن يحتوي على دالة الترجمة، اللغة الحالية، دالة لتغيير اللغة، واتجاه النص.
 * 
 * @example
 * const { t, language, dir } = useLocalization();
 * return <div dir={dir}>{t('dashboard.title')}</div>;
 */
export const useLocalization = (namespaces: AppNamespace[] = DEFAULT_NAMESPACES) => {
  const { t: baseT, i18n: instance } = useTranslation(namespaces);

  const language = (instance.resolvedLanguage === 'ar' ? 'ar' : 'en') as Language;
  const dir = getDirectionForLanguage(language);

  const t = useCallback(
    (key: string, optionsOrDefault?: any) => {
      const normalizedOptions =
        typeof optionsOrDefault === 'string'
          ? { defaultValue: optionsOrDefault }
          : optionsOrDefault ?? {};
      const inferredNamespace = normalizedOptions.ns ? undefined : resolveNamespaceForKey(key);

      if (inferredNamespace) {
        return instance.t(key, { ns: inferredNamespace, ...normalizedOptions });
      }

      return baseT(key, normalizedOptions);
    },
    [baseT, instance]
  );

  const setLanguage = useCallback((nextLanguage: Language) => {
    if (instance.resolvedLanguage === nextLanguage) {
      applyLanguageToDocument(nextLanguage);
      return;
    }

    void i18n.changeLanguage(nextLanguage);
  }, [instance.resolvedLanguage]);

  return {
    t,
    language,
    setLanguage,
    dir,
  };
};
