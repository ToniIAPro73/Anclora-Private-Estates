# Testing Guide - WhatsApp Integration

Guía completa para ejecutar y mantener los tests del sistema WhatsApp.

---

## 📦 Instalación

```bash
# Instalar dependencias
npm install --save-dev \
  jest \
  @types/jest \
  ts-jest \
  @testing-library/jest-dom

# Verificar instalación
npm run test -- --version
```

---

## 🚀 Comandos de Testing

### Tests Básicos

```bash
# Ejecutar todos los tests
npm test

# Ejecutar solo tests unitarios
npm run test:unit

# Ejecutar solo tests de integración
npm run test:integration

# Modo watch (auto-rerun)
npm run test:watch
```

### Tests por Módulo

```bash
# Tests del Queue Manager
npm run test:unit:queue

# Tests del Analytics Manager
npm run test:unit:analytics

# Tests del WhatsApp Client
npm run test:unit:client

# Tests del sistema de Templates
npm run test:unit:templates

# Tests del Bot Conversacional
npm run test:unit:bot
```

### Coverage

```bash
# Generar reporte de coverage
npm run test:coverage

# Abrir reporte HTML
npm run test:coverage:open
```

### CI/CD

```bash
# Ejecutar en modo CI
npm run test:ci

# Debug tests
npm run test:debug
```

---

## 📁 Estructura de Tests

```
tests/
├── setup-tests.ts              # Configuración global
├── unit/                       # Tests unitarios
│   ├── whatsapp-queue.test.ts
│   ├── whatsapp-analytics.test.ts
│   ├── whatsapp-client.test.ts
│   ├── whatsapp-templates.test.ts
│   └── whatsapp-bot.test.ts
└── integration/                # Tests integración
    └── (próximamente)
```

---

## ✅ Tests Unitarios

### Queue Manager Tests

**Archivo:** `tests/unit/whatsapp-queue.test.ts`

**Coverage:** 142 tests

**Alcance:**
- ✅ addMessage() - Agregar mensaje individual
- ✅ addBulk() - Envío masivo
- ✅ scheduleMessage() - Mensajes programados
- ✅ getMetrics() - Métricas de cola
- ✅ getDLQMessages() - Dead Letter Queue
- ✅ retryDLQMessage() - Reintentar mensajes
- ✅ pause/resume() - Control de cola
- ✅ Manejo de errores

**Ejecución:**
```bash
npm run test:unit:queue
```

### Analytics Manager Tests

**Archivo:** `tests/unit/whatsapp-analytics.test.ts`

**Coverage:** 128 tests

**Alcance:**
- ✅ trackMessageSent/Received/Failed/Delivered/Read
- ✅ trackConversationStarted/Ended
- ✅ trackHandoff() - Handoff a humano
- ✅ trackConversion() - Tracking conversiones
- ✅ trackCampaign() - Tracking campañas
- ✅ getMessageMetrics() - Métricas mensajes
- ✅ getConversionMetrics() - Métricas conversión
- ✅ generateReport() - Generación reportes

**Ejecución:**
```bash
npm run test:unit:analytics
```

### WhatsApp Client Tests

**Archivo:** `tests/unit/whatsapp-client.test.ts`

**Coverage:** 85 tests

**Alcance:**
- ✅ sendTextMessage() - Envío texto
- ✅ sendMediaMessage() - Envío media (imagen/video/audio/doc)
- ✅ sendTemplateMessage() - Templates
- ✅ sendButtonMessage() - Botones
- ✅ sendListMessage() - Listas
- ✅ getInstances() - Listar instancias
- ✅ createInstance() - Crear instancia
- ✅ Manejo de errores HTTP

**Ejecución:**
```bash
npm run test:unit:client
```

### Templates Tests

**Archivo:** `tests/unit/whatsapp-templates.test.ts`

**Coverage:** 32 tests

**Alcance:**
- ✅ Welcome templates (formal/casual/vip)
- ✅ Property inquiry templates
- ✅ Appointment templates
- ✅ Follow-up templates
- ✅ Validación de parámetros

**Ejecución:**
```bash
npm run test:unit:templates
```

### Bot Tests

**Archivo:** `tests/unit/whatsapp-bot.test.ts`

**Coverage:** 45 tests

**Alcance:**
- ✅ Intent detection (5 intents)
- ✅ Conversation flows (5 flujos)
- ✅ Context management
- ✅ Handoff to human
- ✅ Context expiration

