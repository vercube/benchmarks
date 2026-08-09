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
| uws               | node    | 264,173.098 |  422,004.5 | 404,071.39 | 230,200.03 |   416.47 |      3.0 KB |  50.4 ms |     69.0 / 137.7 MB |
| elysia-aot        | bun     | 212,854.903 | 405,454.57 | 230,481.76 | 213,861.49 | 1,621.79 |    121.6 KB |  51.1 ms |      35.8 / 45.1 MB |
| elysia            | bun     | 211,732.065 | 405,510.95 | 232,455.97 | 207,324.62 | 1,636.72 |    165.3 KB |  51.0 ms |      37.0 / 45.8 MB |
| hono              | deno    | 171,416.575 | 275,891.06 | 197,365.46 | 211,985.38 |    424.4 |         n/a |  59.9 ms |      64.0 / 97.8 MB |
| deno              | deno    | 167,052.268 | 231,421.35 | 204,518.08 |  231,847.8 |   421.84 |         n/a |  56.9 ms |      56.7 / 88.6 MB |
| ultimate-express  | node    |  166,156.78 | 416,372.41 | 113,372.57 | 134,428.75 |   453.39 |    582.6 KB | 101.2 ms |    103.6 / 240.9 MB |
| bun               | bun     |  164,173.03 | 218,360.23 | 231,569.06 | 205,080.72 | 1,682.11 |      2.3 KB |  54.5 ms |      27.3 / 46.2 MB |
| deno-web-standard | deno    | 162,160.143 | 234,076.57 | 179,076.57 | 235,064.45 |   422.98 |         n/a |  55.4 ms |      56.5 / 85.9 MB |
| hono              | bun     |  157,130.09 |  262,490.8 | 191,471.48 | 172,940.53 | 1,617.55 |     21.3 KB |  58.9 ms |      32.6 / 75.0 MB |
| h3                | bun     | 155,049.632 | 233,668.11 | 195,972.87 | 190,280.34 |   277.21 |     28.4 KB |  53.4 ms |      43.3 / 98.2 MB |
| bun-web-standard  | bun     | 149,128.858 | 215,562.58 | 175,409.02 | 203,892.17 | 1,651.66 |      1.7 KB |  52.7 ms |      27.5 / 45.0 MB |
| hyper-express     | node    | 138,311.982 | 222,684.62 | 184,960.12 |  145,224.1 |   379.09 |    247.9 KB |  51.4 ms |     75.5 / 209.2 MB |
| h3                | deno    | 128,783.533 | 197,376.52 | 151,360.96 | 165,975.42 |   421.23 |         n/a |  55.3 ms |      71.8 / 95.5 MB |
| fastify           | node    | 100,239.498 |  153,462.2 | 142,693.78 | 104,450.81 |    351.2 |    554.7 KB | 107.8 ms |     97.6 / 188.2 MB |
| h3                | node    |  96,918.058 | 146,627.07 | 129,731.88 | 110,974.91 |   338.37 |     46.0 KB |  54.5 ms |     83.2 / 197.7 MB |
| elysia            | node    |  93,734.522 | 145,954.18 | 120,793.03 | 107,968.25 |   222.63 |    196.6 KB |  54.2 ms |     92.4 / 183.1 MB |
| elysia-aot        | node    |  91,016.093 | 142,540.13 | 115,122.02 | 106,181.97 |   220.25 |    149.4 KB |  56.7 ms |     91.4 / 177.9 MB |
| effect            | bun     |   89,923.42 |  144,413.8 | 120,648.98 |  93,164.35 | 1,466.55 |    264.6 KB | 113.4 ms |     47.6 / 103.4 MB |
| hono              | node    |  87,518.063 | 142,679.54 | 112,956.71 |  94,211.12 |   224.88 |     61.3 KB |  58.1 ms |     98.2 / 219.1 MB |
| effect            | node    |  59,106.163 |     93,667 |  80,161.99 |  62,234.13 |   361.53 |    357.6 KB | 112.7 ms |     90.0 / 198.9 MB |
| express           | bun     |   56,278.48 |   84,589.9 |  77,954.03 |   62,303.4 |   266.59 |    822.8 KB |  53.6 ms |     60.3 / 204.8 MB |
| koa               | node    |   43,243.33 |  65,452.62 |  61,214.58 |     45,971 |   335.12 |    729.6 KB |  54.8 ms |     95.6 / 198.2 MB |
| express           | node    |  41,488.568 |  65,450.64 |  56,946.85 |  43,208.64 |   348.14 |    603.6 KB |  54.2 ms |     86.1 / 225.5 MB |
| adonis            | node    |  37,036.045 |  51,231.42 |  46,624.39 |  49,961.35 |   327.02 |      1.2 MB | 231.6 ms |    123.8 / 207.2 MB |
| nest              | node    |  30,578.395 |  46,651.26 |  41,930.73 |  33,400.36 |   331.23 |      1.3 MB | 170.8 ms |    117.3 / 226.8 MB |
| oak               | deno    |  24,100.332 |  35,316.77 |  34,109.31 |   26,726.8 |   248.45 |         n/a | 117.2 ms |    101.5 / 167.8 MB |
| acorn             | deno    |  10,097.715 |  13,154.95 |  13,370.75 |  13,593.49 |   271.67 |         n/a | 360.9 ms |    104.7 / 393.7 MB |

#### Note
1. uws, hyperexpress and ultimate-express bundle size is not accurate because uwebsocket is a native binary that can't be compiled to single bundle, and bundle size is vary based on operating system and CPU architecture
2. uws is a C++ framework with JavaScript binding

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
