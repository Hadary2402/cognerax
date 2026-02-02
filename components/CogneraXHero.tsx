'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CogneraXHero() {
  const { t, dir } = useLanguage()

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 pt-32 pb-20 lg:pt-40 lg:pb-32 transition-colors duration-300 overflow-hidden">
      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-gray-700 px-5 py-2.5 rounded-full mb-6">
            <Sparkles size={18} className="text-primary-600 dark:text-primary-400" />
            <span className="text-base font-semibold text-primary-700 dark:text-primary-300">
              {t.cognerax.hero.badge}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-legal-dark dark:text-white mb-6 leading-tight">
            {t.cognerax.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-legal-gray dark:text-gray-300 mb-8 leading-relaxed">
            {t.cognerax.hero.subtitle}
          </p>
          <p className="text-lg text-legal-gray dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            {t.cognerax.hero.description}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${dir === 'rtl' ? 'sm:flex-row-reverse' : ''}`}>
            <Link href="/nexora" className="btn-primary text-lg px-8 py-4 text-center inline-flex items-center justify-center gap-2">
              {t.cognerax.hero.exploreNexora}
              <ArrowRight size={20} />
            </Link>
            <Link href="/request-demo" className="btn-secondary text-lg px-8 py-4 text-center">
              {t.cognerax.hero.requestDemo}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

