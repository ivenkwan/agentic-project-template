---
name: api-scaffold
description: >
  Scaffold a complete REST API endpoint (route, controller, service, schema/model, tests)
  for any backend in this monorepo. Use when adding a new resource endpoint to
  FastAPI, NestJS, or Go/Gin backends. Follows the /api/v1/ convention.
metadata:
  version: "1.0"
  author: agentic-project-template
---

# API Scaffold Skill

## Workflow

1. Define the resource name and HTTP methods (GET, POST, PUT, DELETE)
2. Create the Pydantic/Zod/Go struct schema in `shared-types` if cross-stack
3. Scaffold files following the layered pattern below
4. Write tests (activate `tdd-workflow` skill)
5. Register the route in the app's router/module file

## FastAPI Structure (Stack 1)

```
apps/backend-fastapi/app/
├── api/v1/
│   └── {resource}.py       # Router + endpoints
├── schemas/
│   └── {resource}.py       # Pydantic request/response models
├── services/
│   └── {resource}_service.py
└── models/
    └── {resource}.py       # SQLAlchemy ORM model
```

**Endpoint template:**
```python
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.{resource} import {Resource}Create, {Resource}Response
from app.services.{resource}_service import {Resource}Service

router = APIRouter(prefix="/api/v1/{resources}", tags=["{resources}"])

@router.post("/", response_model={Resource}Response, status_code=201)
async def create_{resource}(payload: {Resource}Create, svc: {Resource}Service = Depends()):
    return await svc.create(payload)
```

## NestJS Structure (Stack 4)

```
apps/backend-nestjs/src/{resource}/
├── {resource}.controller.ts
├── {resource}.service.ts
├── {resource}.module.ts
├── dto/
│   ├── create-{resource}.dto.ts
│   └── update-{resource}.dto.ts
└── {resource}.controller.spec.ts
```

## Go/Gin Structure (Stack 3)

```
apps/backend-go/internal/{resource}/
├── handler.go    # HTTP handlers
├── service.go    # Business logic
├── repository.go # DB access
├── model.go      # Struct definitions
└── handler_test.go
```

## Rules
1. All routes must be prefixed `/api/v1/`
2. Always validate request bodies (Pydantic / class-validator / Go binding)
3. Return standardized error responses: `{ "error": "message", "code": 400 }`
4. Add the new route to the OpenAPI/Swagger doc
