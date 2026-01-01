# Disaster Recovery Plan

Plan de recuperación ante desastres para Anclora WhatsApp Integration.

---

## 🎯 Recovery Objectives

### RTO (Recovery Time Objective)

| Severity | Target RTO | Max Acceptable |
|----------|-----------|----------------|
| **Critical** | 15 minutes | 30 minutes |
| **High** | 1 hour | 2 hours |
| **Medium** | 4 hours | 8 hours |
| **Low** | 24 hours | 48 hours |

### RPO (Recovery Point Objective)

| Data Type | Target RPO | Backup Frequency |
|-----------|-----------|------------------|
| **Queue Data** | 5 minutes | Continuous (Redis AOF) |
| **Analytics** | 15 minutes | Every 15 min |
| **Configuration** | 1 hour | Hourly snapshots |
| **Logs** | 24 hours | Daily archives |

---

## 🔴 CRITICAL SCENARIOS

### Scenario 1: Complete AWS Region Outage

**Impact:** Total service unavailability

**Detection:**
- AWS Health Dashboard alerts
- All health checks failing
- No ECS tasks running

**Recovery Procedure:**

```bash
# STEP 1: Activate DR region (5 min)
# Pre-configured infrastructure in eu-central-1

# Set DR region
export DR_REGION=eu-central-1
export DR_CLUSTER=anclora-dr

# Verify DR infrastructure
aws ecs describe-clusters \
  --clusters $DR_CLUSTER \
  --region $DR_REGION

# STEP 2: Restore Redis from backup (3 min)
# Latest backup from S3
aws s3 cp s3://anclora-backups/redis/latest.rdb /tmp/

# Restore to DR Redis
redis-cli -h $DR_REDIS_HOST \
  --rdb /tmp/latest.rdb

# STEP 3: Update DNS (2 min)
# Route53 health check failover
aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file://failover-to-dr.json

# STEP 4: Activate ECS service (3 min)
aws ecs update-service \
  --cluster $DR_CLUSTER \
  --service anclora-whatsapp \
  --desired-count 4 \
  --region $DR_REGION

# STEP 5: Verify recovery (2 min)
curl https://anclora.com/health
npm run test:smoke -- --env=production

# Total: ~15 minutes
```

**Post-Recovery:**
- Monitor error rates closely
- Notify customers of incident
- Document lessons learned
- Plan failback when primary region recovers

---

### Scenario 2: Database/Redis Complete Loss

**Impact:** Queue data loss, analytics unavailable

**Detection:**
- Redis connection errors
- Queue operations failing
- Analytics not recording

**Recovery Procedure:**

```bash
# STEP 1: Identify issue (1 min)
redis-cli -h $REDIS_HOST ping
# No response = complete failure

# STEP 2: Launch new Redis instance (5 min)
# Option A: Launch from latest snapshot
aws elasticache create-replication-group \
  --replication-group-id anclora-redis-recovery \
  --snapshot-name anclora-redis-latest \
  --cache-node-type cache.r6g.large

# Option B: Restore from RDB backup
aws s3 cp s3://anclora-backups/redis/$(date +%Y%m%d)/latest.rdb /tmp/
redis-cli -h $NEW_REDIS_HOST --rdb /tmp/latest.rdb

# STEP 3: Update application configuration (2 min)
aws ssm put-parameter \
  --name /anclora/production/redis-url \
  --value "redis://$NEW_REDIS_HOST:6379" \
  --overwrite

# STEP 4: Restart application (3 min)
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --force-new-deployment

# STEP 5: Verify queue operations (2 min)
curl http://localhost:3000/queue/metrics
curl -X POST http://localhost:3000/api/queue/add \
  -H "X-API-Key: $API_KEY" \
  -d '{"test": "message"}'

# Total: ~13 minutes
```

**Data Loss Assessment:**
- Queue messages: Lost since last AOF sync (~5 min)
- Analytics: Lost since last backup (~15 min)
- Action: Notify team of potential lost messages

---

### Scenario 3: Container Registry Unavailable

**Impact:** Cannot deploy or scale

**Detection:**
- ECS task pull errors
- "Image not found" errors
- Deployment failures

**Recovery Procedure:**

```bash
# STEP 1: Verify issue (1 min)
docker pull ghcr.io/anclora/whatsapp-integration:latest
# Fails with timeout or auth error

# STEP 2: Use backup registry (3 min)
# Pre-configured ECR as backup
docker pull 123456789.dkr.ecr.eu-west-1.amazonaws.com/anclora:latest

# STEP 3: Update ECS task definition (2 min)
# Point to ECR backup image
aws ecs register-task-definition \
  --cli-input-json file://task-def-ecr-backup.json

# STEP 4: Update service (2 min)
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --task-definition anclora-whatsapp:BACKUP_REVISION

# Total: ~8 minutes
```

