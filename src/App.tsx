import { FaPhone, FaWhatsapp, FaInstagram, FaBars, FaTimes } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from './i18n'
import NotFound from './components/NotFound'

// Doğrudan (Eager) Import - Küçük projelerde en yüksek performansı bu sağlar
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import ServiceLandingSection from './components/ServiceLandingSection'

function App() {
  const { t, lang, setLang } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [renderDeferredHomeSections, setRenderDeferredHomeSections] = useState(false)
  
  const location = useLocation()
  const pathname = location.pathname
  
  const isHome = pathname === '/'
  const isServices = pathname === '/hizmetler'
  const isAbout = pathname === '/hakkimizda'
  const isContact = pathname === '/iletisim'
  const isPartialTransport = pathname === '/parsiyel-tasimacilik'
  const isFullLoadTransport = pathname === '/komple-yuk-tasimaciligi'
  const isInternationalRoadTransport = pathname === '/uluslararasi-karayolu-tasimaciligi'
  const isTurkeyGermanyLogistics = pathname === '/turkiye-almanya-lojistik'
  const isServiceLandingPage = isPartialTransport || isFullLoadTransport || isInternationalRoadTransport || isTurkeyGermanyLogistics
  const isNotFound = !isHome && !isServices && !isAbout && !isContact && !isServiceLandingPage

  const currentServicePageKey = isPartialTransport
    ? 'partial'
    : isFullLoadTransport
      ? 'full'
      : isInternationalRoadTransport
        ? 'international'
        : isTurkeyGermanyLogistics
          ? 'germany'
          : null

  // Dynamic SEO Injector Effect
  useEffect(() => {
    const seoPrefix = isServices ? 'seo.services' : isAbout ? 'seo.about' : isContact ? 'seo.contact' : isPartialTransport ? 'seo.partial' : isFullLoadTransport ? 'seo.full' : isInternationalRoadTransport ? 'seo.international' : isTurkeyGermanyLogistics ? 'seo.germany' : isNotFound ? 'seo.notfound' : 'seo.home'
    const title = t(`${seoPrefix}.title`)
    document.title = title

    const titleTag = document.querySelector('meta[name="title"]')
    if (titleTag) titleTag.setAttribute('content', title)

    const description = t(`${seoPrefix}.description`)
    const descriptionTag = document.querySelector('meta[name="description"]')
    if (descriptionTag) descriptionTag.setAttribute('content', description)

    let robotsTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
    if (!robotsTag) {
      robotsTag = document.createElement('meta')
      robotsTag.setAttribute('name', 'robots')
      document.head.appendChild(robotsTag)
    }
    robotsTag.setAttribute('content', isNotFound ? 'noindex, follow' : 'index, follow')

    const tags = [
      { sel: 'meta[property="og:title"]', val: title },
      { sel: 'meta[property="og:description"]', val: description },
      { sel: 'meta[property="twitter:title"]', val: title },
      { sel: 'meta[property="twitter:description"]', val: description }
    ]
    tags.forEach(t => {
      const el = document.querySelector(t.sel)
      if (el) el.setAttribute('content', t.val)
    })

    const baseUrl = 'https://www.altuntaslojistik.com'
    const canonicalUrl = `${baseUrl}${pathname}?lang=${lang}`
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)
  }, [isServices, isAbout, isContact, isPartialTransport, isFullLoadTransport, isInternationalRoadTransport, isTurkeyGermanyLogistics, isNotFound, lang, pathname, t])

  // Deferred loading strategy for home animations
  useEffect(() => {
    if (!isHome) {
      setRenderDeferredHomeSections(false)
      return
    }
    const timerId = window.setTimeout(() => setRenderDeferredHomeSections(true), 350)
    return () => window.clearTimeout(timerId)
  }, [isHome])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50" role="banner">
        <nav className="container mx-auto px-4 py-4" aria-label={t('nav.home')}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <picture>
                <source srcSet="/logo.webp" type="image/webp" />
                <img src="/logo.png" alt="Altuntaş Lojistik Logo" width="64" height="64" decoding="async" className="h-12 md:h-16 w-auto" />
              </picture>
              <div className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap hidden sm:block">{t('brand.name')}</div>
            </div>
            
            <div className="hidden lg:flex space-x-6 flex-1 justify-center">
              <Link to="/" className="text-gray-700 hover:text-primary transition">{t('nav.home')}</Link>
              <Link to="/hizmetler" className="text-gray-700 hover:text-primary transition">{t('nav.services')}</Link>
              <Link to="/hakkimizda" className="text-gray-700 hover:text-primary transition">{t('nav.about')}</Link>
              <Link to="/iletisim" className="text-gray-700 hover:text-primary transition">{t('nav.contact')}</Link>
            </div>
            
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button onClick={() => setLang('tr')} className={`px-3 py-2 text-sm ${lang === 'tr' ? 'bg-primary text-white' : 'text-gray-700'}`}>TR</button>
                <button onClick={() => setLang('en')} className={`px-3 py-2 text-sm ${lang === 'en' ? 'bg-primary text-white' : 'text-gray-700'}`}>EN</button>
                <button onClick={() => setLang('de')} className={`px-3 py-2 text-sm ${lang === 'de' ? 'bg-primary text-white' : 'text-gray-700'}`}>DE</button>
              </div>
              <Link to="/iletisim" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition">{t('nav.quote')}</Link>
              <a href="https://wa.me/905325511574" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition" aria-label="WhatsApp"><FaWhatsapp className="text-2xl" /></a>
              <a href="https://www.instagram.com/altuntaslojistik" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition" aria-label="Instagram"><FaInstagram className="text-2xl" /></a>
              
              <div className="hidden xl:flex items-center space-x-2">
                <a href="tel:+905325511574" className="text-gray-700 hover:text-primary transition">
                  <FaPhone className="text-lg" />
                </a>
                <div className="flex flex-col text-sm">
                  <a href="tel:+905325511574" className="text-gray-700 font-semibold hover:text-primary transition">+90 532 551 15 74</a>
                  <a href="tel:+905419255561" className="text-gray-700 font-semibold hover:text-primary transition">+90 541 925 55 61</a>
                </div>
              </div>
            </div>

            <div className="flex lg:hidden items-center space-x-3">
              <a href="https://wa.me/905325511574" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition" aria-label="WhatsApp"><FaWhatsapp className="text-2xl" /></a>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 p-2" aria-label="Menü">{isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}</button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3 pt-4">
                <Link to="/" className="text-gray-700 hover:text-primary transition py-2" onClick={() => setIsMenuOpen(false)}>{t('nav.home')}</Link>
                <Link to="/hizmetler" className="text-gray-700 hover:text-primary transition py-2" onClick={() => setIsMenuOpen(false)}>{t('nav.services')}</Link>
                <Link to="/hakkimizda" className="text-gray-700 hover:text-primary transition py-2" onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</Link>
                <Link to="/iletisim" className="text-gray-700 hover:text-primary transition py-2" onClick={() => setIsMenuOpen(false)}>{t('nav.contact')}</Link>
                <div className="flex items-center space-x-4 pt-2">
                  <Link to="/iletisim" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition" onClick={() => setIsMenuOpen(false)}>{t('nav.quote')}</Link>
                  <div className="ml-auto flex items-center border rounded-lg overflow-hidden">
                    <button onClick={() => setLang('tr')} className={`px-4 py-3 text-sm ${lang === 'tr' ? 'bg-primary text-white' : 'text-gray-700'}`}>TR</button>
                    <button onClick={() => setLang('en')} className={`px-4 py-3 text-sm ${lang === 'en' ? 'bg-primary text-white' : 'text-gray-700'}`}>EN</button>
                    <button onClick={() => setLang('de')} className={`px-4 py-3 text-sm ${lang === 'de' ? 'bg-primary text-white' : 'text-gray-700'}`}>DE</button>
                  </div>
                  <a href="https://www.instagram.com/altuntaslojistik" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition" aria-label="Instagram"><FaInstagram className="text-2xl" /></a>
                  <a href="tel:+905325511574" className="text-gray-700 hover:text-primary transition" aria-label="Telefon"><FaPhone className="text-xl" /></a>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content (Suspense kalktı çünkü artık kodlar eager yükleniyor) */}
      <main role="main">
        {isNotFound && <NotFound />}
        {isHome && <Home t={t} renderDeferredHomeSections={renderDeferredHomeSections} />}
        {isServices && <Services t={t} lang={lang} />}
        {isAbout && <About t={t} />}
        {isContact && <Contact t={t} />}
        {isServiceLandingPage && currentServicePageKey && (
          <ServiceLandingSection servicePageKey={currentServicePageKey} t={t} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <picture>
                <source srcSet="/logo.webp" type="image/webp" />
                <img src="/logo.png" alt="Altuntaş Lojistik Logo" width="64" height="64" loading="lazy" decoding="async" className="h-12 w-auto mb-4" />
              </picture>
              <p className="text-gray-400 mb-4">{t('footer.tagline')}</p>
              <p className="text-gray-300 text-sm">{t('footer.copy')}</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">{t('nav.services')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/parsiyel-tasimacilik" className="hover:text-white">{t('serviceLinks.partial.title')}</Link></li>
                <li><Link to="/komple-yuk-tasimaciligi" className="hover:text-white">{t('serviceLinks.full.title')}</Link></li>
                <li><Link to="/uluslararasi-karayolu-tasimaciligi" className="hover:text-white">{t('serviceLinks.international.title')}</Link></li>
                <li><Link to="/turkiye-almanya-lojistik" className="hover:text-white">{t('serviceLinks.germany.title')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">{t('nav.home')}</Link></li>
                <li><Link to="/hakkimizda" className="hover:text-white">{t('nav.about')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">{t('footer.contact')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="tel:+905325511574" className="hover:text-white">+90 532 551 15 74</a></li>
                <li><a href="mailto:info@altuntaslojistik.com" className="hover:text-white">info@altuntaslojistik.com</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/905325511574" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-900 transition-all hover:scale-110 z-50 group" aria-label="WhatsApp">
        <FaWhatsapp className="text-3xl" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {t('whatsapp.tooltip')}
        </span>
      </a>
    </div>
  )
}

export default App