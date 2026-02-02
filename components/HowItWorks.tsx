'use client'

import { UserPlus, FileText, Upload, Bot } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Icon configuration - doesn't change with language
const stepsConfig = [
  {
    number: '01',
    icon: UserPlus,
    key: 'step1',
  },
  {
    number: '02',
    icon: FileText,
    key: 'step2',
  },
  {
    number: '03',
    icon: Upload,
    key: 'step3',
  },
  {
    number: '04',
    icon: Bot,
    key: 'step4',
  },
]

export default function HowItWorks() {
  const { t, dir } = useLanguage()
  
  // Build steps from config and translations
  const steps = stepsConfig.map(config => {
    const stepData = t.howItWorks[config.key as keyof typeof t.howItWorks] as { title: string; desc: string } | undefined;
    return {
      ...config,
      ...(stepData || {}),
    };
  })
  
  return (
    <section className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 py-20 transition-colors duration-300">
      <div className="section-container">
        <div className="max-w-7xl mx-auto">
          {/* Header - Centered */}
          <div className="text-center mb-16">
            <h2 className="section-title dark:text-white text-center">{t.howItWorks.title}</h2>
            <p className="section-subtitle mx-auto text-center dark:text-gray-300">
              {t.howItWorks.subtitle}
            </p>
          </div>
          
          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative flex flex-col">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:shadow-gray-900 hover:shadow-xl dark:hover:shadow-gray-800 transition-shadow duration-300 border-t-4 border-primary-600 dark:border-primary-500 text-left flex flex-col h-full">
                  <div className="absolute -top-4 -right-4 bg-primary-600 dark:bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="bg-primary-100 dark:bg-gray-700 w-16 h-16 rounded-lg flex items-center justify-center mb-6 mr-auto">
                    <Icon className="text-primary-600 dark:text-primary-400" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-legal-dark dark:text-white mb-3 text-left">{step.title}</h3>
                  <p className="text-legal-gray dark:text-gray-300 text-left flex-grow">{step.desc}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden lg:block absolute top-1/2 transform -translate-y-1/2 ${dir === 'rtl' ? '-left-4' : '-right-4'}`}>
                    <div className="w-8 h-0.5 bg-primary-300 dark:bg-gray-600"></div>
                    <div className={`absolute top-1/2 transform -translate-y-1/2 w-0 h-0 ${dir === 'rtl' ? 'left-0 border-r-8 border-r-primary-300 dark:border-r-gray-600' : 'right-0 border-l-8 border-l-primary-300 dark:border-l-gray-600'} border-t-4 border-t-transparent border-b-4 border-b-transparent`}></div>
                  </div>
                )}
              </div>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}

