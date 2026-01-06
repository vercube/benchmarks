/**
 * Type definitions for Vercube Benchmark Suite
 */

export interface Config {
  frameworks: string[];
  nodeVersion: string;
  testEndpoint: string;
  healthEndpoint: string;
  port: number;
  loadTest: {
    connections: number;
    duration: number;
    pipelining: number;
  };
  buildBenchmark: {
    warmup: number;
    runs: number;
  };
  coldStartBenchmark: {
    warmup: number;
    runs: number;
  };
}

export interface HyperfineResult {
  command: string;
  mean: number;
  stddev: number;
  median: number;
  min: number;
  max: number;
  relative?: number;
}

export interface HyperfineOutput {
  results: HyperfineResult[];
}

export interface AutocannonOutput {
  requests: { mean: number; average: number };
  latency: {
    mean: number;
    stddev: number;
    p50: number;
    p75: number;
    p90: number;
    p97_5: number;
    p99: number;
    p999: number;
  };
  throughput: { mean: number };
  errors: number;
}

export interface ResourceSample {
  timestamp: number;
  cpu: number;
  memory: number;
  elapsed: number;
}

export interface BenchmarkMetrics {
  mean: number;
  stddev: number;
  median: number;
  min: number;
  max: number;
  relative: number;
}

export interface LoadTestMetrics {
  requests: { mean: number };
  throughput: { mean: number };
  latency: {
    mean: number;
    stddev: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
    p999: number;
  };
  errors: number;
}

export interface ResourceMetrics {
  cpu: { mean: number; max: number; p95: number };
  memory: { mean: number; max: number; p95: number };
}

export interface FrameworkResults {
  build: BenchmarkMetrics | null;
  coldStart: BenchmarkMetrics | null;
  loadTest: LoadTestMetrics | null;
  resources: ResourceMetrics | null;
}

