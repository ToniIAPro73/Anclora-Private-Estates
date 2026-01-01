#!/bin/bash
#
# Anclora Deployment Script
# Automated deployment to staging/production environments
#

set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

# =============================================================================
# CONFIGURATION
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}
CLUSTER="anclora-${ENVIRONMENT}"
SERVICE="anclora-whatsapp"
REGION="eu-west-1"

# =============================================================================
# FUNCTIONS
# =============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not found. Please install it."
        exit 1
    fi
    
    # Check jq
    if ! command -v jq &> /dev/null; then
        log_error "jq not found. Please install it."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured properly."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

validate_environment() {
    log_info "Validating environment: $ENVIRONMENT"
    
    if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
        log_error "Invalid environment. Use 'staging' or 'production'"
        exit 1
    fi
    
    # Production requires additional confirmation
    if [[ "$ENVIRONMENT" == "production" ]]; then
        read -p "⚠️  Deploy to PRODUCTION? This action cannot be undone. (yes/no): " confirm
        if [[ "$confirm" != "yes" ]]; then
            log_warning "Deployment cancelled"
            exit 0
        fi
    fi
    
    log_success "Environment validated"
}

create_deployment_backup() {
    log_info "Creating deployment backup..."
    
    BACKUP_FILE="deployment-backup-$(date +%Y%m%d-%H%M%S).json"
    
    aws ecs describe-services \
        --cluster "$CLUSTER" \
        --services "$SERVICE" \
        --region "$REGION" \
        > "$BACKUP_FILE"
    
    log_success "Backup created: $BACKUP_FILE"
}

update_service() {
    log_info "Updating ECS service..."
    
    # Determine desired count based on environment
    if [[ "$ENVIRONMENT" == "production" ]]; then
        DESIRED_COUNT=4
    else
        DESIRED_COUNT=2
    fi
    
    aws ecs update-service \
        --cluster "$CLUSTER" \
        --service "$SERVICE" \
        --force-new-deployment \
        --desired-count "$DESIRED_COUNT" \
        --deployment-configuration "maximumPercent=200,minimumHealthyPercent=100" \
        --region "$REGION" \
        > /dev/null
    
    log_success "Service update initiated"
}

wait_for_deployment() {
    log_info "Waiting for deployment to stabilize..."
    
    aws ecs wait services-stable \
        --cluster "$CLUSTER" \
        --services "$SERVICE" \
        --region "$REGION"
    
    log_success "Deployment stabilized"
}

health_check() {
    log_info "Running health checks..."
    
    # Determine endpoint based on environment
    if [[ "$ENVIRONMENT" == "production" ]]; then
        ENDPOINT="https://anclora.com"
    else
        ENDPOINT="https://staging.anclora.com"
    fi
    
    # Wait for service to be fully ready
    sleep 30
    
    # Health check with retries
    for i in {1..10}; do
        if curl -f -s "$ENDPOINT/health" > /dev/null; then
            log_success "Health check passed"
            return 0
        fi
        log_warning "Health check failed (attempt $i/10). Retrying..."
        sleep 10
    done
    
    log_error "Health check failed after 10 attempts"
    return 1
}

smoke_tests() {
    log_info "Running smoke tests..."
    
    cd "$PROJECT_ROOT"
    
    if npm run test:smoke -- --env="$ENVIRONMENT"; then
        log_success "Smoke tests passed"
    else
        log_error "Smoke tests failed"
        return 1
    fi
}

monitor_metrics() {
    log_info "Monitoring metrics for 5 minutes..."
    
    # Monitor error rate from CloudWatch
    START_TIME=$(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S)
    END_TIME=$(date -u +%Y-%m-%dT%H:%M:%S)
    
    ERROR_RATE=$(aws cloudwatch get-metric-statistics \
        --namespace "Anclora/WhatsApp" \
        --metric-name "ErrorRate" \
        --start-time "$START_TIME" \
        --end-time "$END_TIME" \
        --period 300 \
        --statistics Average \
        --region "$REGION" \
        | jq -r '.Datapoints[0].Average // 0')
    
    if (( $(echo "$ERROR_RATE > 1.0" | bc -l) )); then
        log_error "Error rate is too high: $ERROR_RATE%"
        return 1
    fi
    
    log_success "Metrics looking good (error rate: $ERROR_RATE%)"
}

rollback() {
    log_warning "Rolling back deployment..."
    
    if [[ ! -f "$BACKUP_FILE" ]]; then
        log_error "No backup file found. Cannot rollback."
        exit 1
    fi
    
    PREVIOUS_TASK_DEF=$(jq -r '.services[0].taskDefinition' "$BACKUP_FILE")
    
    aws ecs update-service \
        --cluster "$CLUSTER" \
        --service "$SERVICE" \
        --task-definition "$PREVIOUS_TASK_DEF" \
        --force-new-deployment \
        --region "$REGION" \
        > /dev/null
    
    aws ecs wait services-stable \
        --cluster "$CLUSTER" \
        --services "$SERVICE" \
        --region "$REGION"
    
    log_success "Rollback completed"
}

notify_slack() {
    local status=$1
    local message=$2
    
    if [[ -z "${SLACK_WEBHOOK_URL:-}" ]]; then
        log_warning "SLACK_WEBHOOK_URL not set. Skipping Slack notification."
        return
    fi
    
    local emoji
    if [[ "$status" == "success" ]]; then
        emoji="✅"
    elif [[ "$status" == "failure" ]]; then
        emoji="❌"
    else
        emoji="ℹ️"
    fi
    
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{\"text\": \"$emoji $message\"}" \
        > /dev/null 2>&1
}

cleanup() {
    log_info "Cleaning up temporary files..."
    # Add cleanup logic here if needed
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

main() {
    log_info "=== Anclora Deployment Script ==="
    log_info "Environment: $ENVIRONMENT"
    log_info "Version: $VERSION"
    log_info "Cluster: $CLUSTER"
    
    # Trap errors and cleanup
    trap cleanup EXIT
    
    # Pre-deployment checks
    check_prerequisites
    validate_environment
    create_deployment_backup
    
    # Deploy
    update_service
    wait_for_deployment
    
    # Post-deployment verification
    if ! health_check; then
        log_error "Health check failed. Initiating rollback..."
        rollback
        notify_slack "failure" "Deployment to $ENVIRONMENT failed. Rolled back."
        exit 1
    fi
    
    if ! smoke_tests; then
        log_error "Smoke tests failed. Initiating rollback..."
        rollback
        notify_slack "failure" "Deployment to $ENVIRONMENT failed smoke tests. Rolled back."
        exit 1
    fi
    
    # Production-only monitoring
    if [[ "$ENVIRONMENT" == "production" ]]; then
        if ! monitor_metrics; then
            log_error "Metrics monitoring failed. Initiating rollback..."
            rollback
            notify_slack "failure" "Deployment to $ENVIRONMENT failed metrics check. Rolled back."
            exit 1
        fi
    fi
    
    # Success!
    log_success "=== Deployment Successful ==="
    notify_slack "success" "Deployment to $ENVIRONMENT completed successfully (version: $VERSION)"
}

# Run main function
main "$@"
