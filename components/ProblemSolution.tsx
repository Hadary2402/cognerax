'use client'

import { X, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ProblemSolution() {
  const { t, dir } = useLanguage()

  return (
    <section className="bg-gradient-to-br from-legal-dark to-legal-blue dark:from-gray-900 dark:to-gray-800 py-20 text-white dark:text-gray-100 transition-colors duration-300">
      <div className="section-container">
        <div className="max-w-7xl mx-auto">
          <div className={`grid lg:grid-cols-2 gap-12 ${dir === 'rtl' ? 'lg:grid-flow-dense' : ''}`}>
          {/* Problem Section - Left in RTL, Left in LTR */}
          <div className={`${dir === 'rtl' ? 'lg:col-start-1 lg:row-start-1' : ''} text-left`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-left">{t.problemSolution.problemTitle}</h2>
            <p className="text-lg text-gray-300 mb-8 text-left">
              {t.problemSolution.problemSubtitle}
            </p>
            <div className="space-y-4">
              {t.problemSolution.problems.map((problem, index) => (
                <div key={index} className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1 mr-3" size={20} />
                  <p className="text-gray-300 text-left">{problem}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Section - Right in RTL, Right in LTR */}
          <div className={`${dir === 'rtl' ? 'lg:col-start-2' : ''} text-left`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-left">{t.problemSolution.solutionTitle}</h2>
            <p className="text-lg text-gray-300 mb-8 text-left">
              {t.problemSolution.solutionSubtitle}
            </p>
            <div className="space-y-4">
              {t.problemSolution.solutions.map((solution, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-1 mr-3" size={20} />
                  <p className="text-gray-300 text-left">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

