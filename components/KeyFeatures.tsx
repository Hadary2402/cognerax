'use client'

import { 
  Bot, 
  Briefcase, 
  Users, 
  FileText, 
  UserCheck, 
  Calendar, 
  BarChart3, 
  Languages 
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function KeyFeatures() {
  const { t, dir } = useLanguage()

  const features = [
    {
      icon: Bot,
      title: t.features.aiCopilot.title,
      description: t.features.aiCopilot.desc,
    },
    {
      icon: Briefcase,
      title: t.features.caseManagement.title,
      description: t.features.caseManagement.desc,
    },
    {
      icon: Users,
      title: t.features.clientManagement.title,
      description: t.features.clientManagement.desc,
    },
    {
      icon: FileText,
      title: t.features.documentManagement.title,
      description: t.features.documentManagement.desc,
    },
    {
      icon: UserCheck,
      title: t.features.teamCollaboration.title,
      description: t.features.teamCollaboration.desc,
    },
    {
      icon: Calendar,
      title: t.features.calendar.title,
      description: t.features.calendar.desc,
    },
    {
      icon: BarChart3,
      title: t.features.analytics.title,
      description: t.features.analytics.desc,
    },
    {
      icon: Languages,
      title: t.features.multilingual.title,
      description: t.features.multilingual.desc,
    },
  ]

  return (
    <section id="features" className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300">
      <div className="section-container">
        <div className="max-w-7xl mx-auto">
          {/* Header - Centered */}
          <div className="text-center mb-16">
            <h2 className="section-title text-center">{t.features.title}</h2>
            <p className="section-subtitle mx-auto text-center">
              {t.features.subtitle}
            </p>
          </div>
          
          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-primary-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-primary-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800 transition-shadow duration-300 text-left"
              >
                {/* Icon - Left side */}
                <div className="bg-primary-100 dark:bg-gray-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mr-auto">
                  <Icon className="text-primary-600 dark:text-primary-400" size={24} />
                </div>
                {/* Title - Left-aligned */}
                <h3 className="text-xl font-semibold text-legal-dark dark:text-white mb-2 text-left">{feature.title}</h3>
                {/* Description - Left-aligned */}
                <p className="text-legal-gray dark:text-gray-300 text-left">{feature.description}</p>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}

