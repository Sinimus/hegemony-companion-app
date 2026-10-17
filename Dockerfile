FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.28.2 && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q --spider http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
