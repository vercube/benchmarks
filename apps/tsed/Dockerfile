FROM node:22-slim

RUN npm install -g pnpm@10

WORKDIR /app

COPY apps/tsed/package.json ./
COPY apps/tsed/tsconfig.json ./
COPY apps/tsed/tsconfig.base.json ./
COPY apps/tsed/tsconfig.node.json ./

RUN pnpm install

COPY apps/tsed/src ./src

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
