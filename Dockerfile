FROM oven/bun:1-slim

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Tiny Bun static server with SPA fallback
COPY <<'EOF' /app/serve.ts
const dist = "./dist";
const index = Bun.file(`${dist}/index.html`);
Bun.serve({
  port: 80,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const file = Bun.file(`${dist}${path}`);
    const exists = await file.exists();
    if (exists) return new Response(file);
    return new Response(index);
  },
});
EOF

EXPOSE 80
CMD ["bun", "run", "/app/serve.ts"]
