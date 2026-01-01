import i18next from 'i18next';
import { Redis } from 'ioredis';
import { logger } from '../../monitoring/logging/logger';
import esTranslations from '../../../locales/es/translation.json';
import enTranslations from '../../../locales/en/translation.json';
import deTranslations from '../../../locales/de/translation.json';

/**
 * i18n Service
 * 
 * Provides multi-language support for WhatsApp bot:
 * - Auto language detection from message
 * - User language preference storage
 * - Translation functions
 * - Template rendering in multiple languages
 * 
 * Supported languages: ES, EN, DE
 */

export type SupportedLanguage = 'es' | 'en' | 'de';

interface LanguagePreference {
  phone: string;
  language: SupportedLanguage;
  detected_from: 'auto' | 'manual';
  confidence: number; // 0-1
  updated_at: Date;
}

interface DetectionResult {
  language: SupportedLanguage;
  confidence: number;
  method: 'keyword' | 'pattern' | 'default';
}

export class I18nService {
  private redis: Redis;
  private initialized: boolean = false;

  // Language detection keywords
  private static readonly LANGUAGE_KEYWORDS = {
    es: [
      'hola', 'buenos', 'gracias', 'por favor', 'sí', 'no',
      'quiero', 'necesito', 'busco', 'propiedad', 'casa', 'piso',
      'cuánto', 'dónde', 'cuándo', 'cómo', 'qué'
    ],
    en: [
      'hello', 'hi', 'good', 'thanks', 'please', 'yes', 'no',
      'want', 'need', 'looking', 'property', 'house', 'apartment',
      'how much', 'where', 'when', 'how', 'what'
    ],
    de: [
      'hallo', 'guten', 'danke', 'bitte', 'ja', 'nein',
      'möchte', 'brauche', 'suche', 'immobilie', 'haus', 'wohnung',
      'wie viel', 'wo', 'wann', 'wie', 'was'
    ],
  };

  // Common phrases for pattern matching
  private static readonly LANGUAGE_PATTERNS = {
    es: /\b(hola|gracias|por favor|buenos días|buenas tardes)\b/i,
    en: /\b(hello|hi|thank you|thanks|please|good morning|good afternoon)\b/i,
    de: /\b(hallo|danke|bitte|guten tag|guten morgen)\b/i,
  };

  constructor(redis: Redis) {
    this.redis = redis;
  }

  /**
   * Initialize i18next
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    await i18next.init({
      lng: 'es', // Default language
      fallbackLng: 'es',
      resources: {
        es: { translation: esTranslations },
        en: { translation: enTranslations },
        de: { translation: deTranslations },
      },
      interpolation: {
        escapeValue: false,
      },
    });

    this.initialized = true;
    logger.info('i18n service initialized with 3 languages');
  }

  /**
   * Detect language from message text
   */
  detectLanguage(text: string): DetectionResult {
    const normalizedText = text.toLowerCase();

    // Try pattern matching first (highest confidence)
    for (const [lang, pattern] of Object.entries(I18nService.LANGUAGE_PATTERNS)) {
      if (pattern.test(normalizedText)) {
        return {
          language: lang as SupportedLanguage,
          confidence: 0.9,
          method: 'pattern',
        };
      }
    }

    // Try keyword matching
    const scores: Record<SupportedLanguage, number> = { es: 0, en: 0, de: 0 };

    for (const [lang, keywords] of Object.entries(I18nService.LANGUAGE_KEYWORDS)) {
      for (const keyword of keywords) {
        if (normalizedText.includes(keyword)) {
          scores[lang as SupportedLanguage]++;
        }
      }
    }

    const maxScore = Math.max(scores.es, scores.en, scores.de);

    if (maxScore > 0) {
      const detectedLang = (Object.keys(scores) as SupportedLanguage[]).find(
        lang => scores[lang] === maxScore
      )!;

      return {
        language: detectedLang,
        confidence: Math.min(maxScore / 3, 0.8), // Cap at 0.8 for keyword matching
        method: 'keyword',
      };
    }

    // Default to Spanish (Mallorca context)
    return {
      language: 'es',
      confidence: 0.3,
      method: 'default',
    };
  }

  /**
   * Get or detect user language preference
   */
  async getUserLanguage(phone: string, messageText?: string): Promise<SupportedLanguage> {
    try {
      // Check stored preference first
      const storedPref = await this.getStoredPreference(phone);
      
      if (storedPref && storedPref.confidence > 0.7) {
        return storedPref.language;
      }

      // If we have message text, try to detect
      if (messageText) {
        const detection = this.detectLanguage(messageText);
        
        // If high confidence detection, update preference
        if (detection.confidence > 0.7) {
          await this.setUserLanguage(phone, detection.language, 'auto', detection.confidence);
          return detection.language;
        }
      }

      // Use stored preference if available, otherwise default to Spanish
      return storedPref?.language || 'es';
    } catch (error) {
      logger.error('Error getting user language', { error, phone });
      return 'es'; // Fallback to Spanish
    }
  }

  /**
   * Set user language preference
   */
  async setUserLanguage(
    phone: string,
    language: SupportedLanguage,
    source: 'auto' | 'manual' = 'manual',
    confidence: number = 1.0
  ): Promise<void> {
    try {
      const preference: LanguagePreference = {
        phone,
        language,
        detected_from: source,
        confidence,
        updated_at: new Date(),
      };

      const key = `i18n:preference:${phone}`;
      await this.redis.setex(
        key,
        365 * 24 * 60 * 60, // 1 year
        JSON.stringify(preference)
      );

      logger.info('User language preference updated', {
        phone,
        language,
        source,
        confidence,
      });
    } catch (error) {
      logger.error('Error setting user language', { error, phone });
      throw error;
    }
  }

