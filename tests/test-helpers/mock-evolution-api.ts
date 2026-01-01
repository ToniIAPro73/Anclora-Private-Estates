/**
 * Mock Evolution API Server
 * 
 * Simula respuestas de Evolution API para tests de integración
 */

export class MockEvolutionAPI {
  private instances = new Map<string, any>();
  private messages = new Map<string, any[]>();

  /**
   * Mock: Create Instance
   */
  createInstance(instanceName: string) {
    const instance = {
      instanceName,
      status: 'created',
      qrcode: `data:image/png;base64,mock-qr-${instanceName}`,
      createdAt: new Date().toISOString(),
    };

    this.instances.set(instanceName, instance);
    return instance;
  }

  /**
   * Mock: Get Instance
   */
  getInstance(instanceName: string) {
    const instance = this.instances.get(instanceName);
    
    if (!instance) {
      throw new Error(`Instance ${instanceName} not found`);
    }

    return {
      ...instance,
      status: 'open',
      profilePicUrl: 'https://example.com/profile.jpg',
    };
  }

  /**
   * Mock: Delete Instance
   */
  deleteInstance(instanceName: string) {
    const existed = this.instances.has(instanceName);
    this.instances.delete(instanceName);
    this.messages.delete(instanceName);

    return {
      success: existed,
      message: existed ? 'Instance deleted' : 'Instance not found',
    };
  }

  /**
   * Mock: List Instances
   */
  listInstances() {
    return Array.from(this.instances.values());
  }

  /**
   * Mock: Send Text Message
   */
  sendTextMessage(instanceName: string, phone: string, text: string, options = {}) {
    this._ensureInstance(instanceName);

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const message = {
      key: {
        remoteJid: `${phone}@s.whatsapp.net`,
        fromMe: true,
        id: messageId,
      },
      message: {
        conversation: text,
      },
      messageTimestamp: Date.now(),
      status: 'PENDING',
      ...options,
    };

    this._storeMessage(instanceName, message);
    return message;
  }

  /**
   * Mock: Send Media Message
   */
  sendMediaMessage(
    instanceName: string,
    phone: string,
    mediaUrl: string,
    mediaType: string,
    caption?: string
  ) {
    this._ensureInstance(instanceName);

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const message = {
      key: {
        remoteJid: `${phone}@s.whatsapp.net`,
        fromMe: true,
        id: messageId,
      },
      message: {
        [`${mediaType}Message`]: {
          url: mediaUrl,
          caption: caption || '',
        },
      },
      messageTimestamp: Date.now(),
      status: 'PENDING',
    };

    this._storeMessage(instanceName, message);
    return message;
  }

  /**
   * Mock: Send Button Message
   */
  sendButtonMessage(
    instanceName: string,
    phone: string,
    text: string,
    buttons: Array<{ displayText: string; id: string }>
  ) {
    this._ensureInstance(instanceName);

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const message = {
      key: {
        remoteJid: `${phone}@s.whatsapp.net`,
        fromMe: true,
        id: messageId,
      },
      message: {
        buttonsMessage: {
          contentText: text,
          buttons: buttons.map(btn => ({
            buttonId: btn.id,
            buttonText: { displayText: btn.displayText },
          })),
        },
      },
      messageTimestamp: Date.now(),
      status: 'PENDING',
    };

    this._storeMessage(instanceName, message);
    return message;
  }

  /**
   * Mock: Simulate Incoming Message
   */
  simulateIncomingMessage(instanceName: string, phone: string, text: string) {
    this._ensureInstance(instanceName);

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const message = {
      key: {
        remoteJid: `${phone}@s.whatsapp.net`,
        fromMe: false,
        id: messageId,
      },
      message: {
        conversation: text,
      },
      messageTimestamp: Date.now(),
      pushName: 'Test User',
    };

    this._storeMessage(instanceName, message);
    
    // Return webhook event format
    return {
      event: 'messages.upsert',
      instance: instanceName,
      data: message,
    };
  }

  /**
   * Mock: Simulate Message Status Update
   */
  simulateStatusUpdate(instanceName: string, messageId: string, status: number) {
    this._ensureInstance(instanceName);

    return {
      event: 'messages.update',
      instance: instanceName,
      data: {
        key: {
          id: messageId,
        },
        update: {
          status, // 1: sent, 2: delivered, 3: read
        },
      },
    };
  }

  /**
   * Mock: Get Messages
   */
  getMessages(instanceName: string, phone?: string) {
    const messages = this.messages.get(instanceName) || [];
    
    if (phone) {
      return messages.filter(msg => 
        msg.key.remoteJid === `${phone}@s.whatsapp.net`
      );
    }

    return messages;
  }

  /**
   * Mock: Clear Messages
   */
  clearMessages(instanceName?: string) {
    if (instanceName) {
      this.messages.delete(instanceName);
    } else {
      this.messages.clear();
    }
  }

  /**
   * Mock: Reset All
   */
  reset() {
    this.instances.clear();
    this.messages.clear();
  }

  // Private helpers
  private _ensureInstance(instanceName: string) {
    if (!this.instances.has(instanceName)) {
      throw new Error(`Instance ${instanceName} not found. Create it first.`);
    }
  }

  private _storeMessage(instanceName: string, message: any) {
    if (!this.messages.has(instanceName)) {
      this.messages.set(instanceName, []);
    }
    this.messages.get(instanceName)!.push(message);
  }
}

/**
 * Create mock Evolution API instance
 */
export function createMockEvolutionAPI() {
  return new MockEvolutionAPI();
}
