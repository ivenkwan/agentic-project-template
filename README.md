# 🤖 Agentic Coding Project Template

A polyglot monorepo template for **VSCode + Roo Code + Gemini Pro** agentic coding,
supporting 4 full-stack configurations with Docker Compose orchestration and a full
Agent Skills framework.

---

## Quick Start

```bash
# 1. Clone and configure
cp .env.example .env
# Edit .env — set ACTIVE_STACK and credentials

# 2. Start the full stack
docker compose --profile stack1 up

# 3. Start with hot-reload (development)
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile stack1 up
```

## Supported Stacks

| Stack | Command | Frontend | Backend | DB |
|-------|---------|----------|---------|-----|
| `stack1` | `--profile stack1` | Next.js 14 | FastAPI | PostgreSQL + Redis |
| `stack2` | `--profile stack2` | Next.js + tRPC | Prisma | PostgreSQL |
| `stack3` | `--profile stack3` | SvelteKit | Go + Gin | PostgreSQL |
| `stack4` | `--profile stack4` | Vite + React | NestJS | PostgreSQL |

## Ports

| Service | Port |
|---------|------|
| Next.js | 3000 |
| SvelteKit | 3001 |
| Vite/React | 3002 |
| FastAPI | 8000 |
| NestJS | 8001 |
| Go/Gin | 8002 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| Nginx | 80 |

## Agentic Coding Setup

### Roo Code (VSCode)
1. Install [Roo Code](https://marketplace.visualstudio.com/items?itemName=RooVetGit.roo-cline) extension
2. Set Gemini Pro as your model in Roo Code settings
3. Custom modes are loaded from `.roomodes` automatically
4. Rules in `.roo/` are loaded per-mode

**Available Modes:**
- 🪃 **Orchestrator** — Decomposes complex tasks using Boomerang Tasks
- 🏗️ **Stack Architect** — Designs APIs, schemas, Docker topology
- 💻 **Stack Coder** — Implements features with TDD
- 🐳 **DevOps** — Manages Docker, CI/CD, Nginx
- 🧩 **Skill Creator** — Authors new SKILL.md skills

### Agent Skills Framework
Skills live in `.agent/skills/`. Each skill is a directory with a `SKILL.md` file.

| Skill | Purpose |
|-------|---------|
| `docker-setup` | Scaffold Docker services and Dockerfiles |
| `tdd-workflow` | Test-driven development across all stacks |
| `api-scaffold` | Scaffold REST endpoints (FastAPI/NestJS/Go) |
| `frontend-scaffold` | Scaffold pages and components |
| `db-migration` | Safe database migrations (Alembic/Prisma/golang-migrate) |
| `code-review` | Structured security and quality review |

### Agent Workflows (Slash Commands)
- `/plan <task>` — Generate an implementation plan without writing code
- `/commit` — Generate a Conventional Commit message
- `/review` — Run a structured code review on staged files

### GEMINI.md
The `GEMINI.md` file is the entry point for Gemini CLI. It imports `AGENTS.md`
for project context and defines the 4-phase protocol: Understand → Plan → Implement → Verify.

## Project Structure

```
agentic-project-template/
├── apps/
│   ├── frontend-nextjs/     # Stack 1 & 2
│   ├── frontend-sveltekit/  # Stack 3
│   ├── frontend-vite-react/ # Stack 4
│   ├── backend-fastapi/     # Stack 1
│   ├── backend-nestjs/      # Stack 4
│   └── backend-go/          # Stack 3
├── packages/
│   ├── shared-types/        # Shared TypeScript interfaces
│   ├── shared-utils/        # Common utilities
│   └── ui-components/       # Shared component stubs
├── infra/
│   ├── nginx/               # Reverse proxy config
│   ├── postgres/            # DB init scripts
│   └── redis/
├── .roo/                    # Roo Code rules (per-mode)
│   ├── rules/               # Always-on rules
│   ├── rules-architect/
│   ├── rules-code/
│   ├── rules-debug/
│   └── rules-orchestrator/
├── .agent/                  # Agent Skills Framework
│   ├── skills/              # SKILL.md skill packages
│   └── workflows/           # Slash command workflows
├── docs/
│   ├── backlog.md           # Agent-maintained task log
│   └── architecture.md      # Architecture decisions
├── AGENTS.md                # Project-level agent context (always loaded)
├── GEMINI.md                # Gemini CLI entry point
├── .roomodes                # Roo Code custom modes
├── docker-compose.yml       # Production orchestration
├── docker-compose.dev.yml   # Development hot-reload overrides
└── .env.example             # Environment variable template
```

## Adding a New Skill

```bash
mkdir .agent/skills/my-skill
cat > .agent/skills/my-skill/SKILL.md << 'SKILL'
---
name: my-skill
description: >
  One sentence explaining what this skill does and when to activate it.
metadata:
  version: "1.0"
---

# My Skill

## Steps
1. Step one
2. Step two

## Rules
1. Rule one
SKILL
```

## License

MIT
