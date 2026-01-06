### Results Summary

<<<<<<< Updated upstream
> Last updated: Tuesday, January 6, 2026 at 1:30 AM UTC
=======
> Last updated: Tuesday, January 6, 2026 at 1:42 AM UTC
>>>>>>> Stashed changes

> Statistical comparison powered by [hyperfine](https://github.com/sharkdp/hyperfine)

#### ⚡ Build Time

| Framework | Mean | Median | Min | Max | Relative |
|-----------|------|--------|-----|-----|:--------:|
<<<<<<< Updated upstream
| **vercube** 🏆 | 0.67s | 0.67s | 0.65s | 0.69s | 1.00× |
| **routing-controllers** | 1.52s | 1.51s | 1.50s | 1.55s | 1.00× |
| **nestjs** | 3.13s | 3.12s | 3.07s | 3.19s | 1.00× |
=======
| **vercube** 🏆 | 0.56s | 0.56s | 0.55s | 0.58s | 1.00× |
| **routing-controllers** | 0.79s | 0.79s | 0.74s | 0.84s | 1.00× |
| **nestjs** | 1.86s | 1.85s | 1.77s | 1.94s | 1.00× |
>>>>>>> Stashed changes

#### 🚀 Cold Start Time

| Framework | Mean | Median | Min | Max | Relative |
|-----------|------|--------|-----|-----|:--------:|
<<<<<<< Updated upstream
| **vercube** 🏆 | 507ms | 506ms | 497ms | 527ms | 1.00× |
| **routing-controllers** | 609ms | 608ms | 601ms | 623ms | 1.00× |
| **nestjs** | 710ms | 709ms | 701ms | 725ms | 1.00× |
=======
| **vercube** 🏆 | 597ms | 600ms | 546ms | 639ms | 1.00× |
| **routing-controllers** | 695ms | 690ms | 643ms | 777ms | 1.00× |
| **nestjs** | 792ms | 789ms | 737ms | 932ms | 1.00× |
>>>>>>> Stashed changes

#### 🔥 Load Test Performance

| Framework | Requests/sec | Latency p50 | Latency p95 | Latency p99 | vs Best RPS | vs Best p95 |
|-----------|--------------|-------------|-------------|-------------|:-----------:|:-----------:|
<<<<<<< Updated upstream
| **vercube** 🏆 | 7145 | 135.00ms | 145.00ms | 147.00ms | — | — |
| **nestjs** | 6673 | 142.00ms | 163.00ms | 165.00ms | -7% | +12% |
| **routing-controllers** | 6996 | 137.00ms | 153.00ms | 168.00ms | -2% | +6% |
=======
| **vercube** 🏆 | 52780 | 18.00ms | 38.00ms | 42.00ms | — | — |
| **nestjs** | 37622 | 20.00ms | 41.00ms | 44.00ms | -3% | +8% |
| **routing-controllers** | 36845 | 20.00ms | 42.00ms | 43.00ms | -5% | +11% |
>>>>>>> Stashed changes

#### 💾 Resource Usage

| Framework | CPU Mean | CPU p95 | Memory Mean | Memory p95 | vs Best CPU | vs Best Mem |
|-----------|----------|---------|-------------|------------|:-----------:|:-----------:|
<<<<<<< Updated upstream
| **vercube** 🏆 | 40.5% | 81.8% | 92.6MB | 97.1MB | +Infinity% | — |
| **nestjs** | 0.0% | 0.0% | 97.2MB | 97.2MB | +Infinity% | +5% |
| **routing-controllers** 🏆 | 0.0% | 0.0% | 97.3MB | 97.3MB | — | +5% |
=======
| **vercube** 🏆 | 0.1% | 0.0% | 130.1MB | 130.1MB | — | — |
| **nestjs** | 0.1% | 0.0% | 130.2MB | 130.2MB | +16% | +0% |
| **routing-controllers** | 0.1% | 0.0% | 131.0MB | 131.0MB | +21% | +1% |
>>>>>>> Stashed changes

---

📊 [View raw data](results/latest.json)

**Test environment:** macOS 26.1, Apple M2 Pro (10 cores), 32GB RAM, Node.js 22

**Load test config:** 100 concurrent connections, 30s duration, 10 pipelining
