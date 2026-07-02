import React, { useState, FormEvent } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

interface ContactProps {
  t: (key: string) => string
}

export default function Contact({ t }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const whatsappNumber = '905325511574'
    const whatsappMessage = `
*Yeni Teklif Talebi*
*Ad Soyad:* ${formData.name}
*Telefon:* ${formData.phone}
*E-posta:* ${formData.email}
*Mesaj:*
${formData.message}
    `.trim()
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank')
    setFormData({ name: '', phone: '', email: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section id="iletisim" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900">{t('contact.page.h1')}</h1>
          <p>{t('contact.page.p1')}</p>
          <h2 className="text-2xl font-bold text-gray-900">{t('contact.page.s1.title')}</h2>
          <p>{t('contact.page.s1.p1')}</p>
          <h2 className="text-2xl font-bold text-gray-900">{t('contact.page.s2.title')}</h2>
          <p>{t('contact.page.s2.p1')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-6">{t('contact.reach')}</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaPhone className="text-primary text-xl mr-4 mt-1" />
                <div>
                  <h4 className="font-semibold">{t('contact.phone')}</h4>
                  <p className="text-gray-600">+90 532 551 15 74</p>
                  <p className="text-gray-600">+90 541 925 55 61</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaEnvelope className="text-primary text-xl mr-4 mt-1" />
                <div><h4 className="font-semibold">{t('contact.email')}</h4><p className="text-gray-600">info@altuntaslojistik.com</p></div>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-primary text-xl mr-4 mt-1" />
                <div><h4 className="font-semibold">{t('contact.address')}</h4><p className="text-gray-600 whitespace-pre-line">{t('contact.address.value')}</p></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">{t('form.title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input id="form-name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('form.name')} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary" />
              <input id="form-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={t('form.phone')} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary" />
              <input id="form-email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('form.email')} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary" />
              <textarea id="form-message" rows={4} name="message" value={formData.message} onChange={handleChange} placeholder={t('form.message')} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"></textarea>
              <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center space-x-2">
                <span>{t('form.submit')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}