# Stage 1: Build
FROM oven/bun:1-slim AS build

# Cloud's portal: sign-in for people who come back, and the fallback when the site cannot finish onboarding itself.
ARG VITE_KORA_CLOUD_SIGNUP_URL=https://cloud.kora.mradiafrica.com/signup
# Cloud's API: the catalog, and the signup that the site calls itself.
ARG VITE_KORA_CLOUD_CATALOG_BASE_URL=https://cloud.kora.mradiafrica.com
# Where the workspace app (Studio) lives. The site finishes onboarding itself (account, workspace, verified link, open
# the workspace) only when this is set at build time; empty, it sends people to Cloud's portal instead. Vite reads it
# during the build, so it must be declared here to reach the build: a runtime environment variable cannot.
ARG VITE_KORA_APP_BASE_URL=https://app.kora.mradiafrica.com

ENV VITE_KORA_CLOUD_SIGNUP_URL=${VITE_KORA_CLOUD_SIGNUP_URL}
ENV VITE_KORA_CLOUD_CATALOG_BASE_URL=${VITE_KORA_CLOUD_CATALOG_BASE_URL}
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
