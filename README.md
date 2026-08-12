# Bun HTTP Framework Benchmark

Compare throughput benchmarks from various JavaScript HTTP framework

# Prerequistes

- [bombardier](https://github.com/codesenberg/bombardier)
- Nodejs
- Deno
- Bun

# Run Test

```typescript
bun benchmark
```

To run only specific targets, pass their runtime-qualified names:

```sh
bun benchmark bun/elysia node/effect
```

To select frameworks and optionally cap requests per second:

```sh
bun benchmark --interactive
```

To build and verify every supported framework without running a load test:

```sh
bun run verify
```

The verifier starts frameworks one at a time and checks the three core routes,
the streamed video, and all background routes. Targets in the benchmark
blacklist are skipped.

Select frameworks with the arrow keys and Space, then press Enter and enter an
RPS limit. Use `0` or leave it blank for unlimited throughput. Results include
the emitted minified bundle size, startup time, and server RSS memory as
`before / after MB` in one column. Deno reports `n/a` for bundle size because it
runs directly.

Dump result will be available at `results/[benchmark-name].txt`

All Bun and Node targets are minified with `Bun.build` before their server
startup timer begins.

Effect HTTP v4 beta is included for both Bun and Node using one shared router
and the official adapter for each runtime.

Elysia AOT variants are included for both Bun and Node.

Deno targets run directly because `Bun.build` has no Deno target.

Test method: Average throughput

Every implementation registers the same deterministic background routes before
the measured routes. These routes are not requested during the load test; they
make route lookup and startup closer to a small real-world service while keeping
every run reproducible.

Their shared path list lives in `src/extra-routes.mjs` and every handler returns
`ok`.

1. Ping
    - Request to [GET] `/`
    - Return `Hi`
    - Headers must contains text `Content-Type: text/plain`, additional context is acceptable eg. `Content-Type: text/plain; charset=utf-8`
2. Query
    - Request to [GET] `/id/:id`
    - Extract path parameter, query string and setting headers.
    - For this benchmark, the request URL will be send as: `/id/1?name=bun`
    - Headers must contains `x-powered-by` to `benchmark`
    - Expected response: **"1 bun"** (`${id} ${query}`)
        - You **MUST NOT use hardcode string or index** to extract querystring.
        - In a real-world situation, there's no enforcement that the request will follow the specification, using hardcode index to extract `name=bun` querystring will be prone to error.
        - To test if it pass the requirement, the implementation should be able to extract querystring **dynamically** (please treat the value of 'name=bun' can be any value beside 'bun', for example 'alice', 'hina'), which means that the same code should be able to extract querystring, for example:
        - `/id/1?name=bun&id=1` -> should return `1 bun` not `1 bun&id=1`
        - `/id/1?id=1` -> should return `1 `
        - Query beside `name` maybe not need to be extracted and is optional
    - Headers must contains text `Content-Type: text/plain`, additional context is acceptable eg. `Content-Type: text/plain; charset=utf-8`
3. Body
    - [POST] `/json`
    - Mirror body to response
    - Server **MUST parse body to JSON and serialize back to string**
    - For the benchmark, the request body will be sent as: `{ "hello": "world" }`
    - Expected response: `{ "hello": "world" }`
    - Headers must contains text `Content-Type: application/json`, additional context is acceptable eg. `Content-Type: application/json; charset=utf-8`.
4. Video
    - [GET] `/video`
    - Stream `public/kyuukurarin.mp4` without buffering the whole file in application memory.
    - Headers must contain `Content-Type: video/mp4`.
    - Uses 10 concurrent connections instead of 500 because the file is 14.1 MB.
    - Sends `Cache-Control: no-store` and a deliberately non-matching `If-None-Match` value, and requires `200`, so every request transfers the full file even when the server emits an ETag.

## Requirement

- The framework must at-least has latest published in less than 9 month otherwise will be classified as unmaintained and removed unless is an industry standard (Express).

## Test machine specification

- Intel Core i7-13700K, DDR5 32GB 5600MHz
- Bun 1.4.0-canary.1+e82022145
- Node 26.1.0
- Deno 2.9.4

```
$ uname -a
Linux seia 7.0.11-1-cachyos #1 SMP PREEMPT_DYNAMIC Wed, 03 Jun 2026 22:05:15 +0000 x86_64 GNU/Linux
```

## Results

These results are measured in req/s:

| Framework         | Runtime | Average     | Ping       | Query      | Body       | Video    | Bundle Size | Startup  | Memory Before/After |
| ----------------- | ------- | ----------: | ---------: | ---------: | ---------: | -------: | ----------: | -------: | ------------------: |
| uws               | node    | 263,387.973 | 415,858.51 | 406,359.51 | 230,913.42 |   420.45 |      3.0 KB |  50.2 ms |     69.1 / 120.6 MB |
| elysia            | bun     |  209,850.34 | 405,261.05 | 221,855.98 | 210,579.49 | 1,704.84 |    171.3 KB |  30.5 ms |      36.4 / 46.4 MB |
| elysia-aot        | bun     | 209,333.195 |  400,611.5 | 225,398.95 | 209,587.81 | 1,734.52 |    127.5 KB |  15.0 ms |      34.7 / 45.7 MB |
| hono              | deno    | 170,784.958 | 275,457.57 |  196,225.1 | 211,037.12 |   420.04 |         n/a |  40.7 ms |      63.3 / 98.3 MB |
| deno              | deno    | 166,945.575 | 233,616.94 | 207,521.76 | 226,219.19 |   424.41 |         n/a |  27.0 ms |      56.7 / 88.3 MB |
| ultimate-express  | node    | 164,347.217 | 413,216.17 | 110,974.67 | 132,746.83 |    451.2 |    582.6 KB |  57.9 ms |    103.7 / 238.7 MB |
| bun               | bun     | 163,148.817 | 213,345.95 | 234,122.78 | 203,493.09 | 1,633.45 |      2.3 KB |   6.8 ms |      27.4 / 46.1 MB |
| hono              | bun     | 160,702.865 | 261,351.44 | 194,434.03 | 185,414.26 | 1,611.73 |     21.2 KB |   9.6 ms |      31.9 / 73.8 MB |
| deno-web-standard | deno    |  159,797.86 | 224,482.91 | 179,493.72 | 234,791.16 |   423.65 |         n/a |  15.6 ms |      56.8 / 86.9 MB |
| h3                | bun     | 150,884.067 | 225,928.15 | 192,527.93 | 184,808.05 |   272.14 |     28.4 KB |  14.7 ms |      43.1 / 99.6 MB |
| bun-web-standard  | bun     | 148,887.388 | 217,743.89 | 173,136.09 | 203,018.41 | 1,651.16 |      1.7 KB |   5.7 ms |      27.5 / 45.3 MB |
| hyper-express     | node    | 138,621.292 | 222,002.05 | 186,047.65 | 146,064.95 |   370.52 |    247.9 KB |  48.2 ms |     75.9 / 211.2 MB |
| h3                | deno    | 128,340.873 | 196,400.33 |  150,364.6 | 166,173.38 |   425.18 |         n/a |  25.3 ms |     72.1 / 179.2 MB |
| fastify           | node    |    97,934.5 | 150,359.55 | 141,390.16 |  99,652.63 |   335.66 |    554.7 KB |  67.2 ms |     98.4 / 162.3 MB |
| h3                | node    |   96,906.99 | 146,851.85 | 129,492.37 | 110,936.94 |    346.8 |     46.0 KB |  41.9 ms |     82.5 / 195.0 MB |
| elysia-aot        | node    |  92,933.828 | 145,380.96 |  119,610.3 | 106,524.04 |   220.01 |    152.0 KB |  49.0 ms |     91.4 / 179.8 MB |
| elysia            | node    |   92,473.62 | 144,638.94 | 117,356.21 | 107,680.64 |   218.69 |    202.7 KB |  43.6 ms |     92.3 / 178.2 MB |
| hono              | node    |  91,090.155 | 145,845.02 | 114,859.52 | 103,427.93 |   228.15 |     61.2 KB |  45.2 ms |     95.7 / 217.1 MB |
| effect            | bun     |  90,076.735 | 143,824.65 | 122,300.59 |  92,649.42 | 1,532.28 |    264.6 KB |  69.6 ms |     47.7 / 102.6 MB |
| effect            | node    |  58,684.417 |  91,223.54 |  81,520.32 |   61,641.9 |   351.91 |    357.6 KB |  80.9 ms |     90.7 / 114.6 MB |
| express           | bun     |  56,129.843 |  84,898.51 |  78,103.11 |  61,254.78 |   262.97 |    822.8 KB |  60.6 ms |     60.8 / 203.4 MB |
| koa               | node    |  44,449.868 |  68,804.41 |  60,446.22 |  48,215.47 |   333.37 |    729.6 KB |  61.6 ms |     95.4 / 204.6 MB |
| express           | node    |  42,226.563 |  65,102.45 |  58,459.19 |  45,000.52 |   344.09 |    603.6 KB |  50.2 ms |     86.6 / 223.8 MB |
| adonis            | node    |  36,017.515 |  49,603.34 |  45,081.63 |  49,061.15 |   323.94 |      1.2 MB | 175.5 ms |    123.2 / 192.8 MB |
| nest              | node    |  31,271.942 |  48,476.86 |     41,541 |  34,736.73 |   333.18 |      1.3 MB | 110.3 ms |    119.0 / 224.8 MB |
| oak               | deno    |  24,793.595 |  36,128.89 |  35,256.47 |  27,539.58 |   249.44 |         n/a |  51.5 ms |    101.4 / 192.0 MB |
| acorn             | deno    |  10,323.045 |  13,272.01 |  13,788.98 |  13,962.64 |   268.55 |         n/a |  83.5 ms |    104.3 / 234.7 MB |

#### Note
1. uws, hyperexpress and ultimate-express bundle size is not accurate because uwebsocket is a native binary that can't be compiled to single bundle, and bundle size is vary based on operating system and CPU architecture
2. uws is a C++ framework with JavaScript binding

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
