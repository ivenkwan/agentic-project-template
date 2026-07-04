# Graph Report - .  (2026-06-27)

## Corpus Check
- Corpus is ~24,378 words - fits in a single context window. You may not need a graph.

## Summary
- 139 nodes · 132 edges · 30 communities (14 shown, 16 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Project Template & Agent Modes|Project Template & Agent Modes]]
- [[_COMMUNITY_Stack Architecture & Backends|Stack Architecture & Backends]]
- [[_COMMUNITY_Security & Governance|Security & Governance]]
- [[_COMMUNITY_Data Visualization & Exploration|Data Visualization & Exploration]]
- [[_COMMUNITY_Package Configuration|Package Configuration]]
- [[_COMMUNITY_Agent Skills & Migration Tools|Agent Skills & Migration Tools]]
- [[_COMMUNITY_NestJS Backend Module|NestJS Backend Module]]
- [[_COMMUNITY_Docker & CICD|Docker & CI/CD]]
- [[_COMMUNITY_Coding Principles & Commits|Coding Principles & Commits]]
- [[_COMMUNITY_Shared TypeScript Interfaces|Shared TypeScript Interfaces]]
- [[_COMMUNITY_NestJS + Vite Stack|NestJS + Vite Stack]]
- [[_COMMUNITY_NestJS Module Wiring|NestJS Module Wiring]]
- [[_COMMUNITY_FastAPI CORS Setup|FastAPI CORS Setup]]
- [[_COMMUNITY_PRD Skill|PRD Skill]]
- [[_COMMUNITY_Env Template|Env Template]]
- [[_COMMUNITY_Go Dependencies|Go Dependencies]]
- [[_COMMUNITY_Go Gin Router|Go Gin Router]]
- [[_COMMUNITY_NestJS HealthController|NestJS HealthController]]
- [[_COMMUNITY_NestJS AppModule|NestJS AppModule]]
- [[_COMMUNITY_NestJS ValidationPipe|NestJS ValidationPipe]]
- [[_COMMUNITY_Package Config|Package Config]]
- [[_COMMUNITY_Go Module Path|Go Module Path]]
- [[_COMMUNITY_Vite React App|Vite React App]]
- [[_COMMUNITY_Shared Utils|Shared Utils]]
- [[_COMMUNITY_SvelteKit Component|SvelteKit Component]]
- [[_COMMUNITY_UI Components|UI Components]]

## God Nodes (most connected - your core abstractions)
1. `Agentic Coding Project Template` - 10 edges
2. `Agent Skills Framework` - 8 edges
3. `scripts` - 7 edges
4. `Roo Code Custom Modes` - 7 edges
5. `PostgreSQL Database` - 6 edges
6. `Docker Compose Orchestration` - 6 edges
7. `Editorial Data Visualization Standards` - 6 edges
8. `All 4 Stack Configurations` - 6 edges
9. `Skill: Code Review` - 5 edges
10. `Security Policy (ISO 27001-aligned)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Agentic Coding Project Template` --references--> `Shared Types Package (TypeScript)`  [EXTRACTED]
  README.md → packages/shared-types/src/index.ts
- `PostgreSQL Init Script` --implements--> `PostgreSQL Database`  [EXTRACTED]
  infra/postgres/init.sql → docker-compose.yml
- `GitHub CI/CD Pipeline` --conceptually_related_to--> `Docker Compose Orchestration`  [INFERRED]
  .github/workflows/docker-publish.yml → docker-compose.yml
- `FastAPI /api/v1/ Root Endpoint` --implements--> `/api/v1/ Route Convention`  [EXTRACTED]
  apps/backend-fastapi/app/main.py → AGENTS.md
- `Go /api/v1/ Root Endpoint` --implements--> `/api/v1/ Route Convention`  [EXTRACTED]
  apps/backend-go/cmd/server/main.go → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Four Full-Stack Configurations** — stack1, stack2, stack3, stack4 [EXTRACTED 1.00]
