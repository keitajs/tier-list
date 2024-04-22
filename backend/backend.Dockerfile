# syntax=docker/dockerfile:1

FROM oven/bun:1 AS base

WORKDIR /usr/src/app

FROM base AS deps

RUN mkdir -p /tmp/prod

COPY package.json bun.lockb /tmp/prod/
RUN cd /tmp/prod && bun install --frozen-lockfile

FROM deps AS release

COPY --chown=bun --from=deps /tmp/prod/node_modules node_modules
COPY --chown=bun . .

USER bun
EXPOSE 2000

CMD bun start