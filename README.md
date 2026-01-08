<div align="center">
  <img src="https://raw.githubusercontent.com/vercube/vercube/refs/heads/main/.github/assets/cover.png" width="100%" alt="Vercube - Unleash your server development." />
  <br>
  <br>

  [Website](https://vercube.dev) • [Documentation](https://vercube.dev/docs/getting-started) • [Discord](https://discord.gg/safphS45aN)

</div>

# Vercube Benchmarks

Performance comparison of **Vercube** against other popular Node.js frameworks.

## 📋 Why These Benchmarks Matter

When choosing a framework, performance is crucial. These benchmarks help you understand:

- **How Vercube performs** compared to established solutions
- **Real-world metrics** that impact your application (not synthetic tests)
- **Trade-offs** between different approaches (decorator-based, DI containers, etc.)

All frameworks are tested with identical endpoints and configuration for fair comparison.

### Tested Frameworks

- **🚀 Vercube** ([vercube.dev](https://vercube.dev)) - Modern, fast, TypeScript-first framework
- **NestJS** ([nestjs.com](https://nestjs.com)) - Progressive Node.js framework
- **Routing Controllers** ([github.com/typestack/routing-controllers](https://github.com/typestack/routing-controllers)) - Decorator-based routing
- **Ts.ED** ([https://tsed.dev](https://tsed.dev/)) - A modern framework written in TypeScript


## 📊 Current Benchmarks

<!-- BENCHMARK_RESULTS_START -->
### Results Summary

> Last updated: Wednesday, January 7, 2026 at 9:18 AM UTC

> Statistical comparison powered by [hyperfine](https://github.com/sharkdp/hyperfine)

#### ⚡ Build Time

| Framework | Mean | Median | Min | Max | Relative |
|-----------|------|--------|-----|-----|:--------:|
| **vercube** 🏆 | 0.55s | 0.55s | 0.55s | 0.56s | 1.00× |
| **routing-controllers** | 0.77s | 0.77s | 0.76s | 0.79s | 1.00× |
| **tsed** | 0.95s | 0.95s | 0.93s | 0.99s | 1.00× |
| **nestjs** | 1.83s | 1.83s | 1.80s | 1.88s | 1.00× |

#### 🚀 Cold Start Time

| Framework | Mean | Median | Min | Max | Relative |
|-----------|------|--------|-----|-----|:--------:|
| **vercube** 🏆 | 569ms | 552ms | 521ms | 855ms | 1.00× |
| **routing-controllers** | 637ms | 636ms | 609ms | 671ms | 1.00× |
| **nestjs** | 775ms | 710ms | 670ms | 1070ms | 1.00× |
| **tsed** | 1355ms | 1293ms | 1231ms | 1941ms | 1.00× |

#### 🔥 Load Test Performance

| Framework | Requests/sec | Latency p50 | Latency p95 | Latency p99 | vs Best RPS | vs Best p95 |
|-----------|--------------|-------------|-------------|-------------|:-----------:|:-----------:|
| **vercube** 🏆 | 42337 | 17.00ms | 35.00ms | 35.00ms | — | — |
| **nestjs** | 38044 | 20.00ms | 41.00ms | 42.00ms | -11% | +17% |
| **routing-controllers** | 36770 | 21.00ms | 42.00ms | 43.00ms | -15% | +20% |
| **tsed** | 20305 | 43.00ms | 88.00ms | 90.00ms | -109% | +151% |

---

📊 [View raw data](results/latest.json)

**Test environment:** macOS 26.1, Apple M2 Pro (10 cores), 32GB RAM, Node.js 22

**Load test config:** 100 concurrent connections, 30s duration, 10 pipelining
<!-- BENCHMARK_RESULTS_END -->


## 🚀 Quick Start

### Prerequisites

- **Bun** - For running benchmark scripts ([bun.sh](https://bun.sh))
- **Node.js 22+** - For running framework applications
- **pnpm 10+** - Package manager

### Running Benchmarks

```bash
# Clone and setup
git clone https://github.com/vercube/benchmarks
cd benchmark
pnpm run benchmark:setup

# Run complete benchmark suite
pnpm run benchmark

# View results
cat results/summary.md
```


## 📏 What We Measure

| Metric | Tool | Why It Matters |
|--------|------|----------------|
| **Build Time** | [hyperfine](https://github.com/sharkdp/hyperfine) | Faster builds = better DX and CI/CD |
| **Cold Start** | hyperfine + custom script | Critical for serverless/edge deployments |
| **Requests/sec** | [autocannon](https://github.com/mcollina/autocannon) | Higher RPS = better scalability |
| **Latency p95** | autocannon | 95% of users experience this or better |
| **Memory/CPU** | Custom Node.js monitor | Lower usage = lower hosting costs |

### Interpreting Results

| Metric | Excellent | Good | Acceptable |
|--------|-----------|------|------------|
| **Build** | < 5s | 5-15s | > 15s |
| **Cold Start** | < 100ms | 100-500ms | > 500ms |
| **RPS** | > 50k | 20-50k | < 20k |
| **Latency p95** | < 10ms | 10-50ms | 50-100ms |
| **Memory** | < 50MB | 50-100MB | 100-200MB |

*Results vary based on hardware. See test environment details above.*

## 🐳 Docker Testing (Optional)

For consistent, isolated results:

```bash
docker-compose up benchmark
```

Benefits: Same Node.js version, enforced resource limits (2 CPUs, 2GB RAM), reproducible across machines.


## 🤝 Contributing

Want to add Hono, Fastify, Elysia, or improve the benchmarks? See **[CONTRIBUTING.md](CONTRIBUTING.md)** for detailed instructions.


## 📝 Fairness Notes

- All solutions tested on identical hardware
- All use simple JSON endpoints to isolate framework overhead
- All use recommended production configurations
- Results reflect framework performance, not application code

**For production decisions:** Consider your specific use case, team experience, and ecosystem alongside these metrics.


## 🚀 About Vercube

Vercube is a modern, TypeScript-first Node.js framework designed for performance and developer experience.

- [Website](https://vercube.dev)
- [Documentation](https://vercube.dev/docs/getting-started)
- [Discord](https://discord.gg/safphS45aN)


## 📜 License

MIT

## 🙏 Credits

Benchmarking tools: hyperfine, autocannon • Frameworks: Vercube, NestJS, Routing Controllers