- **Roo Code Agent Modes** — orchestrator_mode, architect_mode, coder_mode, debug_mode, devops_mode, skill_creator_mode [EXTRACTED 1.00]
- **Shared Infrastructure Services** — postgresql_database, redis_cache, nginx_proxy [EXTRACTED 1.00]
- **DataViz Reference Standards** — chart_standards, map_standards, interaction_accessibility, dataviz_format_templates, dataviz_output_contract [EXTRACTED 1.00]
- **Agent Slash Command Workflows** — workflow_plan, workflow_commit, workflow_review [EXTRACTED 1.00]
- **Governance & Security Frameworks** — iso_27001, iso_38505, owasp_top10 [EXTRACTED 1.00]
- **All Backend Implementations** — fastapi_backend, nestjs_backend, go_backend [EXTRACTED 1.00]
- **Database Migration Tools** — alembic_migrations, prisma_migrations, golang_migrate [EXTRACTED 1.00]

## Communities (30 total, 16 thin omitted)

### Community 0 - "Project Template & Agent Modes"
Cohesion: 0.11
Nodes (22): Agentic Coding Project Template, /api/v1/ Route Convention, Mode: Stack Architect, Architecture Documentation, Boomerang Task Decomposition, Mode: Stack Coder, Mode: Debug, Mode: DevOps (+14 more)

### Community 1 - "Stack Architecture & Backends"
Cohesion: 0.15
Nodes (17): All 4 Stack Configurations, Docker Compose Orchestration, FastAPI Backend (Python), FastAPI /health Endpoint, FastAPI Python Dependencies, Go/Gin Backend, Go /health Endpoint, /health Endpoint Convention (+9 more)

### Community 2 - "Security & Governance"
Cohesion: 0.18
Nodes (12): Agentic AI Governance Policy, Coding Standards Rules (Always On), Four-Eyes Peer Review Policy, ISO 27001:2022 Compliance, ISO 38505-1:2022 Data Governance, AI Governance: 6 Control Domains, OWASP Input Validation Requirement, OWASP Top 10 Standards (+4 more)

### Community 3 - "Data Visualization & Exploration"
Cohesion: 0.17
Nodes (12): Chart Standards Reference, Data Exploration Methodology, Data Profiling: Structural Understanding Phase, DataViz Format Templates, DataViz Hard Gates: ONE hero visual carries the story, DataViz Output Contract, DataViz Reference Material Collection, Editorial Data Visualization Standards (+4 more)

### Community 4 - "Package Configuration"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev:stack1, dev:stack3, dev:stack4, down (+3 more)

### Community 5 - "Agent Skills & Migration Tools"
Cohesion: 0.20
Nodes (11): Agent Skills Framework, Alembic DB Migrations (FastAPI), Coding Agent Controls, golang-migrate (Go), Local LLM Deployment Controls, Prisma DB Migrations (NestJS), Skill: API Scaffold, Skill: DB Migration (+3 more)

### Community 7 - "Docker & CI/CD"
Cohesion: 0.40
Nodes (6): Docker Dev Hot-Reload Overrides, Docker Rules (Always On), GitHub CI/CD Pipeline, Docker Healthcheck Convention, Multi-stage Docker Builds, Skill: Docker Setup

### Community 8 - "Coding Principles & Commits"
Cohesion: 0.40
Nodes (5): Torro Agentic Coding Principles, Conventional Commits Standard, Layered Architecture Pattern, Radical Simplicity & Human Readability, Workflow: /commit - Conventional Commit

### Community 9 - "Shared TypeScript Interfaces"
Cohesion: 0.40
Nodes (4): ApiError, ApiResponse, PaginatedResponse, User

### Community 10 - "NestJS + Vite Stack"
Cohesion: 0.50
Nodes (4): NestJS Backend (TypeScript), Stack 4: Vite/React + NestJS, NestJS Whitelist Validation, Vite + React Frontend (Stack 4)

## Knowledge Gaps
- **72 isolated node(s):** `github.com/your-org/agentic-project-template/backend-go`, `name`, `version`, `private`, `workspaces` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Agentic Coding Project Template` connect `Project Template & Agent Modes` to `Coding Principles & Commits`, `Stack Architecture & Backends`, `Security & Governance`, `Agent Skills & Migration Tools`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **Why does `Agent Skills Framework` connect `Agent Skills & Migration Tools` to `Project Template & Agent Modes`, `Security & Governance`, `Docker & CI/CD`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `Docker Compose Orchestration` connect `Stack Architecture & Backends` to `Project Template & Agent Modes`, `Docker & CI/CD`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **What connects `github.com/your-org/agentic-project-template/backend-go`, `name`, `version` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Project Template & Agent Modes` be split into smaller, more focused modules?**
  _Cohesion score 0.10822510822510822 - nodes in this community are weakly interconnected._
- **Should `Stack Architecture & Backends` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._