"use client";

import { useState, useRef } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Newsletter Form] API error:', errorData);
        
        // Check for specific error types
        if (errorData.error) {
          // Display the API error message
          console.error('[Newsletter Form] API error message:', errorData.error);
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Check if user is already subscribed
      if (result.alreadySubscribed) {
        setSubmitStatus("alreadySubscribed");
        setEmail("");
        setWebsite("");
        setTurnstileToken(null);
        // Don't record for rate limiting if already subscribed (no spam)
        return;
      }

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
    } catch (error) {
      console.error('Error submitting newsletter subscription:', error);
      setSubmitStatus("error");
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
                    console.log('[Newsletter Form] NATIVE SUBMIT EVENT CAUGHT - PREVENTING DEFAULT AND REDIRECT', e);
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    if (e.cancelable) {
                      e.preventDefault();
                    }
                    return false;
                  };
                  el.addEventListener('submit', handleNativeSubmit, { capture: true, passive: false });
                  el.addEventListener('submit', handleNativeSubmit, { capture: false, passive: false });
                  listenerAttachedRef.current = true;
                }
              }
            }}
            onSubmit={handleSubmit}
            action="/api/newsletter"
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
                onSuccess={(token) => {
                  console.log('[Newsletter Form] Turnstile verified, token received');
                  setTurnstileToken(token);
                  setTurnstileError(false);
                }}
                onError={() => {
                  console.error('[Newsletter Form] Turnstile error');
                  setTurnstileToken(null);
                  setTurnstileError(true);
                }}
                onExpire={() => {
                  console.log('[Newsletter Form] Turnstile token expired');
                  setTurnstileToken(null);
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
