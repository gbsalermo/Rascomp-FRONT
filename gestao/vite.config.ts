import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

type ProxyRequest = {
  removeHeader(name: string): void
}

type ProxyServerWithEvents = {
  on(event: 'proxyReq', handler: (proxyReq: ProxyRequest) => void): void
}

function configureProxy(proxy: unknown) {
  const proxyWithEvents = proxy as ProxyServerWithEvents
  proxyWithEvents.on('proxyReq', (proxyReq) => {
    proxyReq.removeHeader('origin')
  })
}

const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    configure: configureProxy
  }
}

export default defineConfig({
  plugins: [vue()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: apiProxy
  },

  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    proxy: apiProxy
  }
})
