'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import type { Language, Translation } from '@/types';

/**
 * Hook para gestión de traducciones en componentes
 * 
 * Bridging existing usage with next-intl
 */
export function useTranslation() {
  const locale = useLocale() as Language;
  const t_intl = useTranslations();
  
  /**
   * Función de traducción
   * 
   * @param key - Clave de traducción (ej: 'hero.headline')
   * @returns Texto traducido
   */
  const t = (key: string): string => {
    try {
      // next-intl expects the key directly if no namespace is used in useTranslations()
      return t_intl(key);
    } catch (e) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  };
  
  /**
   * Función para traducir objetos Translation
   * 
   * @param translation - Objeto con traducciones {es: '', en: '', de?: ''}
   * @returns Texto en el idioma actual
   */
  const tr = (translation: Translation): string => {
    return translation[locale] || translation['es'] || '';
  };
  
  /**
   * Función para formatear precio
   */
  const formatPrice = (price: number, currency: 'EUR' | 'USD' = 'EUR'): string => {
    const localeStr = locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-GB';
    return new Intl.NumberFormat(localeStr, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  /**
   * Función para formatear fecha
   */
  const formatDate = (
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  ): string => {
    const localeStr = locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-GB';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(localeStr, options).format(dateObj);
  };
  
  return {
    t,
    tr,
    language: locale,
    formatPrice,
    formatDate,
    isSpanish: locale === 'es',
    isEnglish: locale === 'en',
    isGerman: locale === 'de',
  };
}

/**
 * Hook para alternar idioma
 */
export function useLanguageToggle() {
  const pathname = usePathname();
  const locale = useLocale() as Language;
  const router = useRouter();
  
  /**
   * Obtener ruta localizada
   */
  const getLocalizedPath = (path: string, targetLanguage: Language): string => {
    // next-intl handling: replace the first segment if it's a locale
    const segments = path.split('/');
    const currentLocaleInPath = ['es', 'en', 'de'].includes(segments[1]) ? segments[1] : null;
    
    if (currentLocaleInPath) {
      segments[1] = targetLanguage;
    } else {
      // If no locale in path, add it as first segment? 
      // Actually with middleware redirects, it should usually have it.
      segments.splice(1, 0, targetLanguage);
    }
    
    return segments.join('/') || '/';
  };
  
  /**
   * Obtener URL para cambiar idioma de la página actual
   */
  const getToggleUrl = (): string => {
    const targetLanguage: Language = locale === 'es' ? 'en' : locale === 'en' ? 'de' : 'es';
    return getLocalizedPath(pathname || '/', targetLanguage);
  };

  /**
   * Cambiar idioma navegando a la nueva ruta
   */
  const toggleLanguage = (targetLanguage: Language) => {
    const newPath = getLocalizedPath(pathname || '/', targetLanguage);
    router.push(newPath);
  };
  
  return {
    currentLanguage: locale,
    getLocalizedPath,
    getToggleUrl,
    toggleLanguage,
  };
}
