# Docker Rules (Always On)

- All services use multi-stage builds (builder → runner)
- Base images: `node:22-alpine`, `python:3.13-slim`, `golang:1.22-alpine`
- Every service must define `healthcheck` in docker-compose.yml
- Use `depends_on` with `condition: service_healthy` for service dependencies
- Never use `latest` tag for base images — pin to a specific version
- Volumes for development hot-reload must be in `docker-compose.dev.yml` only
