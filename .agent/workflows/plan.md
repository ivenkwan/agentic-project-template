---
trigger: slash_command
command: /plan
---

# /plan — Planning Workflow (No Implementation)

When the user runs `/plan <task>`, produce a structured implementation plan WITHOUT writing any code.

## Output Format

```
## Plan: <task name>

### Affected Services
- [ ] <service name> — <what changes>

### Files to Create
- `path/to/new/file.ts` — <purpose>

### Files to Modify
- `path/to/existing/file.py` — <what changes>

### Skills to Activate
- `docker-setup` — if new service
- `tdd-workflow` — for all implementations
- `api-scaffold` — if new endpoint
- `db-migration` — if schema changes

### Step-by-Step Subtasks
1. [Architect] Design API contract and DB schema
2. [Code] Implement backend service + tests
3. [Code] Implement frontend page/component
4. [DevOps] Update Docker config if needed
5. [Debug] Verify full stack with docker compose up

### Estimated Docker Impact
- New containers: <yes/no>
- Port changes: <yes/no>
- Migration required: <yes/no>

### ⚠️ Approval Required Before Proceeding
```
