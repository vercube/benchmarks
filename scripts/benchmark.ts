#!/usr/bin/env bun

/**
 * Vercube Benchmark Suite
 * 
 * Single unified benchmark runner using Bun.
 * Replaces all bash scripts with one TypeScript file.
 */

import { $ } from 'bun';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  Config,
  HyperfineOutput,
  AutocannonOutput,
  ResourceSample,
  FrameworkResults,
  MachineSpecs,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════
// Constants & Config
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const config: Config = await Bun.file('benchmark-config.json').json();
const resultsDir = `results/raw/${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}`;

// ═══════════════════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════════════════

function log(message: string, color: keyof typeof COLORS = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function header(title: string) {
  log('\n═══════════════════════════════════════', 'blue');
  log(`  ${title}`, 'blue');
  log('═══════════════════════════════════════\n', 'blue');
}

function extractFrameworkFromCommand(command: string): string | null {
  for (const framework of config.frameworks) {
    if (command.includes(framework)) {
      return framework;
    }
  }
  return null;
}

function average(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

async function getMachineSpecs(): Promise<MachineSpecs> {
  const os = await import('node:os');
  const platform = os.platform();
  const cpus = os.cpus();
  const totalMemGB = Math.round(os.totalmem() / (1024 * 1024 * 1024));
  
  let osName = 'Unknown';
  if (platform === 'darwin') {
    try {
      const result = await $`sw_vers -productName`.quiet();
      const version = await $`sw_vers -productVersion`.quiet();
      osName = `${result.text().trim()} ${version.text().trim()}`;
    } catch {
      osName = `macOS ${os.release()}`;
    }
  } else if (platform === 'linux') {
    try {
      const result = await $`cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2`.quiet();
      osName = result.text().trim() || `Linux ${os.release()}`;
    } catch {
      osName = `Linux ${os.release()}`;
    }
  } else if (platform === 'win32') {
    osName = `Windows ${os.release()}`;
  }

  return {
    os: osName,
    cpu: cpus[0]?.model || 'Unknown CPU',
    cores: cpus.length,
    memory: `${totalMemGB}GB`,
  };
}

function calcPercentBetter(winner: number, other: number, higherIsBetter = false): number {
  if (higherIsBetter) {
    return ((winner - other) / other) * 100;
  }
  return ((other - winner) / winner) * 100;
}

async function waitForServer(port: number, endpoint: string, maxAttempts = 30): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`http://localhost:${port}${endpoint}`);
      if (response.ok) return true;
    } catch {
      // Server not ready yet
    }
    await Bun.sleep(1000);
  }
  return false;
}

