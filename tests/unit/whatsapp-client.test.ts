/**
 * Unit Tests - WhatsApp Client
 */

import { WhatsAppClient } from '../../lib/whatsapp-api';
import { createMockEvolutionResponse, createTestPhone } from '../setup-tests';

// Mock fetch
global.fetch = jest.fn();

describe('WhatsAppClient', () => {
  let client: WhatsAppClient;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new WhatsAppClient(
      'http://localhost:8080',
      'test-api-key'
    );
  });

  describe('sendTextMessage', () => {
    it('should send text message successfully', async () => {
      mockFetch.mockResolvedValue(createMockEvolutionResponse() as any);

      const result = await client.sendTextMessage(
        'test-instance',
        createTestPhone(),
        'Hello World'
      );

      expect(result).toBeDefined();
      expect(result.key).toBeDefined();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/message/sendText'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'apikey': 'test-api-key',
          }),
        })
      );
    });

    it('should include options in request', async () => {
      mockFetch.mockResolvedValue(createMockEvolutionResponse() as any);

      await client.sendTextMessage(
        'test-instance',
        createTestPhone(),
        'Test',
        {
          delay: 1000,
          presence: 'composing',
        }
      );

      const callArgs = mockFetch.mock.calls[0][1];
      const body = JSON.parse(callArgs?.body as string);

      expect(body.options).toEqual({
        delay: 1000,
        presence: 'composing',
      });
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValue(createMockEvolutionResponse(false) as any);

      await expect(
        client.sendTextMessage('test-instance', createTestPhone(), 'Test')
      ).rejects.toThrow();
    });
  });

  describe('sendMediaMessage', () => {
    it('should send image message', async () => {
      mockFetch.mockResolvedValue(createMockEvolutionResponse() as any);

      const result = await client.sendMediaMessage(
        'test-instance',
        createTestPhone(),
        'https://example.com/image.jpg',
        'image',
        'Test caption'
      );

      expect(result).toBeDefined();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/message/sendMedia'),
        expect.any(Object)
      );
    });

    it('should send video message', async () => {
      mockFetch.mockResolvedValue(createMockEvolutionResponse() as any);

      await client.sendMediaMessage(
        'test-instance',
        createTestPhone(),
        'https://example.com/video.mp4',
        'video'
      );

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should send audio message', async () => {
      mockFetch.mockResolvedValue(createMockEvolutionResponse() as any);

      await client.sendMediaMessage(
        'test-instance',
        createTestPhone(),
        'https://example.com/audio.mp3',
        'audio'
      );

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should send document message', async () => {
      mockFetch.mockResolvedValue(createMockEvolutionResponse() as any);

      await client.sendMediaMessage(
        'test-instance',
        createTestPhone(),
        'https://example.com/doc.pdf',
        'document'
      );

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('sendTemplateMessage', () => {
    it('should send template message', async () => {
      mockFetch.mockResolvedValue(createMockEvolutionResponse() as any);

      const result = await client.sendTemplateMessage(
        'test-instance',
        createTestPhone(),
        'template-name',
        'es',
        []
      );

      expect(result).toBeDefined();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/message/sendTemplate'),
        expect.any(Object)
      );
    });
  });

  describe('sendButtonMessage', () => {
    it('should send button message', async () => {
      mockFetch.mockResolvedValue(createMockEvolutionResponse() as any);

      const buttons = [
        { displayText: 'Button 1', id: 'btn-1' },
        { displayText: 'Button 2', id: 'btn-2' },
      ];

      const result = await client.sendButtonMessage(
        'test-instance',
        createTestPhone(),
        'Choose an option',
        buttons
      );

      expect(result).toBeDefined();
    });
  });

  describe('sendListMessage', () => {
    it('should send list message', async () => {
      mockFetch.mockResolvedValue(createMockEvolutionResponse() as any);

      const sections = [
        {
          title: 'Section 1',
          rows: [
            { title: 'Option 1', description: 'Desc 1', rowId: 'row-1' },
          ],
        },
      ];

      const result = await client.sendListMessage(
        'test-instance',
        createTestPhone(),
        'Select an option',
        'Click here',
        sections
      );

      expect(result).toBeDefined();
    });
  });

  describe('getInstances', () => {
    it('should get all instances', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { instanceName: 'instance-1', status: 'open' },
          { instanceName: 'instance-2', status: 'close' },
        ],
      } as any);

      const instances = await client.getInstances();

      expect(instances).toHaveLength(2);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/instance/fetchInstances'),
        expect.any(Object)
      );
    });
  });

  describe('getInstance', () => {
    it('should get specific instance', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          instanceName: 'test-instance',
          status: 'open',
        }),
      } as any);

      const instance = await client.getInstance('test-instance');

      expect(instance).toBeDefined();
      expect(instance.instanceName).toBe('test-instance');
    });
  });

  describe('createInstance', () => {
    it('should create new instance', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          instanceName: 'new-instance',
          qrcode: 'data:image/png;base64,...',
        }),
      } as any);

      const instance = await client.createInstance('new-instance');

      expect(instance).toBeDefined();
      expect(instance.instanceName).toBe('new-instance');
      expect(instance.qrcode).toBeDefined();
    });
  });

  describe('deleteInstance', () => {
    it('should delete instance', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ message: 'Instance deleted' }),
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

  describe('setPresence', () => {
    it('should set presence status', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'available' }),
      } as any);

      await client.setPresence('test-instance', 'available');

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should mark message as read', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as any);

      await client.markAsRead(
        'test-instance',
        createTestPhone(),
        'msg-id-123'
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat/markMessageAsRead'),
        expect.any(Object)
      );
    });
  });

  describe('getContacts', () => {
    it('should get all contacts', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { id: createTestPhone(), name: 'Contact 1' },
          { id: createTestPhone('222333'), name: 'Contact 2' },
        ],
      } as any);

      const contacts = await client.getContacts('test-instance');

      expect(contacts).toHaveLength(2);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat/findContacts'),
        expect.any(Object)
      );
    });
  });

  describe('getMessages', () => {
    it('should get messages from chat', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { key: { id: 'msg-1' }, message: { conversation: 'Hello' } },
          { key: { id: 'msg-2' }, message: { conversation: 'Hi' } },
        ],
      } as any);

      const messages = await client.getMessages(
        'test-instance',
        createTestPhone()
      );

      expect(messages).toHaveLength(2);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(
        client.sendTextMessage('test-instance', createTestPhone(), 'Test')
      ).rejects.toThrow('Network error');
    });

    it('should handle 404 errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as any);

      await expect(
        client.getInstance('non-existent')
      ).rejects.toThrow();
    });

    it('should handle 500 errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as any);

      await expect(
        client.sendTextMessage('test-instance', createTestPhone(), 'Test')
      ).rejects.toThrow();
    });
  });
});