---

## ⚠️  HIGH SEVERITY SCENARIOS

### Scenario 4: Data Corruption

**Impact:** Incorrect data in Redis/Queue

**Detection:**
- Data validation errors
- Unexpected queue behavior
- Analytics anomalies

**Recovery Procedure:**

```bash
# STEP 1: Stop affected services (2 min)
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --desired-count 0

# STEP 2: Backup current state (5 min)
redis-cli -h $REDIS_HOST --rdb /tmp/corrupted-$(date +%s).rdb
aws s3 cp /tmp/corrupted-*.rdb s3://anclora-backups/corrupted/

# STEP 3: Restore from known good backup (10 min)
# Find last known good backup (pre-corruption)
aws s3 ls s3://anclora-backups/redis/hourly/

# Restore specific backup
aws s3 cp s3://anclora-backups/redis/hourly/2026-01-01-10.rdb /tmp/
redis-cli -h $REDIS_HOST FLUSHALL
redis-cli -h $REDIS_HOST --rdb /tmp/2026-01-01-10.rdb

# STEP 4: Validate data integrity (5 min)
node scripts/validate-redis-data.js

# STEP 5: Resume services (3 min)
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --desired-count 4

# Total: ~25 minutes
```

---

### Scenario 5: Security Breach

**Impact:** Potential data exposure, system compromise

**Detection:**
- Sentry security alerts
- Unusual API activity
- AWS GuardDuty findings

**Recovery Procedure:**

```bash
# STEP 1: Immediate containment (5 min)
# Isolate affected systems
aws ec2 modify-instance-attribute \
  --instance-id $INSTANCE_ID \
  --groups sg-isolated

# Rotate all credentials
./scripts/security/rotate-all-credentials.sh

# STEP 2: Assess scope (15 min)
# Review CloudTrail logs
aws cloudtrail lookup-events \
  --start-time $(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S) \
  --lookup-attributes AttributeKey=Username,AttributeValue=compromised-user

# Check data access
aws s3api list-objects \
  --bucket anclora-data \
  --query 'Contents[?LastModified>=`2026-01-01`]'

# STEP 3: Restore from clean backup (30 min)
# Use backup from before breach
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --task-definition anclora-whatsapp:CLEAN_REVISION

# STEP 4: Implement additional security (20 min)
# Enable MFA on all accounts
# Update security groups
# Enable AWS WAF
# Deploy IDS/IPS

# STEP 5: Notify stakeholders (10 min)
# Legal team
# Customers (if PII exposed)
# Regulators (if required)

# Total: ~80 minutes
```

---

## 📋 BACKUP PROCEDURES

### Automated Backups

**Redis AOF (Append-Only File):**
```bash
# Enabled on Redis
redis-cli CONFIG SET appendonly yes
redis-cli CONFIG SET appendfsync everysec

# Verify
redis-cli CONFIG GET appendonly
```

**Redis RDB Snapshots:**
```bash
# Automated via cron
# /etc/cron.d/redis-backup

# Hourly snapshots
0 * * * * /scripts/backup/redis-snapshot.sh hourly

# Daily snapshots (keep 7 days)
0 2 * * * /scripts/backup/redis-snapshot.sh daily

# Weekly snapshots (keep 4 weeks)
0 3 * * 0 /scripts/backup/redis-snapshot.sh weekly
```

**ECS Task Definition Backups:**
```bash
# Automated via GitHub Actions
# On every deployment

aws ecs describe-task-definition \
  --task-definition anclora-whatsapp \
  > backups/task-definitions/$(date +%Y%m%d-%H%M%S).json
```

### Manual Backup

**On-Demand Redis Backup:**
```bash
# Create snapshot
redis-cli -h $REDIS_HOST BGSAVE

# Wait for completion
redis-cli -h $REDIS_HOST LASTSAVE

# Copy to S3
aws s3 cp /var/lib/redis/dump.rdb \
  s3://anclora-backups/redis/manual/$(date +%Y%m%d-%H%M%S).rdb
```

**Configuration Backup:**
```bash
# Backup all SSM parameters
aws ssm get-parameters-by-path \
  --path /anclora/production \
  --recursive \
  > backups/config/ssm-$(date +%Y%m%d).json

# Backup secrets
aws secretsmanager list-secrets \
  --filter Key=name,Values=anclora \
  > backups/config/secrets-$(date +%Y%m%d).json
```

---

## 🔄 RESTORE PROCEDURES

### Restore Redis from Backup

