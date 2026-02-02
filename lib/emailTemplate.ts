import { sanitizeTextContent } from './sanitize'

/**
 * Generates an HTML email template for form submissions
 * All values are HTML-escaped to prevent XSS attacks
 * Uses sanitizeTextContent to preserve apostrophes in normal words (e.g., "Rico's")
 * 
 * @param formData - The form data to include in the email
 * @param formType - The type of form (contact-us, request-demo, newsletter)
 * @returns HTML email template string with all values escaped
 */
export function generateEmailTemplate(
  formData: Record<string, any>,
  formType: 'contact-us' | 'request-demo' | 'newsletter'
): string {
  // HTML-escape all values (preserves apostrophes in normal words)
  const escapeValue = (value: any): string => {
    if (value === null || value === undefined) {
      return ''
    }
    if (typeof value === 'string') {
      return sanitizeTextContent(value)
    }
    return sanitizeTextContent(String(value))
  }

  // Get form title based on type
  const getFormTitle = (): string => {
    switch (formType) {
      case 'contact-us':
        return 'Contact Us Form Submission'
      case 'request-demo':
        return 'Request Demo Form Submission'
      case 'newsletter':
        return 'Newsletter Subscription'
      default:
        return 'Form Submission'
    }
  }

  // Build field rows for the email
  const buildFieldRows = (): string => {
    const rows: string[] = []
    
    // Common fields
    if (formData.name) {
      rows.push(`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 150px;">Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827;">${escapeValue(formData.name)}</td>
        </tr>
      `)
    }

    if (formData.email) {
      rows.push(`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 150px;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827;">${escapeValue(formData.email)}</td>
        </tr>
      `)
    }

    if (formData.company) {
      rows.push(`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 150px;">Company:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827;">${escapeValue(formData.company)}</td>
        </tr>
      `)
    }

    if (formData.inquiryType) {
      rows.push(`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 150px;">Inquiry Type:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827;">${escapeValue(formData.inquiryType)}</td>
        </tr>
      `)
    }

    if (formData.message) {
      rows.push(`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 150px; vertical-align: top;">Message:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827; white-space: pre-wrap;">${escapeValue(formData.message)}</td>
        </tr>
      `)
    }

    // Add timestamp if available
    if (formData.timestamp) {
      const date = new Date(formData.timestamp)
      rows.push(`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 150px;">Submitted:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827;">${escapeValue(date.toLocaleString())}</td>
        </tr>
      `)
    }

    return rows.join('')
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeValue(getFormTitle())}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">${escapeValue(getFormTitle())}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.5;">
                You have received a new form submission from your website.
              </p>
              
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #f9fafb; border-radius: 6px; overflow: hidden;">
                ${buildFieldRows()}
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                This is an automated email from CogneraXAI - Nexora
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  return html
}

/**
 * Generates a plain text version of the email template
 * All values are HTML-escaped for safety
 * Uses sanitizeTextContent to preserve apostrophes in normal words (e.g., "Rico's")
 * 
 * @param formData - The form data to include in the email
 * @param formType - The type of form (contact-us, request-demo, newsletter)
 * @returns Plain text email template string
 */
export function generatePlainTextEmail(
  formData: Record<string, any>,
  formType: 'contact-us' | 'request-demo' | 'newsletter'
): string {
  const escapeValue = (value: any): string => {
    if (value === null || value === undefined) {
      return ''
    }
    if (typeof value === 'string') {
      return sanitizeTextContent(value)
    }
    return sanitizeTextContent(String(value))
  }

  const getFormTitle = (): string => {
    switch (formType) {
      case 'contact-us':
        return 'Contact Us Form Submission'
      case 'request-demo':
        return 'Request Demo Form Submission'
      case 'newsletter':
        return 'Newsletter Subscription'
      default:
        return 'Form Submission'
    }
  }

  let text = `${getFormTitle()}\n`
  text += `${'='.repeat(50)}\n\n`
  text += `You have received a new form submission from your website.\n\n`

  if (formData.name) {
    text += `Name: ${escapeValue(formData.name)}\n`
  }
  if (formData.email) {
    text += `Email: ${escapeValue(formData.email)}\n`
  }
  if (formData.company) {
    text += `Company: ${escapeValue(formData.company)}\n`
  }
  if (formData.inquiryType) {
    text += `Inquiry Type: ${escapeValue(formData.inquiryType)}\n`
  }
  if (formData.message) {
    text += `Message: ${escapeValue(formData.message)}\n`
  }
  if (formData.timestamp) {
    const date = new Date(formData.timestamp)
    text += `Submitted: ${escapeValue(date.toLocaleString())}\n`
  }

  text += `\n${'='.repeat(50)}\n`
  text += `This is an automated email from CogneraXAI - Nexora\n`

  return text
}

