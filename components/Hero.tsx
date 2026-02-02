'use client'

import { Play } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const { t, dir } = useLanguage()

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 pt-0 pb-20 lg:pb-32 transition-colors duration-300 overflow-hidden min-h-screen" style={{ contain: 'layout style paint' }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-60 dark:opacity-50 pointer-events-none"
        style={{ 
          filter: 'blur(2px)',
          transform: 'translateZ(0)',
          willChange: 'opacity',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          zIndex: 0
        }}
      >
        <source src="/8061567-sd_426_240_25fps.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-50/50 via-white/50 to-primary-50/50 dark:from-gray-800/60 dark:via-gray-900/60 dark:to-gray-800/60" style={{ zIndex: 1 }}></div>
      
      <div className="section-container relative z-10 pt-40 lg:pt-48">
        <div className="max-w-7xl mx-auto">
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${dir === 'rtl' ? 'lg:grid-flow-dense' : ''}`}>
            {/* Text Content - Left side in RTL, Left side in LTR */}
            <div className={`relative ${dir === 'rtl' ? 'lg:col-start-1' : ''} flex flex-col ${dir === 'rtl' ? 'items-end text-right' : 'items-start text-left'}`}>
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-legal-dark dark:text-white mb-6 leading-tight`}>
                {t.hero.title}
              </h1>
              <p className={`text-xl text-legal-gray dark:text-gray-300 mb-8 leading-relaxed`}>
                {t.hero.subtitle}
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 w-full ${dir === 'rtl' ? 'sm:flex-row-reverse justify-end items-end' : 'justify-start items-start'}`}>
                <Link href="/request-demo" className="btn-primary text-lg px-8 py-4 text-center">
                  {t.hero.requestDemo}
                </Link>
                <button className={`btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Play size={20} />
                  {t.hero.watchDemo}
                </button>
              </div>
              <p className={`text-sm text-legal-gray dark:text-gray-400 mt-4 ${dir === 'rtl' ? 'text-right' : 'text-left'} ${dir === 'rtl' ? 'w-full' : ''}`}>{t.hero.subtext}</p>
            </div>
            {/* Dashboard Preview - Right side in RTL, Right side in LTR */}
            <div className={`relative ${dir === 'rtl' ? 'lg:col-start-2 lg:row-start-1' : ''}`}>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 shadow-2xl dark:shadow-gray-900">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg dark:shadow-gray-900">
                <div className={`space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {/* Text lines - Right-aligned in RTL */}
                  <div className={`h-4 bg-primary-200 rounded ${dir === 'rtl' ? 'w-3/4 ml-auto' : 'w-3/4 mr-auto'}`}></div>
                  <div className={`h-4 bg-primary-100 rounded w-full`}></div>
                  <div className={`h-4 bg-primary-200 rounded ${dir === 'rtl' ? 'w-5/6 ml-auto' : 'w-5/6 mr-auto'}`}></div>
                  {/* Feature Cards - RTL order: Card 1 (Right), Card 2 (Center), Card 3 (Left) - Same dimensions as LTR */}
                  {dir === 'rtl' ? (
                    <div className="flex flex-row-reverse gap-4 mt-6">
                      {/* RTL: Card 1 (Right), Card 2 (Center), Card 3 (Left) */}
                      <div className="bg-primary-50 rounded p-3 flex-1">
                        <div className="h-12 bg-primary-300 rounded mb-2 w-full"></div>
                        <div className="h-3 bg-primary-200 rounded w-4/5 ml-auto"></div>
                      </div>
                      <div className="bg-primary-50 rounded p-3 flex-1">
                        <div className="h-12 bg-primary-300 rounded mb-2 w-full"></div>
                        <div className="h-3 bg-primary-200 rounded w-4/5 ml-auto"></div>
                      </div>
                      <div className="bg-primary-50 rounded p-3 flex-1">
                        <div className="h-12 bg-primary-300 rounded mb-2 w-full"></div>
                        <div className="h-3 bg-primary-200 rounded w-4/5 ml-auto"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {/* LTR: Card 1 (Left), Card 2 (Center), Card 3 (Right) */}
                      <div className="bg-primary-50 rounded p-3">
                        <div className="h-12 bg-primary-300 rounded mb-2 w-full"></div>
                        <div className="h-3 bg-primary-200 rounded w-4/5"></div>
                      </div>
                      <div className="bg-primary-50 rounded p-3">
                        <div className="h-12 bg-primary-300 rounded mb-2 w-full"></div>
                        <div className="h-3 bg-primary-200 rounded w-4/5"></div>
                      </div>
                      <div className="bg-primary-50 rounded p-3">
                        <div className="h-12 bg-primary-300 rounded mb-2 w-full"></div>
                        <div className="h-3 bg-primary-200 rounded w-4/5"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={`absolute -bottom-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl border-2 border-primary-200 dark:border-gray-700 ${dir === 'rtl' ? '-left-4' : '-right-4'}`}>
              <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-sm font-semibold text-legal-dark dark:text-gray-300 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {t.hero.aiAssistantActive}
                </span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


