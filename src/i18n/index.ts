import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './locales/es.json';

const SUPPORTED_LANGUAGES = ['es', 'en', 'de'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const resources = {
  es: { translation: es },
};

const languageLoaders: Record<Exclude<SupportedLanguage, 'es'>, () => Promise<{ default: unknown }>> = {
  en: () => import('./locales/en.json'),
  de: () => import('./locales/de.json'),
};

const loadedLanguages = new Set<SupportedLanguage>(['es']);

const normalizeLanguage = (language: string | null | undefined): SupportedLanguage => {
  if (!language) return 'es';
  const base = language.toLowerCase().split('-')[0];
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(base) ? (base as SupportedLanguage) : 'es';
};

export const ensureLanguageResources = async (language: string): Promise<SupportedLanguage> => {
  const normalizedLanguage = normalizeLanguage(language);
  if (loadedLanguages.has(normalizedLanguage)) return normalizedLanguage;

  const loader = languageLoaders[normalizedLanguage as Exclude<SupportedLanguage, 'es'>];
  if (!loader) return 'es';

  const module = await loader();
  i18n.addResourceBundle(normalizedLanguage, 'translation', module.default, true, true);
  loadedLanguages.add(normalizedLanguage);
  return normalizedLanguage;
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    lng: 'es',
    supportedLngs: SUPPORTED_LANGUAGES,
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
  });

if (typeof window !== 'undefined') {
  const preferredLanguage = normalizeLanguage(window.localStorage.getItem('i18nextLng'));
  if (preferredLanguage !== 'es') {
    void ensureLanguageResources(preferredLanguage).then((resolvedLanguage) => {
      void i18n.changeLanguage(resolvedLanguage);
    });
  }
}

export default i18n;
