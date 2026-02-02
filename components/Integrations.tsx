'use client'

import { Zap, Download } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Icon configuration - doesn't change with language
const integrationsConfig = [
  {
    icon: Zap,
    key: 'thirdParty',
  },
  {
    icon: Download,
    key: 'export',
  },
]

export default function Integrations() {
  const { t, dir } = useLanguage()
  
  // Build integrations from config and translations
  const integrations = integrationsConfig.map(config => {
    const translation = t.integrations[config.key as keyof typeof t.integrations] as { title: string; desc: string } | undefined
    return {
      ...config,
      ...(translation || {}),
    }
  })
  
  return (
    <section className="bg-primary-50 dark:bg-gray-800 py-20 transition-colors duration-300">
      <div className="section-container">
        <div className="max-w-7xl mx-auto">
          {/* Header - Centered */}
          <div className="text-center mb-16">
            <h2 className="section-title dark:text-white text-center">{t.integrations.title}</h2>
            <p className="section-subtitle mx-auto text-center dark:text-gray-300">
              {t.integrations.subtitle}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8">
          {integrations.map((integration, index) => {
            const Icon = integration.icon
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md dark:shadow-gray-900 hover:shadow-xl dark:hover:shadow-gray-800 transition-shadow duration-300 text-left"
              >
                <div className="bg-primary-100 dark:bg-gray-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 mr-auto">
                  <Icon className="text-primary-600 dark:text-primary-400" size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-legal-dark dark:text-white mb-3 text-left">{integration.title}</h3>
                <p className="text-legal-gray dark:text-gray-300 mb-6 text-left">{integration.desc}</p>
                {integration.key === 'thirdParty' && (
                  <div className="flex flex-wrap gap-2">
                    {['Microsoft 365', 'Google Workspace', 'Dropbox', 'OneDrive'].map((example, exampleIndex) => (
                      <span
                        key={exampleIndex}
                        className="bg-primary-50 dark:bg-gray-600 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                )}
                {integration.key === 'export' && (
                  <div className="flex flex-wrap gap-2">
                    {['PDF Reports', 'Excel Export', 'CSV Data', 'JSON API'].map((example, exampleIndex) => (
                      <span
                        key={exampleIndex}
                        className="bg-primary-50 dark:bg-gray-600 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-legal-gray dark:text-gray-300 mb-4">
              {t.integrations.customIntegration}
            </p>
            <a href="/contact" className={`text-primary-600 dark:text-primary-400 hover:underline font-semibold inline-flex items-center gap-2 ${
              dir === "rtl" ? "flex-row-reverse" : ""
            }`}>
              {t.integrations.contactSupport}
              {dir === "rtl" ? " ←" : " →"}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

