import type { LocaleId, Translations } from '@config/locales/locale.type';

import { en } from '@config/locales/en.config';
import { ptBr } from '@config/locales/pt-br.config';

export const locales: Record<LocaleId, Translations> = {
  'en': en,
  'pt-br': ptBr,
};
