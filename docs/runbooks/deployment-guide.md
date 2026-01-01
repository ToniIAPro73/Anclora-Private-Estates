# Deployment Guide

Guía completa de deployment para Anclora WhatsApp Integration.

---

## 📋 Pre-Requisitos

### Herramientas Necesarias

```bash
# AWS CLI
aws --version  # >= 2.0

# Docker
docker --version  # >= 20.10

# Node.js
node --version  # >= 20.x

# Git
git --version  # >= 2.30
```

### Accesos Requeridos

- [ ] AWS Console access (IAM user)
- [ ] GitHub repository access
- [ ] Slack workspace (notificaciones)
- [ ] Evolution API credentials
- [ ] Sentry DSN

### Configuración Inicial

```bash
# Configure AWS CLI
aws configure
# AWS Access Key ID: [YOUR_KEY]
# AWS Secret Access Key: [YOUR_SECRET]
# Default region: eu-west-1
# Default output format: json

# Verify access
aws sts get-caller-identity

# Clone repository
git clone https://github.com/anclora/whatsapp-integration.git
cd whatsapp-integration
```

---

## 🚀 Deployment Methods

### Method 1: Automated (GitHub Actions)

**Staging:**
```bash
# 1. Create PR and merge to main
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 2. Create PR in GitHub
# 3. Wait for CI checks to pass
# 4. Merge to main
# 5. Staging auto-deploys in ~5-8 minutes
```

**Production:**
```bash
# 1. Create release tag
git checkout main
git pull origin main
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3

# 2. GitHub Actions triggers CD workflow
# 3. Manual approval required (via GitHub UI)
# 4. Production deploys in ~10-15 minutes
```

### Method 2: Manual (Deployment Script)

**Staging:**
```bash
cd scripts/deployment
./deploy.sh staging

# Script will:
# 1. Check prerequisites
# 2. Validate environment
# 3. Create backup
# 4. Update ECS service
# 5. Run health checks
# 6. Run smoke tests
# 7. Notify Slack
```

**Production:**
```bash
cd scripts/deployment
./deploy.sh production

# Interactive confirmation required
# Script performs additional monitoring
```

### Method 3: Docker Compose (Local)

```bash
# 1. Configure environment
cp .env.example .env
nano .env

# 2. Start services
docker-compose up -d

# 3. Check health
curl http://localhost:3000/health

# 4. View logs
docker-compose logs -f anclora-app
```

---

## 🔧 Environment Configuration

### Staging Environment

```bash
# AWS ECS Configuration
CLUSTER_NAME=anclora-staging
SERVICE_NAME=anclora-whatsapp
DESIRED_COUNT=2
TASK_DEFINITION=anclora-whatsapp:latest

# Application
NODE_ENV=staging
PORT=3000
LOG_LEVEL=debug

# Redis
REDIS_URL=redis://anclora-staging-redis:6379

# Evolution API
EVOLUTION_API_URL=https://staging-evolution.anclora.com
EVOLUTION_API_KEY=${STAGING_EVOLUTION_KEY}

# Sentry
SENTRY_DSN=${STAGING_SENTRY_DSN}
SENTRY_ENVIRONMENT=staging
```

### Production Environment

```bash
# AWS ECS Configuration
CLUSTER_NAME=anclora-production
SERVICE_NAME=anclora-whatsapp
DESIRED_COUNT=4
TASK_DEFINITION=anclora-whatsapp:latest

# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Redis
REDIS_URL=redis://anclora-production-redis:6379

# Evolution API
EVOLUTION_API_URL=https://evolution.anclora.com
EVOLUTION_API_KEY=${PRODUCTION_EVOLUTION_KEY}

# Sentry
SENTRY_DSN=${PRODUCTION_SENTRY_DSN}
SENTRY_ENVIRONMENT=production
```

---

## 📦 Deployment Steps

### Pre-Deployment

**1. Code Review**
```bash
# Ensure all tests pass
npm run test:all

# Check code quality
npm run lint
npm run type-check

# Review changes
git log --oneline origin/main..HEAD
```

**2. Database Migrations**
```bash
# Check pending migrations
npm run migrate:status

# Apply if needed (staging first)
npm run migrate:up
```

**3. Configuration Review**
```bash
# Review environment variables
aws ssm get-parameters-by-path \
  --path /anclora/staging \
  --recursive

# Verify secrets
aws secretsmanager list-secrets \
  --filters Key=name,Values=anclora
```

### Deployment

**1. Create Deployment Snapshot**
```bash
# Automated by script, or manual:
aws ecs describe-services \
  --cluster anclora-production \
  --services anclora-whatsapp \
  > deployment-backup-$(date +%Y%m%d-%H%M%S).json
```

**2. Update Service**
```bash
# Via script (recommended)
./scripts/deployment/deploy.sh production

# Or manual
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --force-new-deployment \
  --desired-count 4 \
  --deployment-configuration \
    "maximumPercent=200,minimumHealthyPercent=100"
```

**3. Monitor Deployment**
```bash
# Watch service events
aws ecs describe-services \
  --cluster anclora-production \
  --services anclora-whatsapp \
  --query 'services[0].events[:5]'

# Watch task status
watch -n 5 'aws ecs list-tasks \
  --cluster anclora-production \
  --service-name anclora-whatsapp'
```

### Post-Deployment

**1. Health Verification**
```bash
# Health check
curl https://anclora.com/health | jq

# Readiness check
curl https://anclora.com/health/ready | jq

# Check metrics
curl https://anclora.com/metrics | grep anclora_queue
```

