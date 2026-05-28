export type AncloraLocale =
  | 'es'
  | 'ca'
  | 'de'
  | 'en'
  | 'sv'
  | 'fr'
  | 'it'
  | 'da'
  | 'nl'
  | 'no'
  | 'pt'

export type ActiveAncloraLocale = 'es' | 'ca' | 'de' | 'en' | 'sv' | 'fr' | 'it' | 'da' | 'nl' | 'no' | 'pt'

export type LanguageToggleMode = 'segmented' | 'modal-popover'

export const ULTRA_PREMIUM_LOCALES: AncloraLocale[] = [
  'es',
  'ca',
  'de',
  'en',
  'sv',
  'fr',
  'it',
  'da',
  'nl',
  'no',
  'pt',
]

export const ACTIVE_LOCALES: ActiveAncloraLocale[] = [
  'es',
  'ca',
  'de',
  'en',
  'sv',
  'fr',
  'it',
  'da',
  'nl',
  'no',
  'pt',
]

export const ANCLORA_LOCALE_LABELS: Record<
  AncloraLocale,
  { short: string; nativeName: string; englishName: string }
> = {
  es: { short: 'ES', nativeName: 'Español', englishName: 'Spanish' },
  ca: { short: 'CA', nativeName: 'Català', englishName: 'Catalan' },
  de: { short: 'DE', nativeName: 'Deutsch', englishName: 'German' },
  en: { short: 'EN', nativeName: 'English', englishName: 'English' },
  sv: { short: 'SV', nativeName: 'Svenska', englishName: 'Swedish' },
  fr: { short: 'FR', nativeName: 'Français', englishName: 'French' },
  it: { short: 'IT', nativeName: 'Italiano', englishName: 'Italian' },
  da: { short: 'DA', nativeName: 'Dansk', englishName: 'Danish' },
  nl: { short: 'NL', nativeName: 'Nederlands', englishName: 'Dutch' },
  no: { short: 'NO', nativeName: 'Norsk', englishName: 'Norwegian' },
  pt: { short: 'PT', nativeName: 'Português', englishName: 'Portuguese' },
}

export function isActiveLocale(locale: string | null | undefined): locale is ActiveAncloraLocale {
  if (!locale) return false
  return ACTIVE_LOCALES.includes(locale.toLowerCase().split(/[_-]/)[0] as ActiveAncloraLocale)
}

export function normalizeActiveLocale(locale: string | null | undefined): ActiveAncloraLocale | undefined {
  if (!locale) return undefined
  const base = locale.toLowerCase().split(/[_-]/)[0]
  return isActiveLocale(base) ? base : undefined
}

export function resolveInitialLocale(input: {
  urlLocale?: string | null
  persistedLocale?: string | null
  browserLocales?: string[]
}): ActiveAncloraLocale {
  return (
    normalizeActiveLocale(input.urlLocale) ??
    normalizeActiveLocale(input.persistedLocale) ??
    input.browserLocales?.map(normalizeActiveLocale).find(Boolean) ??
    'es'
  )
}

export function getLanguageToggleMode(): LanguageToggleMode {
  return 'modal-popover'
}
