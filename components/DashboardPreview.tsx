'use client'

import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DashboardPreview() {
  const { t } = useLanguage()
  
  return (
    <section className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300">
      <div className="section-container">
        <div className="max-w-7xl mx-auto">
          {/* Header - Centered */}
          <div className="text-center mb-16">
            <h2 className="section-title dark:text-white text-center">{t.dashboard.title}</h2>
            <p className="section-subtitle mx-auto text-center dark:text-gray-300">
              {t.dashboard.subtitle}
            </p>
          </div>
          
          {/* Dashboard Preview Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/dashboard-preview.png"
                alt="Dashboard Preview"
                width={1200}
                height={800}
                className="w-full h-auto rounded-2xl"
                style={{
                  borderRadius: '1rem',
                  objectFit: 'contain'
                }}
              />
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

