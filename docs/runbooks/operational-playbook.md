# Operational Playbook

Procedimientos operacionales diarios para Anclora WhatsApp Integration.

---

## 📅 DAILY OPERATIONS

### Morning Checklist (10:00 AM)

```bash
# 1. Check service health
curl https://anclora.com/health | jq '.status'
# Expected: "healthy"

# 2. Review overnight metrics
open https://grafana.anclora.com/d/queue-dashboard
open https://grafana.anclora.com/d/analytics-dashboard

# 3. Check queue backlog
curl https://anclora.com/queue/metrics | jq '.waiting'
# Expected: < 1000

# 4. Review error logs
aws logs tail /ecs/anclora-whatsapp \
  --filter-pattern "ERROR" \
  --since 24h | wc -l
# Expected: < 10

# 5. Check Sentry for new issues
open https://sentry.io/anclora/whatsapp

# 6. Verify Evolution API instances
curl https://anclora.com/api/whatsapp/instances | jq '.instances[] | select(.status=="connected") | .name'
# Expected: All instances connected
```

### End of Day Review (18:00 PM)

```bash
# 1. Generate daily report
node scripts/reports/daily-summary.js

# 2. Review key metrics
curl https://anclora.com/analytics/metrics/overview \
  -H "X-API-Key: $API_KEY" \
  | jq '{messages: .messages.sent, conversions: .conversions, handoffs: .conversations.handoffs}'

# 3. Check for pending alerts
# Review Slack #anclora-warnings channel

# 4. Backup verification
aws s3 ls s3://anclora-backups/redis/daily/ \
  | tail -1
# Expected: Today's date

# 5. Document incidents (if any)
# Update incident log
```

---

## 🔧 ROUTINE MAINTENANCE

### Weekly Tasks (Monday)

```bash
# 1. Review performance trends
# Grafana → Last 7 days comparison

# 2. Update dependencies (staging first)
npm outdated
npm update --save

# 3. Clean old logs
aws s3 rm s3://anclora-logs/ \
  --recursive \
  --exclude "*" \
  --include "$(date -d '90 days ago' +%Y-%m-%d)*"

# 4. Review and optimize slow queries
redis-cli SLOWLOG GET 10

# 5. Check disk usage
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name DiskUtilization \
  --statistics Average \
  --start-time $(date -d '7 days ago' +%Y-%m-%dT00:00:00) \
  --end-time $(date +%Y-%m-%dT00:00:00) \
  --period 86400
```

### Monthly Tasks (1st of Month)

```bash
# 1. DR test execution
./scripts/disaster-recovery/test-dr.sh

# 2. Security audit
npm audit
npm run security:scan

# 3. Cost optimization review
aws ce get-cost-and-usage \
  --time-period Start=$(date -d '1 month ago' +%Y-%m-01),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics BlendedCost

# 4. Capacity planning
# Review growth trends
# Forecast next month needs

# 5. Documentation update
# Review and update runbooks
# Update architecture diagrams
```

---

## 📊 MONITORING

### Key Dashboards

**Queue Dashboard:**
- Throughput (messages/sec)
- Latency P95/P99
- Queue depth (waiting/active/DLQ)
- Error rate
- Processing duration

**Analytics Dashboard:**
- Messages sent/delivered/read
- Delivery rate
- Read rate
- Active conversations
- Conversions
- Revenue

**System Dashboard:**
- CPU utilization
- Memory usage
- Event loop lag
- Redis connections
- Disk I/O

### Alert Response

**Critical (< 5 min response):**
1. Acknowledge in Slack
2. Open Grafana dashboards
3. Check recent deployments
4. Execute appropriate runbook
5. Escalate if needed

**Warning (< 30 min response):**
1. Review alert details
2. Check trends
3. Plan remediation
4. Execute during business hours

---

## 🔄 DEPLOYMENT OPERATIONS

### Pre-Deployment Checklist

