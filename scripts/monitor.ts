#!/usr/bin/env bun

/**
 * Process Resource Monitor
 * 
 * Monitors CPU and memory usage of a process.
 * Outputs JSONL format to stdout.
 * 
 * Usage: bun run scripts/monitor.ts <pid>
 */
import pidusage from 'pidusage';

const pid = parseInt(process.argv[2], 10);

if (!pid || isNaN(pid)) {
  console.error('Usage: bun run scripts/monitor.ts <pid>');
  process.exit(1);
}

// Check if process exists
try {
  process.kill(pid, 0);
} catch {
  console.error(`Process ${pid} does not exist`);
  process.exit(1);
}

let running = true;

// Monitor every 100ms
const interval = setInterval(async () => {
  if (!running) return;

  try {
    const stats = await pidusage(pid);

    const output = {
      timestamp: Date.now(),
      cpu: parseFloat(stats.cpu.toFixed(2)),
      memory: parseFloat((stats.memory / 1024 / 1024).toFixed(2)), // MB
      elapsed: stats.elapsed,
    };

    console.log(JSON.stringify(output));
  } catch (err: any) {
    if (err.message?.includes('No matching pid found')) {
      // Process ended
      clearInterval(interval);
      running = false;
    }
  }
}, 100);

// Graceful shutdown
process.on('SIGINT', () => {
  clearInterval(interval);
  running = false;
  process.exit(0);
});

process.on('SIGTERM', () => {
  clearInterval(interval);
  running = false;
  process.exit(0);
});

