FROM golang:1.22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git
COPY apps/backend-go/go.mod apps/backend-go/go.sum ./
RUN go mod download
COPY apps/backend-go/ .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server ./cmd/server

FROM alpine:3.19 AS runner
RUN apk add --no-cache ca-certificates wget
WORKDIR /app
COPY --from=builder /app/server .
COPY --from=builder /app/migrations ./migrations
RUN adduser -D appuser && chown -R appuser /app
USER appuser
EXPOSE 8002
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:8002/health || exit 1
CMD ["./server"]
