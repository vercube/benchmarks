FROM node:22-slim

# Install required tools
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    jq \
    procps \
    lsof \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install hyperfine (detect architecture automatically)
RUN ARCH=$(dpkg --print-architecture) && \
    wget https://github.com/sharkdp/hyperfine/releases/download/v1.18.0/hyperfine_1.18.0_${ARCH}.deb && \
    dpkg -i hyperfine_1.18.0_${ARCH}.deb && \
    rm hyperfine_1.18.0_${ARCH}.deb

# Install pnpm, autocannon, and bun
RUN npm install -g pnpm@10 autocannon && \
    curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Set working directory
WORKDIR /benchmark

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY benchmark-config.json README.md ./

# Copy apps
COPY apps ./apps

# Copy scripts
COPY scripts ./scripts

# Create results directory
RUN mkdir -p results/raw

# Install dependencies
RUN pnpm install --frozen-lockfile

# Default command - run benchmarks with bun
CMD ["bun", "run", "scripts/benchmark.ts"]
