### Results Summary

> Last updated: Tuesday, January 6, 2026 at 1:30 AM UTC

> Statistical comparison powered by [hyperfine](https://github.com/sharkdp/hyperfine)

#### ⚡ Build Time

| Framework | Mean | Median | Min | Max | Relative |
|-----------|------|--------|-----|-----|:--------:|
| **vercube** 🏆 | 0.67s | 0.67s | 0.65s | 0.69s | 1.00× |
| **routing-controllers** | 1.52s | 1.51s | 1.50s | 1.55s | 1.00× |
| **nestjs** | 3.13s | 3.12s | 3.07s | 3.19s | 1.00× |

#### 🚀 Cold Start Time

| Framework | Mean | Median | Min | Max | Relative |
|-----------|------|--------|-----|-----|:--------:|
| **vercube** 🏆 | 507ms | 506ms | 497ms | 527ms | 1.00× |
| **routing-controllers** | 609ms | 608ms | 601ms | 623ms | 1.00× |
| **nestjs** | 710ms | 709ms | 701ms | 725ms | 1.00× |

#### 🔥 Load Test Performance

| Framework | Requests/sec | Latency p50 | Latency p95 | Latency p99 | vs Best RPS | vs Best p95 |
|-----------|--------------|-------------|-------------|-------------|:-----------:|:-----------:|
| **vercube** 🏆 | 7145 | 135.00ms | 145.00ms | 147.00ms | — | — |
| **nestjs** | 6673 | 142.00ms | 163.00ms | 165.00ms | -7% | +12% |
| **routing-controllers** | 6996 | 137.00ms | 153.00ms | 168.00ms | -2% | +6% |

#### 💾 Resource Usage

| Framework | CPU Mean | CPU p95 | Memory Mean | Memory p95 | vs Best CPU | vs Best Mem |
|-----------|----------|---------|-------------|------------|:-----------:|:-----------:|
| **vercube** 🏆 | 40.5% | 81.8% | 92.6MB | 97.1MB | +Infinity% | — |
| **nestjs** | 0.0% | 0.0% | 97.2MB | 97.2MB | +Infinity% | +5% |
| **routing-controllers** 🏆 | 0.0% | 0.0% | 97.3MB | 97.3MB | — | +5% |

---

📊 [View raw data](results/latest.json)

**Test environment:** Ubuntu 22.04, Node.js 22, 100 concurrent connections, 30s duration
