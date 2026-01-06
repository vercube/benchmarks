# Contributing to Vercube Benchmarks

Thank you for your interest in contributing! This document provides guidelines for adding new frameworks and improving the benchmark suite.

## Adding a New Framework

Want to add Hono, Fastify, Elysia, or another framework? Follow these steps:

### Step 1: Create Framework Directory

```bash
mkdir -p apps/your-framework/src
cd apps/your-framework
```

### Step 2: Create package.json

Your `package.json` must include these scripts:

```json
{
  "name": "benchmark-your-framework",
  "scripts": {
    "build": "...",
    "start": "...",
    "dev": "..."
  }
}
```

- `build` - Compiles/bundles the application
- `start` - Runs the production server
- `dev` - Runs development server with hot reload (optional but recommended)

### Step 3: Implement Required Endpoints

Create an HTTP server with these **required** endpoints:

#### GET /health
Health check endpoint.

Response:
```json
{"status": "ok"}
```

#### GET /api/test
Test endpoint for benchmarking.

Response:
```json
{
  "message": "Hello, World!",
  "timestamp": 1234567890,
  "framework": "your-framework"
}
```

#### Server Requirements

- Must listen on port **3000**
- Must log `Server started on port 3000` when ready (used for cold start detection)

### Step 4: Test Locally

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Start server
pnpm start

# In another terminal, test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/test
```

### Step 5: Register Framework in Config

Edit `benchmark-config.json` at the root:

```json
{
  "frameworks": [
    "vercube",
    "nestjs",
    "routing-controllers",
    "your-framework"
  ]
}
```

### Step 6: Run Benchmarks

```bash
pnpm run benchmark
```

Your framework will be automatically included in all tests!

### Step 7: Verify Results

Check that results were generated in `results/raw/<timestamp>/`:
- `build.json` - Build times for all frameworks
- `cold-start.json` - Cold start times for all frameworks
- `your-framework-load-test.json` - Load test results
- `your-framework-resources.jsonl` - Resource usage during load test

### Step 8: Submit Pull Request

1. Fork the repository
2. Create a branch: `git checkout -b add-your-framework`
3. Commit your changes
4. Push and open a Pull Request

## Guidelines for Fair Comparison

### Keep It Simple
- Use the framework's default configuration
- Don't add unnecessary middleware or optimizations
- Implement only the required endpoints

### Consistent Endpoints
Both endpoints must:
- Return JSON with exact schema shown above
- Respond with status 200

### Production Mode
- Always compile/build before benchmarking
- Disable development logging
- Use production settings where applicable

### Document Special Cases
If your framework requires special handling, add a README in `apps/your-framework/`:

```markdown
# Special Considerations

This framework requires:
- Node.js 20+ (uses native fetch)
- Special build flag: `--experimental-modules`
```

## Improving Benchmark Scripts

All scripts are in `scripts/` and written in TypeScript (Bun).

### Main Files

- `benchmark.ts` - Main orchestrator
- `cold-start.ts` - Cold start measurement helper
- `monitor.ts` - Resource monitoring
- `types.ts` - Shared type definitions

### Adding New Metrics

1. Add measurement logic to `benchmark.ts`
2. Update types in `types.ts`
3. Update `generateResultsMarkdown()` to display the metric

## Testing Your Contribution

Before submitting:

1. **Verify benchmarks run**: `pnpm run benchmark`
2. **Check summary**: `cat results/summary.md`
3. **Verify your framework appears in results**

## Need Help?

- Open an issue with your question
- Tag it with `help wanted` or `question`
- Provide context about what you're trying to do

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
