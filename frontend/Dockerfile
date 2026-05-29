FROM node:alpine AS base

RUN npm install -g pnpm
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY frontend/package.json ./frontend/

RUN pnpm install --filter frontend... --frozen-lockfile

FROM base AS build
COPY frontend ./frontend
WORKDIR /app/frontend
RUN pnpm build

FROM nginx:alpine AS prod
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]