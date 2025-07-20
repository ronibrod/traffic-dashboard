import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9921/traffic-dashboard-4c727/us-central1',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
