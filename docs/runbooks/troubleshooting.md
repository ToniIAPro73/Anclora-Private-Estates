# Troubleshooting Runbook

Procedimientos de resolución de problemas para Anclora WhatsApp Integration.

---

## 🔴 CRITICAL ISSUES

### Issue: Application Down (503 Errors)

**Symptoms:**
- Health check endpoint returning 503
- All requests failing
- No tasks running in ECS

**Diagnostic Steps:**

```bash
# 1. Check ECS service status
aws ecs describe-services \
  --cluster anclora-production \
  --services anclora-whatsapp \
  --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount}'

# 2. Check task status
aws ecs list-tasks \
  --cluster anclora-production \
  --service-name anclora-whatsapp

# 3. Check stopped tasks
aws ecs list-tasks \
  --cluster anclora-production \
  --service-name anclora-whatsapp \
  --desired-status STOPPED \
  | head -1 \
  | xargs -I {} aws ecs describe-tasks \
      --cluster anclora-production \
      --tasks {} \
      --query 'tasks[0].{Reason:stopReason,Container:containers[0].reason}'
```

**Resolution:**

```bash
# Option 1: Force new deployment
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --force-new-deployment

# Option 2: Scale up desired count
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --desired-count 4

# Option 3: Rollback to previous version
./scripts/deployment/rollback.sh production

# Monitor recovery
watch -n 5 'aws ecs describe-services \
  --cluster anclora-production \
  --services anclora-whatsapp \
  --query "services[0].runningCount"'
```

**Prevention:**
- Ensure min 2 healthy tasks at all times
- Configure auto-scaling
- Monitor health check failures

---

### Issue: High Memory Usage / OOM Kills

**Symptoms:**
- Tasks restarting frequently
- Memory metrics >90%
- "Out of Memory" in task logs

**Diagnostic Steps:**

```bash
# 1. Check current memory usage
curl http://localhost:3000/health | jq '.checks.memory'

# 2. Get heap snapshot
curl -X POST http://localhost:3000/admin/heap-snapshot
# Download from S3 and analyze

# 3. Check memory trends
aws cloudwatch get-metric-statistics \
  --namespace "AWS/ECS" \
  --metric-name "MemoryUtilization" \
  --dimensions Name=ServiceName,Value=anclora-whatsapp \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average,Maximum
```

**Resolution:**

```bash
# Immediate: Restart tasks
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --force-new-deployment

# Short-term: Increase task memory
# Edit task definition, increase memoryReservation from 1024 to 2048
aws ecs register-task-definition \
  --cli-input-json file://task-definition-updated.json

aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --task-definition anclora-whatsapp:NEW_REVISION

# Long-term: Fix memory leaks
# 1. Analyze heap snapshots
# 2. Review code for leaks
# 3. Update dependencies
# 4. Add memory limits to Redis client
```

**Prevention:**
- Regular heap profiling
- Memory leak testing
- Proper connection pooling
- Cache size limits

---

### Issue: Redis Connection Failures

**Symptoms:**
- "ECONNREFUSED" errors
- Queue operations failing
- Analytics not recording

**Diagnostic Steps:**

```bash
# 1. Check Redis connectivity
redis-cli -h $REDIS_HOST -p 6379 ping

# 2. Check connection count
redis-cli -h $REDIS_HOST INFO clients | grep connected_clients

# 3. Check maxclients limit
redis-cli -h $REDIS_HOST CONFIG GET maxclients

# 4. Check for blocked clients
redis-cli -h $REDIS_HOST CLIENT LIST | grep blocked
```

**Resolution:**

```bash
# Option 1: Restart Redis (if self-managed)
docker-compose restart redis

# Option 2: Clear connections
redis-cli -h $REDIS_HOST CLIENT KILL TYPE normal

# Option 3: Increase max connections
redis-cli -h $REDIS_HOST CONFIG SET maxclients 10000

# Option 4: Application restart
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --force-new-deployment
```

**Prevention:**
- Connection pooling (max 20 connections)
- Connection timeout configuration
- Health checks on Redis
- Redis cluster for HA

---

## ⚠️  WARNING ISSUES

### Issue: High Queue Backlog

**Symptoms:**
- Queue depth >10,000 messages
- Processing latency increasing
- Delayed message delivery

**Diagnostic Steps:**

