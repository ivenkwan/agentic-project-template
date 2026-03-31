# Architecture Documentation

> Updated by the Stack Architect mode.

## System Overview

This monorepo supports 4 interchangeable full-stack configurations, all sharing:
- PostgreSQL for persistent storage
- Redis for caching and queues
- Nginx as reverse proxy
- Docker Compose for orchestration

## Stack Configurations

| Stack | Frontend | Backend | Notes |
|-------|----------|---------|-------|
| stack1 | Next.js 14 | FastAPI | Best for AI/ML integrations |
| stack2 | Next.js 14 + tRPC | Prisma | End-to-end type safety |
| stack3 | SvelteKit | Go/Gin | Minimal image size |
| stack4 | Vite + React | NestJS | Enterprise structure |

## API Contract
All backends expose `/api/v1/` prefixed routes and a `/health` endpoint.
