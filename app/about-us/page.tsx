'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LanguageThemeToggle from '@/components/LanguageThemeToggle'
import { Target, Zap, Shield, Users } from 'lucide-react'

export default function AboutUsPage() {
  const { t, dir } = useLanguage()
  const positionClass = dir === 'rtl' ? 'bottom-6 left-6' : 'bottom-6 right-6'

  const valuesConfig = [
    { key: 'sectorSpecific', icon: Target },
    { key: 'cuttingEdge', icon: Zap },
    { key: 'security', icon: Shield },
    { key: 'expertTeam', icon: Users },
  ]

  const values = valuesConfig.map(config => ({
    icon: config.icon,
    ...t.aboutUs.ourValues.values[config.key as keyof typeof t.aboutUs.ourValues.values],
  }))

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h1 className={`text-4xl md:text-5xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t.footer.aboutUs}
            </h1>
            <p className={`text-xl text-legal-gray dark:text-gray-300 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t.aboutUs.subtitle}
            </p>
          </div>

          <div className={`prose prose-lg dark:prose-invert max-w-none ${dir === 'rtl' ? 'text-right' : ''}`}>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 lg:p-10 space-y-6">
              <section>
                <h2 className={`text-2xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.aboutUs.ourMission.title}
                </h2>
                <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.aboutUs.ourMission.description}
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.aboutUs.ourVision.title}
                </h2>
                <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.aboutUs.ourVision.description}
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-bold text-legal-dark dark:text-white mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.aboutUs.ourValues.title}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {values.map((value, index) => {
                    const Icon = value.icon
                    return (
                      <div
                        key={index}
                        className={`bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md ${dir === 'rtl' ? 'text-right' : ''}`}
                      >
                        <div className="bg-primary-100 dark:bg-gray-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                          <Icon className="text-primary-600 dark:text-primary-400" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-legal-dark dark:text-white mb-2">
                          {value.title}
                        </h3>
                        <p className="text-legal-gray dark:text-gray-300 text-sm">
                          {value.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </section>
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

