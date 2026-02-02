'use client'

import { Building2, Briefcase, Users } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Icon configuration - doesn't change with language
const useCasesConfig = [
  {
    icon: Building2,
    key: 'lawFirms',
  },
  {
    icon: Briefcase,
    key: 'legalDepartments',
  },
  {
    icon: Users,
    key: 'consultants',
  },
]

export default function UseCases() {
  const { t, dir } = useLanguage()
  
  // Build use cases from config and translations
  const useCases = useCasesConfig.map(config => {
    const translation = t.useCases[config.key as keyof typeof t.useCases] as { title: string; desc: string; size?: string } | undefined
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
            <h2 className="section-title dark:text-white text-center">{t.useCases.title}</h2>
            <p className="section-subtitle mx-auto dark:text-gray-300 text-center">
              {t.useCases.subtitle}
            </p>
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <div 
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md dark:shadow-gray-900 hover:shadow-xl dark:hover:shadow-gray-800 transition-shadow duration-300 text-left"
              >
                <div className="bg-primary-100 dark:bg-gray-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 mr-auto">
                  <Icon className="text-primary-600 dark:text-primary-400" size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-legal-dark dark:text-white mb-2 text-left">{useCase.title}</h3>
                <p className="text-legal-gray dark:text-gray-300 mb-4 text-left">{useCase.desc}</p>
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 text-left block">{useCase.size}</span>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}

