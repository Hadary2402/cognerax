'use client'

import { Shield, Lock, FileCheck, Eye } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Icon configuration - doesn't change with language
const securityConfig = [
  {
    icon: Lock,
    key: 'encryption',
  },
  {
    icon: Shield,
    key: 'soc2',
  },
  {
    icon: FileCheck,
    key: 'gdpr',
  },
  {
    icon: Eye,
    key: 'accessControl',
  },
]

export default function SecurityCompliance() {
  const { t, dir } = useLanguage()
  
  // Build features from config and translations
  const securityFeatures = securityConfig.map(config => {
    const translation = t.security[config.key as keyof typeof t.security] as { title: string; desc: string } | undefined
    return {
      ...config,
      ...(translation || {}),
    }
  })
  
  return (
    <section className="bg-gradient-to-br from-legal-dark to-legal-blue dark:from-gray-900 dark:to-gray-800 py-20 text-white dark:text-gray-100 transition-colors duration-300">
      <div className="section-container">
        <div className="max-w-7xl mx-auto">
          {/* Header - Centered */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">{t.security.title}</h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto text-center">
              {t.security.subtitle}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-left"
              >
                <div className="bg-white/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4 mr-auto">
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-left">{feature.title}</h3>
                <p className="text-gray-300 text-left">{feature.desc}</p>
              </div>
            )
          })}
          </div>

          {/* Footer Links */}
          <div className="mt-12 text-center">
            <p className="text-gray-300 mb-4">
              <a href="/privacy" className="text-primary-300 hover:underline">{t.security.privacyPolicy}</a>
              {' • '}
              <a href="/terms" className="text-primary-300 hover:underline">{t.security.terms}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

