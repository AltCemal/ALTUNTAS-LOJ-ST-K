import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaTruck, FaBox, FaBuilding, FaCheckCircle, FaMapMarkerAlt, FaGlobeEurope, FaTimes } from 'react-icons/fa'

type Locations = { turkeyCities: string[]; europeCountries: string[] }
type LocationMap = { tr: Locations; en: Locations; de: Locations }

interface ServicesProps {
  t: (key: string) => string
  lang: 'tr' | 'en' | 'de'
}

export default function Services({ t, lang }: ServicesProps) {
  const [isTurkeyModalOpen, setIsTurkeyModalOpen] = useState(false)
  const [isEuropeModalOpen, setIsEuropeModalOpen] = useState(false)
  const [locationsData, setLocationsData] = useState<LocationMap | null>(null)

  useEffect(() => {
    import('../locales/locations')
      .then((module) => setLocationsData(module.locations as LocationMap))
      .catch(() => setLocationsData(null))
  }, [])

  const servicePages = [
    { path: '/parsiyel-tasimacilik', key: 'partial' },
    { path: '/komple-yuk-tasimaciligi', key: 'full' },
    { path: '/uluslararasi-karayolu-tasimaciligi', key: 'international' },
    { path: '/turkiye-almanya-lojistik', key: 'germany' }
  ] as const

  return (
    <>
      <section id="hizmetler" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">{t('services.page.h1')}</h1>
          <h2 className="text-4xl font-bold text-center mb-12">{t('services.title')}</h2>

          <div className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed space-y-6 mb-12">
            <p>{t('services.page.intro')}</p>
            <h2 className="text-2xl font-bold text-gray-900">{t('services.page.road.title')}</h2>
            <p>{t('services.page.road.p1')}</p>
            <h2 className="text-2xl font-bold text-gray-900">{t('services.page.intercity.title')}</h2>
            <p>{t('services.page.intercity.p1')}</p>
            <h2 className="text-2xl font-bold text-gray-900">{t('services.page.pro.title')}</h2>
            <p>{t('services.page.pro.p1')}</p>
            <p>{t('services.page.outro')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* FTL Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaTruck className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.ftl.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.ftl.desc')}</p>
              <ul className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-gray-700 mr-2" />
                    {t(`services.ftl.b${i}`)}
                  </li>
                ))}
              </ul>
            </div>

            {/* LTL Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBox className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.ltl.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.ltl.desc')}</p>
              <ul className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-gray-700 mr-2" />
                    {t(`services.ltl.b${i}`)}
                  </li>
                ))}
              </ul>
            </div>

            {/* International Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBuilding className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.intl.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.intl.desc')}</p>
              <ul className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-gray-700 mr-2" />
                    {t(`services.intl.b${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ... Diğer 3 Servis Kartı (Storage, Special, Consult) ... */}
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBox className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.storage.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.storage.desc')}</p>
              <ul className="space-y-2">
                {[1, 2, 3].map((i) => <li key={i} className="flex items-center text-gray-700"><FaCheckCircle className="text-gray-700 mr-2" />{t(`services.storage.b${i}`)}</li>)}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaTruck className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.special.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.special.desc')}</p>
              <ul className="space-y-2">
                {[1, 2, 3].map((i) => <li key={i} className="flex items-center text-gray-700"><FaCheckCircle className="text-gray-700 mr-2" />{t(`services.special.b${i}`)}</li>)}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <FaBox className="text-primary text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">{t('services.consult.title')}</h3>
              <p className="text-gray-600 mb-4">{t('services.consult.desc')}</p>
              <ul className="space-y-2">
                {[1, 2, 3].map((i) => <li key={i} className="flex items-center text-gray-700"><FaCheckCircle className="text-gray-700 mr-2" />{t(`services.consult.b${i}`)}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8">{t('serviceLinks.title')}</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {servicePages.map((page) => (
                <Link key={page.path} to={page.path} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-gray-200">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{t(`serviceLinks.${page.key}.title`)}</h3>
                  <p className="text-gray-600 mb-4">{t(`serviceLinks.${page.key}.description`)}</p>
                  <span className="text-primary font-semibold">{t('serviceLinks.cta')}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t('coverage.title')}</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6"><FaMapMarkerAlt className="text-primary text-3xl mr-3" /><h3 className="text-2xl font-bold">{t('coverage.tr.title')}</h3></div>
              <p className="text-gray-600 mb-6">{t('coverage.tr.desc')}</p>
              <button onClick={() => setIsTurkeyModalOpen(true)} className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition font-semibold">{t('coverage.tr.button')}</button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6"><FaGlobeEurope className="text-primary text-3xl mr-3" /><h3 className="text-2xl font-bold">{t('coverage.eu.title')}</h3></div>
              <p className="text-gray-600 mb-6">{t('coverage.eu.desc')}</p>
              <button onClick={() => setIsEuropeModalOpen(true)} className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition font-semibold">{t('coverage.eu.button')}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Turkey Modal */}
      {isTurkeyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsTurkeyModalOpen(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center"><FaMapMarkerAlt className="text-primary mr-3" />{t('coverage.tr.modalTitle')}</h3>
              <button onClick={() => setIsTurkeyModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl p-2"><FaTimes /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(locationsData?.[lang]?.turkeyCities ?? []).map((city) => (
                  <div key={city} className="flex items-center bg-gray-50 p-3 rounded-lg"><FaCheckCircle className="text-gray-700 mr-2 flex-shrink-0" /><span className="text-gray-700">{city}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Europe Modal */}
      {isEuropeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsEuropeModalOpen(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center"><FaGlobeEurope className="text-primary mr-3" />{t('coverage.eu.modalTitle')}</h3>
              <button onClick={() => setIsEuropeModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl p-2"><FaTimes /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(locationsData?.[lang]?.europeCountries ?? []).map((country) => (
                  <div key={country} className="flex items-center bg-gray-50 p-3 rounded-lg"><FaCheckCircle className="text-gray-700 mr-2 flex-shrink-0" /><span className="text-gray-700">{country}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}