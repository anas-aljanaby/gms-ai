import React, { createContext, useReducer, useContext, useEffect, useMemo, useCallback, ReactNode } from 'react';
import i18n, { getDirectionForLanguage } from '../lib/i18n';
import type { Language, Theme, Direction, DashboardState, DashboardAction } from '../types';

// --- CONTEXT SETUP ---

interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
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
        language: i18n.resolvedLanguage === 'ar' ? 'ar' : 'en',
        theme: 'light',
    };
};

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(dashboardReducer, getInitialState());

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
        document.documentElement.classList.toggle('dark', state.theme === 'dark');
    }, [state.theme]);

    useEffect(() => {
        const handleLanguageChanged = (language: string) => {
            dispatch({ type: 'SET_LANGUAGE', payload: language === 'ar' ? 'ar' : 'en' });
        };

        i18n.on('languageChanged', handleLanguageChanged);
        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, []);

    // Memoized dispatcher functions
    const setLanguage = useCallback((language: Language) => {
        void i18n.changeLanguage(language);
    }, []);
    const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);
    const dir = getDirectionForLanguage(state.language);

    const value = useMemo(() => ({
        state,
        dispatch,
        setLanguage,
        toggleTheme,
        dir,
    }), [state, setLanguage, toggleTheme, dir]);
    
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