async function killProcessOnPort(port: number): Promise<void> {
  try {
    await $`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`.quiet();
  } catch {
    // No process on port, that's fine
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Phase 1: Check Tools & Install Dependencies
// ═══════════════════════════════════════════════════════════════════════════

async function checkTools(): Promise<void> {
  log('Checking required tools...', 'yellow');

  // Check hyperfine
  try {
    await $`hyperfine --version`.quiet();
    log('✓ hyperfine', 'green');
  } catch {
    log('✗ hyperfine not installed. Install with: brew install hyperfine', 'red');
    process.exit(1);
  }

  // Check autocannon
  try {
    await $`autocannon --version`.quiet();
    log('✓ autocannon', 'green');
  } catch {
    log('Installing autocannon...', 'yellow');
    await $`npm install -g autocannon`;
    log('✓ autocannon installed', 'green');
  }

  // Check jq
  try {
    await $`jq --version`.quiet();
    log('✓ jq', 'green');
  } catch {
    log('✗ jq not installed. Install with: brew install jq', 'red');
    process.exit(1);
  }

  console.log();
}

// ═══════════════════════════════════════════════════════════════════════════
// Phase 1: Build Benchmark (Comparative)
// ═══════════════════════════════════════════════════════════════════════════

async function runBuildBenchmark(): Promise<void> {
  header('Phase 1: Build Time Comparison');

  const frameworks = config.frameworks.join(',');
  const { warmup, runs } = config.buildBenchmark;

  log(`Running comparative build benchmark for: ${frameworks}\n`, 'cyan');

  await $`hyperfine \
    --export-json ${resultsDir}/build.json \
    --export-markdown ${resultsDir}/build.md \
    --warmup ${warmup} \
    --runs ${runs} \
    --prepare "rm -rf apps/{framework}/dist" \
    -L framework ${frameworks} \
    "cd apps/{framework} && pnpm build"`;

  log('\n✓ Build benchmark completed', 'green');
}

// ═══════════════════════════════════════════════════════════════════════════
// Phase 2: Cold Start Benchmark (Comparative)
// ═══════════════════════════════════════════════════════════════════════════

async function runColdStartBenchmark(): Promise<void> {
  header('Phase 2: Cold Start Comparison');

  const frameworks = config.frameworks.join(',');
  const { warmup, runs } = config.coldStartBenchmark;

  log(`Running comparative cold start benchmark for: ${frameworks}\n`, 'cyan');

  await $`hyperfine \
    --export-json ${resultsDir}/cold-start.json \
    --export-markdown ${resultsDir}/cold-start.md \
    --warmup ${warmup} \
    --runs ${runs} \
    --prepare "lsof -ti:${config.port} | xargs kill -9 2>/dev/null || true; sleep 0.5" \
    -L framework ${frameworks} \
    "bun run scripts/cold-start.ts {framework}"`;

  log('\n✓ Cold start benchmark completed', 'green');
}

// ═══════════════════════════════════════════════════════════════════════════
// Phase 3: Load Tests (Per Framework)
// ═══════════════════════════════════════════════════════════════════════════

async function runLoadTests(): Promise<void> {
  header('Phase 3: Load Tests');

  const { connections, duration, pipelining } = config.loadTest;

  for (const framework of config.frameworks) {
    const appDir = `apps/${framework}`;
    if (!existsSync(appDir)) continue;

    log(`\nTesting: ${framework}`, 'cyan');

    // Start server
    process.stdout.write('  Starting server...');
    const server = Bun.spawn(['pnpm', 'start'], {
      cwd: appDir,
      stdout: 'ignore',
      stderr: 'ignore',
    });

    const serverReady = await waitForServer(config.port, config.healthEndpoint);
    if (!serverReady) {
      log(' ✗ Failed to start', 'red');
      server.kill();
      continue;
    }
    log(' ✓', 'green');

    // Start resource monitoring
    log('  Starting resource monitor...', 'yellow');
    const monitor = Bun.spawn(['bun', 'run', 'scripts/monitor.ts', String(server.pid)], {
      stdout: Bun.file(`${resultsDir}/${framework}-resources.jsonl`),
      stderr: 'ignore',
    });

    await Bun.sleep(1000); // Let monitor start

    // Run load test
    log('  Running load test...', 'yellow');
    await $`autocannon \
      -c ${connections} \
      -d ${duration} \
      -p ${pipelining} \
      --json \
      http://localhost:${config.port}${config.testEndpoint} \
      > ${resultsDir}/${framework}-load-test.json`;

    log('  ✓ Load test completed', 'green');

    // Cleanup
    monitor.kill();
    server.kill();
    await killProcessOnPort(config.port);
    await Bun.sleep(1000);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Phase 4: Generate Report
// ═══════════════════════════════════════════════════════════════════════════

async function generateReport(): Promise<void> {
  header('Phase 4: Generating Report');

  const machineSpecs = await getMachineSpecs();
  log(`Machine: ${machineSpecs.cpu} (${machineSpecs.cores} cores), ${machineSpecs.memory} RAM`, 'cyan');
  
  const results: Record<string, FrameworkResults> = {};

  // Initialize results
  for (const framework of config.frameworks) {
    results[framework] = {
      build: null,
      coldStart: null,
      loadTest: null,
      resources: null,
    };
  }

  // Read build benchmark
  const buildFile = join(resultsDir, 'build.json');
  if (existsSync(buildFile)) {
    const buildData: HyperfineOutput = JSON.parse(readFileSync(buildFile, 'utf8'));
    for (const result of buildData.results) {
      const framework = extractFrameworkFromCommand(result.command);
      if (framework && results[framework]) {
        results[framework].build = {
          mean: result.mean,
          stddev: result.stddev,
          median: result.median,
          min: result.min,
          max: result.max,
          relative: result.relative || 1.0,
        };
      }
    }
  }

  // Read cold start benchmark
  const coldStartFile = join(resultsDir, 'cold-start.json');
  if (existsSync(coldStartFile)) {
    const coldStartData: HyperfineOutput = JSON.parse(readFileSync(coldStartFile, 'utf8'));
    for (const result of coldStartData.results) {
      const framework = extractFrameworkFromCommand(result.command);
      if (framework && results[framework]) {
        results[framework].coldStart = {
          mean: result.mean,
          stddev: result.stddev,
          median: result.median,
          min: result.min,
          max: result.max,
          relative: result.relative || 1.0,
        };
      }
    }
  }

  // Read per-framework results
  for (const framework of config.frameworks) {
    // Load test
    const loadTestFile = join(resultsDir, `${framework}-load-test.json`);
    if (existsSync(loadTestFile)) {
      const loadTestData: AutocannonOutput = JSON.parse(readFileSync(loadTestFile, 'utf8'));
      results[framework].loadTest = {
        requests: loadTestData.requests,
        throughput: loadTestData.throughput,
        latency: {
          mean: loadTestData.latency.mean,
          stddev: loadTestData.latency.stddev,
          p50: loadTestData.latency.p50,
          p75: loadTestData.latency.p75,
          p90: loadTestData.latency.p90,
          p95: loadTestData.latency.p97_5,
          p99: loadTestData.latency.p99,
          p999: loadTestData.latency.p999,
        },
        errors: loadTestData.errors,
      };
    }

    // Resources
    const resourcesFile = join(resultsDir, `${framework}-resources.jsonl`);
    if (existsSync(resourcesFile)) {
      const content = readFileSync(resourcesFile, 'utf8').trim();
      if (content) {
        const samples: ResourceSample[] = content.split('\n').map(line => JSON.parse(line));
        const cpuValues = samples.map(s => s.cpu);
        const memValues = samples.map(s => s.memory);

        results[framework].resources = {
          cpu: {
            mean: average(cpuValues),
            max: Math.max(...cpuValues),
            p95: percentile(cpuValues, 95),
          },
          memory: {
            mean: average(memValues),
            max: Math.max(...memValues),
            p95: percentile(memValues, 95),
          },
        };
      }
    }
  }

  // Save results JSON with machine specs
  const outputData = {
    machineSpecs,
    results,
  };
  writeFileSync('results/latest.json', JSON.stringify(outputData, null, 2));
  log('✓ Generated results/latest.json', 'green');

  // Generate and save summary markdown
  const markdown = generateResultsMarkdown(results, machineSpecs);
  writeFileSync('results/summary.md', markdown);
  log('✓ Generated results/summary.md', 'green');
}

// ═══════════════════════════════════════════════════════════════════════════
// Shared: Generate Results Markdown
// ═══════════════════════════════════════════════════════════════════════════

function generateResultsMarkdown(results: Record<string, FrameworkResults>, machineSpecs?: MachineSpecs): string {
  let md = '### Results Summary\n\n';
  md += `> Last updated: ${new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'UTC',
  })} UTC\n\n`;
  md += '> Statistical comparison powered by [hyperfine](https://github.com/sharkdp/hyperfine)\n\n';

  // Build time
  md += '#### ⚡ Build Time\n\n';
  md += '| Framework | Mean | Median | Min | Max | Relative |\n';
  md += '|-----------|------|--------|-----|-----|:--------:|\n';

  const buildSorted = config.frameworks
    .filter(fw => results[fw]?.build)
    .sort((a, b) => results[a].build!.mean - results[b].build!.mean);

  for (const [index, fw] of buildSorted.entries()) {
    const b = results[fw].build!;
    const trophy = index === 0 ? ' 🏆' : '';
    const relative = b.relative === 1.0 ? '1.00×' : `${b.relative.toFixed(2)}× slower`;
    md += `| **${fw}**${trophy} | ${b.mean.toFixed(2)}s | ${b.median.toFixed(2)}s | ${b.min.toFixed(2)}s | ${b.max.toFixed(2)}s | ${relative} |\n`;
  }
  md += '\n';

  // Cold start
  md += '#### 🚀 Cold Start Time\n\n';
  md += '| Framework | Mean | Median | Min | Max | Relative |\n';
  md += '|-----------|------|--------|-----|-----|:--------:|\n';

  const coldStartSorted = config.frameworks
    .filter(fw => results[fw]?.coldStart)
    .sort((a, b) => results[a].coldStart!.mean - results[b].coldStart!.mean);

  for (const [index, fw] of coldStartSorted.entries()) {
    const c = results[fw].coldStart!;
    const trophy = index === 0 ? ' 🏆' : '';
    const relative = c.relative === 1.0 ? '1.00×' : `${c.relative.toFixed(2)}× slower`;
    md += `| **${fw}**${trophy} | ${(c.mean * 1000).toFixed(0)}ms | ${(c.median * 1000).toFixed(0)}ms | ${(c.min * 1000).toFixed(0)}ms | ${(c.max * 1000).toFixed(0)}ms | ${relative} |\n`;
  }
  md += '\n';

  // Load test - find winners
  const highestRPS = config.frameworks.reduce((highest, fw) => {
    if (!results[fw]?.loadTest) return highest;
    if (!highest || results[fw].loadTest!.requests.mean > results[highest].loadTest!.requests.mean) return fw;
    return highest;
  }, null as string | null);

  const lowestLatency = config.frameworks.reduce((lowest, fw) => {
    if (!results[fw]?.loadTest) return lowest;
    if (!lowest || results[fw].loadTest!.latency.p95 < results[lowest].loadTest!.latency.p95) return fw;
    return lowest;
  }, null as string | null);

  md += '#### 🔥 Load Test Performance\n\n';
  md += '| Framework | Requests/sec | Latency p50 | Latency p95 | Latency p99 | vs Best RPS | vs Best p95 |\n';
  md += '|-----------|--------------|-------------|-------------|-------------|:-----------:|:-----------:|\n';

  for (const fw of config.frameworks) {
    if (!results[fw]?.loadTest) continue;
    const l = results[fw].loadTest!;
    const isRPSWinner = fw === highestRPS;
    const isLatencyWinner = fw === lowestLatency;
    const trophy = isRPSWinner || isLatencyWinner ? ' 🏆' : '';

    const bestRPS = results[highestRPS!]?.loadTest?.requests.mean || 0;
    const bestLatency = results[lowestLatency!]?.loadTest?.latency.p95 || 0;

    const rpsDiff = isRPSWinner ? '—' : `-${calcPercentBetter(bestRPS, l.requests.mean, true).toFixed(0)}%`;
    const latencyDiff = isLatencyWinner ? '—' : `+${calcPercentBetter(bestLatency, l.latency.p95).toFixed(0)}%`;

    md += `| **${fw}**${trophy} | ${l.requests.mean.toFixed(0)} | ${l.latency.p50.toFixed(2)}ms | ${l.latency.p95.toFixed(2)}ms | ${l.latency.p99.toFixed(2)}ms | ${rpsDiff} | ${latencyDiff} |\n`;
  }
  md += '\n';

  md += '---\n\n';
  md += '📊 [View raw data](results/latest.json)\n\n';
  
  if (machineSpecs) {
    md += `**Test environment:** ${machineSpecs.os}, ${machineSpecs.cpu} (${machineSpecs.cores} cores), ${machineSpecs.memory} RAM, Node.js ${config.nodeVersion}\n\n`;
    md += `**Load test config:** ${config.loadTest.connections} concurrent connections, ${config.loadTest.duration}s duration, ${config.loadTest.pipelining} pipelining\n`;
  } else {
    md += `**Test environment:** Node.js ${config.nodeVersion}, ${config.loadTest.connections} concurrent connections, ${config.loadTest.duration}s duration\n`;
  }

  return md;
}

// ═══════════════════════════════════════════════════════════════════════════
// Phase 5: Update README
// ═══════════════════════════════════════════════════════════════════════════

async function updateReadme(): Promise<void> {
  const resultsPath = 'results/latest.json';
  if (!existsSync(resultsPath)) {
    log('No results found. Skipping README update.', 'yellow');
    return;
  }

  const data = JSON.parse(readFileSync(resultsPath, 'utf8'));
  
  // Handle both old format (direct results) and new format (with machineSpecs)
  const results: Record<string, FrameworkResults> = data.results || data;
  const machineSpecs: MachineSpecs | undefined = data.machineSpecs;
  
  let readme = readFileSync('README.md', 'utf8');

  const startMarker = '<!-- BENCHMARK_RESULTS_START -->';
  const endMarker = '<!-- BENCHMARK_RESULTS_END -->';
  const startIndex = readme.indexOf(startMarker);
  const endIndex = readme.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    log('Could not find benchmark results markers in README', 'red');
    return;
  }

  // Use the same markdown generator as summary.md
  const section = generateResultsMarkdown(results, machineSpecs);
  const before = readme.substring(0, startIndex + startMarker.length);
  const after = readme.substring(endIndex);

  writeFileSync('README.md', before + '\n' + section + after);
  log('✓ README.md updated', 'green');
}

// ═══════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  // Handle --update-readme-only flag
  if (args.includes('--update-readme-only')) {
    log('Updating README with latest results...', 'cyan');
    await updateReadme();
    return;
  }

  console.log();
  log('╔════════════════════════════════════════╗', 'blue');
  log('║   Vercube Benchmark Suite              ║', 'blue');
  log('║   Powered by Bun 🚀                    ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');

  // Create results directory
  mkdirSync(resultsDir, { recursive: true });

  try {
    await checkTools();
    await runBuildBenchmark();
    await runColdStartBenchmark();
    await runLoadTests();
    await generateReport();
    await updateReadme();

    console.log();
    log('╔════════════════════════════════════════╗', 'green');
    log('║   Benchmark Complete! 🎉               ║', 'green');
    log('╚════════════════════════════════════════╝', 'green');
    log(`\nResults saved to: ${resultsDir}`, 'cyan');
    log('Summary: results/summary.md\n', 'cyan');
  } catch (error) {
    log(`\nError: ${error}`, 'red');
    process.exit(1);
  } finally {
    await killProcessOnPort(config.port);
  }
}

main();

