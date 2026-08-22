---
name: docker-setup
description: >
  Scaffold a new Docker Compose service for any of the 4 supported stacks.
  Use when adding a new service, containerizing an existing app, or configuring
  multi-stage Dockerfiles with health checks and hot-reload dev overrides.
metadata:
  version: "1.0"
  author: agentic-project-template
---

# Docker Setup Skill

**Compatibility:** Docker Compose v2+, multi-stage builds, Alpine-based images

## When to Use
Activate when: creating a new Dockerfile, modifying docker-compose.yml,
adding a service, configuring health checks, or setting up dev hot-reload.

## Step-by-Step Workflow

1. **Identify the service type** from AGENTS.md (frontend/backend, language)
2. **Choose base image** from the approved list:
   - Node.js: `node:22-alpine`
   - Python: `python:3.13-slim`
   - Go: `golang:1.22-alpine`
   - Nginx: `nginx:1.25-alpine`
3. **Write a multi-stage Dockerfile** with `builder` and `runner` stages
4. **Add a healthcheck** to the service in docker-compose.yml
5. **Add dev override** in docker-compose.dev.yml with volume mounts for hot-reload
6. **Verify** with: `docker compose config --quiet && docker compose build <service>`

## Dockerfile Template (Node.js)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/index.js"]
```

## docker-compose.yml Service Block Template

```yaml
service-name:
  build:
    context: .
    dockerfile: apps/service-name/Dockerfile
  ports:
    - "PORT:PORT"
  environment:
    NODE_ENV: production
    DATABASE_URL: postgresql://appuser:secret@postgres:5432/appdb
  depends_on:
    postgres:
      condition: service_healthy
  healthcheck:
    test: ["CMD", "wget", "-qO-", "http://localhost:PORT/health"]
    interval: 30s
    timeout: 5s
    retries: 3
    start_period: 10s
```

## Rules
1. Never use `latest` image tag — always pin versions
2. Never put secrets in Dockerfile — use environment variables
3. Development volume mounts go in `docker-compose.dev.yml` only
4. Every service must define a `/health` endpoint and a `healthcheck`
