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


## 📊 Current Benchmarks

<!-- BENCHMARK_RESULTS_START -->
### Results Summary

> Last updated: Wednesday, January 7, 2026 at 7:08 AM UTC

> Statistical comparison powered by [hyperfine](https://github.com/sharkdp/hyperfine)

#### ⚡ Build Time

| Framework | Mean | Median | Min | Max | Relative |
|-----------|------|--------|-----|-----|:--------:|
| **vercube** 🏆 | 0.68s | 0.67s | 0.56s | 0.93s | 1.00× |
| **routing-controllers** | 0.86s | 0.86s | 0.74s | 1.02s | 1.00× |
| **nestjs** | 1.78s | 1.78s | 1.74s | 1.82s | 1.00× |

#### 🚀 Cold Start Time

| Framework | Mean | Median | Min | Max | Relative |
|-----------|------|--------|-----|-----|:--------:|
| **vercube** 🏆 | 597ms | 597ms | 540ms | 649ms | 1.00× |
| **routing-controllers** | 695ms | 655ms | 613ms | 1162ms | 1.00× |
| **nestjs** | 729ms | 718ms | 694ms | 876ms | 1.00× |

#### 🔥 Load Test Performance

| Framework | Requests/sec | Latency p50 | Latency p95 | Latency p99 | vs Best RPS | vs Best p95 |
|-----------|--------------|-------------|-------------|-------------|:-----------:|:-----------:|
| **vercube** 🏆 | 42693 | 17.00ms | 35.00ms | 35.00ms | — | — |
| **nestjs** | 39169 | 19.00ms | 40.00ms | 41.00ms | -9% | +14% |
| **routing-controllers** | 36593 | 20.00ms | 44.00ms | 45.00ms | -17% | +26% |

#### 💾 Resource Usage

| Framework | CPU Mean | CPU p95 | Memory Mean | Memory p95 | vs Best CPU | vs Best Mem |
|-----------|----------|---------|-------------|------------|:-----------:|:-----------:|
| **vercube** | 0.1% | 0.0% | 129.7MB | 129.7MB | +80% | +7% |
| **nestjs** 🏆 | 0.0% | 0.0% | 121.7MB | 129.7MB | — | — |
| **routing-controllers** | 0.1% | 0.0% | 127.6MB | 130.0MB | +100% | +5% |

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
