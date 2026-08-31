# Stage 1: Build
FROM oven/bun:1-slim AS build

ARG VITE_KORA_ONBOARD_API_BASE_URL=https://app.kora.mradiafrica.com
ARG VITE_KORA_APP_BASE_URL=https://app.kora.mradiafrica.com
ARG VITE_KORA_PUBLIC_CMS_BASE_URL=https://kora.mradiafrica.com
ARG VITE_KORA_PUBLIC_CMS_SITE_NAME=kora-cms
ARG VITE_KORA_CMS_READ_TOKEN=

ENV VITE_KORA_ONBOARD_API_BASE_URL=${VITE_KORA_ONBOARD_API_BASE_URL}
ENV VITE_KORA_APP_BASE_URL=${VITE_KORA_APP_BASE_URL}
ENV VITE_KORA_PUBLIC_CMS_BASE_URL=${VITE_KORA_PUBLIC_CMS_BASE_URL}
ENV VITE_KORA_PUBLIC_CMS_SITE_NAME=${VITE_KORA_PUBLIC_CMS_SITE_NAME}
ENV VITE_KORA_CMS_READ_TOKEN=${VITE_KORA_CMS_READ_TOKEN}

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
