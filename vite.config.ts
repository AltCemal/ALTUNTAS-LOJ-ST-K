import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const routes = [
  { path: '/hizmetler', title: 'Taşımacılık Hizmetleri: Parsiyel, Komple Yük, Uluslararası | Altuntaş', description: 'Lojistik hizmetlerimiz: Parsiyel taşımacılık, komple yük, uluslararası nakliye, Türkiye-Avrupa hatları. Samsun\'dan tüm Türkiye\'ye güvenli sevkiyat.' },
  { path: '/hakkimizda', title: 'Hakkımızda | Altuntaş Lojistik', description: 'Samsun\'da uluslararası nakliye ve lojistik hizmetleri. Altuntaş Lojistik, güvenli taşımacılık, deneyimli ekip ve modern filo.' },
  { path: '/iletisim', title: 'İletişim: Samsun Lojistik Teklifi & Operasyon Takibi | Altuntaş', description: 'Altuntaş Lojistik - Samsun. Telefon +905325511574, WhatsApp ile teklif alın. 24/7 operasyon takibi.' },
  { path: '/parsiyel-tasimacilik', title: 'Parsiyel Taşımacılık | Altuntaş Lojistik', description: 'Parsiyel taşımacılık hizmetimiz ile Türkiye ve Avrupa hatlarında ekonomik, düzenli ve güvenli sevkiyat çözümleri sunuyoruz.' },
  { path: '/komple-yuk-tasimaciligi', title: 'Komple Yük Taşımacılığı | Altuntaş Lojistik', description: 'Komple yük taşımacılığı hizmetimizle tek araca özel hızlı çıkış, güvenli taşıma ve zamanında teslimat sağlıyoruz.' },
  { path: '/uluslararasi-karayolu-tasimaciligi', title: 'Uluslararası Karayolu Taşımacılığı | Altuntaş Lojistik', description: 'Uluslararası karayolu taşımacılığı çözümlerimizle Türkiye çıkışlı Avrupa sevkiyatlarınızı planlı, güvenli şekilde yönetiyoruz.' },
  { path: '/turkiye-almanya-lojistik', title: 'Türkiye Almanya Lojistik Hattı | Altuntaş Lojistik', description: 'Türkiye Almanya lojistik hattında parsiyel ve komple yükler için düzenli sefer, operasyon takibi ve hızlı teklif.' },
]

function spaStaticRoutesPlugin() {
  return {
    name: 'spa-static-routes',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const distDir = path.join(process.cwd(), 'dist')
      const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')
      const baseUrl = 'https://www.altuntaslojistik.com'
      for (const route of routes) {
        const e = (s) => s.replace(/&/g, '&amp;')
        const html = indexHtml
          .replace(/<title>[^<]*<\/title>/, `<title>${e(route.title)}</title>`)
          .replace(/(<meta name="title" content=")[^"]*"/, `$1${e(route.title)}"`)
          .replace(/(<meta name="description" content=")[^"]*"/, `$1${e(route.description)}"`)
          .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${e(route.title)}"`)
          .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${e(route.description)}"`)
          .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${baseUrl}${route.path}"`)
          .replace(/(<meta property="twitter:title" content=")[^"]*"/, `$1${e(route.title)}"`)
          .replace(/(<meta property="twitter:description" content=")[^"]*"/, `$1${e(route.description)}"`)
        const routeDir = path.join(distDir, route.path)
        fs.mkdirSync(routeDir, { recursive: true })
        fs.writeFileSync(path.join(routeDir, 'index.html'), html)
        console.log(`[spa-static] ✓ ${route.path}`)
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), spaStaticRoutesPlugin()],
  build: { target: 'esnext', minify: 'esbuild' },
})
