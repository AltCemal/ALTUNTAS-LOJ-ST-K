import { Link } from 'react-router-dom'
import { FaTruck, FaShieldAlt, FaClock, FaCheckCircle, FaQuoteLeft, FaStar } from 'react-icons/fa'

interface HomeProps {
  t: (key: string) => string
  renderDeferredHomeSections: boolean
}

export default function Home({ t, renderDeferredHomeSections }: HomeProps) {
  return (
    <>
      <section className="bg-gradient-to-r from-gray-900 to-black text-white">
        <div id="anasayfa" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">{t('hero.title')}</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
            <div className="flex justify-center space-x-4">
              <Link to="/iletisim" className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition">{t('hero.cta.quote')}</Link>
              <Link to="/hizmetler" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">{t('hero.cta.services')}</Link>
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">{t('stats.title')}</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">70+</div>
                <div className="text-xl text-gray-200">{t('stats.years')}</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-xl text-gray-200">{t('stats.fleet')}</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">10,000+</div>
                <div className="text-xl text-gray-200">{t('stats.customers')}</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">45</div>
                <div className="text-xl text-gray-200">{t('stats.countries')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {renderDeferredHomeSections && (
        <section className="py-16 bg-white" aria-label="Features">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTruck className="text-primary text-2xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('features.fleet.title')}</h3>
                <p className="text-gray-600">{t('features.fleet.desc')}</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShieldAlt className="text-primary text-2xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('features.insurance.title')}</h3>
                <p className="text-gray-600">{t('features.insurance.desc')}</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClock className="text-primary text-2xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('features.ontime.title')}</h3>
                <p className="text-gray-600">{t('features.ontime.desc')}</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-primary text-2xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('features.tracking.title')}</h3>
                <p className="text-gray-600">{t('features.tracking.desc')}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-white" aria-label={t('nav.home')}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed space-y-6">
            <p>{t('home.page.p1')}</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('home.page.s1.title')}</h2>
            <p className="mb-4">{t('home.page.s1.p1')}</p>
            <p className="mb-6"><Link to="/hizmetler" className="text-primary font-semibold hover:underline">{t('nav.services')} →</Link></p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('home.page.s2.title')}</h2>
            <p className="mb-4">{t('home.page.s2.p1')}</p>
            <p><Link to="/hakkimizda" className="text-primary font-semibold hover:underline">{t('nav.about')} →</Link></p>
          </div>
        </div>
      </section>

      {renderDeferredHomeSections && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">{t('testimonials.title')}</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map((num) => (
                <div key={num} className="bg-gray-50 rounded-lg p-6 shadow-lg relative">
                  <FaQuoteLeft className="text-primary text-3xl mb-4 opacity-20 absolute top-4 left-4" />
                  <div className="flex mb-3 pt-8">
                    {[...Array(5)].map((_, i) => <FaStar key={i} className="text-gray-400" />)}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{t(`testimonials.${num}.text`)}"</p>
                  <div className="font-semibold text-gray-800">{t(`testimonials.${num}.author`)}</div>
                  <div className="text-sm text-gray-500">{t(`testimonials.${num}.role`)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}