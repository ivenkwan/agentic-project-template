---
trigger: slash_command
command: /commit
---

# /commit — Conventional Commit Message Generator

Generate a Conventional Commits message for staged changes.

## Steps
1. Run `git diff --staged --stat` to see changed files
2. Determine the commit type:
   - `feat:` — new feature
   - `fix:` — bug fix
   - `chore:` — tooling, deps, config
   - `docs:` — documentation only
   - `refactor:` — code restructure, no behavior change
   - `test:` — tests only
   - `docker:` — Dockerfile or compose changes
3. Write the commit message in the format:
   `<type>(<scope>): <short description>`
   e.g. `feat(backend-fastapi): add users CRUD endpoint`

## Rules
- Max 72 characters for the subject line
- Use imperative mood ("add" not "added")
- Reference issue numbers if applicable: `feat(ui): add login page (#42)`
