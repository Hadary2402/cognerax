'use client'

import { Clock, FolderTree, Eye, Shield, TrendingUp, Lock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Icon configuration - doesn't change with language
const benefitsConfig = [
  {
    icon: Clock,
    key: 'timeSavings',
  },
  {
    icon: FolderTree,
    key: 'organization',
  },
  {
    icon: Eye,
    key: 'visibility',
  },
  {
    icon: Shield,
    key: 'compliance',
  },
  {
    icon: TrendingUp,
    key: 'scalability',
  },
  {
    icon: Lock,
    key: 'security',
  },
]

export default function Benefits() {
  const { t, dir } = useLanguage()
  
  // Build benefits from config and translations
  const benefits = benefitsConfig.map(config => {
    const benefitData = t.benefits[config.key as keyof typeof t.benefits] as { title: string; desc: string; stat: string } | undefined;
    return {
      ...config,
      ...(benefitData || {}),
    };
  })
  
  return (
    <section className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300">
      <div className="section-container">
        <div className="max-w-7xl mx-auto">
          {/* Header - Centered */}
          <div className="text-center mb-16">
            <h2 className="section-title dark:text-white text-center">{t.benefits.title}</h2>
            <p className="section-subtitle mx-auto dark:text-gray-300 text-center">
              {t.benefits.subtitle}
            </p>
          </div>
          
          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index}
                className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl border border-primary-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-gray-600 transition-all duration-300 text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary-100 dark:bg-gray-600 w-14 h-14 rounded-lg flex items-center justify-center mr-auto">
                    <Icon className="text-primary-600 dark:text-primary-400" size={28} />
                  </div>
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-gray-600 px-3 py-1 rounded-full">
                    {benefit.stat}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-legal-dark dark:text-white mb-3 text-left">{benefit.title}</h3>
                <p className="text-legal-gray dark:text-gray-300 text-left">{benefit.desc}</p>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}