**2. Smoke Tests**
```bash
npm run test:smoke -- --env=production

# Or manual
curl -X POST https://anclora.com/api/queue/add \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientPhone": "34600000000",
    "messageType": "text",
    "content": "Test message",
    "priority": "low"
  }'
```

**3. Monitoring**
```bash
# CloudWatch logs
aws logs tail /ecs/anclora-whatsapp --follow

# Check error rate
aws cloudwatch get-metric-statistics \
  --namespace "Anclora/WhatsApp" \
  --metric-name "ErrorRate" \
  --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average

# Grafana dashboards
open https://grafana.anclora.com
```

---

## 🔄 Rollback Procedures

### Automatic Rollback

```bash
# Triggered automatically if:
# - Health checks fail
# - Smoke tests fail
# - Error rate > 1% (production)

# Rollback restores previous task definition
# Monitored by deployment script
```

### Manual Rollback

**Via Script:**
```bash
cd scripts/deployment
./rollback.sh production

# Interactive confirmation
# Restores from latest backup
```

**Via AWS CLI:**
```bash
# 1. Find previous task definition
PREVIOUS_TASK=$(aws ecs describe-services \
  --cluster anclora-production \
  --services anclora-whatsapp \
  --query 'services[0].deployments[1].taskDefinition' \
  --output text)

# 2. Update service
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --task-definition $PREVIOUS_TASK \
  --force-new-deployment

# 3. Wait for stability
aws ecs wait services-stable \
  --cluster anclora-production \
  --services anclora-whatsapp
```

**Via GitHub Actions:**
```bash
# Revert commit and push
git revert HEAD
git push origin main

# Or re-deploy previous tag
git tag
git push origin v1.2.2  # Previous working version
```

---

## 🐛 Troubleshooting

### Deployment Stuck

**Symptoms:**
- Service shows "deployment in progress" for >30 min
- Tasks keep stopping and restarting

**Resolution:**
```bash
# 1. Check service events
aws ecs describe-services \
  --cluster anclora-production \
  --services anclora-whatsapp \
  --query 'services[0].events[:10]'

# 2. Check task errors
aws ecs describe-tasks \
  --cluster anclora-production \
  --tasks $(aws ecs list-tasks \
    --cluster anclora-production \
    --service-name anclora-whatsapp \
    --query 'taskArns[0]' --output text) \
  --query 'tasks[0].stopReason'

# 3. Check logs
aws logs tail /ecs/anclora-whatsapp --since 10m

# 4. Force rollback if needed
./scripts/deployment/rollback.sh production
```

### Health Check Failing

**Symptoms:**
- Health endpoint returns 503
- Tasks fail health checks

**Resolution:**
```bash
# 1. Check application logs
docker-compose logs anclora-app | tail -100

# 2. Check Redis connectivity
redis-cli -h $REDIS_HOST ping

# 3. Check queue status
curl http://localhost:3000/queue/metrics

# 4. Restart if needed
docker-compose restart anclora-app
```

### High Error Rate

**Symptoms:**
- CloudWatch shows error rate >1%
- Sentry alerts firing

**Resolution:**
```bash
# 1. Check Sentry for errors
open https://sentry.io/anclora/whatsapp

# 2. Check recent logs
aws logs tail /ecs/anclora-whatsapp \
  --filter-pattern "ERROR" \
  --since 5m

# 3. Check metrics
curl https://anclora.com/metrics | grep error

# 4. Rollback if critical
./scripts/deployment/rollback.sh production
```

---

## 📊 Deployment Checklist

### Pre-Deployment

- [ ] All CI checks passing
- [ ] Code reviewed and approved
- [ ] Database migrations tested (staging)
- [ ] Environment variables verified
- [ ] Monitoring dashboards ready
- [ ] Rollback plan confirmed
- [ ] Team notified (production only)

### Deployment

- [ ] Deployment snapshot created
- [ ] Service updated successfully
- [ ] Tasks running healthy
- [ ] Health checks passing
- [ ] Smoke tests passing
- [ ] Metrics normal
- [ ] No errors in logs

### Post-Deployment

- [ ] Application responding
- [ ] Queue processing normally
- [ ] Analytics tracking working
- [ ] WhatsApp messages sending
- [ ] Error rate < 0.5%
- [ ] Performance within SLO
- [ ] Monitoring active
- [ ] Team notified

---

## 🔐 Security Notes

### Secrets Management

```bash
# Never commit secrets to Git
# Use AWS Secrets Manager

# Store secret
aws secretsmanager create-secret \
  --name /anclora/production/evolution-api-key \
  --secret-string "your-secret-key"

# Retrieve secret
aws secretsmanager get-secret-value \
  --secret-id /anclora/production/evolution-api-key \
  --query SecretString --output text
```

### Access Control

```bash
# Production deployments require:
# - AWS IAM permissions
# - GitHub repository admin
# - Slack notifications enabled

# Verify IAM permissions
aws iam get-user
aws iam list-attached-user-policies --user-name $USER
```

---

## 📞 Support Contacts

### Escalation Path

1. **L1 - DevOps:** Automated monitoring → Slack alerts
2. **L2 - Engineering Lead:** Manual intervention required
3. **L3 - CTO:** Critical production issues

### Emergency Contacts

- **DevOps:** devops@anclora.com
- **Engineering:** engineering@anclora.com
- **On-Call:** oncall@anclora.com (PagerDuty)

### Useful Links

- Grafana: https://grafana.anclora.com
- Sentry: https://sentry.io/anclora
- AWS Console: https://console.aws.amazon.com
- GitHub Actions: https://github.com/anclora/whatsapp-integration/actions

---

**Last Updated:** 2026-01-01  
**Version:** 1.0.0  
**Owner:** DevOps Team
