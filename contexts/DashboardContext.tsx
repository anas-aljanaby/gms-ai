import React, { createContext, useReducer, useContext, useEffect, useMemo, useCallback, ReactNode, useState } from 'react';
import type { Language, Theme, Direction, DashboardState, DashboardAction, LanguageOption } from '../types';
import { SUPPORTED_LANGUAGES } from '../lib/i18n';

// --- CONTEXT SETUP ---

const translationsCache: Partial<Record<Language, any>> = {};

interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  t: (key: string, options?: any) => any;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  dir: Direction;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// --- REDUCER ---

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
};

// --- PROVIDER ---

const getInitialState = (): DashboardState => {
    try {
        const storedState = localStorage.getItem('dashboardState');
        if (storedState) {
            return JSON.parse(storedState);
        }
    } catch (error) {
        console.error("Failed to load state from localStorage:", error);
    }
    return {
        language: 'ar',
        theme: 'light',
    };
};

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(dashboardReducer, getInitialState());
    const [translations, setTranslations] = useState<Record<string, any> | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Effect for persisting state to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('dashboardState', JSON.stringify(state));
        } catch (error) {
            console.error("Failed to save state to localStorage:", error);
        }
    }, [state]);

    // Effect for updating document attributes
    useEffect(() => {
        document.documentElement.lang = state.language;
        document.documentElement.dir = SUPPORTED_LANGUAGES.find(lang => lang.code === state.language)?.dir || 'ltr';
        document.documentElement.classList.toggle('dark', state.theme === 'dark');
    }, [state.language, state.theme]);

    // Effect for loading translation files
    useEffect(() => {
        const loadTranslations = async () => {
        setIsLoaded(false);
        try {
            if (!translationsCache.en) {
                const enRes = await fetch('/lib/locales/en.json');
                if (!enRes.ok) throw new Error('Failed to fetch en.json');
                translationsCache.en = await enRes.json();
            }
            if (state.language !== 'en' && !translationsCache[state.language]) {
                const langRes = await fetch(`/lib/locales/${state.language}.json`);
                if (!langRes.ok) throw new Error(`Failed to fetch ${state.language}.json`);
                translationsCache[state.language] = await langRes.json();
            }
            setTranslations(translationsCache[state.language] || translationsCache.en);
            setIsLoaded(true);
        } catch (error) {
            console.error("Failed to load translations:", error);
            if (translationsCache.en) {
                setTranslations(translationsCache.en);
                setIsLoaded(true);
            }
        }
        };
        loadTranslations();
    }, [state.language]);

    // Translation function `t`
    const t = useCallback((key: string, options?: any): any => {
        if (!isLoaded || !translations) return key;
        
        const keys = key.split('.');
        let result: any = translations;
        for (const k of keys) {
            result = result?.[k];
        }

        if (result === undefined && translations !== translationsCache.en) {
            result = translationsCache.en;
            for (const k of keys) {
                result = result?.[k];
            }
        }

        if (result === undefined) {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
        
        if (options?.returnObjects && typeof result === 'object') {
            return result;
        }

        let finalString = result;

        if (options?.count !== undefined && typeof result === 'object') {
            try {
                const pluralRules = new Intl.PluralRules(state.language);
                const pluralKey = pluralRules.select(options.count);
                finalString = result[pluralKey] || result.other;
            } catch (e) {
                console.error("Pluralization error:", e);
                finalString = result.other || key;
            }
        }
        
        if (typeof finalString !== 'string') {
             console.warn(`Translation for key '${key}' resolved to a non-string value without valid options.`, finalString);
             return key;
        }


        if (options && typeof options === 'object') {
            Object.keys(options).forEach(optKey => {
                if (optKey !== 'returnObjects') {
                    finalString = finalString.replace(`{${optKey}}`, options[optKey]);
                }
            });
        }
        return finalString;
    }, [isLoaded, translations, state.language]);

    // Memoized dispatcher functions
    const setLanguage = useCallback((language: Language) => dispatch({ type: 'SET_LANGUAGE', payload: language }), []);
    const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);
    const dir = SUPPORTED_LANGUAGES.find(lang => lang.code === state.language)?.dir || 'ltr';

    const value = useMemo(() => ({
        state,
        dispatch,
        t,
        setLanguage,
        toggleTheme,
        dir,
    }), [state, t, setLanguage, toggleTheme, dir]);

    if (!isLoaded) {
        return React.createElement('div', { className: "flex h-screen w-screen items-center justify-center" }, 'Loading...');
    }
    
    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};

// --- CUSTOM HOOKS ---

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// This hook is now defined here, making useTheme.ts obsolete but kept for compatibility during refactor.
export const useTheme = () => {
    const { state, toggleTheme } = useDashboard();
    return { theme: state.theme, toggleTheme };
};

export const useLanguage = () => {
    const { state, setLanguage } = useDashboard();
    return { language: state.language, setLanguage };
}