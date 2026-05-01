import { useDashboard } from '../contexts/DashboardContext';

/**
 * useTheme - خطاف مخصص للوصول إلى وتغيير نسق التطبيق (فاتح/داكن).
 * 
 * @returns {{theme: 'light' | 'dark', toggleTheme: () => void}} - كائن يحتوي على النسق الحالي ودالة للتبديل.
 * 
 * @example
 * const { theme, toggleTheme } = useTheme();
 * return <button onClick={toggleTheme}>Switch to {theme === 'light' ? 'dark' : 'light'} mode</button>;
 */
export const useTheme = () => {
    const { state, toggleTheme } = useDashboard();
    return { theme: state.theme, toggleTheme };
};
