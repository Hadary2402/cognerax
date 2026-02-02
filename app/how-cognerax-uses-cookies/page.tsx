'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LanguageThemeToggle from '@/components/LanguageThemeToggle'
import Link from 'next/link'

export default function CookiesPage() {
  const { dir } = useLanguage()
  const positionClass = dir === 'rtl' ? 'bottom-6 left-6' : 'bottom-6 right-6'

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-12 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h1 className={`text-4xl md:text-5xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
              How CogneraX Uses Cookies
            </h1>
            <p className={`text-xl text-legal-gray dark:text-gray-300 ${dir === 'rtl' ? 'text-right' : ''}`}>
              Learn about how we use cookies to improve your experience on our website.
            </p>
          </div>

          <div className={`prose prose-lg dark:prose-invert max-w-none ${dir === 'rtl' ? 'text-right' : ''}`}>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 lg:p-10 space-y-6">
              <section>
                <h2 className={`text-2xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  What Are Cookies?
                </h2>
                <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                  Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  How We Use Cookies
                </h2>
                <p className={`text-gray-700 dark:text-gray-300 leading-relaxed mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  CogneraX uses cookies for the following purposes:
                </p>
                <ul className={`list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ${dir === 'rtl' ? 'text-right' : ''} ${dir === 'rtl' ? 'list-outside' : ''}`}>
                  <li>To enhance your browsing experience by remembering your preferences</li>
                  <li>To analyze site traffic and understand how visitors interact with our website</li>
                  <li>To improve website functionality and performance</li>
                  <li>To provide personalized content and features</li>
                </ul>
              </section>

              <section>
                <h2 className={`text-2xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  Types of Cookies We Use
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className={`text-xl font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      Essential Cookies
                    </h3>
                    <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                      These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas of the website.
                    </p>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      Analytics Cookies
                    </h3>
                    <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.
                    </p>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      Preference Cookies
                    </h3>
                    <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                      These cookies remember your preferences, such as language and theme settings, to provide a more personalized experience.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className={`text-2xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  Managing Your Cookie Preferences
                </h2>
                <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                  You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can impact your user experience and parts of our website may no longer be fully accessible.
                </p>
                <p className={`text-gray-700 dark:text-gray-300 leading-relaxed mt-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  Most browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. You can also clear cookies that have already been set.
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  Updates to This Policy
                </h2>
                <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page periodically to stay informed about our use of cookies.
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  Contact Us
                </h2>
                <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                  If you have any questions about our use of cookies, please contact us through our{' '}
                  <Link
                    href="/request-demo"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline font-semibold"
                  >
                    Request Demo
                  </Link>
                  {' '}page.
                </p>
              </section>
            </div>
          </div>

          <div className={`mt-8 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <Link
              href="/"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
      <Footer />
      <div className={`fixed ${positionClass} z-50`}>
        <LanguageThemeToggle />
      </div>
    </main>
  )
}

