/**
 * Jest Setup File
 * 
 * Configuración global para todos los tests
 */

// Extend Jest matchers
import '@testing-library/jest-dom';

// Mock environment variables
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.REDIS_DB = '0';
process.env.REDIS_ANALYTICS_DB = '1';
process.env.EVOLUTION_API_URL = 'http://localhost:8080';
process.env.EVOLUTION_API_KEY = 'test-key';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch globally
global.fetch = jest.fn();

// Helper: Reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Helper: Clean up after each test
afterEach(() => {
  jest.restoreAllMocks();
});

// Mock timers helpers
export const mockTimers = () => {
  jest.useFakeTimers();
};

export const restoreTimers = () => {
  jest.useRealTimers();
};

// Helper: Create mock Redis client
export const createMockRedis = () => {
  const store = new Map();
  
  return {
    get: jest.fn((key: string) => Promise.resolve(store.get(key) || null)),
    set: jest.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve('OK');
    }),
    del: jest.fn((key: string) => {
      store.delete(key);
      return Promise.resolve(1);
    }),
    incr: jest.fn((key: string) => {
      const current = parseInt(store.get(key) || '0');
      const newValue = current + 1;
      store.set(key, newValue.toString());
      return Promise.resolve(newValue);
    }),
    lpush: jest.fn((key: string, ...values: string[]) => {
      const list = JSON.parse(store.get(key) || '[]');
      list.unshift(...values);
      store.set(key, JSON.stringify(list));
      return Promise.resolve(list.length);
    }),
    lrange: jest.fn((key: string, start: number, stop: number) => {
      const list = JSON.parse(store.get(key) || '[]');
      return Promise.resolve(list.slice(start, stop + 1));
    }),
    zadd: jest.fn((key: string, score: number, member: string) => {
      const sortedSet = JSON.parse(store.get(key) || '[]');
      sortedSet.push({ score, member });
      store.set(key, JSON.stringify(sortedSet));
      return Promise.resolve(1);
    }),
    expire: jest.fn(() => Promise.resolve(1)),
    ttl: jest.fn(() => Promise.resolve(-1)),
    keys: jest.fn((pattern: string) => {
      const keys = Array.from(store.keys()).filter(k => 
        k.includes(pattern.replace('*', ''))
      );
      return Promise.resolve(keys);
    }),
    pipeline: jest.fn(() => ({
      incr: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn(() => Promise.resolve([])),
    })),
    quit: jest.fn(() => Promise.resolve('OK')),
    disconnect: jest.fn(),
  };
};

// Helper: Create mock Evolution API response
export const createMockEvolutionResponse = (success = true) => {
  return {
    ok: success,
    status: success ? 200 : 400,
    json: jest.fn(() => Promise.resolve({
      key: {
        remoteJid: '34600111222@s.whatsapp.net',
        fromMe: true,
        id: 'msg-123',
      },
      message: {
        conversation: 'Test message',
      },
      messageTimestamp: Date.now(),
    })),
  };
};

// Helper: Wait for async operations
export const waitFor = (ms: number) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Helper: Create test phone number
export const createTestPhone = (suffix = '111222') => `34600${suffix}`;

// Helper: Create test message
export const createTestMessage = (overrides = {}) => ({
  instanceName: 'test-instance',
  recipientPhone: createTestPhone(),
  messageType: 'text' as const,
  content: { text: 'Test message' },
  metadata: {},
  ...overrides,
});

// Export test utilities
export const testUtils = {
  mockTimers,
  restoreTimers,
  createMockRedis,
  createMockEvolutionResponse,
  waitFor,
  createTestPhone,
  createTestMessage,
};
