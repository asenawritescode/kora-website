import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Dev only: KORA_DEV_CLOUD_URL=http://localhost:18081 proxies the catalog (set VITE_KORA_CLOUD_CATALOG_BASE_URL= empty).
const devCloud = process.env.KORA_DEV_CLOUD_URL

export default defineConfig({
  server: devCloud ? { proxy: { '/api/public/catalog': devCloud } } : undefined,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
