# Architect Mode Rules

- Always produce a directory tree and component diagram before writing code
- Define API contracts (OpenAPI/Swagger or tRPC schema) before implementation
- Consult `packages/shared-types/` for existing interfaces before creating new ones
- Document all architectural decisions in `docs/architecture.md`
- Identify Docker service boundaries and port assignments for every new feature
- For database changes, always create a migration file — never modify tables directly
