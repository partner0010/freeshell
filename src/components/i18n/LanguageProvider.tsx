'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { i18n, type Locale } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(i18n.getLocale());
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    setLocaleState(i18n.getLocale());
  }, [updateTrigger]);

  const setLocale = useCallback((newLocale: Locale) => {
    i18n.setLocale(newLocale);
    setLocaleState(newLocale);
    setUpdateTrigger(prev => prev + 1);
    // 언어 변경 이벤트 발생
    window.dispatchEvent(new CustomEvent('languagechange', { detail: newLocale }));
  }, []);

  const t = useCallback((key: string, params?: Record<string, string>) => {
    return i18n.t(key, params);
  }, [locale, updateTrigger]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

