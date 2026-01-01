#!/bin/bash

# ============================================================================
# Monitoring Utilities for Anclora WhatsApp System
# ============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONITORING_DIR="${SCRIPT_DIR}/.."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# FUNCTIONS
# ============================================================================

print_header() {
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# ============================================================================
# START MONITORING STACK
# ============================================================================

start_monitoring() {
    print_header "Starting Monitoring Stack"
    
    cd "${MONITORING_DIR}"
    
    print_info "Starting Prometheus, Grafana, Alertmanager..."
    docker-compose -f docker-compose.monitoring.yml up -d
    
    echo ""
    print_success "Monitoring stack started!"
    echo ""
    print_info "Access points:"
    echo "  - Prometheus:    http://localhost:9090"
    echo "  - Grafana:       http://localhost:3001 (admin/admin)"
    echo "  - Alertmanager:  http://localhost:9093"
    echo ""
}

# ============================================================================
# STOP MONITORING STACK
# ============================================================================

stop_monitoring() {
    print_header "Stopping Monitoring Stack"
    
    cd "${MONITORING_DIR}"
    docker-compose -f docker-compose.monitoring.yml down
    
    print_success "Monitoring stack stopped"
}

# ============================================================================
# RESTART MONITORING STACK
# ============================================================================

restart_monitoring() {
    print_header "Restarting Monitoring Stack"
    stop_monitoring
    sleep 2
    start_monitoring
}

# ============================================================================
# CHECK HEALTH
# ============================================================================

check_health() {
    print_header "Checking System Health"
    
    # Check Prometheus
    if curl -s http://localhost:9090/-/healthy > /dev/null 2>&1; then
        print_success "Prometheus is healthy"
    else
        print_error "Prometheus is not responding"
    fi
    
    # Check Grafana
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        print_success "Grafana is healthy"
    else
        print_error "Grafana is not responding"
    fi
    
    # Check Alertmanager
    if curl -s http://localhost:9093/-/healthy > /dev/null 2>&1; then
        print_success "Alertmanager is healthy"
    else
        print_error "Alertmanager is not responding"
    fi
    
    # Check application
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        print_success "Application is healthy"
        
        # Show detailed health
        echo ""
        print_info "Detailed health status:"
        curl -s http://localhost:3000/health | jq '.'
    else
        print_error "Application is not responding"
    fi
    
    echo ""
}

# ============================================================================
# VIEW METRICS
# ============================================================================

view_metrics() {
    print_header "Current Metrics"
    
    if ! curl -s http://localhost:3000/metrics > /dev/null 2>&1; then
        print_error "Cannot connect to application metrics endpoint"
        return 1
    fi
    
    echo ""
    print_info "Queue Metrics:"
    curl -s http://localhost:3000/metrics | grep "anclora_queue" | head -10
    
    echo ""
    print_info "Analytics Metrics:"
    curl -s http://localhost:3000/metrics | grep "anclora_analytics" | head -10
    
    echo ""
    print_info "WhatsApp Metrics:"
    curl -s http://localhost:3000/metrics | grep "anclora_whatsapp" | head -10
    
    echo ""
}

# ============================================================================
# VIEW ACTIVE ALERTS
# ============================================================================

view_alerts() {
    print_header "Active Alerts"
    
    if ! curl -s http://localhost:9093/api/v2/alerts > /dev/null 2>&1; then
        print_error "Cannot connect to Alertmanager"
        return 1
    fi
    
    alerts=$(curl -s http://localhost:9093/api/v2/alerts)
    count=$(echo "$alerts" | jq '. | length')
    
    if [ "$count" -eq 0 ]; then
        print_success "No active alerts"
    else
        print_warning "$count active alert(s):"
        echo "$alerts" | jq -r '.[] | "  - \(.labels.alertname) [\(.labels.severity)]: \(.annotations.summary)"'
    fi
    
    echo ""
}

# ============================================================================
# TAIL LOGS
# ============================================================================

tail_logs() {
    local service=${1:-all}
    
    print_header "Tailing Logs: $service"
    
    cd "${MONITORING_DIR}"
    
    case $service in
        prometheus)
            docker-compose -f docker-compose.monitoring.yml logs -f prometheus
            ;;
        grafana)
            docker-compose -f docker-compose.monitoring.yml logs -f grafana
            ;;
        alertmanager)
            docker-compose -f docker-compose.monitoring.yml logs -f alertmanager
            ;;
        all)
            docker-compose -f docker-compose.monitoring.yml logs -f
            ;;
        *)
            print_error "Unknown service: $service"
            print_info "Available services: prometheus, grafana, alertmanager, all"
            return 1
            ;;
    esac
}

