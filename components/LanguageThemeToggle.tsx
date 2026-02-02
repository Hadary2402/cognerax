'use client'

import { useState, useEffect } from 'react'
import { Languages, Moon, Sun } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { languages } from '@/lib/translations'

export default function LanguageThemeToggle() {
  const { language, setLanguage, dir } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleLanguageChange = (langCode: 'en' | 'ar') => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  const currentLang = languages.find((lang) => lang.code === language)
  const dropdownPosition = dir === 'rtl' ? 'left-0' : 'right-0'

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <div className="relative">
        <button
          className={`bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          aria-label="Change language and theme"
        >
          <div className="flex items-center gap-2">
            <Languages size={20} />
            <span className="hidden sm:inline font-semibold text-sm">{currentLang?.name}</span>
          </div>
          <div className="w-px h-6 bg-white/30"></div>
          <Moon size={20} />
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Combined Button */}
      <button
        onClick={toggleDropdown}
        className={`bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
        aria-label="Change language and theme"
      >
        <div className="flex items-center gap-2">
          <Languages size={20} />
          <span className="hidden sm:inline font-semibold text-sm">{currentLang?.name}</span>
        </div>
        <div className="w-px h-6 bg-white/30"></div>
        {theme === 'dark' ? (
          <Sun size={20} className="text-yellow-300" />
        ) : (
          <Moon size={20} />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute bottom-full ${dropdownPosition} mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[180px] z-50`}>
            {/* Theme Toggle Section */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleTheme()
                }}
                className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'} px-4 py-3 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''} gap-3 text-legal-gray dark:text-gray-300`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={18} className="text-yellow-300" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Language Selection Section */}
            <div>
              <div className={`px-4 py-2 text-xs font-semibold text-legal-gray dark:text-gray-400 uppercase ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                Language
              </div>
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
          </div>
        </>
      )}
    </div>
  )
}


