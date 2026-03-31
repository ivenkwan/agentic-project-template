FROM node:22-alpine AS builder
WORKDIR /app
COPY apps/frontend-sveltekit/package*.json ./
RUN npm ci
COPY apps/frontend-sveltekit/ .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json .
RUN npm ci --omit=dev
RUN adduser -S appuser && chown -R appuser /app
USER appuser
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:3001/ || exit 1
CMD ["node", "build"]
