/**
 * Test Data Factory
 * 
 * Genera datos de prueba realistas para tests de integración
 */

export class TestDataFactory {
  /**
   * Genera mensaje WhatsApp completo
   */
  static createMessage(overrides = {}) {
    return {
      instanceName: 'anclora-main',
      recipientPhone: '34600111222',
      messageType: 'text' as const,
      content: {
        text: 'Hola, me interesa una propiedad en Mallorca',
      },
      metadata: {
        contactId: `contact-${Date.now()}`,
        source: 'web_form',
        timestamp: Date.now(),
      },
      ...overrides,
    };
  }

  /**
   * Genera contacto de prueba
   */
  static createContact(overrides = {}) {
    const id = Math.floor(Math.random() * 1000);
    return {
      id: `contact-${id}`,
      phone: `34600${String(id).padStart(6, '0')}`,
      name: `Test Contact ${id}`,
      email: `contact${id}@test.com`,
      source: 'whatsapp',
      createdAt: new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * Genera propiedad de prueba
   */
  static createProperty(overrides = {}) {
    const id = Math.floor(Math.random() * 1000);
    return {
      id: `property-${id}`,
      name: `Villa Test ${id}`,
      location: 'Port Adriano',
      price: 2500000,
      bedrooms: 4,
      bathrooms: 3,
      surface: 350,
      type: 'villa',
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ],
      ...overrides,
    };
  }

  /**
   * Genera cita de prueba
   */
  static createAppointment(overrides = {}) {
    const id = Math.floor(Math.random() * 1000);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      id: `appointment-${id}`,
      contactId: `contact-${id}`,
      propertyId: `property-${id}`,
      date: tomorrow.toISOString().split('T')[0],
      time: '10:00',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * Genera campaña de prueba
   */
  static createCampaign(overrides = {}) {
    const id = Math.floor(Math.random() * 1000);
    return {
      id: `campaign-${id}`,
      name: `Test Campaign ${id}`,
      type: 'property_launch',
      status: 'active',
      targetAudience: 'qualified_leads',
      messageTemplate: 'property_inquiry',
      startDate: new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * Genera webhook event de WhatsApp
   */
  static createWebhookEvent(type = 'message', overrides = {}) {
    const events = {
      message: {
        event: 'messages.upsert',
        instance: 'anclora-main',
        data: {
          key: {
            remoteJid: '34600111222@s.whatsapp.net',
            fromMe: false,
            id: `msg-${Date.now()}`,
          },
          message: {
            conversation: 'Hola, me interesa una villa',
          },
          messageTimestamp: Date.now(),
          pushName: 'Test User',
        },
      },
      status: {
        event: 'messages.update',
        instance: 'anclora-main',
        data: {
          key: {
            remoteJid: '34600111222@s.whatsapp.net',
            id: `msg-${Date.now()}`,
          },
          update: {
            status: 3, // read
          },
        },
      },
      connection: {
        event: 'connection.update',
        instance: 'anclora-main',
        data: {
          state: 'open',
          statusReason: 200,
        },
      },
    };

    return {
      ...events[type as keyof typeof events],
      ...overrides,
    };
  }

  /**
   * Genera respuesta de Evolution API
   */
  static createEvolutionResponse(success = true, data = {}) {
    if (success) {
      return {
        key: {
          remoteJid: '34600111222@s.whatsapp.net',
          fromMe: true,
          id: `msg-${Date.now()}`,
        },
        message: {
          conversation: 'Test message',
        },
        messageTimestamp: Date.now(),
        status: 'PENDING',
        ...data,
      };
    }

    return {
      error: 'API Error',
      message: 'Failed to send message',
      statusCode: 400,
    };
  }

  /**
   * Genera job de BullMQ
   */
  static createBullMQJob(data = {}, opts = {}) {
    return {
      id: `job-${Date.now()}`,
      name: 'whatsapp-message',
      data: this.createMessage(data),
      opts: {
        priority: 3,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        ...opts,
      },
      attemptsMade: 0,
      timestamp: Date.now(),
      processedOn: null,
      finishedOn: null,
      returnvalue: null,
      failedReason: null,
    };
  }

  /**
   * Genera analytics event
   */
  static createAnalyticsEvent(type = 'message_sent', data = {}) {
    return {
      type,
      timestamp: Date.now(),
      phone: '34600111222',
      metadata: {
        instanceName: 'anclora-main',
        messageType: 'text',
        ...data,
      },
    };
  }

  /**
   * Genera batch de mensajes
   */
  static createMessageBatch(count = 10) {
    return Array.from({ length: count }, (_, i) => 
      this.createMessage({
        recipientPhone: `34600${String(111222 + i).padStart(6, '0')}`,
        metadata: {
          contactId: `contact-${i}`,
          batchId: `batch-${Date.now()}`,
        },
      })
    );
  }

  /**
   * Genera conversación completa
   */
  static createConversation(messageCount = 5) {
    const phone = '34600111222';
    const messages = [];
    let timestamp = Date.now() - (messageCount * 60000); // 1 min between msgs

    for (let i = 0; i < messageCount; i++) {
      messages.push({
        id: `msg-${timestamp}`,
        phone,
        direction: i % 2 === 0 ? 'outbound' : 'inbound',
        type: 'text',
        content: `Message ${i + 1}`,
        timestamp,
        status: 'read',
      });
      timestamp += 60000;
    }

    return {
      phone,
      messages,
      startedAt: messages[0].timestamp,
      lastMessageAt: messages[messages.length - 1].timestamp,
      messageCount,
      status: 'active',
    };
  }

  /**
   * Genera datos de Twenty CRM
   */
  static createCRMData(type = 'person', overrides = {}) {
    const types = {
      person: {
        id: `person-${Date.now()}`,
        firstName: 'Juan',
        lastName: 'López',
        email: 'juan.lopez@test.com',
        phone: '34600111222',
        source: 'whatsapp',
        createdAt: new Date().toISOString(),
      },
      company: {
        id: `company-${Date.now()}`,
        name: 'Test Company',
        industry: 'Real Estate',
        employees: 50,
        website: 'https://test.com',
      },
      opportunity: {
        id: `opportunity-${Date.now()}`,
        name: 'Villa Purchase',
        stage: 'qualified',
        value: 2500000,
        probability: 60,
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    return {
      ...types[type as keyof typeof types],
      ...overrides,
    };
  }

  /**
   * Genera n8n workflow execution data
   */
  static createN8nExecutionData(workflow = 'lead-capture') {
    return {
      workflowId: workflow,
      executionId: `exec-${Date.now()}`,
      status: 'success',
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      data: {
        resultData: {
          runData: {},
        },
      },
      mode: 'webhook',
    };
  }
}

/**
 * Mock Redis Store
 * Simula comportamiento de Redis para tests
 */
export class MockRedisStore {
  private store = new Map<string, string>();
  private sorted = new Map<string, Array<{ score: number; member: string }>>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: string, ex?: number): Promise<string> {
    this.store.set(key, value);
    if (ex) {
      setTimeout(() => this.store.delete(key), ex * 1000);
    }
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const existed = this.store.has(key);
    this.store.delete(key);
    return existed ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const current = parseInt(this.store.get(key) || '0');
    const newValue = current + 1;
    this.store.set(key, newValue.toString());
    return newValue;
  }

  async decr(key: string): Promise<number> {
    const current = parseInt(this.store.get(key) || '0');
    const newValue = current - 1;
    this.store.set(key, newValue.toString());
    return newValue;
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    const list = JSON.parse(this.store.get(key) || '[]');
    list.unshift(...values);
    this.store.set(key, JSON.stringify(list));
    return list.length;
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    const list = JSON.parse(this.store.get(key) || '[]');
    return list.slice(start, stop === -1 ? undefined : stop + 1);
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    if (!this.sorted.has(key)) {
      this.sorted.set(key, []);
    }
    const set = this.sorted.get(key)!;
    set.push({ score, member });
    set.sort((a, b) => a.score - b.score);
    return 1;
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    const set = this.sorted.get(key) || [];
    return set.slice(start, stop === -1 ? undefined : stop + 1).map(s => s.member);
  }

  async zcard(key: string): Promise<number> {
    return (this.sorted.get(key) || []).length;
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return Array.from(this.store.keys()).filter(k => regex.test(k));
  }

  async flushall(): Promise<string> {
    this.store.clear();
    this.sorted.clear();
    return 'OK';
  }

  pipeline() {
    const commands: Array<() => Promise<any>> = [];
    
    return {
      incr: (key: string) => {
        commands.push(() => this.incr(key));
        return this;
      },
      set: (key: string, value: string) => {
        commands.push(() => this.set(key, value));
        return this;
      },
      zadd: (key: string, score: number, member: string) => {
        commands.push(() => this.zadd(key, score, member));
        return this;
      },
      exec: async () => {
        return Promise.all(commands.map(cmd => cmd()));
      },
    };
  }
}
