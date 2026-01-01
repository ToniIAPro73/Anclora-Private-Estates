/**
 * Memory Profiling Script
 * 
 * Herramientas de profiling de memoria y CPU para identificar cuellos de botella
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

interface ProfileConfig {
  type: 'heap' | 'cpu' | 'flame';
  duration: number;
  output: string;
  scenario: string;
}

class MemoryProfiler {
  private outputDir: string;

  constructor(outputDir: string = './performance/profiles') {
    this.outputDir = outputDir;
    this.ensureOutputDir();
  }

  private ensureOutputDir(): void {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Profile heap memory usage
   */
  async profileHeap(scenario: string = 'default'): Promise<void> {
    console.log(`📊 Profiling heap memory for scenario: ${scenario}`);

    const outputPath = path.join(this.outputDir, `heap-${scenario}-${Date.now()}.heapsnapshot`);

    try {
      execSync(
        `node --inspect --heap-prof --heap-prof-dir=${this.outputDir} ` +
        `--heap-prof-name=heap-${scenario}.heapprofile ` +
        `./dist/server.js`,
        { stdio: 'inherit', timeout: 60000 }
      );

      console.log(`✅ Heap profile saved to: ${outputPath}`);
      console.log('   Open in Chrome DevTools: chrome://inspect');
    } catch (error) {
      console.error('❌ Heap profiling failed:', error);
    }
  }

  /**
   * Profile CPU usage
   */
  async profileCPU(scenario: string = 'default', duration: number = 30): Promise<void> {
    console.log(`⚡ Profiling CPU for scenario: ${scenario} (${duration}s)`);

    const outputPath = path.join(this.outputDir, `cpu-${scenario}-${Date.now()}.cpuprofile`);

    try {
      execSync(
        `node --inspect --cpu-prof --cpu-prof-dir=${this.outputDir} ` +
        `--cpu-prof-name=cpu-${scenario}.cpuprofile ` +
        `./dist/server.js`,
        { stdio: 'inherit', timeout: duration * 1000 }
      );

      console.log(`✅ CPU profile saved to: ${outputPath}`);
      console.log('   Open in Chrome DevTools: chrome://inspect');
    } catch (error) {
      console.error('❌ CPU profiling failed:', error);
    }
  }

  /**
   * Generate flame graph using Clinic.js
   */
  async generateFlameGraph(scenario: string = 'default'): Promise<void> {
    console.log(`🔥 Generating flame graph for scenario: ${scenario}`);

    const outputPath = path.join(this.outputDir, `flame-${scenario}`);

    try {
      execSync(
        `clinic flame --dest ${outputPath} -- node ./dist/server.js`,
        { stdio: 'inherit', timeout: 60000 }
      );

      console.log(`✅ Flame graph saved to: ${outputPath}`);
      console.log(`   Open HTML file to view: ${outputPath}/*.html`);
    } catch (error) {
      console.error('❌ Flame graph generation failed:', error);
    }
  }

  /**
   * Analyze memory leaks using Clinic.js
   */
  async detectMemoryLeaks(scenario: string = 'default'): Promise<void> {
    console.log(`🔍 Detecting memory leaks for scenario: ${scenario}`);

    const outputPath = path.join(this.outputDir, `heapprofiler-${scenario}`);

    try {
      execSync(
        `clinic heapprofiler --dest ${outputPath} -- node ./dist/server.js`,
        { stdio: 'inherit', timeout: 120000 }
      );

      console.log(`✅ Heap profiler analysis saved to: ${outputPath}`);
      console.log(`   Open HTML file to view: ${outputPath}/*.html`);
    } catch (error) {
      console.error('❌ Memory leak detection failed:', error);
    }
  }

  /**
   * Profile event loop lag
   */
  async profileEventLoop(scenario: string = 'default'): Promise<void> {
    console.log(`⏱️  Profiling event loop for scenario: ${scenario}`);

    const outputPath = path.join(this.outputDir, `bubbleprof-${scenario}`);

    try {
      execSync(
        `clinic bubbleprof --dest ${outputPath} -- node ./dist/server.js`,
        { stdio: 'inherit', timeout: 90000 }
      );

      console.log(`✅ Event loop profile saved to: ${outputPath}`);
      console.log(`   Open HTML file to view: ${outputPath}/*.html`);
    } catch (error) {
      console.error('❌ Event loop profiling failed:', error);
    }
  }

  /**
   * Comprehensive profiling suite
   */
  async runComprehensiveProfiling(scenario: string = 'comprehensive'): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  COMPREHENSIVE PROFILING SUITE');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('Step 1/5: Heap Memory Profiling');
    await this.profileHeap(scenario);

    console.log('\nStep 2/5: CPU Profiling');
    await this.profileCPU(scenario, 30);

    console.log('\nStep 3/5: Flame Graph Generation');
    await this.generateFlameGraph(scenario);

    console.log('\nStep 4/5: Memory Leak Detection');
    await this.detectMemoryLeaks(scenario);

    console.log('\nStep 5/5: Event Loop Profiling');
    await this.profileEventLoop(scenario);

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  PROFILING COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`\nProfiles saved to: ${this.outputDir}`);
    console.log('\nAnalysis Tools:');
    console.log('  - Chrome DevTools: chrome://inspect (for .heapsnapshot and .cpuprofile)');
    console.log('  - Clinic.js HTML reports: Open .html files in browser');
  }

  /**
   * Quick memory snapshot
   */
  takeMemorySnapshot(): NodeJS.MemoryUsage {
    const usage = process.memoryUsage();
    
    console.log('📸 Memory Snapshot:');
    console.log(`   RSS:          ${(usage.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Heap Total:   ${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Heap Used:    ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   External:     ${(usage.external / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Array Buffers: ${(usage.arrayBuffers / 1024 / 1024).toFixed(2)} MB`);

    return usage;
  }

  /**
   * Monitor memory over time
   */
  monitorMemory(duration: number = 60, interval: number = 5): void {
    console.log(`📊 Monitoring memory for ${duration}s (sampling every ${interval}s)...`);

    const snapshots: NodeJS.MemoryUsage[] = [];
    const startTime = Date.now();

    const monitor = setInterval(() => {
      const snapshot = process.memoryUsage();
      snapshots.push(snapshot);

      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(
        `[${elapsed}s] Heap: ${(snapshot.heapUsed / 1024 / 1024).toFixed(2)} MB | ` +
        `RSS: ${(snapshot.rss / 1024 / 1024).toFixed(2)} MB`
      );

      if (elapsed >= duration) {
        clearInterval(monitor);
        this.analyzeMemoryTrend(snapshots);
      }
    }, interval * 1000);
  }

  /**
   * Analyze memory trend
   */
  private analyzeMemoryTrend(snapshots: NodeJS.MemoryUsage[]): void {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  MEMORY TREND ANALYSIS');
    console.log('═══════════════════════════════════════════════════════════\n');

    const initialHeap = snapshots[0].heapUsed / 1024 / 1024;
    const finalHeap = snapshots[snapshots.length - 1].heapUsed / 1024 / 1024;
    const heapGrowth = finalHeap - initialHeap;
    const growthPercentage = (heapGrowth / initialHeap) * 100;

    console.log(`   Initial heap:   ${initialHeap.toFixed(2)} MB`);
    console.log(`   Final heap:     ${finalHeap.toFixed(2)} MB`);
    console.log(`   Growth:         ${heapGrowth.toFixed(2)} MB (${growthPercentage.toFixed(2)}%)`);

    if (growthPercentage > 50) {
      console.log('\n   ⚠️  WARNING: Significant memory growth detected');
      console.log('   Potential memory leak - run detailed heap profiling');
    } else if (growthPercentage > 20) {
      console.log('\n   ⚠️  NOTICE: Moderate memory growth');
      console.log('   Monitor for continued growth over longer periods');
    } else {
      console.log('\n   ✅ Memory usage stable');
    }

    console.log('\n═══════════════════════════════════════════════════════════\n');
  }
}

// CLI interface
async function main() {
  const profiler = new MemoryProfiler();
  const command = process.argv[2] || 'snapshot';
  const scenario = process.argv[3] || 'default';

  switch (command) {
    case 'heap':
      await profiler.profileHeap(scenario);
      break;

    case 'cpu':
      await profiler.profileCPU(scenario, 30);
      break;

    case 'flame':
      await profiler.generateFlameGraph(scenario);
      break;

    case 'leaks':
      await profiler.detectMemoryLeaks(scenario);
      break;

    case 'eventloop':
      await profiler.profileEventLoop(scenario);
      break;

    case 'comprehensive':
      await profiler.runComprehensiveProfiling(scenario);
      break;

    case 'monitor':
      const duration = parseInt(process.argv[4] || '60');
      profiler.monitorMemory(duration, 5);
      break;

    case 'snapshot':
    default:
      profiler.takeMemorySnapshot();
      break;
  }
}

if (require.main === module) {
  main();
}

export { MemoryProfiler };
