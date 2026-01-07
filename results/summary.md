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