- [ ] All CI checks passing
- [ ] Code reviewed
- [ ] Staging tested
- [ ] Monitoring ready
- [ ] Rollback plan confirmed

### Deployment Process

```bash
# Staging (automatic on merge to main)
git checkout main
git pull origin main
# Wait for GitHub Actions

# Production (manual approval)
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3
# Approve in GitHub Actions UI
```

### Post-Deployment Verification

```bash
# 1. Health check
curl https://anclora.com/health

# 2. Smoke tests
npm run test:smoke -- --env=production

# 3. Monitor metrics (15 min)
watch -n 30 'curl -s https://anclora.com/metrics | grep error_rate'

# 4. Check logs
aws logs tail /ecs/anclora-whatsapp --follow --since 5m
```

---

## 🐛 COMMON ISSUES

### Issue: Queue Growing

**Quick Fix:**
```bash
# Scale up temporarily
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --desired-count 6
```

### Issue: High Memory

**Quick Fix:**
```bash
# Force task rotation
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --force-new-deployment
```

### Issue: WhatsApp Disconnected

**Quick Fix:**
```bash
# Restart instance
curl -X POST https://evolution.anclora.com/instance/restart/$INSTANCE \
  -H "apikey: $EVOLUTION_API_KEY"
```

---

## 📈 CAPACITY PLANNING

### Current Capacity

```
Tasks: 4
CPU per task: 1 vCPU
Memory per task: 2048 MB
Max throughput: ~600 msg/sec
```

### When to Scale

**Scale Up (Add Tasks):**
- Queue depth consistently > 5000
- CPU utilization > 70% for > 10 min
- Processing latency P95 > 200ms

**Scale Out (Increase Resources):**
- Memory usage > 80%
- OOM kills observed
- Event loop lag > 100ms

### Scaling Commands

```bash
# Horizontal scaling
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --desired-count 8

# Vertical scaling (update task definition first)
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --task-definition anclora-whatsapp:NEW_REVISION
```

---

## 🔐 ACCESS MANAGEMENT

### AWS Console

- **DevOps Team:** Full access
- **Developers:** Read-only + specific write
- **Support:** Read-only

### GitHub Repository

- **Admins:** Can merge to main, create tags
- **Developers:** Can create PRs, push to feature branches
- **External:** No access

### Monitoring Tools

- **Grafana:** Viewer role for all
- **Sentry:** Developer role for team
- **CloudWatch:** Read-only for support

---

## 📞 ON-CALL PROCEDURES

### On-Call Rotation

- **Duration:** 1 week
- **Handoff:** Monday 10:00 AM
- **Tools:** PagerDuty, Slack, Phone

### Handoff Checklist

```markdown
## On-Call Handoff - [Date]

**From:** [Previous On-Call]
**To:** [New On-Call]

### Active Issues
- [ ] [Issue 1 - Description]
- [ ] [Issue 2 - Description]

### Recent Changes
- [Deployment v1.2.3 on 2026-01-01]
- [Config change: increased timeout]

### Upcoming
- [Scheduled maintenance on 2026-01-05]
- [DR test planned for 2026-01-10]

### Notes
[Any additional context]
```

### Escalation

```
Alert → On-Call Engineer (5 min)
  ↓ (if critical and unresolved after 30 min)
DevOps Lead (30 min)
  ↓ (if still unresolved)
CTO (60 min)
```

---

## 📋 RUNBOOK INDEX

| Runbook | Purpose | Link |
|---------|---------|------|
| **Deployment** | Deploy to staging/production | [deployment-guide.md](./deployment-guide.md) |
| **Troubleshooting** | Resolve common issues | [troubleshooting.md](./troubleshooting.md) |
| **Disaster Recovery** | Recover from disasters | [disaster-recovery.md](./disaster-recovery.md) |
| **Operational** | Daily operations | [operational-playbook.md](./operational-playbook.md) |

---

**Last Updated:** 2026-01-01  
**Version:** 1.0.0  
**Owner:** DevOps Team
