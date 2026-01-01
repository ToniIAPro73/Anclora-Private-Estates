import { I18nService } from '../../services/i18n/i18n-service';
import { MessageTemplateEngine } from '../../services/i18n/message-template-engine';
import Redis from 'ioredis-mock';

describe('I18nService', () => {
  let redis: Redis;
  let i18nService: I18nService;

  beforeEach(async () => {
    redis = new Redis();
    i18nService = new I18nService(redis);
    await i18nService.initialize();
  });

  afterEach(async () => {
    await redis.flushall();
    redis.disconnect();
  });

  describe('detectLanguage', () => {
    it('should detect Spanish from common phrases', () => {
      const result = i18nService.detectLanguage('Hola, buenos días');
      expect(result.language).toBe('es');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.method).toBe('pattern');
    });

    it('should detect English from common phrases', () => {
      const result = i18nService.detectLanguage('Hello, good morning');
      expect(result.language).toBe('en');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.method).toBe('pattern');
    });

    it('should detect German from common phrases', () => {
      const result = i18nService.detectLanguage('Hallo, guten Tag');
      expect(result.language).toBe('de');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.method).toBe('pattern');
    });

    it('should use keyword matching for less obvious text', () => {
      const result = i18nService.detectLanguage('Estoy buscando una casa en Mallorca');
      expect(result.language).toBe('es');
      expect(result.method).toBe('keyword');
    });

    it('should default to Spanish for ambiguous text', () => {
      const result = i18nService.detectLanguage('123456');
      expect(result.language).toBe('es');
      expect(result.method).toBe('default');
      expect(result.confidence).toBeLessThan(0.5);
    });
  });

  describe('getUserLanguage', () => {
    it('should return stored language preference', async () => {
      await i18nService.setUserLanguage('34600123456', 'en', 'manual');
      const language = await i18nService.getUserLanguage('34600123456');
      expect(language).toBe('en');
    });

    it('should detect and store language from message', async () => {
      const language = await i18nService.getUserLanguage(
        '34600234567',
        'Hello, I am looking for a property'
      );
      expect(language).toBe('en');

      // Should be stored now
      const storedLanguage = await i18nService.getUserLanguage('34600234567');
      expect(storedLanguage).toBe('en');
    });

    it('should default to Spanish for new user without message', async () => {
      const language = await i18nService.getUserLanguage('34600345678');
      expect(language).toBe('es');
    });

    it('should not override high-confidence stored preference', async () => {
      await i18nService.setUserLanguage('34600456789', 'de', 'manual', 0.9);
      
      // Try to detect different language with low confidence
      const language = await i18nService.getUserLanguage(
        '34600456789',
        'maybe this is english'
      );
      
      expect(language).toBe('de'); // Should keep German
    });
  });

  describe('setUserLanguage', () => {
    it('should store language preference in Redis', async () => {
      await i18nService.setUserLanguage('34600567890', 'en', 'manual');

      const key = 'i18n:preference:34600567890';
      const data = await redis.get(key);
      
      expect(data).not.toBeNull();
      const preference = JSON.parse(data!);
      expect(preference.language).toBe('en');
      expect(preference.detected_from).toBe('manual');
      expect(preference.confidence).toBe(1.0);
    });

    it('should set TTL for preference', async () => {
      await i18nService.setUserLanguage('34600678901', 'es');

      const key = 'i18n:preference:34600678901';
      const ttl = await redis.ttl(key);
      
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(365 * 24 * 60 * 60);
    });

    it('should support auto-detected preferences', async () => {
      await i18nService.setUserLanguage('34600789012', 'de', 'auto', 0.85);

      const key = 'i18n:preference:34600789012';
      const data = await redis.get(key);
      
      const preference = JSON.parse(data!);
      expect(preference.detected_from).toBe('auto');
      expect(preference.confidence).toBe(0.85);
    });
  });

  describe('translate', () => {
    it('should translate welcome greeting in Spanish', async () => {
      await i18nService.setUserLanguage('34600890123', 'es');

      const translation = await i18nService.translate(
        'welcome.greeting',
        '34600890123'
      );

      expect(translation).toContain('Hola');
      expect(translation).toContain('Anclora');
    });

    it('should translate welcome greeting in English', async () => {
      await i18nService.setUserLanguage('34600901234', 'en');

      const translation = await i18nService.translate(
        'welcome.greeting',
        '34600901234'
      );

      expect(translation).toContain('Hello');
      expect(translation).toContain('Anclora');
    });

    it('should translate welcome greeting in German', async () => {
      await i18nService.setUserLanguage('34601012345', 'de');

      const translation = await i18nService.translate(
        'welcome.greeting',
        '34601012345'
      );

      expect(translation).toContain('Hallo');
      expect(translation).toContain('Anclora');
    });

    it('should interpolate parameters', async () => {
      await i18nService.setUserLanguage('34601123456', 'en');

      const translation = await i18nService.translate(
        'search.results',
        '34601123456',
        { params: { count: 5 } }
      );

      expect(translation).toContain('5');
      expect(translation).toContain('properties');
    });

    it('should detect language from message text if provided', async () => {
      const translation = await i18nService.translate(
        'welcome.greeting',
        '34601234567',
        { messageText: 'Hola, buenos días' }
      );

      expect(translation).toContain('Hola'); // Should be in Spanish
    });
  });

  describe('translateMultiple', () => {
    it('should translate multiple keys at once', async () => {
      await i18nService.setUserLanguage('34601345678', 'es');

      const translations = await i18nService.translateMultiple(
        ['confirmation.yes', 'confirmation.no', 'confirmation.maybe'],
        '34601345678'
      );

      expect(translations['confirmation.yes']).toBe('Sí');
      expect(translations['confirmation.no']).toBe('No');
      expect(translations['confirmation.maybe']).toBe('Quizás');
    });

    it('should support parameters for each key', async () => {
      await i18nService.setUserLanguage('34601456789', 'en');

      const translations = await i18nService.translateMultiple(
        ['search.results', 'handoff.wait_time'],
        '34601456789',
        {
          params: {
            'search.results': { count: 10 },
            'handoff.wait_time': { minutes: 3 },
          },
        }
      );

      expect(translations['search.results']).toContain('10');
      expect(translations['handoff.wait_time']).toContain('3');
    });
  });

  describe('formatPropertyDetails', () => {
    it('should format property details in user language', async () => {
      await i18nService.setUserLanguage('34601567890', 'es');

      const details = await i18nService.formatPropertyDetails('34601567890', {
        title: 'Villa Moderna en Calvià',
        price: 1500000,
        size: 350,
        bedrooms: 4,
        bathrooms: 3,
        location: 'Calvià',
        description: 'Hermosa villa con vistas al mar',
      });

      expect(details).toContain('Precio');
      expect(details).toContain('1.500.000');
      expect(details).toContain('350m²');
      expect(details).toContain('4');
      expect(details).toContain('3');
    });

    it('should format in English when user language is English', async () => {
      await i18nService.setUserLanguage('34601678901', 'en');

      const details = await i18nService.formatPropertyDetails('34601678901', {
        title: 'Modern Villa in Calvià',
        price: 1500000,
        size: 350,
        bedrooms: 4,
        bathrooms: 3,
        location: 'Calvià',
        description: 'Beautiful villa with sea views',
      });

      expect(details).toContain('Price');
      expect(details).toContain('€1,500,000');
      expect(details).toContain('350m²');
    });
  });

  describe('getLanguageStatistics', () => {
    it('should return statistics about language usage', async () => {
      await i18nService.setUserLanguage('34601789012', 'es', 'manual');
      await i18nService.setUserLanguage('34601890123', 'es', 'auto');
      await i18nService.setUserLanguage('34601901234', 'en', 'manual');
      await i18nService.setUserLanguage('34602012345', 'de', 'auto');

      const stats = await i18nService.getLanguageStatistics();

      expect(stats.total_users).toBe(4);
      expect(stats.by_language.es).toBe(2);
      expect(stats.by_language.en).toBe(1);
      expect(stats.by_language.de).toBe(1);
      expect(stats.auto_detected).toBe(2);
      expect(stats.manually_set).toBe(2);
    });
  });

  describe('clearUserLanguage', () => {
    it('should clear user language preference', async () => {
      await i18nService.setUserLanguage('34602123456', 'en');

      await i18nService.clearUserLanguage('34602123456');

      const language = await i18nService.getUserLanguage('34602123456');
      expect(language).toBe('es'); // Should default to Spanish
    });
  });
});

