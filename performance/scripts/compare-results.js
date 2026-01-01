#!/usr/bin/env node
/**
 * Performance Results Comparison Script
 * 
 * Compares current performance test results against baseline
 * to detect regressions
 */

const fs = require('fs');
const path = require('path');

// Regression thresholds
const THRESHOLDS = {
  WARNING: 0.10,  // 10% degradation
  CRITICAL: 0.20, // 20% degradation
};

/**
 * Load performance results from directory
 */
function loadResults(directory) {
  const resultsPath = path.join(directory, 'summary.json');
  
  if (!fs.existsSync(resultsPath)) {
    return null;
  }
  
  return JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
}

/**
 * Calculate percentage change
 */
function calculateChange(baseline, current) {
  if (!baseline || baseline === 0) return 0;
  return ((current - baseline) / baseline);
}

/**
 * Compare metrics
 */
function compareMetrics(baseline, current) {
  if (!baseline || !current) {
    return {
      regression: false,
      reason: 'Missing baseline or current results',
    };
  }
  
  const comparison = {
    baseline: {},
    current: {},
    change: {},
    regressions: [],
    warnings: [],
  };
  
  // Queue metrics
  const queueMetrics = [
    { key: 'queue_p99', name: 'Queue P99 Latency', higherIsBetter: false },
    { key: 'queue_throughput', name: 'Queue Throughput', higherIsBetter: true },
    { key: 'queue_error_rate', name: 'Queue Error Rate', higherIsBetter: false },
  ];
  
  // Analytics metrics
  const analyticsMetrics = [
    { key: 'analytics_p99', name: 'Analytics P99 Latency', higherIsBetter: false },
    { key: 'analytics_throughput', name: 'Analytics Throughput', higherIsBetter: true },
  ];
  
  // Redis metrics
  const redisMetrics = [
    { key: 'redis_p99', name: 'Redis P99 Latency', higherIsBetter: false },
    { key: 'redis_ops_per_sec', name: 'Redis Ops/Sec', higherIsBetter: true },
  ];
  
  const allMetrics = [...queueMetrics, ...analyticsMetrics, ...redisMetrics];
  
  allMetrics.forEach(({ key, name, higherIsBetter }) => {
    const baselineValue = baseline[key];
    const currentValue = current[key];
    
    if (baselineValue === undefined || currentValue === undefined) {
      return;
    }
    
    comparison.baseline[key] = baselineValue;
    comparison.current[key] = currentValue;
    
    const change = calculateChange(baselineValue, currentValue);
    comparison.change[key] = (change * 100).toFixed(2);
    
    // Determine if this is a regression
    const isRegression = higherIsBetter 
      ? change < -THRESHOLDS.CRITICAL 
      : change > THRESHOLDS.CRITICAL;
    
    const isWarning = higherIsBetter 
      ? change < -THRESHOLDS.WARNING && change >= -THRESHOLDS.CRITICAL
      : change > THRESHOLDS.WARNING && change <= THRESHOLDS.CRITICAL;
    
    if (isRegression) {
      comparison.regressions.push({
        metric: name,
        baseline: baselineValue,
        current: currentValue,
        change: comparison.change[key],
      });
    } else if (isWarning) {
      comparison.warnings.push({
        metric: name,
        baseline: baselineValue,
        current: currentValue,
        change: comparison.change[key],
      });
    }
  });
  
  comparison.regression = comparison.regressions.length > 0;
  comparison.hasWarnings = comparison.warnings.length > 0;
  
  return comparison;
}

/**
 * Generate summary report
 */
function generateReport(comparison) {
  console.log('\n=== Performance Comparison Report ===\n');
  
  if (!comparison.baseline || !comparison.current) {
    console.log('❌ Missing baseline or current results');
    return;
  }
  
  console.log('📊 Metrics Comparison:');
  console.log('─'.repeat(80));
  
  Object.keys(comparison.baseline).forEach(key => {
    const baseline = comparison.baseline[key];
    const current = comparison.current[key];
    const change = comparison.change[key];
    
    const changeNum = parseFloat(change);
    let indicator = '✅';
    if (Math.abs(changeNum) > THRESHOLDS.CRITICAL * 100) {
      indicator = '❌';
    } else if (Math.abs(changeNum) > THRESHOLDS.WARNING * 100) {
      indicator = '⚠️ ';
    }
    
    console.log(`${indicator} ${key}:`);
    console.log(`   Baseline: ${baseline}`);
    console.log(`   Current:  ${current}`);
    console.log(`   Change:   ${change}%\n`);
  });
  
  if (comparison.regressions.length > 0) {
    console.log('\n❌ REGRESSIONS DETECTED:');
    console.log('─'.repeat(80));
    comparison.regressions.forEach(r => {
      console.log(`- ${r.metric}: ${r.change}% degradation`);
      console.log(`  Baseline: ${r.baseline} → Current: ${r.current}`);
    });
  }
  
  if (comparison.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    console.log('─'.repeat(80));
    comparison.warnings.forEach(w => {
      console.log(`- ${w.metric}: ${w.change}% change`);
      console.log(`  Baseline: ${w.baseline} → Current: ${w.current}`);
    });
  }
  
  if (!comparison.regression && !comparison.hasWarnings) {
    console.log('\n✅ No performance regressions detected!');
  }
  
  console.log('\n' + '='.repeat(80));
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: compare-results.js <baseline-dir> <current-dir>');
    process.exit(1);
  }
  
  const baselineDir = args[0];
  const currentDir = args[1];
  
  const baseline = loadResults(baselineDir);
  const current = loadResults(currentDir);
  
  const comparison = compareMetrics(baseline, current);
  
  // Generate console report
  generateReport(comparison);
  
  // Output JSON for CI/CD consumption
  console.log(JSON.stringify(comparison, null, 2));
  
  // Exit with error code if regression detected
  if (comparison.regression) {
    process.exit(1);
  }
}

// Run
main();
