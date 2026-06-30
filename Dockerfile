# Stage 1: Build
FROM oven/bun:1-slim AS build

ARG VITE_KORA_ONBOARD_API_BASE_URL=https://app.kora.mradiafrica.com
ARG VITE_KORA_APP_BASE_URL=https://app.kora.mradiafrica.com

ENV VITE_KORA_ONBOARD_API_BASE_URL=${VITE_KORA_ONBOARD_API_BASE_URL}
ENV VITE_KORA_APP_BASE_URL=${VITE_KORA_APP_BASE_URL}

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
