/**
 * Unit Tests - WhatsApp Conversational Bot
 */

import { WhatsAppBot } from '../../lib/whatsapp-bot';
import { createTestPhone } from '../setup-tests';

describe('WhatsAppBot', () => {
  let bot: WhatsAppBot;

  beforeEach(() => {
    bot = new WhatsAppBot();
  });

  describe('intent detection', () => {
    it('should detect greeting intent', () => {
      const intent = bot.detectIntent('Hola');
      expect(intent).toBe('greeting');
    });

    it('should detect property inquiry intent', () => {
      const intent = bot.detectIntent('Me interesa una villa en Mallorca');
      expect(intent).toBe('property_inquiry');
    });

    it('should detect appointment intent', () => {
      const intent = bot.detectIntent('Quiero agendar una visita');
      expect(intent).toBe('appointment');
    });

    it('should detect pricing intent', () => {
      const intent = bot.detectIntent('¿Cuál es el precio?');
      expect(intent).toBe('pricing_info');
    });

    it('should detect general inquiry intent', () => {
      const intent = bot.detectIntent('Tengo una pregunta');
      expect(intent).toBe('general_inquiry');
    });

    it('should handle unknown intent', () => {
      const intent = bot.detectIntent('xyz123');
      expect(intent).toBe('unknown');
    });
  });

  describe('conversation flows', () => {
    it('should handle greeting flow', async () => {
      const response = await bot.processMessage(
        createTestPhone(),
        'Hola',
        {}
      );

      expect(response.message).toBeDefined();
      expect(response.nextStep).toBe('ask_help');
    });

    it('should handle property inquiry flow', async () => {
      const response = await bot.processMessage(
        createTestPhone(),
        'Busco una villa',
        {}
      );

      expect(response.message).toBeDefined();
      expect(response.nextStep).toBe('property_details');
    });

    it('should handle appointment flow', async () => {
      const response = await bot.processMessage(
        createTestPhone(),
        'Quiero agendar cita',
        {}
      );

      expect(response.message).toBeDefined();
      expect(response.nextStep).toBe('appointment_date');
    });
  });

  describe('context management', () => {
    it('should maintain conversation context', async () => {
      const phone = createTestPhone();

      await bot.processMessage(phone, 'Hola', {});
      const context = bot.getContext(phone);

      expect(context).toBeDefined();
      expect(context.lastIntent).toBe('greeting');
    });

    it('should update context with each message', async () => {
      const phone = createTestPhone();

      await bot.processMessage(phone, 'Hola', {});
      await bot.processMessage(phone, 'Busco villa', {});

      const context = bot.getContext(phone);
      expect(context.lastIntent).toBe('property_inquiry');
    });

    it('should clear context after timeout', () => {
      const phone = createTestPhone();
      bot.setContext(phone, { lastIntent: 'greeting', timestamp: Date.now() - 3600000 });

      bot.clearExpiredContexts();
      const context = bot.getContext(phone);

      expect(context).toBeNull();
    });
  });

  describe('handoff to human', () => {
    it('should handoff on request', async () => {
      const response = await bot.processMessage(
        createTestPhone(),
        'Quiero hablar con un agente',
        {}
      );

      expect(response.requiresHandoff).toBe(true);
    });

    it('should handoff on complex inquiry', async () => {
      const response = await bot.processMessage(
        createTestPhone(),
        'Necesito información muy específica sobre impuestos',
        {}
      );

      expect(response.requiresHandoff).toBe(true);
    });
  });
});
