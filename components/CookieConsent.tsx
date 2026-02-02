'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent')
    
    if (!cookieConsent) {
      // Show popup after a small delay for better UX
      setTimeout(() => {
        setIsVisible(true)
        // Trigger animation after a brief moment
        setTimeout(() => setIsAnimating(true), 10)
      }, 500)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    closePopup()
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    closePopup()
  }

  const closePopup = () => {
    setIsAnimating(false)
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[100] transition-transform duration-300 ease-out ${
        isAnimating ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                We use cookies to enhance your browsing experience and analyze site traffic. By continuing to use this site, you consent to our use of cookies.{' '}
                <Link
                  href="/how-cognerax-uses-cookies"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline font-semibold"
                >
                  Learn more
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleDecline}
                className="px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 rounded-lg transition-colors duration-200"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

