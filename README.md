# Anclora WhatsApp Integration

Sistema de automatización WhatsApp para Anclora Private Estates - Agencia inmobiliaria de lujo en Mallorca.

---

## 🎯 Overview

Sistema completo de integración WhatsApp que combina:
- **Queue Manager:** Procesamiento asíncrono de mensajes con prioridades
- **Analytics Engine:** Tracking de conversiones y métricas en tiempo real
- **Bot Conversacional:** NLP con handoff inteligente a agentes humanos
- **Evolution API Integration:** Gestión de instancias WhatsApp Business

**Stack Tecnológico:**
- Node.js 20.x + TypeScript 5.x
- BullMQ (Queue) + Redis 7.x
- Express.js + Jest (Testing)
- Prometheus + Grafana (Monitoring)
- AWS ECS + Docker

---

## 🚀 Quick Start

### Prerequisites

```bash
node >= 20.x
docker >= 20.10
docker-compose >= 2.0
```

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/anclora/whatsapp-integration.git
cd whatsapp-integration

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
nano .env

# 4. Start services
docker-compose up -d

# 5. Run application
npm run dev

# 6. Verify health
curl http://localhost:3000/health
```

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 📦 Project Structure

```
anclora-private-estates/
├── services/               # Core services
│   ├── queue/             # BullMQ queue manager
│   ├── analytics/         # Analytics engine
│   ├── bot/               # Conversational bot
│   └── whatsapp/          # Evolution API integration
│
├── tests/                 # Test suites
│   ├── unit/              # Unit tests (5 suites, 432 tests)
│   ├── integration/       # Integration tests (6 suites, 95 tests)
│   └── e2e/               # End-to-end tests
│
├── monitoring/            # Observability stack
│   ├── metrics/           # Prometheus metrics (40+ metrics)
│   ├── logging/           # Winston logger
│   ├── health/            # Health checks
│   ├── errors/            # Sentry integration
│   ├── dashboards/        # Grafana dashboards (2)
│   └── alerts/            # Alerting rules (29 rules)
│
├── performance/           # Performance testing
│   ├── artillery/         # Load tests
│   ├── benchmarks/        # Benchmarks
│   └── profiling/         # Memory profiling
│
├── docs/                  # Documentation
│   ├── api/              # OpenAPI spec
│   ├── architecture/     # System design
│   └── runbooks/         # Operational guides
│
├── scripts/              # Automation scripts
│   └── deployment/       # Deploy automation
│
└── .github/              # CI/CD workflows
    └── workflows/        # GitHub Actions (4 workflows)
```

---

## 📊 Metrics & Monitoring

### Dashboards

- **Grafana:** http://localhost:3001 (admin/anclora2024)
  - Queue Dashboard (10 panels)
  - Analytics Dashboard (13 panels)
- **Prometheus:** http://localhost:9090
- **Alertmanager:** http://localhost:9093

### Key Metrics

```
Queue Throughput:      ~150 msg/sec
Processing Latency P95: ~65ms
API Response Time P95:  ~145ms
Memory Usage:          ~1200 MB
Error Rate:            < 0.5%
```

### Health Checks

```bash
# Comprehensive health
curl http://localhost:3000/health | jq

# Liveness
curl http://localhost:3000/health/live

# Readiness
curl http://localhost:3000/health/ready

# Prometheus metrics
curl http://localhost:3000/metrics
```

---

## 🔧 API Documentation

### OpenAPI Specification

Interactive API docs available at:
- **Swagger UI:** http://localhost:3000/api-docs
- **OpenAPI Spec:** [docs/api/openapi.yaml](docs/api/openapi.yaml)

### Quick Examples

**Add message to queue:**
```bash
curl -X POST http://localhost:3000/api/queue/add \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientPhone": "34600123456",
    "messageType": "text",
    "content": "Hola, ¿en qué puedo ayudarte?",
    "priority": "high"
  }'
```

**Get queue metrics:**
```bash
curl http://localhost:3000/api/queue/metrics \
  -H "X-API-Key: your-api-key"
```

**Track conversion:**
```bash
curl -X POST http://localhost:3000/api/analytics/track/conversion \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "34600123456",
    "type": "appointment",
    "value": 0
  }'
