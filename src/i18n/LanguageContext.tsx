import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, SiteContent } from '../types';
import { getContent } from '../content';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRtl: boolean;
  content: SiteContent;
}

const STORAGE_KEY = 'munira_fashion_lang_pref';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Arabic unless explicitly saved as 'en' previously
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ar') {
        return stored;
      }
    } catch {
      // Ignore localStorage errors (e.g. sandbox restriction)
    }
    return 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const isRtl = language === 'ar';
  const content = useMemo(() => getContent(language), [language]);

  // Synchronize document attributes on language change
  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = isRtl ? 'rtl' : 'ltr';

    if (isRtl) {
      document.title = 'منيرة الحربي | دليل نجاح مشروع الأزياء — Munira Alharbi';
    } else {
      document.title = 'Munira Alharbi | The Fashion Business Success Guide';
    }
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isRtl, content }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
