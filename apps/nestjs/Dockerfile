FROM node:22-slim

RUN npm install -g pnpm@10

WORKDIR /app

COPY apps/nestjs/package.json ./
COPY apps/nestjs/tsconfig.json ./
COPY apps/nestjs/nest-cli.json ./

RUN pnpm install

COPY apps/nestjs/src ./src

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
