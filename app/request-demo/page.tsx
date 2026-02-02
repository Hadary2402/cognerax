'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LanguageThemeToggle from '@/components/LanguageThemeToggle'
import { sanitizeObjectForExcel, validateEmail, validateNotEmpty } from '@/lib/sanitize'
import { generateEmailTemplate, generatePlainTextEmail } from '@/lib/emailTemplate'
import { checkRateLimit, recordSubmission, formatRetryAfter } from '@/lib/rateLimit'
import { unicodeObjectToText } from '@/lib/unicodeConverter'
import Turnstile from '@/components/Turnstile'
import { API_ENDPOINTS } from '@/lib/apiConfig'

export default function RequestDemoPage() {
  const { t, dir } = useLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const listenerAttachedRef = useRef(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    website: '' // Honeypot field - should always be empty
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rateLimited'>('idle')
  const [rateLimitRetryAfter, setRateLimitRetryAfter] = useState<number>(0)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileError, setTurnstileError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('[Request Demo Form] handleSubmit STARTED - PREVENTING DEFAULT')
    e.preventDefault()
    e.stopPropagation()
    if (e.nativeEvent && 'stopImmediatePropagation' in e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation()
    }
    
    // Honeypot check - if this field is filled, it's likely a bot
    // Check both React state AND actual DOM element (in case value was changed via inspect element)
    const honeypotStateValue = formData.website?.trim() || ''
    let honeypotDOMValue = ''
    
    try {
      const honeypotField = document.getElementById('website') as HTMLInputElement
      if (honeypotField) {
        honeypotDOMValue = honeypotField.value?.trim() || ''
      }
    } catch (error) {
      // Ignore errors
    }
    
    // Reject if either React state or DOM has a value
    if (honeypotStateValue !== '' || honeypotDOMValue !== '') {
      // Silently reject - don't show any error to avoid alerting bots
      console.warn('Bot detection: honeypot field filled', {
        stateValue: honeypotStateValue,
        domValue: honeypotDOMValue
      })
      // Reset the field to prevent resubmission attempts
      setFormData(prev => ({ ...prev, website: '' }))
      // Clear DOM field too
      try {
        const honeypotField = document.getElementById('website') as HTMLInputElement
        if (honeypotField) {
          honeypotField.value = ''
        }
      } catch (error) {
        // Ignore
      }
      return
    }
    
    // Convert unicode to text first (exclude honeypot field)
    const { website, ...formDataWithoutHoneypot } = formData
    const unicodeConvertedData = unicodeObjectToText(formDataWithoutHoneypot)

    // Validate required fields
    console.log('[Request Demo Form] Validating fields:', {
      name: unicodeConvertedData.name,
      email: unicodeConvertedData.email,
      company: unicodeConvertedData.company
    })
    
    if (!validateNotEmpty(unicodeConvertedData.name) || !validateNotEmpty(unicodeConvertedData.email) || 
        !validateNotEmpty(unicodeConvertedData.company)) {
      console.error('[Request Demo Form] Validation failed - missing required fields')
      setSubmitStatus('error')
      return
    }

    // Validate email format
    if (!validateEmail(unicodeConvertedData.email)) {
      console.error('[Request Demo Form] Validation failed - invalid email format')
      setSubmitStatus('error')
      return
    }
    
    console.log('[Request Demo Form] Validation passed')

    // Check rate limiting before submission
    const rateLimitCheck = checkRateLimit({
      ...unicodeConvertedData,
      formType: 'request-demo'
    })
    
    if (rateLimitCheck.isLimited) {
      setRateLimitRetryAfter(rateLimitCheck.retryAfter)
      setSubmitStatus('rateLimited')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Double-check honeypot field right before submission (extra security)
      const finalHoneypotCheck = document.getElementById('website') as HTMLInputElement
      if (finalHoneypotCheck && finalHoneypotCheck.value?.trim() !== '') {
        console.warn('Bot detection: honeypot field filled right before submission')
        setIsSubmitting(false)
        setFormData(prev => ({ ...prev, website: '' }))
        finalHoneypotCheck.value = ''
        return
      }
      
      // Don't sanitize before email template - let the template handle it with sanitizeTextContent
      // This preserves apostrophes in normal words like "Rico's"
      const timestamp = new Date().toISOString()
      
      // Prepare data with timestamp for email template (unsanitized - template will sanitize)
      const emailData = {
        ...unicodeConvertedData,
        timestamp
      }
      
      // Generate HTML email template - it will sanitize with sanitizeTextContent (preserves apostrophes)
      const emailHtml = generateEmailTemplate(emailData, 'request-demo')
      const emailText = generatePlainTextEmail(emailData, 'request-demo')
      
      // For JSON body, sanitize for Excel only (JSON.stringify handles JSON escaping)
      const sanitizedDataForApi = sanitizeObjectForExcel(unicodeConvertedData)
      
      console.log('[Request Demo Form] About to send fetch to /api/request-demo')
      console.log('[Request Demo Form] Data being sent:', {
        name: sanitizedDataForApi.name,
        email: sanitizedDataForApi.email,
        company: sanitizedDataForApi.company
      })
      
      const response = await fetch(API_ENDPOINTS.REQUEST_DEMO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizedDataForApi.name,
          email: sanitizedDataForApi.email,
          company: sanitizedDataForApi.company,
          message: sanitizedDataForApi.message,
          formType: 'request-demo',
          timestamp,
          emailHtml,
          emailText,
          turnstileToken: turnstileToken
        })
      })

      console.log('[Request Demo Form] Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[Request Demo Form] API error:', errorData)
        
        // Check for specific error types
        if (errorData.error) {
          // Display the API error message
          console.error('[Request Demo Form] API error message:', errorData.error)
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      const responseData = await response.json()
      console.log('[Request Demo Form] Success:', responseData)

      setSubmitStatus('success')
      setFormData({ name: '', email: '', company: '', message: '', website: '' })
      setTurnstileToken(null) // Reset token after successful submission
      
      // Record successful submission for rate limiting
      // Use unicodeConvertedData (same as check) to ensure identifier matching
      recordSubmission({
        ...unicodeConvertedData,
        formType: 'request-demo',
        timestamp
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h1 className={`text-4xl md:text-5xl font-bold text-legal-dark dark:text-white mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t.nav.requestDemo}
            </h1>
            <p className={`text-xl text-legal-gray dark:text-gray-300 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t.requestDemo.subtitle}
            </p>
          </div>

          <form 
            ref={(el) => {
              console.log('[Request Demo Form] Ref callback called with element:', el)
              if (el) {
                (formRef as any).current = el
                
                // Attach listener immediately when form mounts (no setTimeout)
                if (!listenerAttachedRef.current) {
                  console.log('[Request Demo Form] Form element mounted, attaching native event listener IMMEDIATELY', el)
                  listenerAttachedRef.current = true
                  
                  const handleNativeSubmit = (e: Event) => {
                    console.log('[Request Demo Form] NATIVE SUBMIT EVENT CAUGHT - PREVENTING DEFAULT AND REDIRECT', e)
                    e.preventDefault()
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    if (e.cancelable) {
                      e.preventDefault()
                    }
                    return false
                  }

                  // Attach in capture phase FIRST (runs before React's handler)
                  el.addEventListener('submit', handleNativeSubmit, { capture: true, passive: false })
                  console.log('[Request Demo Form] Native event listener attached in capture phase')
                  
                  // Also attach in bubble phase as backup
                  el.addEventListener('submit', handleNativeSubmit, { capture: false, passive: false })
                  console.log('[Request Demo Form] Native event listener attached in bubble phase')
                  
                  // Also intercept onsubmit attribute
                  const originalOnSubmit = el.onsubmit
                  el.onsubmit = (e) => {
                    console.log('[Request Demo Form] onsubmit attribute caught')
                    if (e) {
                      e.preventDefault()
                    }
                    return false
                  }
                }
              }
            }}
            onSubmit={handleSubmit}
            action="/api/request-demo"
            method="post"
            noValidate
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 lg:p-10 relative" 
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 30px rgba(2, 132, 199, 0.2)'
            }}
          >
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className={`block text-sm font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.requestDemo.name} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-legal-dark dark:text-white focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 transition-colors ${dir === 'rtl' ? 'text-right' : ''}`}
                  placeholder={t.requestDemo.namePlaceholder}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block text-sm font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.requestDemo.email} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-legal-dark dark:text-white focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 transition-colors ${dir === 'rtl' ? 'text-right' : ''}`}
                  placeholder={t.requestDemo.emailPlaceholder}
                />
              </div>

              {/* Company Field */}
              <div>
                <label htmlFor="company" className={`block text-sm font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.requestDemo.company} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-legal-dark dark:text-white focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 transition-colors ${dir === 'rtl' ? 'text-right' : ''}`}
                  placeholder={t.requestDemo.companyPlaceholder}
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className={`block text-sm font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.requestDemo.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-legal-dark dark:text-white focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 transition-colors resize-none ${dir === 'rtl' ? 'text-right' : ''}`}
                  placeholder={t.requestDemo.messagePlaceholder}
                />
              </div>

              {/* Honeypot field - hidden from users but visible to bots */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', visibility: 'hidden' }}>
                <label htmlFor="website">Website (leave blank)</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              {/* Turnstile Captcha */}
              <div className="flex justify-center">
                <Turnstile
                  siteKey="0x4AAAAAACBPITLIpkr5lgfq"
                  onSuccess={(token) => {
                    console.log('[Request Demo Form] Turnstile verified, token received')
                    setTurnstileToken(token)
                    setTurnstileError(false)
                  }}
                  onError={() => {
                    console.error('[Request Demo Form] Turnstile error')
                    setTurnstileToken(null)
                    setTurnstileError(true)
                  }}
                  onExpire={() => {
                    console.log('[Request Demo Form] Turnstile token expired')
                    setTurnstileToken(null)
                  }}
                  theme="auto"
                  size="normal"
                />
              </div>
              {turnstileError && (
                <p className="text-red-500 text-sm text-center">
                  Please complete the captcha verification
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t.requestDemo.submitting : t.requestDemo.submit}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <p className="text-green-800 dark:text-green-300 font-semibold">
                    {t.requestDemo.successMessage}
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className={`p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <p className="text-red-800 dark:text-red-300 font-semibold">
                    {t.requestDemo.errorMessage}
                  </p>
                </div>
              )}

              {submitStatus === 'rateLimited' && (
                <div className={`p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <p className="text-yellow-800 dark:text-yellow-300 font-semibold">
                    {t.requestDemo.rateLimitMessage} {rateLimitRetryAfter > 0 && `(${formatRetryAfter(rateLimitRetryAfter)})`}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
      <Footer />
      <div className={`fixed ${dir === 'rtl' ? 'bottom-6 left-6' : 'bottom-6 right-6'} z-50`}>
        <LanguageThemeToggle />
      </div>
    </main>
  )
}

