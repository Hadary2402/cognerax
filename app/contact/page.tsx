'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LanguageThemeToggle from '@/components/LanguageThemeToggle'
import { sanitizeObjectForExcel, validateEmail, validateNotEmpty } from '@/lib/sanitize'
import { generateEmailTemplate, generatePlainTextEmail } from '@/lib/emailTemplate'
import { checkRateLimit, recordSubmission, formatRetryAfter, debugRateLimit, getRawRateLimitData } from '@/lib/rateLimit'
import { unicodeObjectToText } from '@/lib/unicodeConverter'
import Turnstile from '@/components/Turnstile'
import { API_ENDPOINTS } from '@/lib/apiConfig'

export default function ContactPage() {
  const { t, dir } = useLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const listenerAttachedRef = useRef(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    inquiryType: '',
    message: '',
    website: '' // Honeypot field - should always be empty
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rateLimited'>('idle')
  const [rateLimitRetryAfter, setRateLimitRetryAfter] = useState<number>(0)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileError, setTurnstileError] = useState(false)

  // Memoize Turnstile callbacks to prevent widget reload
  const handleTurnstileSuccess = useCallback((token: string) => {
    console.log('[Contact Form] Turnstile verified, token received')
    setTurnstileToken(token)
    setTurnstileError(false)
  }, [])

  const handleTurnstileError = useCallback(() => {
    console.error('[Contact Form] Turnstile error')
    setTurnstileToken(null)
    setTurnstileError(true)
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    console.log('[Contact Form] Turnstile token expired')
    setTurnstileToken(null)
  }, [])

  const inquiryTypes = [
    { value: 'pricing', label: 'Pricing' },
    { value: 'inquiries', label: 'Inquiries' },
    { value: 'technical-support', label: 'Technical Support' },
    { value: 'others', label: 'Others' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent any event bubbling
    
    // Check Turnstile token
    if (!turnstileToken) {
      console.error('[Contact Form] Turnstile token missing');
      setTurnstileError(true);
      setSubmitStatus('error');
      return;
    }
    
    // Debug: Log that form submission started
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Form submission started - checking honeypot...')
    }
    
    // Honeypot check - CRITICAL: Check FIRST before anything else
    // Check both React state AND actual DOM element (in case value was changed via inspect element)
    const honeypotStateValue = formData.website?.trim() || ''
    let honeypotDOMValue = ''
    let honeypotField: HTMLInputElement | null = null
    
    try {
      honeypotField = document.getElementById('website') as HTMLInputElement
      if (honeypotField) {
        honeypotDOMValue = honeypotField.value?.trim() || ''
      }
    } catch (error) {
      console.error('Error checking honeypot field:', error)
    }
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Honeypot check:', {
        stateValue: honeypotStateValue,
        domValue: honeypotDOMValue,
        fieldExists: !!honeypotField
      })
    }
    
    // Reject if either React state or DOM has a value
    if (honeypotStateValue !== '' || honeypotDOMValue !== '') {
      // Silently reject - don't show any error to avoid alerting bots
      console.error('🚫 BOT DETECTED: Honeypot field filled! Submission BLOCKED.', {
        stateValue: honeypotStateValue,
        domValue: honeypotDOMValue,
        timestamp: new Date().toISOString()
      })
      
      // Reset the field to prevent resubmission attempts
      setFormData(prev => ({ ...prev, website: '' }))
      
      // Clear DOM field too
      if (honeypotField) {
        honeypotField.value = ''
      }
      
      // Prevent form submission completely
      e.preventDefault()
      e.stopPropagation()
      setIsSubmitting(false)
      return false
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Honeypot check passed - continuing with submission...')
    }
    
    // Convert unicode to text first (exclude honeypot field)
    const { website, ...formDataWithoutHoneypot } = formData
    const unicodeConvertedData = unicodeObjectToText(formDataWithoutHoneypot)

    // Validate required fields
    if (!validateNotEmpty(unicodeConvertedData.name) || !validateNotEmpty(unicodeConvertedData.company) || 
        !validateNotEmpty(unicodeConvertedData.email) || !validateNotEmpty(unicodeConvertedData.inquiryType)) {
      setSubmitStatus('error')
      return
    }

    // Validate email format
    if (!validateEmail(unicodeConvertedData.email)) {
      setSubmitStatus('error')
      return
    }

    // Prepare data for rate limiting (use same structure for check and record)
    const rateLimitData = {
      ...unicodeConvertedData,
      formType: 'contact-us' as const
    }
    
    // Check rate limiting before submission
    // IMPORTANT: Use unicodeConvertedData (same as what will be recorded) to ensure matching identifiers
    const rateLimitCheck = checkRateLimit(rateLimitData)
    
    // Debug logging in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[Contact Form] Rate limit check data:', rateLimitData)
      console.log('[Contact Form] Rate limit check - identifiers will be:', {
        email: rateLimitData.email,
        company: rateLimitData.company,
        name: rateLimitData.name,
        formType: rateLimitData.formType
      })
      debugRateLimit(rateLimitData)
      console.log('[Contact Form] Rate limit check result:', rateLimitCheck)
    }
    
    if (rateLimitCheck.isLimited) {
      console.warn('🚫 Rate limit exceeded! Blocking submission.')
      setRateLimitRetryAfter(rateLimitCheck.retryAfter)
      setSubmitStatus('rateLimited')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // CRITICAL: Double-check honeypot field right before fetch (catches DOM modifications after initial check)
      const finalHoneypotCheck = document.getElementById('website') as HTMLInputElement
      const finalHoneypotValue = finalHoneypotCheck?.value?.trim() || ''
      
      if (finalHoneypotValue !== '') {
        console.error('🚫 BOT DETECTED: Honeypot field filled right before submission!', {
          value: finalHoneypotValue,
          timestamp: new Date().toISOString()
        })
        setIsSubmitting(false)
        setSubmitStatus('idle')
        setFormData(prev => ({ ...prev, website: '' }))
        if (finalHoneypotCheck) {
          finalHoneypotCheck.value = ''
        }
        // DO NOT proceed with submission
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
      const emailHtml = generateEmailTemplate(emailData, 'contact-us')
      const emailText = generatePlainTextEmail(emailData, 'contact-us')
      
      // For JSON body, sanitize for Excel only (JSON.stringify handles JSON escaping)
      const sanitizedDataForApi = sanitizeObjectForExcel(unicodeConvertedData)
      
      const response = await fetch(API_ENDPOINTS.CONTACT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizedDataForApi.name,
          company: sanitizedDataForApi.company,
          email: sanitizedDataForApi.email,
          inquiryType: sanitizedDataForApi.inquiryType,
          message: sanitizedDataForApi.message,
          formType: 'contact-us',
          timestamp,
          emailHtml,
          emailText,
          turnstileToken: turnstileToken
        })
      })

      const responseData = await response.json().catch(() => ({}))
      console.log('[Contact Form] Response data:', responseData)
      
      if (!response.ok) {
        console.error('[Contact Form] API error:', responseData)
        
        // Check for specific error types
        if (responseData.error) {
          // Display the API error message
          console.error('[Contact Form] API error message:', responseData.error)
        }
        
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`)
      }

      // Success - show notification
      console.log('[Contact Form] Success:', responseData)
      setSubmitStatus('success')
      setFormData({ name: '', company: '', email: '', inquiryType: '', message: '', website: '' })
      setTurnstileToken(null) // Reset token after successful submission
      
      // Record successful submission for rate limiting
      // IMPORTANT: Use same data structure as check (rateLimitData) to ensure identifier matching
      // This must match exactly what was passed to checkRateLimit above
      const dataToRecord = {
        ...rateLimitData,
        timestamp
      }
      
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log('[Contact Form] Recording submission with data:', dataToRecord)
      }
      
      recordSubmission(dataToRecord)
      
      // Debug: Verify the record happened
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log('[Contact Form] Submission recorded. Checking localStorage...')
        const stored = getRawRateLimitData()
        console.log('[Contact Form] Current rate limit data in localStorage:', stored)
      }
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
              {t.nav.contactUs}
            </h1>
            <p className={`text-xl text-legal-gray dark:text-gray-300 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t.contact.subtitle}
            </p>
          </div>

          <form 
            ref={(el) => {
              if (el) {
                (formRef as any).current = el
                if (!listenerAttachedRef.current) {
                  const handleNativeSubmit = (e: Event) => {
                    console.log('[Contact Form] NATIVE SUBMIT EVENT CAUGHT - PREVENTING DEFAULT AND REDIRECT', e)
                    e.preventDefault()
                    e.stopPropagation()
                    e.stopImmediatePropagation()
                    if (e.cancelable) {
                      e.preventDefault()
                    }
                    return false
                  }
                  el.addEventListener('submit', handleNativeSubmit, { capture: true, passive: false })
                  el.addEventListener('submit', handleNativeSubmit, { capture: false, passive: false })
                  listenerAttachedRef.current = true
                }
              }
            }}
            onSubmit={handleSubmit}
            action="/api/contact"
            method="post"
            noValidate
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 lg:p-10 relative" 
            style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 30px rgba(2, 132, 199, 0.2)'
          }}>
            <div className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label htmlFor="name" className={`block text-sm font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.contact.fullName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-legal-dark dark:text-white focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 transition-colors ${dir === 'rtl' ? 'text-right' : ''}`}
                  placeholder={t.contact.fullNamePlaceholder}
                />
              </div>

              {/* Company Field */}
              <div>
                <label htmlFor="company" className={`block text-sm font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.contact.company} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-legal-dark dark:text-white focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 transition-colors ${dir === 'rtl' ? 'text-right' : ''}`}
                  placeholder={t.contact.companyPlaceholder}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block text-sm font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.contact.email} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-legal-dark dark:text-white focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 transition-colors ${dir === 'rtl' ? 'text-right' : ''}`}
                  placeholder={t.contact.emailPlaceholder}
                />
              </div>

              {/* Inquiry Type Field */}
              <div>
                <label htmlFor="inquiryType" className={`block text-sm font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.contact.inquiryType} <span className="text-red-500">*</span>
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  required
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-legal-dark dark:text-white focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 transition-colors ${dir === 'rtl' ? 'text-right' : ''}`}
                >
                  <option value="">{t.contact.selectInquiryType}</option>
                  {inquiryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {t.contact.inquiryTypes[type.value as keyof typeof t.contact.inquiryTypes]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className={`block text-sm font-semibold text-legal-dark dark:text-white mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-legal-dark dark:text-white focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 transition-colors resize-none ${dir === 'rtl' ? 'text-right' : ''}`}
                  placeholder={t.contact.messagePlaceholder}
                />
              </div>

              {/* Honeypot field - hidden from users but visible to bots */}
              {/* DO NOT FILL THIS FIELD - Bots that fill it will be blocked */}
              <div 
                style={{ 
                  position: 'absolute', 
                  left: '-9999px', 
                  opacity: 0, 
                  pointerEvents: 'none', 
                  visibility: 'hidden',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden'
                }}
                aria-hidden="true"
              >
                <label htmlFor="website" style={{ display: 'none' }}>Website (leave blank)</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  value={formData.website}
                  onChange={handleChange}
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: 0,
                    border: 0,
                    opacity: 0
                  }}
                />
              </div>

              {/* Turnstile Captcha */}
              <div className="flex justify-center">
                <Turnstile
                  siteKey="0x4AAAAAACBPITLIpkr5lgfq"
                  onSuccess={handleTurnstileSuccess}
                  onError={handleTurnstileError}
                  onExpire={handleTurnstileExpire}
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
                {isSubmitting ? t.contact.submitting : t.contact.submit}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <p className="text-green-800 dark:text-green-300 font-semibold">
                    {t.contact.successMessage}
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className={`p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <p className="text-red-800 dark:text-red-300 font-semibold">
                    {t.contact.errorMessage}
                  </p>
                </div>
              )}

              {submitStatus === 'rateLimited' && (
                <div className={`p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <p className="text-yellow-800 dark:text-yellow-300 font-semibold">
                    {t.contact.rateLimitMessage} {rateLimitRetryAfter > 0 && `(${formatRetryAfter(rateLimitRetryAfter)})`}
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

