FROM node:22-slim

RUN npm install -g pnpm@10

WORKDIR /app

COPY apps/vercube/package.json ./
COPY apps/vercube/tsconfig.json ./
COPY apps/vercube/vercube.config.ts ./

RUN pnpm install

COPY apps/vercube/src ./src

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
