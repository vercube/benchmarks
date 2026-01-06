# Contributing to Framework Benchmark

Thank you for your interest in contributing! This document provides guidelines for adding new frameworks and improving the benchmark suite.

## Adding a New Framework

Want to add Hono, Fastify, Elysia, or another framework? Follow these steps:

### Step 1: Create Framework Directory

```bash
mkdir -p apps/your-framework/src
cd apps/your-framework
```

### Step 2: Create package.json

```json
{
  "name": "benchmark-your-framework",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "tsc",
    "start": "node dist/main.js",
    "dev": "tsx watch src/main.ts"
  },
  "dependencies": {
    "your-framework": "latest"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

### Step 3: Create tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Note:** Adjust compiler options based on your framework's requirements. For example:
- Remove `experimentalDecorators` and `emitDecoratorMetadata` if not using decorators
- Change `module` to `ESNext` if using ESM

### Step 4: Implement Required Endpoints

Create `src/main.ts` with these **required** endpoints:

```typescript
// Example structure - adapt to your framework's API

// REQUIRED: Health check endpoint
// GET /health
// Response: { "status": "ok" }

// REQUIRED: Test endpoint
// GET /api/test
// Response: {
//   "message": "Hello, World!",
//   "timestamp": <number>,
//   "framework": "your-framework"
// }

// Server must listen on port 3000
// Must log "Server started on port 3000" when ready
```

#### Example for Express-based Framework:

```typescript
import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Hello, World!',
    timestamp: Date.now(),
    framework: 'express'
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

#### Example for Hono:

```typescript
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.get('/api/test', (c) => {
  return c.json({
    message: 'Hello, World!',
    timestamp: Date.now(),
    framework: 'hono'
  });
});

serve({
  fetch: app.fetch,
  port: 3000,
}, () => {
  console.log('Server started on port 3000');
});
```

#### Example for Fastify:

```typescript
import Fastify from 'fastify';

const fastify = Fastify({
  logger: false
});

fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

fastify.get('/api/test', async (request, reply) => {
  return {
    message: 'Hello, World!',
    timestamp: Date.now(),
    framework: 'fastify'
  };
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log('Server started on port 3000');
});
```

### Step 5: Test Locally

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

Expected responses:
```json
// /health
{"status":"ok"}

// /api/test
{"message":"Hello, World!","timestamp":1234567890,"framework":"your-framework"}
```

### Step 6: Register Framework in Config

Edit `benchmark-config.json` at the root:

```json
{
  "frameworks": [
    "vercube",
    "nestjs",
    "routing-controllers",
    "your-framework"  // Add your framework here
  ],
  ...
}
```

### Step 7: Run Benchmarks

```bash
cd ../..  # Back to root
./scripts/run-all-benchmarks.sh
```

Your framework will be automatically included in all tests!

### Step 8: Verify Results

Check that results were generated:

```bash
ls results/raw/$(ls -t results/raw | head -1)/your-framework-*
```

You should see:
- `your-framework-build.json`
- `your-framework-cold-start.json`
- `your-framework-load-test.json`
- `your-framework-resources.jsonl`

### Step 9: Submit Pull Request

1. Fork the repository
2. Create a branch: `git checkout -b add-your-framework`
3. Commit your changes:
   ```bash
   git add apps/your-framework
   git add benchmark-config.json
   git commit -m "feat: add your-framework to benchmarks"
   ```
4. Push: `git push origin add-your-framework`
5. Open a Pull Request

## Guidelines for Fair Comparison

To ensure fair benchmarks:

### 1. Keep It Simple
- Use the framework's default configuration
- Don't add unnecessary middleware or optimizations
- Implement only the required endpoints

### 2. Consistent Endpoints
Both endpoints must:
- Return JSON
- Match the exact schema shown above
- Respond with status 200

### 3. Production Mode
- Always compile/build before benchmarking
- Disable development logging
- Use production settings where applicable

### 4. Document Special Cases
If your framework requires special handling, document it:

```typescript
// apps/your-framework/README.md

# Special Considerations

This framework requires:
- Node.js 20+ (uses native fetch)
- Special build flag: `--experimental-modules`
- etc.
```

## Improving Benchmark Scripts

### Adding New Metrics

Want to measure something new? Here's how:

1. **Create a new script** in `scripts/`:
   ```bash
   scripts/your-metric-benchmark.sh
   ```

2. **Follow the pattern**:
   ```bash
   #!/bin/bash
   FRAMEWORK=$1
   RESULTS_DIR=$2
   
   # Your measurement logic here
   
   # Save results as JSON
   echo '{"metric": value}' > "$RESULTS_DIR/$FRAMEWORK-your-metric.json"
   ```

3. **Integrate into main script**:
   Edit `scripts/run-all-benchmarks.sh` to call your script

4. **Update report generator**:
   Edit `scripts/generate-report.js` to include your metric

### Improving Accuracy

Ideas for better benchmarks:
- More sophisticated statistical analysis
- Confidence intervals
- Outlier detection and removal
- Warmup strategies
- Memory leak detection
- Long-running stability tests

## Code Style

- Use TypeScript for all apps
- Follow the existing code structure
- Include type definitions where applicable
- Keep it simple and readable

## Testing Your Contribution

Before submitting:

1. **Verify all benchmarks run**:
   ```bash
   ./scripts/run-all-benchmarks.sh
   ```

2. **Check HTML report**:
   ```bash
   open results/report.html
   ```

3. **Verify framework appears in results**

4. **Test README update**:
   ```bash
   node scripts/update-readme.js
   git diff README.md
   ```

## Need Help?

- Open an issue with your question
- Tag it with `help wanted` or `question`
- Provide context about what you're trying to do

## Framework-Specific Notes

### Bun-based Frameworks
If your framework requires Bun instead of Node.js:

1. Update `package.json` scripts to use `bun` instead of `node`
2. Document this requirement in your framework's README
3. Consider providing both Bun and Node.js versions

### ESM-only Frameworks
If your framework only supports ESM:

1. Change `package.json` type: `"type": "module"`
2. Update `tsconfig.json`: `"module": "ESNext"`
3. Use `.js` extensions in imports
4. Update `start` script if needed

### Frameworks Requiring Additional Setup
If your framework needs a database, Redis, etc.:

1. Document in `apps/your-framework/README.md`
2. Provide Docker Compose configuration
3. Make it optional if possible (use mocks for basic benchmarks)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