# ============================================================================
# BACKUP DASHBOARDS
# ============================================================================

backup_dashboards() {
    print_header "Backing up Grafana Dashboards"
    
    BACKUP_DIR="${MONITORING_DIR}/backups/dashboards-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Get all dashboard UIDs
    dashboards=$(curl -s -u admin:admin http://localhost:3001/api/search?type=dash-db | jq -r '.[].uid')
    
    for uid in $dashboards; do
        dashboard_json=$(curl -s -u admin:admin "http://localhost:3001/api/dashboards/uid/$uid")
        title=$(echo "$dashboard_json" | jq -r '.dashboard.title' | sed 's/ /-/g')
        
        echo "$dashboard_json" > "$BACKUP_DIR/${title}.json"
        print_success "Backed up: $title"
    done
    
    print_success "Dashboards backed up to: $BACKUP_DIR"
    echo ""
}

# ============================================================================
# RELOAD PROMETHEUS CONFIG
# ============================================================================

reload_prometheus() {
    print_header "Reloading Prometheus Configuration"
    
    if curl -X POST http://localhost:9090/-/reload > /dev/null 2>&1; then
        print_success "Prometheus configuration reloaded"
    else
        print_error "Failed to reload Prometheus configuration"
        print_info "You may need to restart Prometheus"
    fi
    
    echo ""
}

# ============================================================================
# SHOW STATS
# ============================================================================

show_stats() {
    print_header "System Statistics"
    
    # Prometheus stats
    print_info "Prometheus:"
    targets=$(curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets | length')
    echo "  Active targets: $targets"
    
    # Grafana stats
    print_info "Grafana:"
    dashboards=$(curl -s -u admin:admin http://localhost:3001/api/search?type=dash-db | jq '. | length')
    echo "  Dashboards: $dashboards"
    
    # Alertmanager stats
    print_info "Alertmanager:"
    alerts=$(curl -s http://localhost:9093/api/v2/alerts | jq '. | length')
    echo "  Active alerts: $alerts"
    
    echo ""
}

# ============================================================================
# MAIN
# ============================================================================

case "${1:-help}" in
    start)
        start_monitoring
        ;;
    stop)
        stop_monitoring
        ;;
    restart)
        restart_monitoring
        ;;
    health)
        check_health
        ;;
    metrics)
        view_metrics
        ;;
    alerts)
        view_alerts
        ;;
    logs)
        tail_logs "${2:-all}"
        ;;
    backup)
        backup_dashboards
        ;;
    reload)
        reload_prometheus
        ;;
    stats)
        show_stats
        ;;
    help|*)
        echo "Usage: $0 {start|stop|restart|health|metrics|alerts|logs|backup|reload|stats}"
        echo ""
        echo "Commands:"
        echo "  start       - Start monitoring stack"
        echo "  stop        - Stop monitoring stack"
        echo "  restart     - Restart monitoring stack"
        echo "  health      - Check health of all services"
        echo "  metrics     - View current metrics"
        echo "  alerts      - View active alerts"
        echo "  logs [svc]  - Tail logs (prometheus|grafana|alertmanager|all)"
        echo "  backup      - Backup Grafana dashboards"
        echo "  reload      - Reload Prometheus configuration"
        echo "  stats       - Show system statistics"
        echo ""
        ;;
esac
