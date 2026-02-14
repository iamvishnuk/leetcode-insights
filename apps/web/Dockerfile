FROM oven/bun:1 AS base

WORKDIR /app

FROM base AS deps
# copy root file (monorepo)
COPY package.json bun.lock turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN bun install --frozen-lockfile


FROM deps AS builder
RUN bunx turbo run build --filter=@leetcode-insights/web

# Production Runnter
FROM oven/bun:1-slim AS runner

WORKDIR /app
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD [ "bun", "apps/web/server.js" ]
