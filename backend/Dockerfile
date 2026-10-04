FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG FRONTEND_URL
ENV FRONTEND_URL=$FRONTEND_URL

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start:prod"]