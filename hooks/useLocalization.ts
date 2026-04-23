import { useContext } from 'react';
import { DashboardContext } from '../contexts/DashboardContext';

/**
 * useLocalization - خطاف مخصص للوصول إلى وظائف الترجمة واللغة الحالية.
 * 
 * @returns {{ t: (key: string, options?: any) => string, language: 'en' | 'ar', setLanguage: (lang: 'en' | 'ar') => void, dir: 'ltr' | 'rtl' }} - كائن يحتوي على دالة الترجمة، اللغة الحالية، دالة لتغيير اللغة، واتجاه النص.
 * 
 * @example
 * const { t, language, dir } = useLocalization();
 * return <div dir={dir}>{t('dashboard.title')}</div>;
 */
export const useLocalization = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a DashboardProvider');
  }
  const { t, state, setLanguage, dir } = context;

  return { 
    t, 
    language: state.language,
    setLanguage,
    dir
  };
};
