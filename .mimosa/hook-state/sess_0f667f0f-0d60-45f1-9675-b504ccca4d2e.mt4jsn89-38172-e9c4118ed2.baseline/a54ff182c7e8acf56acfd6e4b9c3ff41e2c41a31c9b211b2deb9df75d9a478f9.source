# AGENTS.md — Project-Level Agent Context

> This file is loaded **always** by every AI agent (Roo Code, Gemini CLI, Claude Code, Copilot, Codex).
> It defines project boundaries, architecture, commands, and conventions.
> For task-specific capabilities, see `.agent/skills/`.

---

## Project Overview

**Name:** `agentic-project-template`
**Purpose:** A polyglot monorepo template supporting 4 full-stack configurations, all orchestrated via Docker Compose and wired for agentic coding with Roo Code + Gemini Pro.

---

## Architecture

```
agentic-project-template/
├── apps/
│   ├── frontend-nextjs/       # Stack 1 & 2: Next.js (App Router, TypeScript, Tailwind)
│   ├── frontend-sveltekit/    # Stack 3: SvelteKit + TypeScript
│   ├── frontend-vite-react/   # Stack 4: Vite + React 19 + TypeScript
│   ├── backend-fastapi/       # Stack 1: Python FastAPI + Pydantic
│   ├── backend-nestjs/        # Stack 4: NestJS + TypeScript
│   └── backend-go/            # Stack 3: Go + Gin (or PocketBase)
├── packages/
│   ├── shared-types/          # Cross-stack TypeScript interfaces
│   ├── shared-utils/          # Common utility functions
│   └── ui-components/         # Shared React/Svelte component stubs
├── infra/
│   ├── nginx/                 # Reverse proxy config
│   ├── postgres/              # DB init scripts
│   └── redis/                 # Redis config
├── .roo/                      # Roo Code agent rules (always-on + per-mode)
├── .agent/                    # Agent skills framework (SKILL.md)
├── AGENTS.md                  # This file — project-level agent context
├── GEMINI.md                  # Gemini CLI entry point (imports AGENTS.md)
├── docker-compose.yml         # Full stack orchestration
├── docker-compose.dev.yml     # Dev overrides (hot-reload, volume mounts)
└── .env.example               # Environment variable template
```

---

## Active Stack

> ⚙️ Set `ACTIVE_STACK` in `.env` to activate one configuration:
> - `stack1` — Next.js + FastAPI + PostgreSQL + Redis
> - `stack2` — T3 (Next.js + tRPC + Prisma + PostgreSQL)
> - `stack3` — SvelteKit + Go + PostgreSQL
> - `stack4` — Vite + React + NestJS + PostgreSQL

---

## Key Commands

```bash
# Start full stack (set ACTIVE_STACK in .env first)
docker compose up

# Start with hot-reload for development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Rebuild a specific service
docker compose build <service>

# Run database migrations
docker compose exec backend-fastapi alembic upgrade head
docker compose exec backend-nestjs npm run migration:run

# Access database
docker compose exec postgres psql -U appuser -d appdb

# Run tests
docker compose exec backend-fastapi pytest
docker compose exec backend-nestjs npm run test
docker compose exec backend-go go test ./...
```

---

## Conventions

- **TypeScript:** strict mode, PascalCase for types/interfaces, camelCase for variables
- **Python:** PEP8, snake_case, type hints required on all functions
- **Go:** gofmt enforced, PascalCase for exported, camelCase for unexported
- **CSS:** Tailwind utility-first; no custom CSS unless absolutely necessary
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Env vars:** Never hardcode secrets; always use `.env` + Docker secrets
- **Tests:** Test files live beside source (`*.test.ts`, `*_test.go`, `test_*.py`)
- **API:** RESTful by default; suffix `/api/v1/` for all backend routes

---

## File Boundaries

- Do NOT modify `AGENTS.md` directly — it is the source of truth
- Do NOT commit `.env` — use `.env.example` as the template
- Do NOT modify `packages/shared-types` without updating all consumers
- Skills in `.agent/skills/` are read-only reference; copy & customize as needed

---

## Ports

| Service            | Port  |
|--------------------|-------|
| Frontend (Next.js) | 3000  |
| Frontend (Svelte)  | 3001  |
| Frontend (Vite)    | 3002  |
| FastAPI            | 8000  |
| NestJS             | 8001  |
| Go/Gin             | 8002  |
| PostgreSQL         | 5432  |
| Redis              | 6379  |
| Nginx (proxy)      | 80    |
