import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { generateEmailTemplate, generatePlainTextEmail } from '@/lib/emailTemplate'
import { getCorsHeaders } from '@/lib/cors'

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Contact API] Request received')
    
    // Check if API key is configured (use contact-specific key if available, fallback to general key)
    const apiKey = process.env.RESEND_API_KEY_CONTACT || process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('[Contact API] RESEND_API_KEY_CONTACT or RESEND_API_KEY is not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }
    
    console.log('[Contact API] API key found:', apiKey.substring(0, 10) + '...')

    // Initialize Resend inside the function to ensure env variable is loaded
    const resend = new Resend(apiKey)

    let body
    const contentType = request.headers.get('content-type') || ''
    
    try {
      if (contentType.includes('application/json')) {
        body = await request.json()
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData()
        body = {
          name: formData.get('name') || '',
          company: formData.get('company') || '',
          email: formData.get('email') || '',
          inquiryType: formData.get('inquiryType') || '',
          message: formData.get('message') || '',
          website: formData.get('website') || ''
        }
      } else {
        body = await request.json()
      }
      
      console.log('[Contact API] Request body received:', { 
        name: body.name, 
        email: body.email, 
        company: body.company,
        inquiryType: body.inquiryType 
      })
    } catch (parseError: any) {
      console.error('[Contact API] Error parsing request body:', parseError)
      return NextResponse.json({ 
        error: 'Invalid request body', 
        details: parseError?.message 
      }, { status: 400 })
    }
    
    const { name, company, email, inquiryType, message, emailHtml, emailText, timestamp, turnstileToken } = body

    // Validate required fields
    if (!name || !email || !company || !inquiryType) {
      console.error('[Contact API] Missing required fields:', { hasName: !!name, hasEmail: !!email, hasCompany: !!company, hasInquiryType: !!inquiryType })
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: 'Name, email, company, and inquiry type are required' 
      }, { status: 400 })
    }

    // Verify Turnstile token
    if (turnstileToken) {
      try {
        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY || '',
            response: turnstileToken,
          }),
        })

        const verifyData = await verifyResponse.json()
        
        if (!verifyData.success) {
          console.error('[Contact API] Turnstile verification failed:', verifyData)
          return NextResponse.json({ 
            error: 'Captcha verification failed', 
            details: verifyData 
          }, { status: 400 })
        }
        
        console.log('[Contact API] Turnstile verification successful')
      } catch (verifyError: any) {
        console.error('[Contact API] Turnstile verification error:', verifyError)
        return NextResponse.json({ 
          error: 'Failed to verify captcha', 
          details: verifyError?.message 
        }, { status: 500 })
      }
    } else {
      console.warn('[Contact API] No Turnstile token provided')
    }

    // If emailHtml/emailText are not provided, generate them
    let finalEmailHtml = emailHtml
    let finalEmailText = emailText
    
    if (!finalEmailHtml || !finalEmailText) {
      const emailData = {
        name,
        company,
        email,
        inquiryType,
        message,
        timestamp: timestamp || new Date().toISOString()
      }
      finalEmailHtml = generateEmailTemplate(emailData, 'contact-us')
      finalEmailText = generatePlainTextEmail(emailData, 'contact-us')
    }

    // Send email using Resend
    console.log('[Contact API] Sending email to: cognerax@outlook.com')
    console.log('[Contact API] Email data:', { name, email, company, inquiryType, hasMessage: !!message })
    const { data, error } = await resend.emails.send({
      from: 'CogneraX Website <onboarding@resend.dev>',
      to: ['cognerax@outlook.com'],
      subject: `New Contact Form Submission - ${inquiryType || 'General Inquiry'}`,
      html: finalEmailHtml || `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'N/A'}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
      text: finalEmailText || `
        New Contact Form Submission
        
        Name: ${name || 'N/A'}
        Company: ${company || 'N/A'}
        Email: ${email || 'N/A'}
        Inquiry Type: ${inquiryType || 'N/A'}
        Message: ${message || 'N/A'}
        Timestamp: ${new Date().toISOString()}
      `,
    })

    if (error) {
      console.error('[Contact API] Resend error:', JSON.stringify(error, null, 2))
      return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 })
    }

    console.log('[Contact API] Email sent successfully:', data)
    const origin = request.headers.get('origin')
    return NextResponse.json({ success: true, data }, { 
      status: 200,
      headers: getCorsHeaders(origin),
    })
  } catch (error: any) {
    console.error('[Contact API] API error:', error)
    console.error('[Contact API] Error stack:', error?.stack)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error?.message || 'Unknown error' 
    }, { status: 500 })
  }
}
