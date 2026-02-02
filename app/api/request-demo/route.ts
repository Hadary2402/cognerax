import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { generateEmailTemplate, generatePlainTextEmail } from '@/lib/emailTemplate'

export async function POST(request: NextRequest) {
  try {
    console.log('[Request Demo API] Request received')
    
    // Check if API key is configured (use request-demo-specific key if available, fallback to general key)
    const apiKey = process.env.RESEND_API_KEY_REQUEST_DEMO || process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('[Request Demo API] RESEND_API_KEY_REQUEST_DEMO or RESEND_API_KEY is not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }
    
    console.log('[Request Demo API] API key found:', apiKey.substring(0, 10) + '...')

    // Initialize Resend inside the function to ensure env variable is loaded
    const resend = new Resend(apiKey)

    let body
    const contentType = request.headers.get('content-type') || ''
    
    try {
      if (contentType.includes('application/json')) {
        body = await request.json()
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Handle form-encoded data
        const formData = await request.formData()
        body = {
          name: formData.get('name') || '',
          email: formData.get('email') || '',
          company: formData.get('company') || '',
          message: formData.get('message') || '',
          website: formData.get('website') || ''
        }
      } else {
        // Try JSON first, fallback to form data
        try {
          body = await request.json()
        } catch {
          const formData = await request.formData()
          body = {
            name: formData.get('name') || '',
            email: formData.get('email') || '',
            company: formData.get('company') || '',
            message: formData.get('message') || '',
            website: formData.get('website') || ''
          }
        }
      }
      
      console.log('[Request Demo API] Request body received:', { 
        name: body.name, 
        email: body.email, 
        company: body.company 
      })
    } catch (parseError: any) {
      console.error('[Request Demo API] Error parsing request body:', parseError)
      return NextResponse.json({ 
        error: 'Invalid request body', 
        details: parseError?.message 
      }, { status: 400 })
    }
    
    const { name, email, company, message, emailHtml, emailText, timestamp, turnstileToken } = body

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
          console.error('[Request Demo API] Turnstile verification failed:', verifyData)
          return NextResponse.json({ 
            error: 'Captcha verification failed', 
            details: verifyData 
          }, { status: 400 })
        }
        
        console.log('[Request Demo API] Turnstile verification successful')
      } catch (verifyError: any) {
        console.error('[Request Demo API] Turnstile verification error:', verifyError)
        return NextResponse.json({ 
          error: 'Failed to verify captcha', 
          details: verifyError?.message 
        }, { status: 500 })
      }
    } else {
      console.warn('[Request Demo API] No Turnstile token provided')
      // You can choose to require it or make it optional
      // return NextResponse.json({ error: 'Captcha token required' }, { status: 400 })
    }

    // If emailHtml/emailText are not provided (form-encoded submission), generate them
    let finalEmailHtml = emailHtml
    let finalEmailText = emailText
    
    if (!finalEmailHtml || !finalEmailText) {
      const emailData = {
        name,
        email,
        company,
        message,
        timestamp: timestamp || new Date().toISOString()
      }
      console.log('[Request Demo API] Generating email templates with data:', { name, email, company, hasMessage: !!message })
      finalEmailHtml = generateEmailTemplate(emailData, 'request-demo')
      finalEmailText = generatePlainTextEmail(emailData, 'request-demo')
    }

    // Validate required fields before sending
    if (!name || !email || !company) {
      console.error('[Request Demo API] Missing required fields:', { hasName: !!name, hasEmail: !!email, hasCompany: !!company })
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: 'Name, email, and company are required' 
      }, { status: 400 })
    }

    // Send email using Resend
    console.log('[Request Demo API] Sending email to: cognerax@outlook.com')
    console.log('[Request Demo API] Email data:', { name, email, company, hasMessage: !!message })
    const { data, error } = await resend.emails.send({
      from: 'CogneraX Website <onboarding@resend.dev>',
      to: ['cognerax@outlook.com'],
      subject: 'New Demo Request',
      html: finalEmailHtml,
      text: finalEmailText,
    })

    if (error) {
      console.error('[Request Demo API] Resend error:', JSON.stringify(error, null, 2))
      return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 })
    }

    console.log('[Request Demo API] Email sent successfully:', data)
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: any) {
    console.error('[Request Demo API] API error:', error)
    console.error('[Request Demo API] Error stack:', error?.stack)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error?.message || 'Unknown error' 
    }, { status: 500 })
  }
}
