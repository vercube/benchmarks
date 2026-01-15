### Results Summary

> Last updated: Thursday, January 15, 2026 at 11:10 PM UTC

> Statistical comparison powered by [hyperfine](https://github.com/sharkdp/hyperfine)

#### ⚡ Build Time

| Framework | Mean | Median | Min | Max | vs Best |
|-----------|------|--------|-----|-----|:-------:|
| **vercube** 🏆 | 0.58s | 0.58s | 0.56s | 0.59s | — |
| **routing-controllers** | 0.77s | 0.77s | 0.76s | 0.78s | +33% |
| **tsed** | 0.97s | 0.96s | 0.95s | 1.02s | +67% |
| **rikta** | 1.56s | 1.55s | 1.50s | 1.65s | +169% |
| **nestjs** | 1.84s | 1.84s | 1.81s | 1.88s | +218% |

#### 🚀 Cold Start Time

| Framework | Mean | Median | Min | Max | vs Best |
|-----------|------|--------|-----|-----|:-------:|
| **vercube** 🏆 | 554ms | 554ms | 525ms | 572ms | — |
| **rikta** | 633ms | 636ms | 578ms | 676ms | +14% |
| **routing-controllers** | 678ms | 677ms | 638ms | 718ms | +22% |
| **nestjs** | 734ms | 728ms | 684ms | 785ms | +33% |
| **tsed** | 1334ms | 1328ms | 1283ms | 1408ms | +141% |

#### 🔥 Load Test Performance

| Framework | Requests/sec | Latency p50 | Latency p95 | Latency p99 | vs Best RPS | vs Best p95 |
|-----------|--------------|-------------|-------------|-------------|:-----------:|:-----------:|
| **vercube** 🏆 | 42446 | 17.00ms | 35.00ms | 36.00ms | — | — |
| **nestjs** | 38820 | 20.00ms | 41.00ms | 41.00ms | -9% | +17% |
| **rikta** | 38009 | 20.00ms | 45.00ms | 47.00ms | -12% | +29% |
| **routing-controllers** | 36840 | 21.00ms | 43.00ms | 43.00ms | -15% | +23% |
| **tsed** | 19364 | 45.00ms | 91.00ms | 101.00ms | -119% | +160% |

---

📊 [View raw data](results/latest.json)

**Test environment:** macOS 26.1, Apple M2 Pro (10 cores), 32GB RAM, Node.js 22

**Load test config:** 100 concurrent connections, 30s duration, 10 pipelining
