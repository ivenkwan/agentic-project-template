FROM node:22-alpine AS builder
WORKDIR /app
COPY apps/frontend-vite-react/package*.json ./
RUN npm ci
COPY apps/frontend-vite-react/ .
RUN npm run build

FROM nginx:1.25-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY apps/frontend-vite-react/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:80/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
