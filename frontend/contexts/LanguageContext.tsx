'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { settingsApi, Settings } from '@/lib/settings-api';
import { translations, Language, Translations, getLanguageName, getLanguageFlag } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  t: Translations;
  settings: Settings | null;
  isLoading: boolean;
  setLanguage: (lang: Language) => void;
  getLanguageName: (lang: Language) => string;
  getLanguageFlag: (lang: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('PORTUGUESE'); // Default to Portuguese
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from backend on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const data = await settingsApi.getSettings();
        setSettings(data);

        // Set language from settings, default to PORTUGUESE if not set
        const lang = data.language || 'PORTUGUESE';
        setLanguageState(lang);

        // Save to localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('language', lang);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // If error loading settings, use Portuguese as default
        setLanguageState('PORTUGUESE');
        if (typeof window !== 'undefined') {
          localStorage.setItem('language', 'PORTUGUESE');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Check localStorage first (for SSR compatibility)
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language;
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
      localStorage.setItem('language', lang);
    }
  };

  // Get translations for current language
  const t = translations[language];

  const value: LanguageContextType = {
    language,
    t,
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
