FROM node:22-alpine AS builder
WORKDIR /app
COPY apps/backend-nestjs/package*.json ./
RUN npm ci
COPY apps/backend-nestjs/ .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .
RUN npm ci --omit=dev
RUN adduser -S appuser && chown -R appuser /app
USER appuser
EXPOSE 8001
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:8001/health || exit 1
CMD ["node", "dist/main.js"]
