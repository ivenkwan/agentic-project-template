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
The collection combines the template's project skills with a broader library — core
document/office skills, data architecture, and financial analysis / equity research —
all discoverable as flat skill packages under `.agent/skills/`.

**Project skills** (template-specific)

| Skill | Purpose |
|-------|---------|
| `api-scaffold` | Scaffold REST endpoints (FastAPI/NestJS/Go) |
| `code-review` | Structured security and quality review |
| `create-product-requirements-document` | Draft product requirements documents from a brief |
| `data-exploration` | Explore datasets and summarize structure |
| `dataviz` | Create charts and data visualizations |
| `db-migration` | Safe database migrations (Alembic/Prisma/golang-migrate) |
| `docker-setup` | Scaffold Docker services and Dockerfiles |
| `frontend-scaffold` | Scaffold pages and components |
| `tdd-workflow` | Test-driven development across all stacks |

**Core skills** (merged)

| Skill | Purpose |
|-------|---------|
| `docx` | Create, read, and edit Word documents |
| `pdf` | Read, merge, split, rotate, fill forms, and OCR PDFs |
| `pdf-reading` | Extract text, tables, and images from PDFs |
| `pptx` | Create, read, and edit PowerPoint decks |
| `xlsx` | Create, read, and edit Excel spreadsheets |
| `frontend-design` | UI visual design guidance |
| `schedule` | Create and update scheduled tasks |
| `consolidate-memory` | Merge, fix, and prune memory files |
| `explain-usage` | Explain session token usage |
| `setup-cowork` | Guided Cowork setup |

**Data architecture** (merged)

| Skill | Purpose |
|-------|---------|
| `enterprise-data-architect` | Logical/physical data modeling, legacy reverse-engineering, migration, schema review, DB selection |

**Financial analysis** (merged)

| Skill | Purpose |
|-------|---------|
| `3-statement-model` | Fill 3-statement financial model templates |
| `audit-xls` | Audit spreadsheet formulas and model integrity |
| `clean-data-xls` | Clean and normalize spreadsheet data |
| `competitive-analysis` | Competitive landscape decks |
| `comps-analysis` | Comparable company analysis with trading multiples |
| `dcf-model` | DCF valuation models |
| `deck-refresh` | Refresh decks with new numbers |
| `ib-check-deck` | Investment-banking deck quality check |
| `lbo-model` | LBO model templates |
| `ppt-template-creator` | Create reusable PPT template skills |
| `pptx-author` | Headless `.pptx` generation |
| `skill-creator` | Guide for authoring new skills |
| `xlsx-author` | Headless `.xlsx` generation |

**Equity research** (merged)

| Skill | Purpose |
|-------|---------|
| `catalyst-calendar` | Upcoming catalyst calendar |
| `earnings-analysis` | Earnings update reports |
| `earnings-preview` | Pre-earnings scenario analysis |
| `idea-generation` | Stock screening and idea sourcing |
| `initiating-coverage` | Initiation coverage reports |
| `model-update` | Update financial models |
| `morning-note` | Morning meeting notes |
| `sector-overview` | Sector landscape reports |
| `thesis-tracker` | Investment thesis maintenance |

### New Skill Project Template
The repo ships a starter template for building new skills (or whole skill projects) at
`templates/project-template/`. It includes a full clone of the `enterprise-data-architect`
skill as the worked example. See `templates/project-template/README.md` for the walkthrough:
copy the template, rename the skill folder, rewrite the frontmatter and body for your
domain, rebuild `references/`, then validate and package.

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
│   ├── skills/              # SKILL.md skill packages (42 merged skills)
│   └── workflows/           # Slash command workflows
├── templates/
│   └── project-template/    # New-skill starter template (exemplar: enterprise-data-architect)
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
