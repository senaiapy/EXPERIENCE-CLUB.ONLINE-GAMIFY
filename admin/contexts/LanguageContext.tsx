'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { settingsApi, Settings } from '../lib/settings-api';

export type Language = 'ENGLISH' | 'SPANISH' | 'PORTUGUESE';

interface LanguageContextType {
  language: Language;
  settings: Settings | null;
  isLoading: boolean;
  setLanguage: (lang: Language) => void;
  getLanguageName: (lang: Language) => string;
  getLanguageFlag: (lang: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const getLanguageName = (lang: Language): string => {
  const names: Record<Language, string> = {
    ENGLISH: 'English',
    SPANISH: 'Español',
    PORTUGUESE: 'Português',
  };
  return names[lang];
};

export const getLanguageFlag = (lang: Language): string => {
  const flags: Record<Language, string> = {
    ENGLISH: '🇺🇸',
    SPANISH: '🇵🇾',
    PORTUGUESE: '🇧🇷',
  };
  return flags[lang];
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('SPANISH'); // Default to Spanish
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from backend on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const data = await settingsApi.getSettings();
        setSettings(data);

        // Set language from settings, default to SPANISH if not set
        const lang = data.language || 'SPANISH';
        setLanguageState(lang);

        // Save to localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_language', lang);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // If error loading settings, use Spanish as default
        setLanguageState('SPANISH');
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_language', 'SPANISH');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Check localStorage first (for SSR compatibility)
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('admin_language') as Language;
      if (savedLang && ['ENGLISH', 'SPANISH', 'PORTUGUESE'].includes(savedLang)) {
        setLanguageState(savedLang);
      }
    }

    loadSettings();
  }, []);

  // Function to manually change language (saves to localStorage)
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_language', lang);
    }
  };

  const value: LanguageContextType = {
    language,
    settings,
    isLoading,
    setLanguage,
    getLanguageName,
    getLanguageFlag,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
