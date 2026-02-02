import { en } from './en'
import { ar } from './ar'

export type TranslationKey = typeof en
export type Language = 'en' | 'ar'

export const translations = {
  en,
  ar,
}

export const languages: { code: Language; name: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
]



