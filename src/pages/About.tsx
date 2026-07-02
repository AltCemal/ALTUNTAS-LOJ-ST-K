interface AboutProps {
  t: (key: string) => string
}

export default function About({ t }: AboutProps) {
  return (
    <section id="hakkimizda" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">{t('about.page.h1')}</h1>
          <p>{t('about.page.p1')}</p>
          <h2 className="text-2xl font-bold text-gray-900">{t('about.page.mission.title')}</h2>
          <p>{t('about.page.mission.p1')}</p>
          <h2 className="text-2xl font-bold text-gray-900">{t('about.page.vision.title')}</h2>
          <p>{t('about.page.vision.p1')}</p>
          <h2 className="text-2xl font-bold text-gray-900">{t('about.page.team.title')}</h2>
          <p>{t('about.page.team.p1')}</p>
        </div>
      </div>
    </section>
  )
}