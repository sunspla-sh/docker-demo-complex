import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    hmr: {
      clientPort: 3050, //this is whatever port our NGINX proxy is using on our local machine
      path: '/ws'
    }
  }
})
