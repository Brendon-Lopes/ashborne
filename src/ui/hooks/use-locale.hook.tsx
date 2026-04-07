import { createContext, useContext, type ReactElement, type ReactNode } from 'react';

import type { LocaleId, Translations } from '@config/locales/locale.type';
import { locales } from '@config/locales/locales.config';

const LocaleContext = createContext<Translations>(locales['en']);

type LocaleProviderProps = {
  readonly locale: LocaleId;
  readonly children: ReactNode;
};

export function LocaleProvider({ locale, children }: LocaleProviderProps): ReactElement {
  const translations = locales[locale];

  return (
    <LocaleContext.Provider value={translations}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): Translations {
  return useContext(LocaleContext);
}
