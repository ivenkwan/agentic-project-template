FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY apps/frontend-nextjs/package*.json ./apps/frontend-nextjs/
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/ui-components/package*.json ./packages/ui-components/
RUN npm ci --prefix apps/frontend-nextjs

FROM base AS builder
COPY --from=deps /app/apps/frontend-nextjs/node_modules ./apps/frontend-nextjs/node_modules
COPY apps/frontend-nextjs/ ./apps/frontend-nextjs/
COPY packages/ ./packages/
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --prefix apps/frontend-nextjs

FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/frontend-nextjs/.next/standalone ./
COPY --from=builder /app/apps/frontend-nextjs/.next/static ./.next/static
COPY --from=builder /app/apps/frontend-nextjs/public ./public
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:3000/api/health || exit 1
CMD ["node", "server.js"]
