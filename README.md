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

`vercube-default` is the same application with Vercube's default
configuration: request logging and the request context stay on, so every
request writes one JSON log line. `vercube` switches both off
(`requestLogging: false, requestContext: false`), which is the fastest the
framework can be configured and what the other targets, none of which log, are
closest to. The log lines of `vercube-default` go to `/dev/null`, the way a
production process hands them to a collector rather than to a terminal. Read
the two rows together: `vercube` is the router and the dispatch, the distance
to `vercube-default` is the price of a log line per request.

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

One run of `bun benchmark`, all 36 targets, on an otherwise idle machine.
Upstream's own results, measured on upstream's very different machine, are in
[SaltyAom/bun-http-framework-benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark#results);
absolute numbers are not comparable between the two, relative ones are.

- Apple M4 Pro (8P + 4E), 48 GB
- macOS 27.0, arm64
- Bun 1.4.1
- Node 26.13.1
- Deno 2.9.5
- Vercube `1.6 @ 0b45dc2f`, linked from a local checkout rather than installed
  from npm, because the changes being measured are not released yet
- Date: 2026-11-22

## Results

These results are measured in req/s. `bun benchmark` writes the same table to
`results/results.md` and one raw bombardier dump per target under
`results/<runtime>/<framework>.txt`; the table below is copied from there. Note
that a run wipes `results/` first, so a partial run leaves a partial table.

| Framework           | Runtime | Average     | Ping       | Query      | Body       | Video     | Bundle Size | Startup  | Memory Before/After |
| ------------------- | ------- | ----------: | ---------: | ---------: | ---------: | --------: | ----------: | -------: | ------------------: |
| uws                 | node    | 122,524.535 | 174,755.15 | 171,231.73 | 143,718.37 |    392.89 |      3.0 KB |  37.8 ms |     66.7 / 211.0 MB |
| elysia              | bun     | 106,506.015 | 161,876.38 | 136,818.02 | 126,642.09 |    687.57 |    171.4 KB |  15.2 ms |      28.3 / 54.8 MB |
| elysia-aot          | bun     |  106,448.42 | 162,364.22 | 136,642.35 | 126,146.26 |    640.85 |    127.5 KB |  15.0 ms |      27.7 / 53.3 MB |
| h3                  | bun     |   99,917.42 | 144,318.54 | 130,225.89 | 124,403.75 |     721.5 |     22.6 KB |  11.0 ms |      24.8 / 58.2 MB |
| bun                 | bun     |  97,727.798 | 132,587.46 | 135,844.44 | 121,835.26 |    644.03 |      2.3 KB |   8.5 ms |      20.7 / 52.7 MB |
| hono                | bun     |   97,388.47 | 144,933.79 | 125,683.24 | 118,233.12 |    703.73 |     20.4 KB |  11.4 ms |      26.1 / 55.2 MB |
| vercube             | bun     |  95,730.465 | 136,370.41 | 129,959.59 | 115,865.57 |    726.29 |    352.1 KB |  31.8 ms |      44.3 / 99.4 MB |
| bun-web-standard    | bun     |  95,478.843 | 132,416.79 | 121,914.77 | 126,899.53 |    684.28 |      1.7 KB |   9.4 ms |      20.7 / 49.0 MB |
| deno                | deno    |  94,572.348 | 128,118.17 | 119,761.08 | 130,094.41 |    315.73 |         n/a |  22.9 ms |      29.8 / 70.0 MB |
| ultimate-express    | node    |  94,394.135 |  173,633.2 |  102,410.4 | 101,024.41 |    508.53 |    584.4 KB |  76.2 ms |     91.4 / 316.0 MB |
| hono                | deno    |  94,074.795 | 139,064.91 | 116,835.89 | 120,073.19 |    325.19 |         n/a |  37.9 ms |      35.8 / 82.1 MB |
| deno-web-standard   | deno    |  92,700.287 | 125,613.04 | 111,738.86 | 133,132.57 |    316.68 |         n/a |  21.7 ms |      29.9 / 71.2 MB |
| hyper-express       | node    |  90,589.345 | 131,857.31 |  121,653.6 | 108,465.96 |    380.51 |    247.9 KB | 422.9 ms |     76.1 / 285.8 MB |
| h3                  | deno    |  82,476.288 | 120,091.31 |  101,949.2 | 107,533.43 |    331.21 |         n/a |  27.0 ms |      40.5 / 72.6 MB |
| vercube             | deno    |  80,082.125 | 112,635.74 | 107,895.44 |  99,475.24 |    322.08 |         n/a |  46.5 ms |      53.9 / 82.4 MB |
| fastify             | node    |    79,627.9 | 112,738.03 | 110,575.41 |  94,844.99 |    353.17 |    554.8 KB |  86.2 ms |     89.9 / 261.3 MB |
| vercube             | node    |  77,020.815 | 107,956.37 |  104,518.5 |  95,316.54 |    291.85 |    365.7 KB |  58.6 ms |     94.8 / 279.6 MB |
| hono                | node    |  76,486.273 | 110,854.01 | 101,130.54 |  93,667.34 |     293.2 |     61.2 KB |  53.5 ms |     96.8 / 273.8 MB |
| h3                  | node    |  74,913.785 |  105,427.7 |  101,068.8 |  92,806.73 |    351.91 |     41.5 KB |  45.2 ms |     77.8 / 286.8 MB |
| elysia-aot          | node    |  74,899.858 | 105,908.32 |   99,386.8 |  93,949.48 |    354.83 |    147.5 KB |  52.1 ms |     82.4 / 253.8 MB |
| elysia              | node    |  74,250.225 | 104,777.95 |  99,123.16 |  92,746.97 |    352.82 |    198.2 KB |  50.1 ms |     83.5 / 260.0 MB |
| rikta               | node    |  73,821.198 |  102,305.6 | 102,320.29 |  90,312.68 |    346.22 |    944.1 KB |  90.7 ms |    101.2 / 263.4 MB |
| effect              | bun     |  71,776.323 | 108,910.89 |  95,522.91 |  82,051.72 |    619.77 |    260.9 KB |  32.5 ms |      40.3 / 76.6 MB |
| vercube-default     | bun     |  68,211.503 |  93,640.37 |  90,278.83 |  88,232.99 |    693.82 |    352.1 KB |  33.2 ms |     45.8 / 120.3 MB |
| effect              | node    |  57,484.725 |  88,125.71 |  77,728.58 |  63,730.51 |     354.1 |    354.0 KB |  80.1 ms |     93.3 / 288.8 MB |
| acorn               | deno    |  47,499.708 |  49,402.86 |   45,294.2 |  66,494.36 | 28,807.41 |         n/a | 258.9 ms |      79.0 / 91.1 MB |
| express             | bun     |  46,459.873 |  66,564.95 |  64,470.21 |  54,575.47 |    228.86 |    821.1 KB |  38.0 ms |     54.8 / 209.1 MB |
| koa                 | node    |  46,031.175 |   66,590.9 |   62,414.3 |  54,772.43 |    347.07 |    728.6 KB |  56.7 ms |     92.7 / 270.6 MB |
| vercube-default     | node    |  45,432.388 |  58,816.26 |  57,119.77 |  65,498.03 |    295.49 |    365.7 KB |  73.5 ms |    107.9 / 300.2 MB |
| vercube-default     | deno    |  44,505.568 |  59,603.76 |  58,055.99 |  60,047.76 |    314.76 |         n/a |  50.5 ms |     56.1 / 181.6 MB |
| adonis              | node    |   39,949.59 |  52,640.63 |  49,384.35 |  57,437.87 |    335.51 |      1.2 MB | 316.1 ms |    113.2 / 301.5 MB |
| express             | node    |  36,283.945 |  50,291.44 |  47,674.54 |  46,819.73 |    350.07 |    601.9 KB |  51.7 ms |     83.3 / 303.0 MB |
| tsed                | node    |   33,744.69 |  53,582.26 |  39,513.72 |   41,544.4 |    338.38 |      1.1 MB | 101.7 ms |    105.8 / 299.3 MB |
| routing-controllers | node    |  32,304.743 |  46,567.23 |  41,789.07 |  40,527.47 |     335.2 |      1.7 MB | 172.9 ms |    105.5 / 287.8 MB |
| nest                | node    |   31,536.91 |  45,157.13 |  41,246.05 |  39,400.15 |    344.31 |      1.3 MB | 105.3 ms |    107.4 / 277.9 MB |
| oak                 | deno    |  23,898.368 |  34,407.05 |  34,144.06 |  26,811.41 |    230.95 |         n/a |  97.5 ms |     72.1 / 240.5 MB |


#### Note
0. Vercube's bundle size is measured with `jiti`, `giget` and `dotenv` marked
   external, alongside `chokidar`. They are optional peer dependencies of `c12`,
   which imports them dynamically. A checkout that has them installed, such as
   this repository or the Vercube monorepo, lets the bundler follow those
   dynamic imports and adds about 300 KB that `bun add @vercube/core` never
   installs and a deployment never ships. Of the 352 KB that remain, 155 KB
   are `c12` and what it loads to read a config file (`confbox` alone is
   105 KB): built with `c12` external, which an application that passes its
   whole configuration to `createApp` can do, the bundle is 196 KB.
1. The Video column is not stable enough to compare frameworks with. Repeating
   the same target on the same machine moved it between 580 and 742 req/s, about
   13% either way, because it streams a 14.1 MB file over 10 connections and is
   dominated by the file cache and thermal state. The Average column is the mean
   of all four benchmarks, Video included, so it inherits a quarter of that
   noise. Compare Ping, Query and Body.
2. uws, hyperexpress and ultimate-express bundle size is not accurate because uwebsocket is a native binary that can't be compiled to single bundle, and bundle size is vary based on operating system and CPU architecture
3. uws is a C++ framework with JavaScript binding
4. acorn's Video figure in this run is not a file transfer rate: nearly all of its responses were errors, see `results/deno/acorn.txt`. It also lifts its Average.

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
