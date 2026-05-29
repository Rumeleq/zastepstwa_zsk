FROM node:alpine AS base

RUN npm install -g pnpm
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/api/package.json ./backend/api/

RUN pnpm install --filter api... --frozen-lockfile

COPY backend/api ./backend/api

FROM base AS dev
EXPOSE 8080
CMD ["pnpm", "--filter", "api", "dev"]

FROM base AS prod
WORKDIR /app/backend/api
RUN pnpm build
EXPOSE 8080
CMD ["pnpm", "start"]