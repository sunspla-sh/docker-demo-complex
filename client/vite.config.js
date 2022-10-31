import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    hmr: {
      clientPort: 3050, //this is whatever port our docker-compose is using to bind to our NGINX proxy (running on port 80 in a docker container) on our local machine
      path: '/ws'
    }
  }
})
