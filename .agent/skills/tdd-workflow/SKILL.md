---
name: tdd-workflow
description: >
  Test-Driven Development workflow for any service in this monorepo.
  Use when implementing a new feature, fixing a bug, or adding an API endpoint.
  Covers TypeScript (Jest/Vitest), Python (pytest), and Go (testing package).
metadata:
  version: "1.0"
  author: agentic-project-template
---

# TDD Workflow Skill

**Compatibility:** Node.js 22+, Python 3.13+, Go 1.22+

## TDD Cycle: Red → Green → Refactor

### Step 1: Write a Failing Test (Red)
Write the test BEFORE the implementation file exists.

**TypeScript (Vitest):**
```typescript
// apps/backend-nestjs/src/users/users.service.spec.ts
import { UsersService } from './users.service';
describe('UsersService', () => {
  it('should return a user by id', async () => {
    const service = new UsersService();
    const user = await service.findById('123');
    expect(user).toHaveProperty('id', '123');
  });
});
```

**Python (pytest):**
```python
# apps/backend-fastapi/tests/test_users.py
from httpx import AsyncClient
import pytest

@pytest.mark.asyncio
async def test_get_user(client: AsyncClient):
    response = await client.get("/api/v1/users/123")
    assert response.status_code == 200
    assert response.json()["id"] == "123"
```

**Go:**
```go
// apps/backend-go/internal/users/users_test.go
func TestGetUser(t *testing.T) {
    svc := NewUsersService()
    user, err := svc.GetByID("123")
    if err != nil { t.Fatal(err) }
    if user.ID != "123" { t.Errorf("expected 123, got %s", user.ID) }
}
```

### Step 2: Implement (Green)
Write the minimum code to make the test pass.

### Step 3: Refactor
Clean up duplication, improve naming, ensure all tests still pass.

## Running Tests in Docker

```bash
docker compose exec backend-fastapi pytest --tb=short
docker compose exec backend-nestjs npm run test
docker compose exec backend-go go test ./...
```

## Rules
1. Never modify a test to make it pass — fix the implementation
2. Co-locate tests with source files
3. Test file naming: `*.spec.ts`, `*_test.go`, `test_*.py`
4. All tests must pass before committing
