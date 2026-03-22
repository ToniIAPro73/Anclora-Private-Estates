const DEFAULT_NEXUS_LOGIN_URL = 'https://nexus.anclora.group/login';
const DEFAULT_NEXUS_PRIVATE_AREA_URL = 'https://nexus.anclora.group';

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

function buildPortalUrl(pathname: string, language?: string | null): string {
  const explicitUrl = pathname === '/private-area/partner'
    ? import.meta.env.VITE_ANCLORA_PARTNER_PORTAL_URL ?? import.meta.env.VITE_PARTNER_PORTAL_URL
    : pathname === '/private-area/data-lab'
      ? import.meta.env.VITE_ANCLORA_DATA_LAB_URL ?? import.meta.env.VITE_DATA_LAB_URL
      : undefined;

  const baseOrExplicit = explicitUrl
    ? normalizeBaseUrl(explicitUrl, `${DEFAULT_NEXUS_PRIVATE_AREA_URL}${pathname}`)
    : `${normalizeBaseUrl(
        import.meta.env.VITE_ANCLORA_PRIVATE_AREA_URL ?? import.meta.env.VITE_NEXUS_PRIVATE_AREA_URL,
        DEFAULT_NEXUS_PRIVATE_AREA_URL,
      )}${pathname}`;

  return withLanguage(baseOrExplicit, language);
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

export function getPartnerPortalUrl(language?: string | null): string {
  return buildPortalUrl('/private-area/partner', language);
}

export function getDataLabPortalUrl(language?: string | null): string {
  return buildPortalUrl('/private-area/data-lab', language);
}
