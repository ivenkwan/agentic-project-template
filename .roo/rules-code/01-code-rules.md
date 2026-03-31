# Code Mode Rules

- Refer to `AGENTS.md` for stack conventions before generating any code
- Match existing patterns in the codebase — do not introduce new patterns without Architect approval
- For Python: use async/await for all FastAPI endpoints
- For TypeScript: use `zod` for runtime validation at API boundaries
- For Go: use structured error returns (`value, error` pattern)
- Always co-locate test files with source files
- After creating files, verify they can be imported/compiled without errors
