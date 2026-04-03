import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'zh-CN' | 'zh-TW';

interface Dictionary {
  privacy: string;
  disclosure: string;
  [key: string]: string;
}

const translations: Record<Language, Dictionary> = {
  en: {
    privacy: 'Privacy',
    disclosure: 'Disclosure',
  },
  'zh-CN': {
    privacy: '隐私政策',
    disclosure: '披露信息',
  },
  'zh-TW': {
    privacy: '隱私政策',
    disclosure: '披露資訊',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const detectLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'en';
  
  const langs = navigator.languages || [navigator.language];
  for (const lang of langs) {
    const l = lang.toLowerCase();
    if (l.includes('zh-hk') || l.includes('zh-tw') || l.includes('zh-hant')) {
      return 'zh-TW';
    }
    if (l.includes('zh-cn') || l.includes('zh-hans') || l === 'zh') {
      return 'zh-CN';
    }
    if (l.startsWith('en')) {
      return 'en';
    }
  }
  return 'en'; // default fallback
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Only detect on mount/first run
    const saved = localStorage.getItem('app_lang') as Language;
    if (saved && (saved === 'en' || saved === 'zh-CN' || saved === 'zh-TW')) {
      setLanguageState(saved);
    } else {
      setLanguageState(detectLanguage());
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = (key: string): string => {
    if (!translations[language]) return key;
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
