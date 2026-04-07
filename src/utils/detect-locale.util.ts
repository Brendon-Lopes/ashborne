import type { LocaleId } from '@config/locales/locale.type';

const SUPPORTED_LOCALES: readonly LocaleId[] = ['en', 'pt-br'];

export function detectLocale(): LocaleId {
  try {
    const detected = new Intl.NumberFormat().resolvedOptions().locale.toLowerCase();
    if (detected.startsWith('pt')) {
      return 'pt-br';
    }
  } catch {
    // Intl not available — fallback to default
  }
  return 'en';
}

export function isValidLocale(locale: string): locale is LocaleId {
  return SUPPORTED_LOCALES.includes(locale as LocaleId);
}
