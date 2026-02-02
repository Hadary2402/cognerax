'use client'

import { Target, Zap, Shield, Users } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Card configuration (icons - these don't change with language)
const valuesConfig = [
  { icon: Target, key: 'sectorSpecific' },
  { icon: Zap, key: 'cuttingEdge' },
  { icon: Shield, key: 'security' },
  { icon: Users, key: 'expertTeam' },
]

export default function CogneraXAbout() {
  const { t, dir } = useLanguage()

  // Build cards from config and translations
  const values = valuesConfig.map(config => {
    const translation = t.cognerax.about.cards[config.key as keyof typeof t.cognerax.about.cards] as { title: string; description: string } | undefined
    return {
      ...config,
      ...(translation || {}),
    }
  })

  return (
    <section id="about" className="bg-primary-50 dark:bg-gray-800 py-20 transition-colors duration-300">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-legal-dark dark:text-white">
            {t.cognerax.about.title}
          </h2>
          <p className="text-xl text-legal-gray dark:text-gray-300 max-w-3xl mx-auto">
            {t.cognerax.about.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center max-w-7xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md dark:shadow-gray-900 hover:shadow-xl dark:hover:shadow-gray-800 transition-shadow duration-300 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
              >
                <div className="bg-primary-100 dark:bg-gray-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="text-primary-600 dark:text-primary-400" size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-legal-dark dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-legal-gray dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

