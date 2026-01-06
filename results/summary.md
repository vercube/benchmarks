### Results Summary

> Last updated: Tuesday, January 6, 2026 at 12:52 AM UTC

> Statistical comparison powered by [hyperfine](https://github.com/sharkdp/hyperfine)

#### ⚡ Build Time

| Framework | Mean | Median | Min | Max | Relative |
|-----------|------|--------|-----|-----|:--------:|
| **vercube** 🏆 | 0.57s | 0.57s | 0.55s | 0.58s | 1.00× |
| **routing-controllers** | 0.74s | 0.74s | 0.73s | 0.76s | 1.00× |
| **nestjs** | 1.83s | 1.82s | 1.77s | 1.91s | 1.00× |

#### 🚀 Cold Start Time

| Framework | Mean | Median | Min | Max | Relative |
|-----------|------|--------|-----|-----|:--------:|
| **vercube** 🏆 | 585ms | 585ms | 542ms | 673ms | 1.00× |
| **routing-controllers** | 664ms | 658ms | 630ms | 729ms | 1.00× |
| **nestjs** | 745ms | 743ms | 690ms | 832ms | 1.00× |

#### 🔥 Load Test Performance

| Framework | Requests/sec | Latency p50 | Latency p95 | Latency p99 | vs Best RPS | vs Best p95 |
|-----------|--------------|-------------|-------------|-------------|:-----------:|:-----------:|
| **vercube** 🏆 | 40249 | 18.00ms | 36.00ms | 38.00ms | — | — |
| **nestjs** | 36609 | 20.00ms | 41.00ms | 42.00ms | -10% | +14% |
| **routing-controllers** | 34979 | 21.00ms | 43.00ms | 44.00ms | -15% | +19% |

#### 💾 Resource Usage

| Framework | CPU Mean | CPU p95 | Memory Mean | Memory p95 | vs Best CPU | vs Best Mem |
|-----------|----------|---------|-------------|------------|:-----------:|:-----------:|
| **vercube** | 0.1% | 0.0% | 130.6MB | 130.6MB | +73% | +1% |
| **nestjs** 🏆 | 0.0% | 0.0% | 129.8MB | 129.8MB | — | — |
| **routing-controllers** | 0.1% | 0.0% | 130.8MB | 130.8MB | +109% | +1% |

---

📊 [View raw data](results/latest.json)

**Test environment:** Ubuntu 22.04, Node.js 22, 100 concurrent connections, 30s duration
