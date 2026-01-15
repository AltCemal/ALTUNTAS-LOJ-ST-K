import { FaTruck, FaBox, FaHome, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle, FaShieldAlt, FaUsers } from 'react-icons/fa'
import { useState, FormEvent } from 'react'

function App() {
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
        <nav className="container mx-auto px-4 py-4" aria-label="Ana menü">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaTruck className="text-primary text-3xl" aria-hidden="true" />
              <div className="text-2xl font-bold text-gray-800">ALTUNTAŞ NAKLİYAT</div>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#anasayfa" className="text-gray-700 hover:text-primary transition">Anasayfa</a>
              <a href="#hizmetler" className="text-gray-700 hover:text-primary transition">Hizmetler</a>
              <a href="#hakkimizda" className="text-gray-700 hover:text-primary transition">Hakkımızda</a>
              <a href="#iletisim" className="text-gray-700 hover:text-primary transition">İletişim</a>
            </div>
            <a href="#iletisim" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Teklif Al
            </a>
          </div>
        </nav>
      </header>

      <main role="main">
        {/* Hero Section */}
        <section id="anasayfa" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20" aria-label="Ana sayfa">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Türkiye ve Avrupa'da Lojistik Çözümleri</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Karayolu taşımacılığında 20 yıllık deneyimimizle, yüklerinizi güvenle taşıyoruz. Parsiyel ve komple yük taşımacılığında güvenilir çözüm ortağınız.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#iletisim" className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
              Hemen Teklif Al
            </a>
            <a href="#hizmetler" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Hizmetlerimiz
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white" aria-label="Özellikler">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">Geniş Filo</h3>
              <p className="text-gray-600">Modern tır ve çekici filosu</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">CMR Sigortası</h3>
              <p className="text-gray-600">Tüm yükler CMR sigortası altında</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">Zamanında Teslimat</h3>
              <p className="text-gray-600">Güzergah optimizasyonu ile hızlı teslimat</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">Takip Sistemi</h3>
              <p className="text-gray-600">Anlık yük takip ve raporlama</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="hizmetler" className="py-16 bg-gray-100" aria-label="Hizmetlerimiz">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Hizmetlerimiz</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaTruck className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Komple Yük Taşıma</h3>
              <p className="text-gray-600 mb-4">
                Tüm tır kapasitesini kullanan büyük hacimli yüklerinizi güvenle taşıyoruz. FTL (Full Truck Load) hizmeti.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Direkt teslimat
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Tüm tır tipleri
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  CMR sigortası
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBox className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Parsiyel Yük Taşıma</h3>
              <p className="text-gray-600 mb-4">
                Kısmi yük taşımacılığı (LTL - Less Than Truckload) ile ekonomik ve esnek çözümler sunuyoruz.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Uygun maliyetli
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Düzenli seferler
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Konsolidasyon
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBuilding className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Uluslararası Taşıma</h3>
              <p className="text-gray-600 mb-4">
                Avrupa genelinde kapıdan kapıya nakliyat hizmetleri. Gümrük işlemleri dahil.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Tüm Avrupa
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Gümrük danışmanlığı
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  TIR karnesi
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBox className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Depolama ve Dağıtım</h3>
              <p className="text-gray-600 mb-4">
                Modern lojistik merkezlerimizde güvenli depolama ve hızlı dağıtım hizmetleri.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  WMS sistemi
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Cross-docking
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Stok yönetimi
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaTruck className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Özel Yük Taşıma</h3>
              <p className="text-gray-600 mb-4">
                ADR, soğuk zincir ve ağır yük taşımacılığı gibi özel yük çözümleri.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  ADR sertifikalı
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Frigo taşıma
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Proje taşıma
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBox className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Lojistik Danışmanlık</h3>
              <p className="text-gray-600 mb-4">
                Tedarik zinciri optimizasyonu ve lojistik süreç iyileştirme hizmetleri.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Rota optimizasyonu
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Maliyet analizi
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Süreç tasarımı
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="hakkimizda" className="py-16 bg-white" aria-label="Hakkımızda">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Hakkımızda</h2>
            <p className="text-lg text-gray-700 mb-6">
              Altuntaş Nakliyat olarak 20 yıldır Türkiye ve Avrupa'da karayolu lojistik hizmetleri sunmaktayız. 
              Modern tır filomuz, deneyimli sürücü kadromuz ve teknolojik altyapımızla, parsiyel ve komple yük 
              taşımacılığında güvenilir çözüm ortağınızız.
            </p>
            <p className="text-lg text-gray-700">
              ISO 9001 kalite belgeli firmamız, CMR sigortası, GPS takip sistemi ve 7/24 operasyon merkezi ile 
              müşterilerimize kesintisiz hizmet vermektedir. Tedarik zinciri yönetiminden depolamaya, 
              uluslararası taşımadan özel yük çözümlerine kadar geniş hizmet yelpazemizle sektörün öncü 
              firmalarından biriyiz.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="iletisim" className="py-16 bg-gray-100" aria-label="İletişim">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">İletişim</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold mb-6">Bize Ulaşın</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaPhone className="text-primary text-xl mr-4 mt-1" />
                  <div>
                    <h4 className="font-semibold">Telefon</h4>
                    <p className="text-gray-600">+90 XXX XXX XX XX</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="text-primary text-xl mr-4 mt-1" />
                  <div>
                    <h4 className="font-semibold">E-posta</h4>
                    <p className="text-gray-600">info@altuntasnakliyat.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-primary text-xl mr-4 mt-1" />
                  <div>
                    <h4 className="font-semibold">Adres</h4>
                    <p className="text-gray-600">Örnek Mahallesi, Nakliyat Caddesi No:123<br />İstanbul, Türkiye</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Teklif Formu</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınız Soyadınız" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefon Numaranız" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-posta Adresiniz" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                />
                <textarea 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mesajınız (Taşıma detayları, nereden nereye, yük bilgisi vb.)" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                ></textarea>
                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center space-x-2"
                >
                  <span>WhatsApp ile Gönder</span>
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
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FaTruck className="text-secondary text-2xl" />
            <h3 className="text-xl font-bold">ALTUNTAŞ NAKLİYAT</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Güvenli ve profesyonel taşımacılık hizmetleri
          </p>
          <p className="text-gray-500 text-sm">
            © 2026 Altuntaş Nakliyat. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
