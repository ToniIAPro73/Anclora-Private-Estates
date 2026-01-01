/**
 * Unit Tests - WhatsApp Templates
 */

import { WhatsAppTemplates } from '../../lib/whatsapp-templates';

describe('WhatsAppTemplates', () => {
  const templates = new WhatsAppTemplates();

  describe('welcome templates', () => {
    it('should generate formal welcome message', () => {
      const template = templates.getTemplate('welcome', 'formal', { name: 'Juan' });
      
      expect(template).toContain('Juan');
      expect(template).toContain('Anclora Private Estates');
    });

    it('should generate casual welcome message', () => {
      const template = templates.getTemplate('welcome', 'casual', { name: 'María' });
      
      expect(template).toContain('María');
    });

    it('should generate VIP welcome message', () => {
      const template = templates.getTemplate('welcome', 'vip', { name: 'Sr. López' });
      
      expect(template).toContain('Sr. López');
    });
  });

  describe('property inquiry templates', () => {
    it('should generate property inquiry response', () => {
      const template = templates.getTemplate('property_inquiry', 'standard', {
        propertyName: 'Villa Azure Bay',
        location: 'Port Adriano',
        price: '€2.5M',
      });
      
      expect(template).toContain('Villa Azure Bay');
      expect(template).toContain('Port Adriano');
      expect(template).toContain('€2.5M');
    });

    it('should generate luxury property inquiry', () => {
      const template = templates.getTemplate('property_inquiry', 'luxury', {
        propertyName: 'Mansion Playa Viva',
        price: '€8M',
      });
      
      expect(template).toContain('Mansion Playa Viva');
    });
  });

  describe('appointment templates', () => {
    it('should generate appointment confirmation', () => {
      const template = templates.getTemplate('appointment_confirmation', 'standard', {
        date: '15 de enero',
        time: '10:00 AM',
      });
      
      expect(template).toContain('15 de enero');
      expect(template).toContain('10:00 AM');
    });

    it('should generate appointment reminder', () => {
      const template = templates.getTemplate('appointment_reminder', 'standard', {
        date: 'mañana',
        time: '10:00 AM',
      });
      
      expect(template).toContain('mañana');
    });
  });

  describe('follow-up templates', () => {
    it('should generate follow-up message', () => {
      const template = templates.getTemplate('follow_up', 'standard', {
        name: 'Carlos',
      });
      
      expect(template).toContain('Carlos');
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid template type', () => {
      expect(() => {
        templates.getTemplate('invalid_type' as any, 'standard', {});
      }).toThrow();
    });

    it('should throw error for invalid variant', () => {
      expect(() => {
        templates.getTemplate('welcome', 'invalid_variant' as any, {});
      }).toThrow();
    });
  });
});
