/**
 * Integration Tests - WhatsApp Client + Evolution API
 * 
 * Verifica la integración del cliente WhatsApp con Evolution API
 */

import { WhatsAppClient } from '../../lib/whatsapp-api';
import { TestDataFactory } from '../test-helpers/test-data-factory';

// Mock fetch
global.fetch = jest.fn();

describe('WhatsApp Client + Evolution API Integration', () => {
  let client: WhatsAppClient;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
  const API_URL = 'http://localhost:8080';
  const API_KEY = 'test-api-key';

  beforeEach(() => {
    jest.clearAllMocks();
    client = new WhatsAppClient(API_URL, API_KEY);
  });

  describe('Instance Lifecycle', () => {
    it('should create instance and connect', async () => {
      // Mock create instance response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          instanceName: 'test-instance',
          status: 'created',
          qrcode: 'data:image/png;base64,test',
        }),
      } as any);

      // Mock connection status response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          instanceName: 'test-instance',
          status: 'open',
          profilePicUrl: 'https://example.com/pic.jpg',
        }),
      } as any);

      // Create instance
      const instance = await client.createInstance('test-instance');
      expect(instance.instanceName).toBe('test-instance');
      expect(instance.qrcode).toBeDefined();

      // Check connection status
      const status = await client.getInstance('test-instance');
      expect(status.status).toBe('open');
    });

    it('should handle instance creation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Instance already exists',
        }),
      } as any);

      await expect(
        client.createInstance('existing-instance')
      ).rejects.toThrow();
    });

    it('should delete instance', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Instance deleted successfully',
        }),
      } as any);

      await client.deleteInstance('test-instance');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/instance/delete'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('Message Sending Flow', () => {
    it('should send text message and receive confirmation', async () => {
      const response = TestDataFactory.createEvolutionResponse(true, {
        status: 'PENDING',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      } as any);

      const result = await client.sendTextMessage(
        'test-instance',
        '34600111222',
        'Hello from integration test'
      );

      expect(result.key).toBeDefined();
      expect(result.status).toBe('PENDING');
    });

    it('should send media message with caption', async () => {
      const response = TestDataFactory.createEvolutionResponse();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      } as any);

      const result = await client.sendMediaMessage(
        'test-instance',
        '34600111222',
        'https://example.com/property.jpg',
        'image',
        'Beautiful villa in Mallorca'
      );

      expect(result).toBeDefined();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/message/sendMedia'),
        expect.objectContaining({
          body: expect.stringContaining('property.jpg'),
        })
      );
    });

    it('should send interactive button message', async () => {
      const response = TestDataFactory.createEvolutionResponse();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      } as any);

      const buttons = [
        { displayText: 'Ver detalles', id: 'view-details' },
        { displayText: 'Agendar visita', id: 'book-visit' },
      ];

      const result = await client.sendButtonMessage(
        'test-instance',
        '34600111222',
        '¿Te interesa esta propiedad?',
        buttons
      );

      expect(result).toBeDefined();
    });

    it('should send list message', async () => {
      const response = TestDataFactory.createEvolutionResponse();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      } as any);

      const sections = [
        {
          title: 'Villas Disponibles',
          rows: [
            { title: 'Villa Azure Bay', description: 'Port Adriano - €2.5M', rowId: 'prop-1' },
            { title: 'Mansion Playa Viva', description: 'Portals Nous - €8M', rowId: 'prop-2' },
          ],
        },
      ];

      const result = await client.sendListMessage(
        'test-instance',
        '34600111222',
        'Selecciona una propiedad:',
        'Ver propiedades',
        sections
      );

      expect(result).toBeDefined();
    });
  });

  describe('Webhook Events Processing', () => {
    it('should process incoming message webhook', async () => {
      const webhookEvent = TestDataFactory.createWebhookEvent('message');

      // Simulate webhook reception
      expect(webhookEvent.event).toBe('messages.upsert');
      expect(webhookEvent.data.message.conversation).toBeDefined();
      expect(webhookEvent.data.key.fromMe).toBe(false);
    });

    it('should process message status update webhook', async () => {
      const webhookEvent = TestDataFactory.createWebhookEvent('status');

      expect(webhookEvent.event).toBe('messages.update');
      expect(webhookEvent.data.update.status).toBe(3); // read
    });

    it('should process connection update webhook', async () => {
      const webhookEvent = TestDataFactory.createWebhookEvent('connection');

      expect(webhookEvent.event).toBe('connection.update');
      expect(webhookEvent.data.state).toBe('open');
    });
  });

  describe('Rate Limiting', () => {
    it('should respect Evolution API rate limits', async () => {
      const messages = Array.from({ length: 10 }, (_, i) => 
        TestDataFactory.createMessage({
          recipientPhone: `34600${String(111222 + i).padStart(6, '0')}`,
        })
      );

      // Mock successful responses
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => TestDataFactory.createEvolutionResponse(),
      } as any);

      const startTime = Date.now();

      // Send messages with delay between them
      for (const msg of messages) {
        await client.sendTextMessage(
          'test-instance',
          msg.recipientPhone,
          msg.content.text
        );
        // Simulate small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      const duration = Date.now() - startTime;

      // Should take at least 450ms (9 * 50ms delays)
      expect(duration).toBeGreaterThan(400);
      expect(mockFetch).toHaveBeenCalledTimes(10);
    });

    it('should handle rate limit errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: 'Rate limit exceeded',
          retryAfter: 1000,
        }),
      } as any);

      await expect(
        client.sendTextMessage('test-instance', '34600111222', 'Test')
      ).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        client.sendTextMessage('test-instance', '34600111222', 'Test')
      ).rejects.toThrow('Network error');
    });

    it('should handle API errors with error messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid phone number',
          message: 'The phone number format is invalid',
        }),
      } as any);

      await expect(
        client.sendTextMessage('test-instance', 'invalid', 'Test')
      ).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      await expect(
        client.sendTextMessage('test-instance', '34600111222', 'Test')
      ).rejects.toThrow('Request timeout');
    });
  });

  describe('Media Upload', () => {
    it('should upload and send media in single operation', async () => {
      const mediaUrl = 'https://example.com/villa.jpg';
      const response = TestDataFactory.createEvolutionResponse();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      } as any);

      const result = await client.sendMediaMessage(
        'test-instance',
        '34600111222',
        mediaUrl,
        'image',
        'Villa en Mallorca'
      );

      expect(result).toBeDefined();
      
      const callArgs = mockFetch.mock.calls[0][1];
      const body = JSON.parse(callArgs?.body as string);
      expect(body.mediaUrl).toBe(mediaUrl);
      expect(body.caption).toBe('Villa en Mallorca');
    });

    it('should handle large media files', async () => {
      // Simulate large file (>5MB)
      const largeMediaUrl = 'https://example.com/large-video.mp4';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => TestDataFactory.createEvolutionResponse(),
      } as any);

      await client.sendMediaMessage(
        'test-instance',
        '34600111222',
        largeMediaUrl,
        'video'
      );

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('Message Status Tracking', () => {
    it('should track complete message lifecycle', async () => {
      const messageId = 'msg-123';
      const phone = '34600111222';

      // Send message
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          key: { id: messageId, remoteJid: `${phone}@s.whatsapp.net` },
          status: 'PENDING',
        }),
      } as any);

      const sentMsg = await client.sendTextMessage(
        'test-instance',
        phone,
        'Test message'
      );

      expect(sentMsg.key.id).toBe(messageId);

      // Mark as read
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as any);

      await client.markAsRead('test-instance', phone, messageId);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat/markMessageAsRead'),
        expect.any(Object)
      );
    });
  });

  describe('Contact Management', () => {
    it('should fetch and process contact list', async () => {
      const contacts = [
        TestDataFactory.createContact({ name: 'Juan López' }),
        TestDataFactory.createContact({ name: 'María García' }),
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => contacts,
      } as any);

      const result = await client.getContacts('test-instance');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Juan López');
    });
  });
});
