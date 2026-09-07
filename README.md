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

Not measured on this fork yet. The numbers below are produced by one run of
`bun benchmark` on a single idle machine, and the specification of that machine
is filled in from the run that produced them. Upstream's own results, measured
on upstream's machine, are in
[SaltyAom/bun-http-framework-benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark#results).

- CPU:
- Memory:
- OS:
- Bun:
- Node:
- Deno:
- Vercube:

## Results

These results are measured in req/s. `bun benchmark` writes the same table to
`results/results.md` and one raw bombardier dump per target under
`results/<runtime>/<framework>.txt`; the table below is copied from there. Note
that a run wipes `results/` first, so a partial run leaves a partial table.

Pending the first full run on the fork.


#### Note
1. uws, hyperexpress and ultimate-express bundle size is not accurate because uwebsocket is a native binary that can't be compiled to single bundle, and bundle size is vary based on operating system and CPU architecture
2. uws is a C++ framework with JavaScript binding

See more detail in [results](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/main/results)

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.

If you are unable to run Deno, please run each Deno app individually first until the Deno finish installing the package, then proceed to run benchmark using `bench.sh` or `npm run benchmark`