```bash
# 1. Check queue metrics
curl http://localhost:3000/queue/metrics | jq

# 2. Check queue details via Redis
redis-cli -h $REDIS_HOST \
  LLEN bull:anclora-whatsapp:wait

redis-cli -h $REDIS_HOST \
  LLEN bull:anclora-whatsapp:active

# 3. Check processing rate
curl http://localhost:3000/metrics | grep anclora_queue_messages_processed_total
```

**Resolution:**

```bash
# Option 1: Scale up workers
# Increase ECS task count temporarily
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --desired-count 8  # Double from 4

# Option 2: Increase concurrency
# Update environment variable
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --task-definition anclora-whatsapp:REVISION

# Option 3: Pause low-priority messages
# Via admin API
curl -X POST http://localhost:3000/admin/queue/pause-priority \
  -H "X-Admin-Key: $ADMIN_KEY" \
  -d '{"priority": "low"}'

# Monitor backlog reduction
watch -n 10 'curl -s http://localhost:3000/queue/metrics | jq .waiting'
```

**Prevention:**
- Auto-scaling based on queue depth
- Rate limiting on message ingestion
- Priority-based processing
- Regular capacity planning

---

### Issue: High Error Rate

**Symptoms:**
- Error rate >1%
- Sentry alerts firing
- Failed jobs in DLQ

**Diagnostic Steps:**

```bash
# 1. Check error metrics
curl http://localhost:3000/metrics | grep anclora_queue_messages_failed_total

# 2. Check Sentry
open https://sentry.io/anclora/whatsapp

# 3. Check DLQ
redis-cli -h $REDIS_HOST \
  LLEN bull:anclora-whatsapp:failed

# 4. Sample errors
redis-cli -h $REDIS_HOST \
  LRANGE bull:anclora-whatsapp:failed 0 10
```

**Resolution:**

```bash
# 1. Identify error pattern
aws logs filter-log-events \
  --log-group-name /ecs/anclora-whatsapp \
  --filter-pattern "ERROR" \
  --start-time $(date -u -d '1 hour ago' +%s)000

# 2. Fix underlying cause
# (depends on error type)

# 3. Retry failed jobs
curl -X POST http://localhost:3000/admin/queue/retry-failed \
  -H "X-Admin-Key: $ADMIN_KEY"

# 4. Clear DLQ if errors are transient
redis-cli -h $REDIS_HOST \
  DEL bull:anclora-whatsapp:failed
```

**Prevention:**
- Robust error handling
- Retry logic with exponential backoff
- Circuit breakers
- Input validation

---

### Issue: Slow Response Times

**Symptoms:**
- P95 latency >500ms
- Grafana showing spikes
- Users reporting delays

**Diagnostic Steps:**

```bash
# 1. Check latency metrics
curl http://localhost:3000/metrics | grep anclora_queue_processing_duration

# 2. Check event loop lag
curl http://localhost:3000/health | jq '.checks.eventLoop'

# 3. Profile CPU
curl -X POST http://localhost:3000/admin/profile/cpu \
  -d '{"duration": 30000}'
# Download profile and analyze

# 4. Check database query times
# Review slow query logs
```

**Resolution:**

```bash
# Immediate: Scale horizontally
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --desired-count 6

# Short-term: Identify bottleneck
# Use flame graphs to find hot code paths
npm run profile:flame

# Long-term: Optimize code
# - Add caching
# - Optimize queries
# - Async operations
# - Remove blocking code
```

---

## ℹ️  INFO ISSUES

### Issue: WhatsApp Instance Disconnected

**Symptoms:**
- "No active instances" alert
- Messages not sending
- QR code required

**Diagnostic Steps:**

```bash
# 1. Check instance status
curl http://localhost:3000/api/whatsapp/instances | jq

# 2. Check Evolution API
curl https://evolution.anclora.com/instance/status/$INSTANCE_NAME \
  -H "apikey: $EVOLUTION_API_KEY"
```

**Resolution:**

```bash
# 1. Restart instance
curl -X POST https://evolution.anclora.com/instance/restart/$INSTANCE_NAME \
  -H "apikey: $EVOLUTION_API_KEY"

# 2. If QR required, scan new QR
curl https://evolution.anclora.com/instance/connect/$INSTANCE_NAME \
  -H "apikey: $EVOLUTION_API_KEY" | jq '.qrcode'

# 3. Verify reconnection
sleep 30
curl http://localhost:3000/api/whatsapp/instances | jq '.instances[] | select(.status=="connected")'
```