  /**
   * Get stored language preference
   */
  private async getStoredPreference(phone: string): Promise<LanguagePreference | null> {
    try {
      const key = `i18n:preference:${phone}`;
      const data = await this.redis.get(key);

      if (!data) return null;

      const preference = JSON.parse(data) as LanguagePreference;
      preference.updated_at = new Date(preference.updated_at);

      return preference;
    } catch (error) {
      logger.error('Error getting stored preference', { error, phone });
      return null;
    }
  }

  /**
   * Translate a key
   */
  async translate(
    key: string,
    phone: string,
    options?: {
      messageText?: string;
      language?: SupportedLanguage;
      params?: Record<string, any>;
    }
  ): Promise<string> {
    try {
      // Ensure initialized
      if (!this.initialized) {
        await this.initialize();
      }

      // Determine language
      const language = options?.language || 
        await this.getUserLanguage(phone, options?.messageText);

      // Translate
      const translated = i18next.t(key, {
        lng: language,
        ...options?.params,
      });

      return translated;
    } catch (error) {
      logger.error('Error translating key', { error, key, phone });
      // Fallback to English if translation fails
      return i18next.t(key, { lng: 'en', ...options?.params });
    }
  }

  /**
   * Get multiple translations at once
   */
  async translateMultiple(
    keys: string[],
    phone: string,
    options?: {
      messageText?: string;
      language?: SupportedLanguage;
      params?: Record<string, Record<string, any>>;
    }
  ): Promise<Record<string, string>> {
    const language = options?.language || 
      await this.getUserLanguage(phone, options?.messageText);

    const translations: Record<string, string> = {};

    for (const key of keys) {
      translations[key] = i18next.t(key, {
        lng: language,
        ...options?.params?.[key],
      });
    }

    return translations;
  }

  /**
   * Get language-specific menu options
   */
  async getMenuOptions(phone: string, messageText?: string): Promise<{
    title: string;
    options: Array<{ id: string; text: string }>;
  }> {
    const language = await this.getUserLanguage(phone, messageText);

    const title = i18next.t('menu.main', { lng: language });
    const options = [
      { id: 'search', text: i18next.t('menu.options.search', { lng: language }) },
      { id: 'appointment', text: i18next.t('menu.options.appointment', { lng: language }) },
      { id: 'info', text: i18next.t('menu.options.info', { lng: language }) },
      { id: 'agent', text: i18next.t('menu.options.agent', { lng: language }) },
      { id: 'language', text: i18next.t('menu.options.language', { lng: language }) },
    ];

    return { title, options };
  }

  /**
   * Get language change options
   */
  async getLanguageOptions(phone: string): Promise<{
    current: string;
    options: Array<{ id: SupportedLanguage; text: string }>;
  }> {
    const currentLang = await this.getUserLanguage(phone);

    const current = i18next.t('language.current', { lng: currentLang });
    const options: Array<{ id: SupportedLanguage; text: string }> = [
      { id: 'es', text: i18next.t('language.options.es', { lng: currentLang }) },
      { id: 'en', text: i18next.t('language.options.en', { lng: currentLang }) },
      { id: 'de', text: i18next.t('language.options.de', { lng: currentLang }) },
    ];

    return { current, options };
  }

  /**
   * Format property details in user's language
   */
  async formatPropertyDetails(
    phone: string,
    property: {
      title: string;
      price: number;
      size: number;
      bedrooms: number;
      bathrooms: number;
      location: string;
      description: string;
    }
  ): Promise<string> {
    const language = await this.getUserLanguage(phone);

    return i18next.t('property.details', {
      lng: language,
      title: property.title,
      price: property.price.toLocaleString(),
      size: property.size,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      location: property.location,
      description: property.description,
    });
  }

  /**
   * Format appointment confirmation in user's language
   */
  async formatAppointmentConfirmation(
    phone: string,
    appointment: {
      date: string;
      time: string;
      property: string;
    }
  ): Promise<string> {
    const language = await this.getUserLanguage(phone);

    return i18next.t('appointment.confirmation', {
      lng: language,
      date: appointment.date,
      time: appointment.time,
      property: appointment.property,
    });
  }

  /**
   * Get error message in user's language
   */
  async getErrorMessage(
    phone: string,
    errorType: 'generic' | 'invalid_input' | 'property_not_found' | 'system_error' | 'timeout' | 'rate_limit'
  ): Promise<string> {
    const language = await this.getUserLanguage(phone);
    return i18next.t(`errors.${errorType}`, { lng: language });
  }

  /**
   * Get statistics about language usage
   */
  async getLanguageStatistics(): Promise<{
    total_users: number;
    by_language: Record<SupportedLanguage, number>;
    auto_detected: number;
    manually_set: number;
  }> {
    try {
      const pattern = 'i18n:preference:*';
      const keys = await this.redis.keys(pattern);

      const stats = {
        total_users: keys.length,
        by_language: { es: 0, en: 0, de: 0 } as Record<SupportedLanguage, number>,
        auto_detected: 0,
        manually_set: 0,
      };

      for (const key of keys) {
        const data = await this.redis.get(key);
        if (!data) continue;

        const pref = JSON.parse(data) as LanguagePreference;
        stats.by_language[pref.language]++;

        if (pref.detected_from === 'auto') stats.auto_detected++;
        else stats.manually_set++;
      }

      return stats;
    } catch (error) {
      logger.error('Error getting language statistics', { error });
      throw error;
    }
  }

  /**
   * Clear user language preference (for testing/reset)
   */
  async clearUserLanguage(phone: string): Promise<void> {
    const key = `i18n:preference:${phone}`;
    await this.redis.del(key);
    logger.info('User language preference cleared', { phone });
  }
}
