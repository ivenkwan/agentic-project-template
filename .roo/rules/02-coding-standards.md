# Coding Standards (Always On)

- TypeScript: strict mode enabled, no `any` types without comment justification
- Python: type hints required, use Pydantic models for all API contracts
- Go: run gofmt before any commit, use Go modules
- All API routes prefixed with `/api/v1/`
- Environment variables: loaded from `.env`, never hardcoded
- Tests: write tests before implementation (TDD)
