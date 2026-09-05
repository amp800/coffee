import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // In local development, run `npm run pages:dev` in a second terminal so the
    // API (Pages Functions + local D1) is available on port 8788.
    proxy: {
      '/api': 'http://localhost:8788',
    },
  },
})
