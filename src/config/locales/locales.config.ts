import type { LocaleId, Translations } from '@config/locales/locale.type';

import { en } from '@config/locales/en.config';
import { ptBr } from '@config/locales/pt-br.config';

export const locales: Record<LocaleId, Translations> = {
  'en': en,
  'pt-br': ptBr,
};

type LocaleMeta = {
  readonly id: LocaleId;
  readonly label: string;
  readonly key: string;
};

export const LOCALE_LIST: readonly LocaleMeta[] = [
  { id: 'en', label: 'English', key: '1' },
  { id: 'pt-br', label: 'Português (BR)', key: '2' },
];

export function getLocaleByKey(key: string): LocaleId | undefined {
  return LOCALE_LIST.find((l) => l.key === key)?.id;
}
