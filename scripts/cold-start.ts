#!/usr/bin/env bun

/**
 * Cold Start Measurement Helper
 * 
 * Called by hyperfine to measure cold start time for a single framework.
 * Usage: bun run scripts/cold-start.ts <framework>
 */
import { file, spawn } from 'bun';

const framework = process.argv[2];

if (!framework) {
  console.error('Usage: bun run scripts/cold-start.ts <framework>');
  process.exit(1);
}

const appDir = `apps/${framework}`;
const config = await file('benchmark-config.json').json();
const { port, healthEndpoint } = config;

// Start time
const startTime = performance.now();

// Start the server
const server = spawn(['pnpm', 'start'], {
  cwd: appDir,
  stdout: 'ignore',
  stderr: 'ignore',
});

// Wait for health check to respond
const maxAttempts = 1000;
let attempt = 0;

while (attempt < maxAttempts) {
  try {
    const response = await fetch(`http://localhost:${port}${healthEndpoint}`);
    if (response.ok) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      // Kill the server
      server.kill();
      
      // Output duration in milliseconds (hyperfine captures this)
      console.log(duration);
      process.exit(0);
    }
  } catch {
    // Server not ready yet
  }

  // Check if process is still alive
  if (server.exitCode !== null) {
    console.error('Server process died');
    process.exit(1);
  }

  await Bun.sleep(10);
  attempt++;
}

// Timeout
server.kill();
console.error('Timeout waiting for server to start');
process.exit(1);

