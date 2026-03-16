import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // When running `vercel dev`, Vercel runs on port 3000 and handles /api routes.
      // For `npm run dev` with Vite only, we proxy /api to the vercel dev server.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})


