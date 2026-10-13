import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

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

const publicApiProxy = {
  '/api/v1/public': {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    configure: configureProxy
  }
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    proxy: publicApiProxy
  },
  preview: {
    host: '127.0.0.1',
    port: 4174,
    strictPort: true,
    proxy: publicApiProxy
  }
})
