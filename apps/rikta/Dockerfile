FROM node:22-slim

RUN npm install -g pnpm@10

WORKDIR /app

COPY apps/rikta/package.json ./
COPY apps/rikta/tsconfig.json ./

RUN pnpm install

COPY apps/rikta/src ./src

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