---

### Issue: Missing Metrics in Grafana

**Symptoms:**
- Dashboards showing "No data"
- Gaps in time series
- Old data not updating

**Diagnostic Steps:**

```bash
# 1. Check Prometheus targets
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | select(.labels.job=="anclora-app")'

# 2. Check metrics endpoint
curl http://localhost:3000/metrics | grep anclora_

# 3. Check Prometheus scrape
tail -f /var/log/prometheus/prometheus.log | grep anclora
```

**Resolution:**

```bash
# 1. Verify application is exposing metrics
curl http://localhost:3000/metrics

# 2. Restart Prometheus
docker-compose restart prometheus

# 3. Force scrape
curl -X POST http://localhost:9090/-/reload

# 4. Check Grafana datasource
# Grafana UI → Configuration → Data Sources → Prometheus → Test
```

---

## 🔍 DIAGNOSTIC COMMANDS

### System Health

```bash
# Overall health
curl http://localhost:3000/health | jq

# Component health
curl http://localhost:3000/health | jq '.checks'

# Memory details
curl http://localhost:3000/health | jq '.checks.memory.details'
```

### Application Logs

```bash
# Recent logs
docker-compose logs --tail=100 anclora-app

# Follow logs
docker-compose logs -f anclora-app

# Filter errors
docker-compose logs anclora-app | grep ERROR

# CloudWatch logs (AWS)
aws logs tail /ecs/anclora-whatsapp --follow --since 10m
```

### Metrics

```bash
# Prometheus metrics
curl http://localhost:3000/metrics

# Specific metric
curl http://localhost:3000/metrics | grep anclora_queue_messages_total

# Queue metrics
curl http://localhost:3000/queue/metrics | jq
```

### Redis Debugging

```bash
# Connect to Redis
redis-cli -h $REDIS_HOST

# Queue info
LLEN bull:anclora-whatsapp:wait
LLEN bull:anclora-whatsapp:active
LLEN bull:anclora-whatsapp:completed
LLEN bull:anclora-whatsapp:failed

# Memory usage
INFO memory

# Slow log
SLOWLOG GET 10
```

### Database Queries

```bash
# Active connections
redis-cli -h $REDIS_HOST CLIENT LIST

# Key count
redis-cli -h $REDIS_HOST DBSIZE

# Largest keys
redis-cli -h $REDIS_HOST --bigkeys
```

---

## 📊 Monitoring Dashboards

### Grafana Dashboards

- **Queue Manager:** http://localhost:3001/d/queue-dashboard
- **Analytics:** http://localhost:3001/d/analytics-dashboard
- **System:** http://localhost:3001/d/system-dashboard

### Key Metrics to Watch

```
✓ Queue depth: < 5,000 messages
✓ Processing latency P95: < 100ms
✓ Error rate: < 0.5%
✓ Memory usage: < 768MB
✓ Event loop lag: < 50ms
✓ API success rate: > 99%
```

---

## 🚨 Alert Response

### Critical Alerts

**Response Time:** < 5 minutes

1. Acknowledge alert in Slack
2. Check Grafana dashboards
3. Review recent deployments
4. Execute appropriate runbook
5. Escalate if needed

### Warning Alerts

**Response Time:** < 30 minutes

1. Review alert details
2. Check trend (getting worse?)
3. Plan remediation
4. Execute during business hours

### Info Alerts

**Response Time:** Review daily

1. Note in log
2. Track patterns
3. Plan preventive measures

---

## 📞 Escalation

### Level 1 - Automated Response

- Auto-scaling
- Auto-restart
- Circuit breakers
- **No human intervention**

### Level 2 - On-Call Engineer

- Service degradation
- Performance issues
- Non-critical failures
- **Response: < 30 min**

### Level 3 - Engineering Lead

- Critical service down
- Data loss risk
- Security incident
- **Response: < 15 min**

### Level 4 - CTO

- Major outage (>30 min)
- Business impact
- Executive decision needed
- **Response: < 5 min**

---

**Last Updated:** 2026-01-01  
**Version:** 1.0.0  
**Owner:** DevOps Team
