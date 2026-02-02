'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LanguageThemeToggle from '@/components/LanguageThemeToggle'
import Link from 'next/link'
import { Briefcase, MapPin, Clock } from 'lucide-react'

export default function CareersPage() {
  const { t, dir } = useLanguage()
  const positionClass = dir === 'rtl' ? 'bottom-6 left-6' : 'bottom-6 right-6'

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h1 className={`text-4xl md:text-5xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t.footer.careers}
            </h1>
            <p className={`text-xl text-legal-gray dark:text-gray-300 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t.careers.subtitle}
            </p>
          </div>

          <div className={`space-y-12 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <section>
              <h2 className={`text-2xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t.careers.whyJoin.title}
              </h2>
              <p className={`text-gray-700 dark:text-gray-300 leading-relaxed mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t.careers.whyJoin.description}
              </p>
              <ul className={`list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ${dir === 'rtl' ? 'text-right' : ''} ${dir === 'rtl' ? 'list-outside' : ''}`}>
                <li>{t.careers.whyJoin.benefit1}</li>
                <li>{t.careers.whyJoin.benefit2}</li>
                <li>{t.careers.whyJoin.benefit3}</li>
                <li>{t.careers.whyJoin.benefit4}</li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      {/* Open Positions - Separate Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${dir === 'rtl' ? 'text-right' : ''}`}>
            <h2 className={`text-2xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t.careers.openPositions.title}
            </h2>
            <p className={`text-gray-700 dark:text-gray-300 leading-relaxed mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t.careers.openPositions.description}
            </p>
            <div className={`flex items-start gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className="bg-primary-100 dark:bg-gray-700 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-legal-dark dark:text-white mb-2">
                  {t.careers.openPositions.noPositions}
                </h3>
                <p className="text-legal-gray dark:text-gray-300">
                  {t.careers.openPositions.checkBack}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <div className={`fixed ${positionClass} z-50`}>
        <LanguageThemeToggle />
      </div>
    </main>
  )
}

