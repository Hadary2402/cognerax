'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FAQ() {
  const { t, dir } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = t.faq.items || []

  return (
    <section id="faq" className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300">
      <div className="section-container">
        <div className="max-w-7xl mx-auto">
          {/* Header - Centered */}
          <div className="text-center mb-16">
            <h2 className="section-title dark:text-white text-center">{t.faq.title}</h2>
            <p className="section-subtitle mx-auto text-center dark:text-gray-300">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq: { question: string; answer: string }, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md dark:hover:shadow-gray-900 transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <span className="font-semibold text-legal-dark dark:text-white pr-4 text-left">{faq.question}</span>
                  <ChevronDown
                    className={`text-primary-600 dark:text-primary-400 flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                    size={20}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-legal-gray dark:text-gray-300 leading-relaxed text-left">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-legal-gray dark:text-gray-300 mb-4">{t.faq.stillHaveQuestions}</p>
            <a href="/contact" className={`text-primary-600 dark:text-primary-400 hover:underline font-semibold inline-flex items-center gap-2 ${
              dir === "rtl" ? "flex-row-reverse" : ""
            }`}>
              {t.faq.contactSupport}
              {dir === "rtl" ? " ←" : " →"}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

