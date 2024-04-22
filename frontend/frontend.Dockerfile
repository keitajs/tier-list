# syntax=docker/dockerfile:1

FROM oven/bun:1 AS base

WORKDIR /usr/src/app

FROM base AS deps

RUN mkdir -p /tmp/prod
COPY package.json bun.lockb /tmp/prod/
RUN cd /tmp/prod && bun install --frozen-lockfile

FROM deps AS build

COPY --from=deps /tmp/prod/node_modules node_modules
COPY . .

RUN bun run build

FROM build AS release

COPY --chown=bun --from=deps /tmp/prod/package.json ./package.json
COPY --chown=bun --from=build /usr/src/app/dist ./dist
COPY --chown=bun --from=build /usr/src/app/vite.config.js ./vite.config.js

USER bun
EXPOSE 3000

CMD bun run serve