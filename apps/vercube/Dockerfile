FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm@8

WORKDIR /app

# Copy package files
COPY apps/vercube/package.json ./
COPY apps/vercube/tsconfig.json ./

# Install dependencies
RUN pnpm install

# Copy source
COPY apps/vercube/src ./src

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Start server
CMD ["pnpm", "start"]
