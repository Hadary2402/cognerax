'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePathname } from 'next/navigation'

export default function FinalCTA() {
  const { t, dir } = useLanguage()
  const pathname = usePathname()
  const isCogneraXPage = pathname === '/'
  
  const ctaData = isCogneraXPage ? t.cognerax?.finalCTA : t.finalCTA

  return (
    <section className="bg-gradient-to-br from-primary-600 to-legal-blue dark:from-primary-700 dark:to-gray-800 py-20 text-white dark:text-gray-100 transition-colors duration-300">
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {ctaData?.title || t.finalCTA.title}
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            {ctaData?.subtitle || t.finalCTA.subtitle}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-8 ${dir === 'rtl' ? 'sm:flex-row-reverse' : ''}`}>
            <Link href="/request-demo" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg text-center">
              {ctaData?.requestDemo || t.finalCTA.requestDemo}
            </Link>
            <Link href="/contact" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg text-center">
              {ctaData?.contactUs || t.finalCTA.contactUs}
            </Link>
          </div>
          <div className={`flex flex-wrap items-center justify-center gap-6 text-sm text-primary-100 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{ctaData?.personalizedDemo || t.finalCTA.personalizedDemo}</span>
            </div>
            <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{ctaData?.dedicatedSupport || t.finalCTA.dedicatedSupport}</span>
            </div>
            <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{ctaData?.enterpriseReady || t.finalCTA.enterpriseReady}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

