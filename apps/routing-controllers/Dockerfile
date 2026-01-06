FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm@8

WORKDIR /app

# Copy package files
COPY apps/routing-controllers/package.json ./
COPY apps/routing-controllers/tsconfig.json ./

# Install dependencies
RUN pnpm install

# Copy source
COPY apps/routing-controllers/src ./src

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Start server
CMD ["pnpm", "start"]