describe('MessageTemplateEngine', () => {
  let redis: Redis;
  let i18nService: I18nService;
  let templateEngine: MessageTemplateEngine;

  beforeEach(async () => {
    redis = new Redis();
    i18nService = new I18nService(redis);
    await i18nService.initialize();
    templateEngine = new MessageTemplateEngine(i18nService);
  });

  afterEach(async () => {
    await redis.flushall();
    redis.disconnect();
  });

  describe('getWelcomeMessage', () => {
    it('should generate welcome message in Spanish', async () => {
      await i18nService.setUserLanguage('34602234567', 'es');

      const template = await templateEngine.getWelcomeMessage('34602234567');

      expect(template.text).toContain('Hola');
      expect(template.text).toContain('Anclora');
    });

    it('should ask for name if not provided', async () => {
      await i18nService.setUserLanguage('34602345678', 'es');

      const template = await templateEngine.getWelcomeMessage('34602345678');

      expect(template.text).toContain('¿Cómo te llamo?');
    });

    it('should not ask for name if provided', async () => {
      await i18nService.setUserLanguage('34602456789', 'es');

      const template = await templateEngine.getWelcomeMessage('34602456789', 'John');

      expect(template.text).not.toContain('¿Cómo te llamo?');
    });
  });

  describe('getMainMenu', () => {
    it('should generate main menu with buttons', async () => {
      await i18nService.setUserLanguage('34602567890', 'es');

      const template = await templateEngine.getMainMenu('34602567890');

      expect(template.text).toContain('ayudarte');
      expect(template.buttons).toBeDefined();
      expect(template.buttons?.length).toBe(5);
      expect(template.buttons?.[0].id).toBe('search');
    });

    it('should generate menu in English', async () => {
      await i18nService.setUserLanguage('34602678901', 'en');

      const template = await templateEngine.getMainMenu('34602678901');

      expect(template.text).toContain('help');
      expect(template.buttons?.[0].text).toContain('Search');
    });
  });

  describe('getPropertyTypeSelection', () => {
    it('should generate property type options', async () => {
      await i18nService.setUserLanguage('34602789012', 'es');

      const template = await templateEngine.getPropertyTypeSelection('34602789012');

      expect(template.buttons).toBeDefined();
      expect(template.buttons?.length).toBe(4);
      expect(template.buttons?.map(b => b.id)).toEqual([
        'villa',
        'apartment',
        'land',
        'commercial',
      ]);
    });
  });

  describe('getBudgetSelection', () => {
    it('should generate budget range options', async () => {
      await i18nService.setUserLanguage('34602890123', 'es');

      const template = await templateEngine.getBudgetSelection('34602890123');

      expect(template.buttons).toBeDefined();
      expect(template.buttons?.length).toBe(5);
      expect(template.buttons?.[0].id).toBe('under_500k');
    });

    it('should display prices in euros', async () => {
      await i18nService.setUserLanguage('34602901234', 'en');

      const template = await templateEngine.getBudgetSelection('34602901234');

      expect(template.buttons?.[1].text).toContain('€500,000');
      expect(template.buttons?.[2].text).toContain('€1,000,000');
    });
  });

  describe('getPropertyDetails', () => {
    it('should format property details with all information', async () => {
      await i18nService.setUserLanguage('34603012345', 'es');

      const template = await templateEngine.getPropertyDetails('34603012345', {
        title: 'Villa Moderna',
        price: 2000000,
        size: 400,
        bedrooms: 5,
        bathrooms: 4,
        location: 'Calvià',
        description: 'Impresionante villa',
      });

      expect(template.text).toContain('Villa Moderna');
      expect(template.text).toContain('2.000.000');
      expect(template.text).toContain('400m²');
      expect(template.text).toContain('5');
      expect(template.text).toContain('4');
      expect(template.buttons).toBeDefined();
      expect(template.buttons?.length).toBe(3);
    });
  });

  describe('getLanguageSelection', () => {
    it('should show all language options', async () => {
      await i18nService.setUserLanguage('34603123456', 'es');

      const template = await templateEngine.getLanguageSelection('34603123456');

      expect(template.buttons).toBeDefined();
      expect(template.buttons?.length).toBe(3);
      expect(template.buttons?.map(b => b.id)).toEqual(['es', 'en', 'de']);
    });
  });

  describe('getErrorMessage', () => {
    it('should generate error message in user language', async () => {
      await i18nService.setUserLanguage('34603234567', 'es');

      const template = await templateEngine.getErrorMessage('34603234567', 'generic');

      expect(template.text).toContain('error');
    });

    it('should handle different error types', async () => {
      await i18nService.setUserLanguage('34603345678', 'en');

      const generic = await templateEngine.getErrorMessage('34603345678', 'generic');
      const timeout = await templateEngine.getErrorMessage('34603345678', 'timeout');

      expect(generic.text).not.toBe(timeout.text);
    });
  });
});
