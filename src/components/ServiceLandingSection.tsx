import { FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

type ServicePageKey = 'partial' | 'full' | 'international' | 'germany'

type ServiceLandingSectionProps = {
  servicePageKey: ServicePageKey
  t: (key: string) => string
}

function ServiceLandingSection({ servicePageKey, t }: ServiceLandingSectionProps) {
  return (
    <section className="py-16 bg-white" aria-label={t(`servicePages.${servicePageKey}.h1`)}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t(`servicePages.${servicePageKey}.h1`)}</h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">{t(`servicePages.${servicePageKey}.intro`)}</p>

          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(`servicePages.${servicePageKey}.benefitsTitle`)}</h2>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-700">
                <FaCheckCircle className="text-primary mr-3 mt-1" />
                {t(`servicePages.${servicePageKey}.benefit1`)}
              </li>
              <li className="flex items-start text-gray-700">
                <FaCheckCircle className="text-primary mr-3 mt-1" />
                {t(`servicePages.${servicePageKey}.benefit2`)}
              </li>
              <li className="flex items-start text-gray-700">
                <FaCheckCircle className="text-primary mr-3 mt-1" />
                {t(`servicePages.${servicePageKey}.benefit3`)}
              </li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(`servicePages.${servicePageKey}.detailsTitle`)}</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">{t(`servicePages.${servicePageKey}.details1`)}</p>
            <p className="text-gray-700 text-lg leading-relaxed">{t(`servicePages.${servicePageKey}.details2`)}</p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(`servicePages.${servicePageKey}.faqTitle`)}</h2>
            <div className="space-y-5">
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{t(`servicePages.${servicePageKey}.faq1q`)}</h3>
                <p className="text-gray-700">{t(`servicePages.${servicePageKey}.faq1a`)}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{t(`servicePages.${servicePageKey}.faq2q`)}</h3>
                <p className="text-gray-700">{t(`servicePages.${servicePageKey}.faq2a`)}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{t(`servicePages.${servicePageKey}.faq3q`)}</h3>
                <p className="text-gray-700">{t(`servicePages.${servicePageKey}.faq3a`)}</p>
              </div>
            </div>
          </div>

          <div className="bg-black text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">{t('servicePages.common.ctaTitle')}</h2>
            <p className="text-gray-200 mb-6">{t(`servicePages.${servicePageKey}.ctaText`)}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/iletisim" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                {t('servicePages.common.ctaContact')}
              </Link>
              <a
                href="https://wa.me/905325511574"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition"
              >
                {t('servicePages.common.ctaWhatsapp')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceLandingSection
