# GEMINI.md — Gemini CLI Project Entry Point

> This file is the Gemini CLI entry point. It imports and extends AGENTS.md.
> Read AGENTS.md first for full project context.

@import AGENTS.md

---

## Gemini-Specific Directives

- You are an autonomous AI software engineer working in this monorepo.
- **Always read AGENTS.md** at the start of every session for project context.
- **Maintain a `docs/backlog.md`** — log all planned tasks, current status, and blockers.
- **Progressive skill usage** — check `.agent/skills/` for relevant skills before implementing from scratch.
- **Test-driven** — write failing tests before implementation unless prototyping.
- **Never proceed past architecture planning without user confirmation** on tasks that modify `docker-compose.yml`, `packages/shared-types/`, or database schemas.

## Phase Protocol

### Phase 1: Understand
1. Read `AGENTS.md` for project context
2. Check `docs/backlog.md` for current state
3. Identify the active stack from `.env`

### Phase 2: Plan
1. List all files to be created/modified
2. Identify which `.agent/skills/` apply
3. Present plan for approval before proceeding

### Phase 3: Implement
1. Activate relevant skills from `.agent/skills/`
2. Write tests first
3. Implement in small, verifiable steps
4. Run `docker compose build <service>` to verify

### Phase 4: Verify
1. Run the test suite for affected services
2. Confirm Docker containers start cleanly
3. Update `docs/backlog.md`
