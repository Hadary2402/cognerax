'use client'

import { useState } from 'react'
import { Languages } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { languages } from '@/lib/translations'

export default function LanguageSwitcher() {
  const { language, setLanguage, dir } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleLanguageChange = (langCode: 'en' | 'ar') => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  const currentLang = languages.find((lang) => lang.code === language)
  const dropdownPosition = dir === 'rtl' ? 'left-0' : 'right-0'

  return (
    <div className="relative">
        {/* Button */}
        <button
          onClick={toggleDropdown}
          className={`bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          aria-label="Change language"
        >
          <Languages size={24} />
          <span className="hidden sm:inline font-semibold">{currentLang?.name}</span>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className={`absolute bottom-full ${dropdownPosition} mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[150px] z-50`}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'} px-4 py-3 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''} justify-between ${
                    language === lang.code ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 font-semibold' : 'text-legal-gray dark:text-gray-300'
                  }`}
                >
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
    </div>
  )
}

