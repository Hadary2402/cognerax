"use client";

import { useState, useRef, useCallback } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { sanitizeForExcel, validateEmail, validateNotEmpty } from "@/lib/sanitize";
import { generateEmailTemplate, generatePlainTextEmail } from "@/lib/emailTemplate";
import { checkRateLimit, recordSubmission, formatRetryAfter } from "@/lib/rateLimit";
import { unicodeToText } from "@/lib/unicodeConverter";
import Turnstile from "@/components/Turnstile";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export default function Newsletter() {
  const { t, dir } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const listenerAttachedRef = useRef(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot field - should always be empty
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error" | "rateLimited" | "alreadySubscribed"
  >("idle");
  const [rateLimitRetryAfter, setRateLimitRetryAfter] = useState<number>(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);

  // Memoize Turnstile callbacks to prevent widget reload
  const handleTurnstileSuccess = useCallback((token: string) => {
    console.log('[Newsletter Form] Turnstile verified, token received');
    setTurnstileToken(token);
    setTurnstileError(false);
  }, []);

  const handleTurnstileError = useCallback(() => {
    console.error('[Newsletter Form] Turnstile error');
    setTurnstileToken(null);
    setTurnstileError(true);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    console.log('[Newsletter Form] Turnstile token expired');
    setTurnstileToken(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Newsletter Form] handleSubmit called');
    
    // Check API endpoint configuration
    if (!API_ENDPOINTS.NEWSLETTER) {
      console.error('[Newsletter Form] API endpoint not configured');
      setSubmitStatus("error");
      return;
    }
    
    // Check if API base URL is set (warn if using relative path)
    const apiBaseUrl = typeof window !== 'undefined' ? (window as any).__API_BASE_URL__ : '';
    if (!apiBaseUrl && API_ENDPOINTS.NEWSLETTER.startsWith('/')) {
      console.error('[Newsletter Form] ⚠️ WARNING: API base URL not configured!');
      console.error('[Newsletter Form] Using relative path:', API_ENDPOINTS.NEWSLETTER);
      console.error('[Newsletter Form] This will NOT work with static hosting.');
      console.error('[Newsletter Form] Please set NEXT_PUBLIC_API_BASE_URL environment variable.');
      setSubmitStatus("error");
      return;
    }
    
    console.log('[Newsletter Form] API endpoint:', API_ENDPOINTS.NEWSLETTER);
    console.log('[Newsletter Form] API base URL:', apiBaseUrl || 'Not set (using relative)');
    
    // Check Turnstile token
    if (!turnstileToken) {
      console.error('[Newsletter Form] Turnstile token missing');
      setTurnstileError(true);
      setSubmitStatus("error");
      return;
    }
    
    // Honeypot check - if this field is filled, it's likely a bot
    // Check both React state AND actual DOM element (in case value was changed via inspect element)
    const honeypotStateValue = website?.trim() || '';
    let honeypotDOMValue = '';
    
    try {
      const honeypotField = document.getElementById('website') as HTMLInputElement;
      if (honeypotField) {
        honeypotDOMValue = honeypotField.value?.trim() || '';
      }
    } catch (error) {
      // Ignore errors
    }
    
    // Reject if either React state or DOM has a value
    if (honeypotStateValue !== '' || honeypotDOMValue !== '') {
      // Silently reject - don't show any error to avoid alerting bots
      console.warn("Bot detection: honeypot field filled", {
        stateValue: honeypotStateValue,
        domValue: honeypotDOMValue
      });
      // Reset the field to prevent resubmission attempts
      setWebsite("");
      // Clear DOM field too
      try {
        const honeypotField = document.getElementById('website') as HTMLInputElement;
        if (honeypotField) {
          honeypotField.value = '';
        }
      } catch (error) {
        // Ignore
      }
      return;
    }
    
    // Convert unicode to text first
    const unicodeConvertedEmail = unicodeToText(email);

    // Validate email
    if (!validateNotEmpty(unicodeConvertedEmail) || !validateEmail(unicodeConvertedEmail)) {
      setSubmitStatus("error");
      return;
    }

    // Check rate limiting before submission
    const rateLimitCheck = checkRateLimit({
      email: unicodeConvertedEmail,
      formType: 'newsletter'
    });
    
    if (rateLimitCheck.isLimited) {
      setRateLimitRetryAfter(rateLimitCheck.retryAfter);
      setSubmitStatus("rateLimited");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Double-check honeypot field right before submission (extra security)
      const finalHoneypotCheck = document.getElementById('website') as HTMLInputElement;
      if (finalHoneypotCheck && finalHoneypotCheck.value?.trim() !== '') {
        console.warn('Bot detection: honeypot field filled right before submission');
        setIsSubmitting(false);
        setWebsite("");
        finalHoneypotCheck.value = '';
        return;
      }
      
      // Don't sanitize before email template - let the template handle it with sanitizeTextContent
      // This preserves apostrophes in normal words like "Rico's"
      const timestamp = new Date().toISOString();
      
      // Prepare data with timestamp for email template (unsanitized - template will sanitize)
      const emailData = {
        email: unicodeConvertedEmail,
        timestamp
      };
      
      // Generate HTML email template - it will sanitize with sanitizeTextContent (preserves apostrophes)
      const emailHtml = generateEmailTemplate(emailData, 'newsletter');
      const emailText = generatePlainTextEmail(emailData, 'newsletter');
      
      // For JSON body, we can use the original email (JSON.stringify handles escaping)
      // But sanitize for Excel safety if needed
      const sanitizedEmailForApi = sanitizeForExcel(unicodeConvertedEmail);
      
      console.log('[Newsletter Form] Sending request to:', API_ENDPOINTS.NEWSLETTER);
      console.log('[Newsletter Form] Request payload:', {
        email: sanitizedEmailForApi,
        hasToken: !!turnstileToken
      });

      const response = await fetch(API_ENDPOINTS.NEWSLETTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizedEmailForApi,
          formType: 'newsletter',
          timestamp,
          emailHtml,
          emailText,
          turnstileToken: turnstileToken
        })
      });

      console.log('[Newsletter Form] Response status:', response.status);
      console.log('[Newsletter Form] Response ok:', response.ok);

      const result = await response.json().catch((parseError) => {
        console.error('[Newsletter Form] Failed to parse response as JSON:', parseError);
        return { error: 'Failed to parse server response' };
      });
      console.log('[Newsletter Form] Response data:', result);
      
      if (!response.ok) {
        console.error('[Newsletter Form] API error:', result);
        
        // Check for specific error types
        if (result.error) {
          // Display the API error message
          console.error('[Newsletter Form] API error message:', result.error);
        }
        
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }
      
      // Check if user is already subscribed
      if (result.alreadySubscribed) {
        console.log('[Newsletter Form] Already subscribed')
        setSubmitStatus("alreadySubscribed");
        setEmail("");
        setWebsite("");
        setTurnstileToken(null);
        // Don't record for rate limiting if already subscribed (no spam)
        return;
      }

      // Success - show notification
      console.log('[Newsletter Form] Success:', result)
      setSubmitStatus("success");
      setEmail("");
      setWebsite("");
      setTurnstileToken(null); // Reset token after successful submission
      
      // Record successful submission for rate limiting
      // Use unicodeConvertedEmail (same as check) to ensure identifier matching
      recordSubmission({
        email: unicodeConvertedEmail,
        formType: 'newsletter',
        timestamp
      });
    } catch (error: any) {
      console.error('[Newsletter Form] Error submitting newsletter subscription:', error);
      console.error('[Newsletter Form] Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      
      // Check if it's a network error
      if (error?.message?.includes('fetch') || error?.message?.includes('network') || error?.message?.includes('Failed to fetch')) {
        console.error('[Newsletter Form] Network error - API endpoint may be unreachable');
        setSubmitStatus("error");
      } else {
        setSubmitStatus("error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-gray-700 rounded-full mb-6">
            <Mail
              className="text-primary-600 dark:text-primary-400"
              size={32}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-legal-dark dark:text-white">
            {t.newsletter.title}
          </h2>
          <p className="text-xl text-legal-gray dark:text-gray-300 mb-8">
            {t.newsletter.subtitle}
          </p>

          <form
            ref={(el) => {
              if (el) {
                (formRef as any).current = el;
                if (!listenerAttachedRef.current) {
                  const handleNativeSubmit = (e: Event) => {
                    // Only prevent default if React handler hasn't already handled it
                    // React's synthetic events run before native events in bubble phase
                    // So we only need to prevent in capture phase to stop browser navigation
                    if (e.eventPhase === Event.CAPTURING_PHASE) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  };
                  // Only attach in capture phase to prevent browser navigation
                  // Let React handler run in bubble phase
                  el.addEventListener('submit', handleNativeSubmit, { capture: true, passive: false });
                  listenerAttachedRef.current = true;
                }
              }
            }}
            onSubmit={handleSubmit}
            action="#"
            method="post"
            noValidate
            className="flex flex-col gap-4 max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  id="newsletter-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t.newsletter.placeholder}
                  className={`w-full px-6 py-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-legal-dark dark:text-white focus:outline-none focus:border-primary-600 dark:focus:border-primary-400 transition-colors text-lg ${
                    dir === "rtl" ? "text-right" : ""
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSubmitting ? t.newsletter.subscribing : t.newsletter.subscribe}
              </button>
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
            
            {/* Honeypot field - hidden from users but visible to bots */}
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', visibility: 'hidden' }}>
              <label htmlFor="website">Website (leave blank)</label>
              <input
                type="text"
                id="website"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </form>

          {submitStatus === "success" && (
            <div
              className={`mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 inline-flex items-center gap-2 ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <CheckCircle
                className="text-green-600 dark:text-green-400"
                size={20}
              />
              <p className="text-green-800 dark:text-green-300 font-semibold">
                {t.newsletter.successMessage}
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div
              className={`mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 ${
                dir === "rtl" ? "text-right" : ""
              }`}
            >
              <p className="text-red-800 dark:text-red-300 font-semibold">
                {t.newsletter.errorMessage}
              </p>
            </div>
          )}

          {submitStatus === "rateLimited" && (
            <div
              className={`mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 ${
                dir === "rtl" ? "text-right" : ""
              }`}
            >
              <p className="text-yellow-800 dark:text-yellow-300 font-semibold">
                {t.newsletter.rateLimitMessage} {rateLimitRetryAfter > 0 && `(${formatRetryAfter(rateLimitRetryAfter)})`}
              </p>
            </div>
          )}

          {submitStatus === "alreadySubscribed" && (
            <div
              className={`mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 inline-flex items-center gap-2 ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <CheckCircle
                className="text-blue-600 dark:text-blue-400"
                size={20}
              />
              <p className="text-blue-800 dark:text-blue-300 font-semibold">
                {t.newsletter.alreadySubscribedMessage}
              </p>
            </div>
          )}

          <p
            className="text-sm text-legal-gray dark:text-gray-400 mt-6 text-center"
          >
            {t.newsletter.privacy}
          </p>

        </div>
      </div>
    </section>
  );
}
