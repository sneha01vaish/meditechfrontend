import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/upload_pdfs': 'https://unique-wisdom-production-a6d8.up.railway.app',
      '/ask':         'https://unique-wisdom-production-a6d8.up.railway.app',
    }
  }
})
