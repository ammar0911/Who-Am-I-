'use client';
import React, { createContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { AppContextType, Language, TranslationStrings } from '../types';
import { translations } from '../app/translations';
import SessionProvider from './SessionProvider';

const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#4f46e5' },
          background: { paper: '#ffffff', default: '#f9fafb' },
        }
      : {
          primary: { main: '#818cf8' },
          background: { paper: '#1f2937', default: '#111827' },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export const AppContext = createContext<AppContextType>({} as AppContextType);

// Translation type helpers
type ArrayTranslationKeys = 'daysOfWeek' | 'dayAbbreviations';
type TranslationKey = keyof TranslationStrings;
type IsArrayKey<T extends TranslationKey> = T extends ArrayTranslationKeys
  ? true
  : false;
type TranslationReturn<T extends TranslationKey> = IsArrayKey<T> extends true
  ? string[]
  : string;
export interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setMode(savedTheme);
    }
  }, []);

  const [language, setLanguage] = useState<Language>('en');

  const theme = createTheme(getDesignTokens(mode));

  useEffect(() => {
    document.documentElement.className = mode;
    document.documentElement.lang = language;
  }, [mode, language]);

  const t = <T extends TranslationKey>(
    key: T,
    params?: Record<string, string>
  ): TranslationReturn<T> => {
    const value = translations[language][key] || translations['en'][key];

    if (typeof value === 'function' && params && params.name) {
      return value({ name: params.name }) as TranslationReturn<T>;
    }

    if (Array.isArray(value)) {
      return value as TranslationReturn<T>;
    }

    if (typeof value === 'string') {
      return value as TranslationReturn<T>;
    }

    return String(value) as TranslationReturn<T>;
  };

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  };

  const value: AppContextType = {
    mode,
    toggleTheme,
    language,
    setLanguage,
    t,
  };

  return (
    <SessionProvider>
      <AppContext.Provider value={value}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppContext.Provider>
    </SessionProvider>
  );
};
