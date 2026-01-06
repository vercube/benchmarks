FROM node:22-slim

# Install required tools
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    jq \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Install hyperfine
RUN wget https://github.com/sharkdp/hyperfine/releases/download/v1.18.0/hyperfine_1.18.0_amd64.deb \
    && dpkg -i hyperfine_1.18.0_amd64.deb \
    && rm hyperfine_1.18.0_amd64.deb

# Install pnpm
RUN npm install -g pnpm@8 autocannon

# Set working directory
WORKDIR /benchmark

# Copy package files first for better caching
COPY package.json ./
COPY benchmark-config.json ./

# Copy apps
COPY apps ./apps

# Copy scripts
COPY scripts ./scripts
RUN chmod +x scripts/*.sh

# Install root dependencies
RUN pnpm install

# Default command
CMD ["./scripts/run-all-benchmarks.sh"]