```

---

## 🚀 Deployment

### CI/CD Pipeline

**Automatic Deployment:**
- Push to `main` → Auto-deploy to Staging
- Push tag `v*.*.*` → Manual approval → Production

**Workflows:**
- **CI:** Lint, tests, build, security scan (8-12 min)
- **CD:** Docker build, deploy staging/production (5-15 min)
- **Performance:** Load tests, regression detection (15-20 min)
- **Docker:** Multi-platform build, security scan, SBOM

### Manual Deployment

```bash
# Deploy to staging
./scripts/deployment/deploy.sh staging

# Deploy to production
./scripts/deployment/deploy.sh production

# Rollback
./scripts/deployment/rollback.sh production
```

### Docker Deployment

```bash
# Build image
docker build -t anclora:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e REDIS_URL=redis://redis:6379 \
  anclora:latest

# Docker Compose
docker-compose up -d
```

---

## 📚 Documentation

### Runbooks

| Guide | Purpose |
|-------|---------|
| [Deployment Guide](docs/runbooks/deployment-guide.md) | Deploy to staging/production |
| [Troubleshooting](docs/runbooks/troubleshooting.md) | Resolve common issues |
| [Disaster Recovery](docs/runbooks/disaster-recovery.md) | DR procedures (RTO: 15 min) |
| [Operational Playbook](docs/runbooks/operational-playbook.md) | Daily operations |

### Architecture

- [System Overview](docs/architecture/system-overview.md)
- [API Documentation](docs/api/openapi.yaml)

### Monitoring

- [Metrics Guide](monitoring/README.md)
- [Logging Guide](monitoring/logging/README.md)
- [Alert Rules](monitoring/alerts/prometheus-alerts.yml)

---

## 🔐 Security

### Authentication

- **API Key:** Header-based (`X-API-Key`)
- **Rate Limiting:** 100 req/s per key
- **Webhook Validation:** HMAC signature

### Secrets Management

```bash
# Using AWS Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id /anclora/production/evolution-api-key
```

### Security Scanning

- **npm audit:** Dependency vulnerabilities
- **Snyk:** Security scanning
- **Trivy:** Docker image scanning
- **SonarCloud:** Code quality & security

---

## 🧪 Performance

### Load Testing

```bash
# Smoke test
npm run perf:smoke

# Load test
npm run perf:load

# Stress test
npm run perf:stress

# Benchmarks
npm run bench:all
```

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Queue P99 Latency | < 100ms | ~65ms |
| Queue Throughput | > 100 msg/s | ~150 msg/s |
| API P95 Response | < 200ms | ~145ms |
| Memory Usage | < 1.5 GB | ~1.2 GB |
| Error Rate | < 1% | ~0.3% |

---

## 🤝 Contributing

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and test
npm run lint
npm test

# 3. Commit with conventional commits
git commit -m "feat: add new feature"

# 4. Push and create PR
git push origin feature/my-feature
```

### Code Standards

- **Linting:** ESLint + Prettier
- **Testing:** 80%+ coverage required
- **Commits:** Conventional Commits
- **Reviews:** 1+ approval required

---

## 📈 Roadmap

### Phase 6 (Current) - Testing & DevOps ✅
- [x] Unit testing (432 tests, 81% coverage)
- [x] Integration testing (95+ tests)
- [x] Performance optimization
- [x] Monitoring & observability
- [x] CI/CD pipeline
- [x] Documentation & runbooks

### Phase 7 (Next) - Advanced Features
- [ ] AI-powered lead scoring
- [ ] Multi-language support
- [ ] Voice message transcription
- [ ] Advanced analytics dashboard

### Phase 8 - Scale & Optimize
- [ ] Kubernetes migration
- [ ] Multi-region deployment
- [ ] Advanced caching strategies
- [ ] GraphQL API

---

## 📞 Support

### Contacts

- **DevOps:** devops@anclora.com
- **Engineering:** engineering@anclora.com
- **On-Call:** oncall@anclora.com

### Links

- **Grafana:** https://grafana.anclora.com
- **Sentry:** https://sentry.io/anclora
- **GitHub:** https://github.com/anclora/whatsapp-integration

---

## 📄 License

Proprietary - Anclora Private Estates © 2026

---

**Built with ❤️ by Anclora Tech Team**

**Last Updated:** 2026-01-01  
**Version:** 1.0.0
