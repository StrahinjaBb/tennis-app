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
  },
  plugins: [
    react({
      jsxRuntime: 'automatic'  // OBAVEZNO za React 18+
    })
  ],
  define: {
    global: 'window', // Add this line
  },
})