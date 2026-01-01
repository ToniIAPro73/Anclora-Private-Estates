'use client';

import { usePathname } from 'next/navigation';
import type { Language, Translation } from '@/types';
import esTranslations from '@/data/translations/es.json';
import enTranslations from '@/data/translations/en.json';

/**
 * Hook para gestión de traducciones en componentes
 * 
 * @example
 * const { t, language } = useTranslation();
 * const title = t('hero.headline');
 */
export function useTranslation() {
  const pathname = usePathname();
  
  // Detectar idioma de la URL
  const language: Language = pathname?.startsWith('/en') ? 'en' : 'es';
  
  // Seleccionar diccionario según idioma
  const translations = language === 'en' ? enTranslations : esTranslations;
  
  /**
   * Función de traducción
   * Soporta notación de punto para acceder a objetos anidados
   * 
   * @param key - Clave de traducción (ej: 'hero.headline')
   * @returns Texto traducido
   */
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  /**
   * Función para traducir objetos Translation
   * 
   * @param translation - Objeto con traducciones {es: '', en: ''}
   * @returns Texto en el idioma actual
   */
  const tr = (translation: Translation): string => {
    return translation[language];
  };
  
  /**
   * Función para formatear precio
   * 
   * @param price - Precio en número
   * @param currency - Código de moneda (EUR, USD)
   * @returns Precio formateado según idioma
   */
  const formatPrice = (price: number, currency: 'EUR' | 'USD' = 'EUR'): string => {
    const locale = language === 'es' ? 'es-ES' : 'en-GB';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  /**
   * Función para formatear fecha
   * 
   * @param date - Fecha a formatear
   * @param options - Opciones de formateo
   * @returns Fecha formateada según idioma
   */
  const formatDate = (
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  ): string => {
    const locale = language === 'es' ? 'es-ES' : 'en-GB';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  };
  
  return {
    t,
    tr,
    language,
    formatPrice,
    formatDate,
    isSpanish: language === 'es',
    isEnglish: language === 'en',
  };
}

/**
 * Hook para alternar idioma
 * 
 * @example
 * const { toggleLanguage, getLocalizedPath } = useLanguageToggle();
 */
export function useLanguageToggle() {
  const pathname = usePathname();
  const currentLanguage: Language = pathname?.startsWith('/en') ? 'en' : 'es';
  
  /**
   * Obtener ruta localizada
   * 
   * @param path - Ruta a localizar
   * @param targetLanguage - Idioma objetivo
   * @returns Ruta localizada
   */
  const getLocalizedPath = (path: string, targetLanguage: Language): string => {
    // Si el path ya tiene prefijo de idioma, reemplazarlo
    if (path.startsWith('/en/') || path.startsWith('/en')) {
      const pathWithoutLang = path.replace(/^\/en\/?/, '/');
      return targetLanguage === 'en' ? `/en${pathWithoutLang}` : pathWithoutLang;
    }
    
    // Si el path es español (sin prefijo), añadir /en si es necesario
    return targetLanguage === 'en' ? `/en${path}` : path;
  };
  
  /**
   * Obtener URL para cambiar idioma de la página actual
   * 
   * @returns URL localizada
   */
  const getToggleUrl = (): string => {
    const targetLanguage: Language = currentLanguage === 'es' ? 'en' : 'es';
    return getLocalizedPath(pathname || '/', targetLanguage);
  };
  
  return {
    currentLanguage,
    getLocalizedPath,
    getToggleUrl,
  };
}
