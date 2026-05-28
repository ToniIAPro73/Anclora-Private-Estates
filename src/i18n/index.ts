import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './locales/es.json';
import {
  ACTIVE_LOCALES,
  normalizeActiveLocale,
  resolveInitialLocale,
  type ActiveAncloraLocale,
} from '../lib/ancloraLanguageToggle';

const SUPPORTED_LANGUAGES = ACTIVE_LOCALES;
type SupportedLanguage = ActiveAncloraLocale;

const resources = {
  es: { translation: es },
};

const languageLoaders: Record<Exclude<SupportedLanguage, 'es'>, () => Promise<{ default: unknown }>> = {
  ca: () => import('./locales/ca.json'),
  de: () => import('./locales/de.json'),
  en: () => import('./locales/en.json'),
  sv: () => import('./locales/sv.json'),
  fr: () => import('./locales/fr.json'),
  it: () => import('./locales/it.json'),
  da: () => import('./locales/da.json'),
  nl: () => import('./locales/nl.json'),
  no: () => import('./locales/no.json'),
  pt: () => import('./locales/pt.json'),
};

const loadedLanguages = new Set<SupportedLanguage>(['es']);

const normalizeLanguage = (language: string | null | undefined): SupportedLanguage => {
  return normalizeActiveLocale(language) ?? 'es';
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
  const searchParams = new URLSearchParams(window.location.search);
  const preferredLanguage = resolveInitialLocale({
    urlLocale: searchParams.get('lang') ?? searchParams.get('locale'),
    persistedLocale: window.localStorage.getItem('i18nextLng'),
    browserLocales: Array.from(window.navigator.languages ?? [window.navigator.language]),
  });
  if (preferredLanguage !== 'es') {
    void ensureLanguageResources(preferredLanguage).then((resolvedLanguage) => {
      void i18n.changeLanguage(resolvedLanguage);
    });
  }
}

export default i18n;
