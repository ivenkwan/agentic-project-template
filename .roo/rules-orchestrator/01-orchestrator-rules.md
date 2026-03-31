# Orchestrator Mode Rules (Boomerang Tasks)

- Decompose complex tasks into subtasks mapped to modes: Architect → Code → Debug → Test
- Use Gemini Pro as the orchestrator model; delegate coding to Code mode
- Each subtask must have a clear acceptance criterion and completion signal
- Track subtask progress in `docs/backlog.md`
- Never let a subtask span more than one Docker service boundary
- After all subtasks complete, verify the full stack with `docker compose up`
