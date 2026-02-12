import { FaTruck, FaBox, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle, FaShieldAlt, FaWhatsapp, FaInstagram, FaBars, FaTimes, FaStar, FaQuoteLeft, FaGlobeEurope } from 'react-icons/fa'
import { useState, FormEvent } from 'react'
import { useI18n } from './i18n'
import { locations } from './locales/locations'

function App() {
  const { t, lang, setLang } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTurkeyModalOpen, setIsTurkeyModalOpen] = useState(false)
  const [isEuropeModalOpen, setIsEuropeModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // WhatsApp numarası (başında + ve ülke kodu ile)
    const whatsappNumber = '905325511574' // Gerçek numaranızı buraya yazın
    
    // Mesaj formatı
    const whatsappMessage = `
*Yeni Teklif Talebi*

*Ad Soyad:* ${formData.name}
*Telefon:* ${formData.phone}
*E-posta:* ${formData.email}

*Mesaj:*
${formData.message}
    `.trim()
    
    // WhatsApp URL'i oluştur
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    
    // WhatsApp'ı aç
    window.open(whatsappUrl, '_blank')
    
    // Formu temizle
    setFormData({
      name: '',
      phone: '',
      email: '',
      message: ''
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50" role="banner">
        <nav className="container mx-auto px-4 py-4" aria-label={t('nav.home')}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Altuntaş Lojistik Logo" 
                className="h-12 md:h-16 w-auto"
              />
              <div className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap hidden sm:block">{t('brand.name')}</div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-6 flex-1 justify-center">
              <a href="#anasayfa" className="text-gray-700 hover:text-primary transition">{t('nav.home')}</a>
              <a href="#hizmetler" className="text-gray-700 hover:text-primary transition">{t('nav.services')}</a>
              <a href="#hakkimizda" className="text-gray-700 hover:text-primary transition">{t('nav.about')}</a>
              <a href="#iletisim" className="text-gray-700 hover:text-primary transition">{t('nav.contact')}</a>
            </div>
            
            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setLang('tr')}
                  className={`px-3 py-2 text-sm ${lang === 'tr' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  aria-label="Türkçe"
                >TR</button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-2 text-sm ${lang === 'en' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  aria-label="English"
                >EN</button>
              </div>
              <a href="#iletisim" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                {t('nav.quote')}
              </a>
              <a 
                href="https://wa.me/905325511574" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-2xl" />
              </a>
              <a 
                href="https://instagram.com/altuntasnakliyat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 transition"
                aria-label="Instagram"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a 
                href="tel:+905325511574" 
                className="hidden xl:flex items-center space-x-2 text-gray-700 hover:text-primary transition"
              >
                <FaPhone className="text-lg" />
                <span className="font-semibold whitespace-nowrap">+90 532 551 15 74</span>
              </a>
            </div>

            {/* Mobile Icons */}
            <div className="flex lg:hidden items-center space-x-3">
              <a 
                href="https://wa.me/905325511574" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-2xl" />
              </a>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary transition p-2"
                aria-label="Menü"
              >
                {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3 pt-4">
                <a 
                  href="#anasayfa" 
                  className="text-gray-700 hover:text-primary transition py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.home')}
                </a>
                <a 
                  href="#hizmetler" 
                  className="text-gray-700 hover:text-primary transition py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.services')}
                </a>
                <a 
                  href="#hakkimizda" 
                  className="text-gray-700 hover:text-primary transition py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.about')}
                </a>
                <a 
                  href="#iletisim" 
                  className="text-gray-700 hover:text-primary transition py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.contact')}
                </a>
                <div className="flex items-center space-x-4 pt-2">
                  <a 
                    href="#iletisim" 
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.quote')}
                  </a>
                  <div className="ml-auto flex items-center border rounded-lg overflow-hidden">
                    <button onClick={() => setLang('tr')} className={`px-3 py-2 text-sm ${lang === 'tr' ? 'bg-primary text-white' : 'text-gray-700'}`}>TR</button>
                    <button onClick={() => setLang('en')} className={`px-3 py-2 text-sm ${lang === 'en' ? 'bg-primary text-white' : 'text-gray-700'}`}>EN</button>
                  </div>
                  <a 
                    href="https://instagram.com/altuntasnakliyat" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700 transition"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-2xl" />
                  </a>
                  <a 
                    href="tel:+905XXXXXXXXX" 
                    className="text-gray-700 hover:text-primary transition"
                    aria-label="Telefon"
                  >
                    <FaPhone className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main role="main">
        {/* Hero Section */}
        <section id="anasayfa" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20" aria-label={t('nav.home')}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{t('hero.title')}</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
          <div className="flex justify-center space-x-4">
            <a href="#iletisim" className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">{t('hero.cta.quote')}</a>
            <a href="#hizmetler" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">{t('hero.cta.services')}</a>
          </div>
        </div>
      </section>

        {/* Stats Section - Rakamlarla Altuntaş */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">{t('stats.title')}</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">20+</div>
                <div className="text-xl text-blue-100">{t('stats.years')}</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-xl text-blue-100">{t('stats.fleet')}</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">10,000+</div>
                <div className="text-xl text-blue-100">{t('stats.customers')}</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">45</div>
                <div className="text-xl text-blue-100">{t('stats.countries')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white" aria-label="Features">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('features.fleet.title')}</h3>
              <p className="text-gray-600">{t('features.fleet.desc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('features.insurance.title')}</h3>
              <p className="text-gray-600">{t('features.insurance.desc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('features.ontime.title')}</h3>
              <p className="text-gray-600">{t('features.ontime.desc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('features.tracking.title')}</h3>
              <p className="text-gray-600">{t('features.tracking.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="hizmetler" className="py-16 bg-gray-100" aria-label={t('services.title')}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t('services.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaTruck className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.ftl.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.ftl.desc')}</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.ftl.b1')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.ftl.b2')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.ftl.b3')}
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBox className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.ltl.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.ltl.desc')}</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.ltl.b1')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.ltl.b2')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.ltl.b3')}
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBuilding className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.intl.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.intl.desc')}</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.intl.b1')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.intl.b2')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.intl.b3')}
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBox className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.storage.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.storage.desc')}</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.storage.b1')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.storage.b2')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.storage.b3')}
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaTruck className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.special.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.special.desc')}</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.special.b1')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.special.b2')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.special.b3')}
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBox className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.consult.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.consult.desc')}</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.consult.b1')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.consult.b2')}
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {t('services.consult.b3')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Coverage Map */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t('coverage.title')}</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FaMapMarkerAlt className="text-primary text-3xl mr-3" />
                <h3 className="text-2xl font-bold">{t('coverage.tr.title')}</h3>
              </div>
              <p className="text-gray-600 mb-6">{t('coverage.tr.desc')}</p>
              <button
                onClick={() => setIsTurkeyModalOpen(true)}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                {t('coverage.tr.button')}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FaGlobeEurope className="text-primary text-3xl mr-3" />
                <h3 className="text-2xl font-bold">{t('coverage.eu.title')}</h3>
              </div>
              <p className="text-gray-600 mb-6">{t('coverage.eu.desc')}</p>
              <button
                onClick={() => setIsEuropeModalOpen(true)}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                {t('coverage.eu.button')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Turkey Cities Modal */}
      {isTurkeyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsTurkeyModalOpen(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center">
                <FaMapMarkerAlt className="text-primary mr-3" />
                {t('coverage.tr.modalTitle')}
              </h3>
              <button
                onClick={() => setIsTurkeyModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {locations[lang].turkeyCities.map((city) => (
                  <div key={city} className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Europe Countries Modal */}
      {isEuropeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsEuropeModalOpen(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center">
                <FaGlobeEurope className="text-primary mr-3" />
                {t('coverage.eu.modalTitle')}
              </h3>
              <button
                onClick={() => setIsEuropeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {locations[lang].europeCountries.map((country) => (
                  <div key={country} className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{country}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t('testimonials.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg relative">
              <FaQuoteLeft className="text-primary text-3xl mb-4 opacity-20 absolute top-4 left-4" />
              <div className="flex mb-3 pt-8">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{t('testimonials.1.text')}"</p>
              <div className="font-semibold text-gray-800">{t('testimonials.1.author')}</div>
              <div className="text-sm text-gray-500">{t('testimonials.1.role')}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow-lg relative">
              <FaQuoteLeft className="text-primary text-3xl mb-4 opacity-20 absolute top-4 left-4" />
              <div className="flex mb-3 pt-8">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{t('testimonials.2.text')}"</p>
              <div className="font-semibold text-gray-800">{t('testimonials.2.author')}</div>
              <div className="text-sm text-gray-500">{t('testimonials.2.role')}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow-lg relative">
              <FaQuoteLeft className="text-primary text-3xl mb-4 opacity-20 absolute top-4 left-4" />
              <div className="flex mb-3 pt-8">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{t('testimonials.3.text')}"</p>
              <div className="font-semibold text-gray-800">{t('testimonials.3.author')}</div>
              <div className="text-sm text-gray-500">{t('testimonials.3.role')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="hakkimizda" className="py-16 bg-gray-100" aria-label={t('about.title')}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">{t('about.title')}</h2>
            <p className="text-lg text-gray-700 mb-6">{t('about.p1')}</p>
            <p className="text-lg text-gray-700">{t('about.p2')}</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="iletisim" className="py-16 bg-gray-100" aria-label={t('contact.title')}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t('contact.title')}</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold mb-6">{t('contact.reach')}</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaPhone className="text-primary text-xl mr-4 mt-1" />
                  <div>
                    <h4 className="font-semibold">{t('contact.phone')}</h4>
                    <p className="text-gray-600">+90 532 551 15 74</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="text-primary text-xl mr-4 mt-1" />
                  <div>
                    <h4 className="font-semibold">{t('contact.email')}</h4>
                    <p className="text-gray-600">info@altuntasnakliyat.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-primary text-xl mr-4 mt-1" />
                  <div>
                    <h4 className="font-semibold">{t('contact.address')}</h4>
                    <p className="text-gray-600">Örnek Mahallesi, Nakliyat Caddesi No:123<br />İstanbul, Türkiye</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">{t('form.title')}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('form.name')} 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('form.phone')} 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('form.email')} 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                />
                <textarea 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('form.message')} 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                ></textarea>
                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center space-x-2"
                >
                  <span>{t('form.submit')}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8" role="contentinfo">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/logo.png" 
              alt="Altuntaş Lojistik Logo" 
              className="h-16 w-auto"
            />
          </div>
          <p className="text-gray-400 mb-4">{t('footer.tagline')}</p>
          <p className="text-gray-500 text-sm">{t('footer.copy')}</p>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/905XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-50 group"
        aria-label="WhatsApp"
      >
        <FaWhatsapp className="text-3xl" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {t('whatsapp.tooltip')}
        </span>
      </a>
    </div>
  )
}

export default App
