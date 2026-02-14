FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps

COPY package.json bun.lock turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN bun install --frozen-lockfile

FROM deps AS builder
RUN bunx turbo run build --filter=@leetcode-insights/server


FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json

WORKDIR /app/apps/server
CMD [ "node", "dist/index.js" ]
