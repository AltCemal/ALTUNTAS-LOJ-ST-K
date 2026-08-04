import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import tr from './locales/tr'
import en from './locales/en'

type Lang = 'tr' | 'en'

type I18nContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Lang, Record<string, string>> = { tr, en }

export const I18nProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>('tr')

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('lang') as Lang | null
    if (fromUrl === 'tr' || fromUrl === 'en') {
      setLangState(fromUrl)
      document.documentElement.lang = fromUrl
      localStorage.setItem('lang', fromUrl)
      return
    }
    const saved = (localStorage.getItem('lang') as Lang) || 'tr'
    setLangState(saved)
    document.documentElement.lang = saved
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
    document.documentElement.lang = l
    const url = new URL(window.location.href)
    url.searchParams.set('lang', l)
    window.history.replaceState({}, '', url.toString())
  }

  const t = useMemo(() => (key: string) => {
    return translations[lang][key] ?? translations['tr'][key] ?? key
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
