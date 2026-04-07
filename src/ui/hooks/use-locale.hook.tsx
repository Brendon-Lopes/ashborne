import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactElement,
  type ReactNode,
} from 'react';

import type { LocaleId, Translations } from '@config/locales/locale.type';
import { locales } from '@config/locales/locales.config';
import { detectLocale } from '@utils/detect-locale.util';

type LocaleContextValue = {
  readonly t: Translations;
  readonly localeId: LocaleId;
  readonly setLocale: (locale: LocaleId) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  readonly locale?: LocaleId;
  readonly children: ReactNode;
};

export function LocaleProvider({ locale, children }: LocaleProviderProps): ReactElement {
  const [localeId, setLocaleId] = useState<LocaleId>(locale ?? detectLocale());

  const setLocale = useCallback((newLocale: LocaleId): void => {
    setLocaleId(newLocale);
  }, []);

  const translations = locales[localeId];

  const value: LocaleContextValue = {
    t: translations,
    localeId,
    setLocale,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (ctx === null) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
}
