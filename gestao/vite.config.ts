import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFile } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

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

// Serve only the ALREADY PUBLIC hero assets from the sibling Landing project for local CMS previews.
// The route exists exclusively in Vite dev mode; it is not deployed to Workers.
const landingPublicMediaRoot = fileURLToPath(new URL('../landing-page/public/media/assets/', import.meta.url))
function localLandingMediaPreview(): Plugin {
  const prefix = '/__rascomp_landing_media/'
  const mediaType: Record<string,string> = { '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.avif':'image/avif' }
  return {
    name: 'rascomp-local-landing-media-preview',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req,res,next) => {
        const url = req.url?.split('?')[0] || ''
        if (!url.startsWith(prefix)) return next()
        if (req.method !== 'GET' && req.method !== 'HEAD') {res.writeHead(405).end();return}
        let relative:string
        try {relative=decodeURIComponent(url.slice(prefix.length))}catch {res.writeHead(400).end();return}
        const target = resolve(landingPublicMediaRoot,relative)
        const base = resolve(landingPublicMediaRoot)
        const extension=extname(target).toLowerCase()
        if (!target.startsWith(base+sep) || !mediaType[extension]) {res.writeHead(403).end();return}
        try {
          const data=await readFile(target)
          res.setHeader('Content-Type',mediaType[extension])
          res.setHeader('Cache-Control','no-store')
          res.writeHead(200)
          res.end(req.method==='HEAD'?undefined:data)
        } catch {res.writeHead(404).end()}
      })
    }
  }
}
export default defineConfig({
  plugins: [vue(), localLandingMediaPreview()],

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
