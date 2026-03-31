---
name: db-migration
description: >
  Create and run database migrations safely. Use when adding/modifying tables,
  columns, or indexes in PostgreSQL. Covers Alembic (FastAPI), Prisma (T3/NestJS),
  and raw SQL migration files.
metadata:
  version: "1.0"
  author: agentic-project-template
---

# DB Migration Skill

## Rules (ALWAYS follow)
1. Never modify the database schema directly — always create a migration file
2. Migrations must be reversible (include downgrade/revert steps)
3. Test migrations on a fresh DB before committing
4. Back up production data before running migrations

## Alembic (FastAPI — Stack 1)

```bash
# Create migration
docker compose exec backend-fastapi alembic revision --autogenerate -m "add_users_table"

# Apply migration
docker compose exec backend-fastapi alembic upgrade head

# Rollback one step
docker compose exec backend-fastapi alembic downgrade -1
```

## Prisma (T3 — Stack 2 / NestJS — Stack 4)

```bash
# After editing prisma/schema.prisma:
docker compose exec backend-nestjs npx prisma migrate dev --name add_users_table

# Apply in production
docker compose exec backend-nestjs npx prisma migrate deploy

# Reset dev DB
docker compose exec backend-nestjs npx prisma migrate reset
```

## Raw SQL (Go — Stack 3)

```bash
# Create migration file
touch apps/backend-go/migrations/001_create_users.up.sql
touch apps/backend-go/migrations/001_create_users.down.sql

# Apply with golang-migrate
docker compose exec backend-go migrate -path /migrations -database $DATABASE_URL up
```

## Schema Change Checklist
- [ ] Created migration file
- [ ] Updated shared-types if API contract changes
- [ ] Updated Pydantic/Zod schemas if applicable
- [ ] Ran migration on dev DB successfully
- [ ] Verified rollback works
- [ ] Updated `docs/database.md`
