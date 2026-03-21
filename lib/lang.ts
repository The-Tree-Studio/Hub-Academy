'use client'

export function getLang(): 'fr' | 'en' {
  if (typeof window === 'undefined') return 'fr'
  return (localStorage.getItem('hub_lang') as 'fr' | 'en') || 'fr'
}

export function setLang(lang: 'fr' | 'en') {
  if (typeof window !== 'undefined') localStorage.setItem('hub_lang', lang)
}
