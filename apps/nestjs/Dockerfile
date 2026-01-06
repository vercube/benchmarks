FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm@8

WORKDIR /app

# Copy package files
COPY apps/nestjs/package.json ./
COPY apps/nestjs/tsconfig.json ./
COPY apps/nestjs/nest-cli.json ./

# Install dependencies
RUN pnpm install

# Copy source
COPY apps/nestjs/src ./src

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Start server
CMD ["pnpm", "start"]
