---
name: code-review
description: >
  Perform a structured code review on staged or specified files.
  Use when reviewing PRs, auditing new features, or checking code before commit.
  Covers security, performance, style, and Docker compatibility.
metadata:
  version: "1.0"
  author: agentic-project-template
---

# Code Review Skill

## Review Checklist

### Security
- [ ] No secrets or credentials hardcoded in source files
- [ ] All user inputs validated (Pydantic / Zod / Go binding)
- [ ] SQL queries use parameterized statements (no string interpolation)
- [ ] Dependencies have no known critical CVEs (`npm audit`, `safety check`, `govulncheck`)

### Performance
- [ ] Database queries use indexes where appropriate
- [ ] No N+1 query patterns in ORM code
- [ ] Async patterns used correctly (no blocking calls in async context)
- [ ] Docker images use multi-stage builds and minimal layers

### Code Style
- [ ] Matches conventions in AGENTS.md
- [ ] No `any` types in TypeScript without justification
- [ ] Functions have single responsibility
- [ ] Error handling is explicit and consistent

### Tests
- [ ] New code has corresponding tests
- [ ] Tests are independent and deterministic
- [ ] Edge cases covered (empty input, invalid input, auth errors)

### Docker Compatibility
- [ ] Service builds successfully: `docker compose build <service>`
- [ ] Health check endpoint responds correctly
- [ ] Environment variables match `.env.example`

## Review Output Format

```
## Code Review: <file or feature>

### ✅ Approved
- <what is good>

### ⚠️ Suggestions
- <line X>: <suggestion>

### ❌ Must Fix
- <line X>: <critical issue>

### Verdict: APPROVE / REQUEST CHANGES
```
