# Vercube HTTP Framework Benchmark

Compare throughput benchmarks from various JavaScript HTTP framework.

> This is [Vercube](https://vercube.dev)'s fork of
> [SaltyAom/bun-http-framework-benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark).
> The harness, the route contract and the methodology are SaltyAom's work; we
> track upstream and add the targets we care about. Everything the upstream
> README says about the method still applies here.
>
> Added in this fork:
>
> - **Vercube** on Bun, Node and Deno.
> - **Ts.ED** and **Rikta** on Node, so Vercube is measured against the other
>   decorator-and-DI frameworks and not only against bare routers.
>
> Nothing else about the harness is changed, so a number here is comparable to
> the same number upstream when the machine is the same.

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
bun run verify node/vercube node/tsed/index    # or only some of them
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

Vercube is included for Bun, Node and Deno from one shared application
definition in `src/vercube-app.ts`, so the three runtimes differ only in how the
video file is opened. It is benchmarked at the version in `package.json`, which
is what anyone can install. To measure an unreleased change instead, link a
local monorepo:

```sh
bun run link:vercube ../vercube   # build the packages there first
bun run link:vercube --restore    # back to the published versions
```

A published result should always come from the published version, so say so in
the machine specification below when it does not.

Ts.ED and Rikta live in `src/node/tsed` and `src/node/rikta` as directories
rather than single files, because both need `emitDecoratorMetadata` and Bun
resolves the nearest `tsconfig.json`. Their entries use top-level await, so both
are in the `nodeEsm` set in `bench.ts` and are bundled as ESM.

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

One run of `bun benchmark`, all 33 targets, on an otherwise idle machine.
Upstream's own results, measured on upstream's very different machine, are in
[SaltyAom/bun-http-framework-benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark#results);
absolute numbers are not comparable between the two, relative ones are.

- Apple M4 Pro (8P + 4E), 48 GB
- macOS 26.5, arm64
- Bun 1.4.1-canary.1
- Node 24.20.0
- Deno 2.9.5
- Vercube `main @ 6611a768`, linked from a local checkout rather than installed
  from npm, because the changes being measured are not released yet
- Date: 2026-09-07

## Results

These results are measured in req/s. `bun benchmark` writes the same table to
`results/results.md` and one raw bombardier dump per target under
`results/<runtime>/<framework>.txt`; the table below is copied from there. Note
that a run wipes `results/` first, so a partial run leaves a partial table.

| Framework           | Runtime | Average     | Ping       | Query      | Body       | Video  | Bundle Size | Startup  | Memory Before/After |
| ------------------- | ------- | ----------: | ---------: | ---------: | ---------: | -----: | ----------: | -------: | ------------------: |
| uws                 | node    | 117,329.225 | 169,407.02 | 165,135.71 | 134,390.65 | 383.52 |      3.0 KB |  41.9 ms |     61.9 / 203.8 MB |
| elysia-aot          | bun     | 103,911.473 | 158,908.67 | 132,465.68 |  123,501.7 | 769.84 |    127.5 KB |  14.4 ms |      27.0 / 52.3 MB |
| elysia              | bun     | 103,655.695 | 158,497.33 | 132,757.85 | 122,588.49 | 779.11 |    171.4 KB |  15.2 ms |      28.5 / 54.4 MB |
| h3                  | bun     |  96,616.123 | 139,396.93 | 126,719.88 | 119,644.56 | 703.12 |     22.5 KB |  10.7 ms |      25.0 / 60.8 MB |
| bun                 | bun     |  95,871.627 | 129,483.25 | 133,985.55 | 119,269.54 | 748.17 |      2.3 KB |   8.8 ms |      20.2 / 51.4 MB |
| hono                | bun     |   93,312.04 | 138,946.07 | 120,098.43 | 113,533.96 |  669.7 |     20.4 KB |  11.5 ms |      25.3 / 55.6 MB |
| bun-web-standard    | bun     |  92,440.975 | 127,639.32 | 118,141.66 | 123,229.98 | 752.94 |      1.7 KB |   8.7 ms |      20.8 / 49.5 MB |
| ultimate-express    | node    |  90,794.573 | 169,157.12 | 101,362.23 |  92,176.46 | 482.48 |    584.4 KB |  66.3 ms |     92.3 / 425.7 MB |
| deno-web-standard   | deno    |  90,551.533 | 122,651.15 | 109,978.93 |  129,299.9 | 276.15 |         n/a |  14.5 ms |      29.7 / 68.2 MB |
| vercube             | bun     |  89,256.205 | 127,856.23 | 119,859.25 | 108,729.55 | 579.79 |    561.1 KB |  37.3 ms |      42.2 / 71.0 MB |
| deno                | deno    |  87,003.168 | 118,549.66 | 108,855.85 | 120,276.32 | 330.84 |         n/a |  23.1 ms |      29.8 / 69.9 MB |
| hono                | deno    |  86,319.098 | 126,475.16 | 106,523.71 | 112,007.64 | 269.88 |         n/a |  57.2 ms |      36.0 / 80.7 MB |
| hyper-express       | node    |  85,589.608 | 124,977.04 | 115,916.77 | 101,120.08 | 344.54 |    247.9 KB |  56.6 ms |     71.3 / 274.1 MB |
| h3                  | deno    |  77,919.528 | 112,639.82 |  94,698.03 |  104,067.4 | 272.86 |         n/a |  28.3 ms |      40.2 / 72.7 MB |
| effect              | bun     |   74,190.57 |    108,719 |  99,320.61 |  87,987.33 | 735.34 |    260.9 KB |  33.0 ms |      40.1 / 76.0 MB |
| vercube             | deno    |  73,737.093 | 105,536.04 |  92,968.17 |  96,124.45 | 319.71 |         n/a |  64.1 ms |     47.8 / 165.0 MB |
| h3                  | node    |   69,999.12 |  94,234.27 |  96,782.24 |  88,635.03 | 344.94 |     40.1 KB |  55.5 ms |     73.8 / 339.4 MB |
| elysia              | node    |   68,779.86 |  99,088.25 |  89,416.19 |  86,351.22 | 263.78 |    196.8 KB |  53.2 ms |     80.8 / 349.9 MB |
| fastify             | node    |  67,315.845 |  99,689.69 |  98,646.05 |  70,603.51 | 324.13 |    554.8 KB |  79.2 ms |     87.3 / 444.7 MB |
| vercube             | node    |  67,250.968 | 101,976.51 |  84,831.47 |   81,946.3 | 249.59 |    570.7 KB |  65.4 ms |     97.8 / 377.3 MB |
| rikta               | node    |   66,406.84 |  93,318.36 |  87,316.83 |  84,656.41 | 335.76 |    949.9 KB |  96.5 ms |     97.9 / 319.5 MB |
| hono                | node    |  64,025.588 |  91,660.64 |  83,170.07 |  80,996.07 | 275.57 |     61.2 KB |  51.1 ms |     83.7 / 333.4 MB |
| elysia-aot          | node    |  62,364.093 |  91,397.22 |  75,492.14 |  82,284.76 | 282.25 |    146.0 KB |  52.0 ms |     80.0 / 356.0 MB |
| express             | bun     |  49,408.683 |  71,034.84 |  69,509.08 |  56,855.33 | 235.48 |    821.1 KB |  34.7 ms |     49.1 / 201.3 MB |
| effect              | node    |   46,372.71 |   68,446.7 |   61,926.8 |   54,769.9 | 347.44 |    354.0 KB |  79.0 ms |     83.5 / 438.0 MB |
| koa                 | node    |  41,086.528 |  58,867.57 |  57,046.12 |  48,106.57 | 325.85 |    728.6 KB |  55.2 ms |     86.8 / 345.4 MB |
| express             | node    |  31,209.125 |  45,848.64 |  42,440.56 |  36,221.23 | 326.07 |    601.9 KB |  50.5 ms |     78.1 / 323.1 MB |
| tsed                | node    |  30,769.085 |  49,897.71 |  37,128.33 |  35,727.29 | 323.01 |      1.1 MB |  92.4 ms |    101.8 / 443.3 MB |
| routing-controllers | node    |  28,527.743 |  41,515.69 |  37,951.53 |   34,315.6 | 328.15 |      1.7 MB | 165.9 ms |    105.8 / 357.0 MB |
| adonis              | node    |  28,329.082 |  30,433.79 |  38,346.92 |  44,299.06 | 236.56 |      1.2 MB | 199.1 ms |    116.1 / 471.1 MB |
| nest                | node    |  25,614.535 |  36,309.11 |  33,174.84 |  32,644.11 | 330.08 |      1.3 MB | 103.5 ms |    100.1 / 361.2 MB |
| oak                 | deno    |  19,530.668 |  31,228.02 |  26,355.26 |  20,321.13 | 218.26 |         n/a | 113.7 ms |     71.6 / 245.3 MB |
| acorn               | deno    |    9,888.14 |  12,498.38 |   13,264.4 |  13,563.71 | 226.07 |         n/a | 135.8 ms |     79.5 / 424.8 MB |


#### Note
0. The Video column is not stable enough to compare frameworks with. Repeating
   the same target on the same machine moved it between 580 and 742 req/s, about
   13% either way, because it streams a 14.1 MB file over 10 connections and is
   dominated by the file cache and thermal state. The Average column is the mean
   of all four benchmarks, Video included, so it inherits a quarter of that
   noise. Compare Ping, Query and Body.
1. uws, hyperexpress and ultimate-express bundle size is not accurate because uwebsocket is a native binary that can't be compiled to single bundle, and bundle size is vary based on operating system and CPU architecture
2. uws is a C++ framework with JavaScript binding

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
