import { getLocales } from 'expo-localization';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { translations, type Language, type TranslationKey } from '@/i18n/translations';

const LocaleContext = createContext({ language: 'en' as Language, t: (key: TranslationKey): string => translations.en[key] });

function deviceLanguage(): Language {
  return getLocales()[0]?.languageCode === 'vi' ? 'vi' : 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(deviceLanguage);
  useEffect(() => {
    function updateLanguage() {
      setLanguage(deviceLanguage());
    }
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') updateLanguage();
    });
    return () => subscription.remove();
  }, []);

  const t = useCallback((key: TranslationKey) => translations[language][key], [language]);
  return <LocaleContext.Provider value={{ language, t }}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