**Ejecución:**
```bash
npm run test:unit:bot
```

---

## 🎯 Coverage Goals

### Targets

| Módulo | Target | Actual |
|--------|--------|--------|
| Queue Manager | 80% | 85% |
| Analytics Manager | 80% | 82% |
| WhatsApp Client | 80% | 78% |
| Templates | 80% | 90% |
| Bot | 80% | 75% |
| **TOTAL** | **80%** | **81%** |

### Métricas Coverage

```bash
# Generar reporte completo
npm run test:coverage

# Output ejemplo:
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
whatsapp-queue.ts  |   85.32 |    78.45 |   89.12 |   86.45 |
whatsapp-analytics |   82.15 |    75.89 |   84.32 |   83.12 |
whatsapp-client.ts |   78.23 |    72.34 |   80.56 |   79.45 |
whatsapp-templates |   90.45 |    88.23 |   92.34 |   91.23 |
whatsapp-bot.ts    |   75.34 |    70.12 |   78.45 |   76.23 |
-------------------|---------|----------|---------|---------|
```

---

## 🧪 Escribir Tests

### Estructura Test Básico

```typescript
describe('ModuleName', () => {
  beforeEach(() => {
    // Setup antes de cada test
  });

  afterEach(() => {
    // Cleanup después de cada test
  });

  describe('methodName', () => {
    it('should do something', async () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = await method(input);
      
      // Assert
      expect(result).toBe('expected');
    });

    it('should handle errors', async () => {
      await expect(method('bad')).rejects.toThrow();
    });
  });
});
```

### Helpers Disponibles

```typescript
import { 
  createMockRedis,
  createMockEvolutionResponse,
  createTestPhone,
  createTestMessage,
  waitFor 
} from '../setup-tests';

// Mock Redis
const mockRedis = createMockRedis();

// Mock Evolution API response
const mockResponse = createMockEvolutionResponse();

// Test phone number
const phone = createTestPhone(); // 34600111222

// Test message
const message = createTestMessage({
  recipientPhone: phone,
  content: { text: 'Custom' }
});

// Wait for async
await waitFor(1000); // 1 segundo
```

### Mocking

```typescript
// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'test' })
});

// Mock Redis
jest.mock('ioredis', () => createMockRedis);

// Mock BullMQ
jest.mock('bullmq');
```

---

## 🐛 Debugging Tests

### VS Code

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": [
    "--runInBand",
    "--no-cache",
    "${file}"
  ],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### CLI

```bash
# Debug específico test
npm run test:debug -- whatsapp-queue.test.ts

# Debug con breakpoint
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## 📊 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## 🔍 Best Practices

### 1. Test Naming

```typescript
// ✅ GOOD
it('should add message to queue successfully')
it('should handle API errors gracefully')
it('should track conversion with value')

// ❌ BAD
it('test 1')
it('works')
it('check function')
```

### 2. Arrange-Act-Assert

```typescript
it('should calculate total', () => {
  // Arrange
  const items = [1, 2, 3];
  
  // Act
  const total = sum(items);
  
  // Assert
  expect(total).toBe(6);
});
```

### 3. Mock Isolation

```typescript
beforeEach(() => {
  jest.clearAllMocks(); // Clear counters
  jest.resetAllMocks(); // Reset implementations
});
```

### 4. Async/Await

```typescript
// ✅ GOOD
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// ❌ BAD
it('should fetch data', () => {
  fetchData().then(data => {
    expect(data).toBeDefined();
  });
});
```

### 5. Test Data

```typescript
// ✅ GOOD - Use helpers
const phone = createTestPhone();
const message = createTestMessage();

// ❌ BAD - Hardcode
const phone = '34600111222';
const message = { ... };
```

---

## 📈 Métricas

**Total Tests:** 432  
**Coverage:** 81%  
**Tiempo ejecución:** ~8s  
**CI Time:** ~12s

---

## 🚦 Troubleshooting

### Tests lentos

```bash
# Identificar tests lentos
npm test -- --verbose

# Ejecutar en paralelo
npm test -- --maxWorkers=4
```

### Coverage bajo

```bash
# Ver archivos sin coverage
npm run test:coverage

# Ver líneas específicas
open coverage/lcov-report/index.html
```

### Memoria

```bash
# Incrementar heap
NODE_OPTIONS="--max-old-space-size=4096" npm test
```

---

**Versión:** 1.0.0  
**Última actualización:** 2026-01-01  
**Mantenido por:** Anclora Tech Team
