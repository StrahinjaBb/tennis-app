import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',  // Za Render static deploy
  server: {
    proxy: {
      '/api': {
        target: 'https://tennis-app-qh39.onrender.com',
        changeOrigin: true
      }
    }
  }
})