```bash
# STEP 1: Stop applications using Redis
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --desired-count 0

# STEP 2: Download backup
aws s3 cp s3://anclora-backups/redis/daily/2026-01-01.rdb /tmp/

# STEP 3: Stop Redis (if self-managed)
docker-compose stop redis

# STEP 4: Replace RDB file
sudo cp /tmp/2026-01-01.rdb /var/lib/redis/dump.rdb
sudo chown redis:redis /var/lib/redis/dump.rdb

# STEP 5: Start Redis
docker-compose start redis

# STEP 6: Verify data
redis-cli -h $REDIS_HOST DBSIZE
redis-cli -h $REDIS_HOST LLEN bull:anclora-whatsapp:wait

# STEP 7: Resume applications
aws ecs update-service \
  --cluster anclora-production \
  --service anclora-whatsapp \
  --desired-count 4
```

### Restore Configuration

```bash
# Restore SSM parameters
jq -r '.Parameters[] | 
  "aws ssm put-parameter --name \(.Name) --value '\''\(.Value)'\'' --type \(.Type) --overwrite"' \
  backups/config/ssm-20260101.json | bash

# Verify
aws ssm get-parameters-by-path \
  --path /anclora/production \
  --recursive
```

---

## 🧪 DISASTER RECOVERY TESTING

### Monthly DR Test

**Objective:** Verify DR procedures work

**Procedure:**
```bash
# 1. Schedule DR test (off-peak hours)
# 2. Notify team
# 3. Execute DR scenario in staging
# 4. Measure RTO/RPO
# 5. Document findings
# 6. Update procedures
```

**Test Scenarios:**
- [ ] Region failover (quarterly)
- [ ] Redis restore (monthly)
- [ ] Configuration restore (monthly)
- [ ] Security breach response (annually)

### Test Checklist

```markdown
## DR Test - [Date]

**Scenario:** [Scenario Name]
**Tester:** [Name]
**Environment:** Staging/Production

### Pre-Test
- [ ] Backup created
- [ ] Team notified
- [ ] Monitoring active

### During Test
- [ ] Issue simulated
- [ ] Recovery executed
- [ ] RTO measured: _____ min
- [ ] RPO measured: _____ min

### Post-Test
- [ ] Service restored
- [ ] Data validated
- [ ] Lessons documented
- [ ] Procedures updated

### Findings
[Document any issues or improvements]
```

---

## 📞 EMERGENCY CONTACTS

### Internal

| Role | Name | Phone | Email |
|------|------|-------|-------|
| **On-Call Engineer** | Rotating | +34 XXX XXX XXX | oncall@anclora.com |
| **DevOps Lead** | [Name] | +34 XXX XXX XXX | devops@anclora.com |
| **CTO** | [Name] | +34 XXX XXX XXX | cto@anclora.com |
| **CEO** | [Name] | +34 XXX XXX XXX | ceo@anclora.com |

### External

| Service | Contact | Phone | Portal |
|---------|---------|-------|--------|
| **AWS Support** | Enterprise | +1 XXX XXX XXXX | https://console.aws.amazon.com/support |
| **Evolution API** | Support | support@evolution.api | https://evolution.api/support |
| **Cloudflare** | 24/7 | +1 XXX XXX XXXX | https://dash.cloudflare.com |

### Escalation Chain

```
Level 1: On-Call Engineer (0-15 min)
    ↓ (if unresolved after 30 min)
Level 2: DevOps Lead (15-30 min)
    ↓ (if critical and unresolved)
Level 3: CTO (30+ min)
    ↓ (if business impact)
Level 4: CEO
```

---

## 📊 POST-INCIDENT REPORT

### Template

```markdown
# Post-Incident Report - [Incident ID]

**Date:** [YYYY-MM-DD]
**Severity:** Critical/High/Medium/Low
**Duration:** [Start] - [End] ([Total Duration])
**Impact:** [Description]

## Timeline

| Time | Event |
|------|-------|
| HH:MM | Incident detected |
| HH:MM | Team notified |
| HH:MM | Investigation started |
| HH:MM | Root cause identified |
| HH:MM | Fix deployed |
| HH:MM | Service restored |
| HH:MM | Incident closed |

## Root Cause

[Detailed analysis of what went wrong]

## Resolution

[What was done to fix it]

## Impact Assessment

- **Users Affected:** [Number/Percentage]
- **Data Loss:** [Yes/No - Details]
- **Revenue Impact:** [Amount]
- **RTO Achieved:** [Time]
- **RPO Achieved:** [Time]

## Action Items

- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

## Lessons Learned

### What Went Well
- [Item 1]
- [Item 2]

### What Could Be Improved
- [Item 1]
- [Item 2]

## Prevention

[How to prevent this from happening again]
```

---

**Last Updated:** 2026-01-01  
**Version:** 1.0.0  
**Next Review:** 2026-04-01  
**Owner:** DevOps Team
