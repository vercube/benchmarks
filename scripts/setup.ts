#!/usr/bin/env bun

/**
 * Vercube Benchmark Suite - Setup Script
 * 
 * Checks for required tools and installs dependencies.
 */

import { $ } from 'bun';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof COLORS = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

console.log();
log('🚀 Vercube Benchmark Suite - Setup', 'cyan');
log('════════════════════════════════════', 'cyan');
console.log();

// Check Bun
try {
  const result = await $`bun --version`.text();
  log(`✓ Bun ${result.trim()}`, 'green');
} catch {
  log('✗ Bun is required. Install from: https://bun.sh', 'red');
  process.exit(1);
}

// Check Node.js
try {
  const result = await $`node --version`.text();
  const version = parseInt(result.trim().replace('v', '').split('.')[0]);
  if (version < 20) {
    log(`✗ Node.js 20+ required. Current: ${result.trim()}`, 'red');
    process.exit(1);
  }
  log(`✓ Node.js ${result.trim()}`, 'green');
} catch {
  log('✗ Node.js is not installed', 'red');
  process.exit(1);
}

// Check pnpm
try {
  const result = await $`pnpm --version`.text();
  log(`✓ pnpm ${result.trim()}`, 'green');
} catch {
  log('Installing pnpm...', 'yellow');
  await $`npm install -g pnpm`;
  log('✓ pnpm installed', 'green');
}

// Check hyperfine
try {
  const result = await $`hyperfine --version`.text();
  log(`✓ ${result.trim()}`, 'green');
} catch {
  log('⚠ hyperfine not found. Install manually:', 'yellow');
  log('   macOS: brew install hyperfine', 'yellow');
  log('   Linux: cargo install hyperfine', 'yellow');
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
  const result = await $`jq --version`.text();
  log(`✓ ${result.trim()}`, 'green');
} catch {
  log('⚠ jq not found. Install manually:', 'yellow');
  log('   macOS: brew install jq', 'yellow');
  log('   Linux: sudo apt-get install jq', 'yellow');
}

// Install root dependencies
console.log();
log('Installing dependencies...', 'yellow');
await $`pnpm install`;
log('✓ Dependencies installed', 'green');

console.log();
log('════════════════════════════════════', 'cyan');
log('✅ Setup complete!', 'green');
console.log();
log('To run benchmarks:', 'cyan');
log('  pnpm run benchmark', 'reset');
log('  pnpm run readme:update  (update README only)', 'reset');
console.log();

