# Debug Mode Rules

- Check Docker container logs first: `docker compose logs <service> --tail=50`
- Isolate issues to a single container before cross-service debugging
- Write regression tests for every bug fixed
- Log debug findings to `docs/debug-log.md` with timestamps
- Never remove existing tests to fix a failing build
