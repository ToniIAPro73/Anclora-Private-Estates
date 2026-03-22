const DEFAULT_NEXUS_LOGIN_URL = 'https://nexus.anclora.group/login';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizeLanguage(value: string | null | undefined): 'es' | 'en' | 'de' | 'fr' | null {
  const candidate = String(value || '').trim().toLowerCase();
  if (candidate === 'es' || candidate === 'en' || candidate === 'de' || candidate === 'fr') {
    return candidate;
  }
  return null;
}

function normalizeBaseUrl(value: string | undefined, fallback: string): string {
  const candidate = String(value || '').trim();
  if (!candidate) return fallback;
  return trimTrailingSlash(candidate);
}

function withLanguage(url: string, language?: string | null): string {
  const normalized = normalizeLanguage(language);
  if (!normalized) return url;
  const nextUrl = new URL(url);
  nextUrl.searchParams.set('lang', normalized);
  return nextUrl.toString();
}

export function getNexusLoginUrl(language?: string | null): string {
  const loginUrl = normalizeBaseUrl(
    import.meta.env.VITE_ANCLORA_NEXUS_LOGIN_URL ?? import.meta.env.VITE_NEXUS_LOGIN_URL,
    DEFAULT_NEXUS_LOGIN_URL,
  );
  return withLanguage(loginUrl, language);
}
