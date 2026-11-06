import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import type { Plugin } from 'vite'
import { seoHead } from './scripts/seo-head'

// Regression guard: fail the build when a single JS chunk grows past the budget,
// so a heavy dependency cannot silently land back in the entry chunk.
// Largest chunk today is vendor-react at about 190 kB minified (60 kB gzip).
const CHUNK_BUDGET_BYTES = 200_000

function chunkBudget(): Plugin {
  return {
    name: 'chunk-budget',
    apply: 'build',
    generateBundle(_options, bundle) {
      const over = Object.values(bundle).flatMap((file) => {
        const size = file.type === 'chunk' ? Buffer.byteLength(file.code) : 0
        return size > CHUNK_BUDGET_BYTES ? [`${file.fileName} is ${(size / 1000).toFixed(1)} kB`] : []
      })
      if (over.length > 0) {
        this.error(`JS chunk budget of ${CHUNK_BUDGET_BYTES / 1000} kB (minified) exceeded: ${over.join('; ')}. Lazy-load the dependency or raise the budget deliberately.`)
      }
    },
  }
}

// Dev only: KORA_DEV_CLOUD_URL=http://localhost:18081 proxies the catalog (set VITE_KORA_CLOUD_CATALOG_BASE_URL= empty).
const devCloud = process.env.KORA_DEV_CLOUD_URL

export default defineConfig({
  server: devCloud ? { proxy: { '/api/public/catalog': devCloud } } : undefined,
  plugins: [react(), tailwindcss(), seoHead(), chunkBudget()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // Stable, rarely-changing vendor code gets its own long-cached chunks.
            { name: 'vendor-icons', test: /node_modules[\\/]lucide-react[\\/]/, priority: 10 },
            { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 20 },
          ],
        },
      },
    },
  },
})
