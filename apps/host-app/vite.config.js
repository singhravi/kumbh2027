import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_app',
      remotes: {
        map_mfe: `http://localhost:5001/assets/remoteEntry.js?t=${Date.now()}`,
      },
      shared: ['react', 'react-dom']
    })
  ],
  server: {
    port: 5005,
    strictPort: true,
    allowedHosts: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
