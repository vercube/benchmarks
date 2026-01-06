FROM node:22-slim

RUN npm install -g pnpm@10

WORKDIR /app

COPY apps/routing-controllers/package.json ./
COPY apps/routing-controllers/tsconfig.json ./

RUN pnpm install

COPY apps/routing-controllers/src ./src

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
