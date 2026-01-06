# Benchmark Scripts

All benchmark scripts are written in TypeScript and powered by **Bun**.

## Main Scripts

### `benchmark.ts`

**Main benchmark runner** - Runs the complete benchmark suite.

```bash
pnpm run benchmark
# or directly:
bun run scripts/benchmark.ts
```

This script runs in phases:
1. **Check Tools** - Verifies hyperfine, autocannon, jq are available
2. **Build Benchmark** - Comparative build time measurement
3. **Cold Start Benchmark** - Comparative cold start measurement
4. **Load Tests** - Per-framework load testing with resource monitoring
5. **Generate Report** - Creates summary.md and latest.json
6. **Update README** - Updates README.md with latest results

### `setup.ts`

**Setup script** - Checks tools and installs all dependencies.

```bash
pnpm run benchmark:setup
# or directly:
bun run scripts/setup.ts
```

### `cold-start.ts`

**Cold start helper** - Called by hyperfine to measure a single framework's cold start.

```bash
bun run scripts/cold-start.ts <framework>
```

### `monitor.ts`

**Resource monitor** - Monitors CPU and memory usage of a process.

```bash
bun run scripts/monitor.ts <pid>
```

Output format (JSONL):
```json
{"timestamp":1234567890,"cpu":45.2,"memory":128.5,"elapsed":1000}
```

## Why Bun?

- **Single language** - Everything is TypeScript, no bash/JS mix
- **Fast** - Bun is significantly faster than Node.js for scripts
- **Great DX** - `$` tagged template for shell commands
- **Type safety** - Full TypeScript support out of the box

## Configuration

All scripts read from `benchmark-config.json`:

```json
{
  "frameworks": ["vercube", "nestjs", "routing-controllers"],
  "port": 3000,
  "loadTest": {
    "connections": 100,
    "duration": 30,
    "pipelining": 10
  },
  "buildBenchmark": {
    "warmup": 3,
    "runs": 10
  },
  "coldStartBenchmark": {
    "warmup": 0,
    "runs": 20
  }
}
```

## Output Files

After running benchmarks, you'll find:

```
results/
├── raw/
│   └── 2026-01-06-12-30-00/
│       ├── build.json           # Hyperfine comparative results
│       ├── build.md             # Hyperfine markdown table
│       ├── cold-start.json      # Hyperfine comparative results
│       ├── cold-start.md        # Hyperfine markdown table
│       ├── vercube-load-test.json
│       ├── vercube-resources.jsonl
│       ├── nestjs-load-test.json
│       └── ...
├── summary.md                   # Generated summary
└── latest.json                  # Aggregated results
```

## Comparative Mode

Build and cold start benchmarks use hyperfine's comparative mode:

```bash
hyperfine \
  -L framework vercube,nestjs,routing-controllers \
  "cd apps/{framework} && pnpm build"
```

Benefits:
- **Interleaved runs** - Reduces system load bias
- **Statistical significance** - t-tests for comparisons
- **Relative performance** - "1.23× slower" built-in

## Dependencies

### Required
- **Bun** - Runtime for scripts
- **Node.js 20+** - For running framework apps
- **pnpm** - Package manager
- **hyperfine** - Timing benchmarks
- **autocannon** - Load testing
- **jq** - JSON processing

### npm packages
- **pidusage** - Process resource monitoring
