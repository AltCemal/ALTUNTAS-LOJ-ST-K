import { Link } from 'react-router-dom'
import { FaArrowLeft, FaHome, FaPhone, FaEnvelope } from 'react-icons/fa'
import { useI18n } from '../i18n'

export default function NotFound() {
  const { lang } = useI18n()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 py-12">
      {/* 404 Number */}
      <div className="text-center mb-8">
        <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
          404
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-300 mx-auto mb-8"></div>
      </div>

      {/* Main Message */}
      <div className="text-center max-w-2xl mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {lang === 'tr' ? 'Sayfa Bulunamadı' : lang === 'en' ? 'Page Not Found' : 'Seite nicht gefunden'}
        </h2>
        <p className="text-lg text-gray-300 mb-6">
          {lang === 'tr'
            ? 'Aradığınız sayfa silinmiş veya yanlış yazılmış olabilir. Lütfen ana sayfaya dönün veya aşağıdaki seçeneklerden birini seçin.'
            : lang === 'en'
            ? 'The page you are looking for may have been deleted or misspelled. Please return to the home page or select one of the options below.'
            : 'Die gesuchte Seite wurde möglicherweise gelöscht oder falsch geschrieben. Bitte kehren Sie zur Startseite zurück oder wählen Sie eine der folgenden Optionen.'}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full mb-12">
        <Link
          to={`/?lang=${lang}`}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
        >
          <FaHome className="text-xl" />
          <span>
            {lang === 'tr' ? 'Anasayfaya Dön' : lang === 'en' ? 'Back to Home' : 'Zur Startseite'}
          </span>
        </Link>

        <Link
          to={`/hizmetler?lang=${lang}`}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
        >
          <FaArrowLeft className="text-xl" />
          <span>
            {lang === 'tr' ? 'Hizmetlerimiz' : lang === 'en' ? 'Our Services' : 'Unsere Dienstleistungen'}
          </span>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full mb-12">
        <Link
          to={`/hakkimizda?lang=${lang}`}
          className="text-center py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
        >
          {lang === 'tr' ? 'Hakkımızda' : lang === 'en' ? 'About Us' : 'Über Uns'}
        </Link>

        <Link
          to={`/iletisim?lang=${lang}`}
          className="text-center py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
        >
          {lang === 'tr' ? 'İletişim' : lang === 'en' ? 'Contact' : 'Kontakt'}
        </Link>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          {lang === 'tr' ? 'Hızlı İletişim' : lang === 'en' ? 'Quick Contact' : 'Schnelle Kontakt'}
        </h3>

        <div className="space-y-4">
          {/* Phone */}
          <a
            href="tel:+905325511574"
            className="flex items-center gap-4 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <FaPhone className="text-blue-400 text-xl" />
            <div>
              <p className="text-gray-400 text-sm">
                {lang === 'tr' ? 'Telefon' : lang === 'en' ? 'Phone' : 'Telefon'}
              </p>
              <p className="text-white font-semibold">+90 532 551 1574</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:info@altuntaslojistik.com"
            className="flex items-center gap-4 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <FaEnvelope className="text-cyan-400 text-xl" />
            <div>
              <p className="text-gray-400 text-sm">
                {lang === 'tr' ? 'E-posta' : lang === 'en' ? 'Email' : 'E-Mail'}
              </p>
              <p className="text-white font-semibold">info@altuntaslojistik.com</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/905325511574"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <span className="text-green-400 text-xl">💬</span>
            <div>
              <p className="text-gray-400 text-sm">
                {lang === 'tr' ? 'WhatsApp' : lang === 'en' ? 'WhatsApp' : 'WhatsApp'}
              </p>
              <p className="text-white font-semibold">
                {lang === 'tr' ? 'Mesaj Gönder' : lang === 'en' ? 'Send Message' : 'Nachricht Senden'}
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-gray-400 text-sm text-center mt-8">
        {lang === 'tr'
          ? '© 2026 Altuntaş Lojistik. Tüm Hakları Saklıdır.'
          : lang === 'en'
          ? '© 2026 Altuntaş Logistics. All Rights Reserved.'
          : '© 2026 Altuntaş Logistik. Alle Rechte Vorbehalten.'}
      </p>
    </div>
  )
}
