import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const vitePrerender = require('vite-plugin-prerender')
const JSDOMRenderer = require('@prerenderer/renderer-jsdom')

export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: [
        '/',
        '/hizmetler',
        '/hakkimizda',
        '/iletisim',
        '/parsiyel-tasimacilik',
        '/komple-yuk-tasimaciligi',
        '/uluslararasi-karayolu-tasimaciligi',
        '/turkiye-almanya-lojistik',
      ],
      renderer: new JSDOMRenderer(),
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
})
