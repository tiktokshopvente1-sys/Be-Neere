import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/chat': 'http://localhost:8000',
      '/translate': 'http://localhost:8000',
      '/quiz': 'http://localhost:8000',
      '/grammar': 'http://localhost:8000',
      '/voice': 'http://localhost:8000',
      '/audio': 'http://localhost:8000',
      '/languages': 'http://localhost:8000',
    }
  }
})
