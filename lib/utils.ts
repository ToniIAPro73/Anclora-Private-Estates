import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind CSS de forma óptima
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un precio en euros con separadores de miles
 */
export function formatPrice(price: number, currency: 'EUR' | 'USD' = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formatea un rango de precios
 */
export function formatPriceRange(min: number, max: number, currency: 'EUR' | 'USD' = 'EUR'): string {
  return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`;
}

/**
 * Trunca un texto a una longitud máxima
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Convierte un string a slug (URL-friendly)
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

/**
 * Obtiene las iniciales de un nombre
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Valida si un email es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida si un teléfono español es válido
 */
export function isValidSpanishPhone(phone: string): boolean {
  const phoneRegex = /^(\+34|0034|34)?[6789]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Formatea un número de teléfono español
 */
export function formatSpanishPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
}

/**
 * Calcula el tiempo de lectura estimado (palabras por minuto)
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Formatea una fecha en español
 */
export function formatDate(date: Date | string, locale: 'es' | 'en' = 'es'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Genera un ID único
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return prefix ? `${prefix}_${timestamp}${randomStr}` : `${timestamp}${randomStr}`;
}

/**
 * Retrasa la ejecución (útil para testing y UX)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Detecta si estamos en el cliente o servidor
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Obtiene la URL completa del sitio
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

/**
 * Construye una URL absoluta
 */
export function getAbsoluteUrl(path: string): string {
  return `${getSiteUrl()}${path}`;
}
