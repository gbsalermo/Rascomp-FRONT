import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

type ProxyRequest = {
  removeHeader(name: string): void
}

type ProxyServerWithEvents = {
  on(event: 'proxyReq', handler: (proxyReq: ProxyRequest) => void): void
}

export default defineConfig({
  plugins: [vue()],

  server: {
    host: '0.0.0.0',
    port: 5173,

    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,

        configure: (proxy) => {
          const proxyWithEvents = proxy as unknown as ProxyServerWithEvents
          proxyWithEvents.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin')
          })
        }
      }
    }
  }
})
