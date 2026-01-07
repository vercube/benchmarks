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

#### 💾 Resource Usage

| Framework | CPU Mean | CPU p95 | Memory Mean | Memory p95 | vs Best CPU | vs Best Mem |
|-----------|----------|---------|-------------|------------|:-----------:|:-----------:|
| **vercube** | 0.1% | 0.0% | 129.6MB | 129.6MB | +57% | +3% |
| **nestjs** | 0.1% | 0.0% | 129.7MB | 129.7MB | +83% | +3% |
| **routing-controllers** 🏆 | 0.0% | 0.0% | 129.8MB | 129.8MB | — | +3% |
| **tsed** 🏆 | 0.0% | 0.0% | 125.8MB | 130.1MB | +0% | — |

---

📊 [View raw data](results/latest.json)

**Test environment:** macOS 26.1, Apple M2 Pro (10 cores), 32GB RAM, Node.js 22

**Load test config:** 100 concurrent connections, 30s duration, 10 pipelining
