FROM python:3.13-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir uv
COPY apps/backend-fastapi/requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

FROM python:3.13-slim AS runner
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY apps/backend-fastapi/app ./app
COPY apps/backend-fastapi/alembic ./alembic
COPY apps/backend-fastapi/alembic.ini .
RUN adduser --system --no-create-home appuser && chown -R appuser /app
USER appuser
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
