import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { validateEmail } from '@/lib/sanitize'
import { generateEmailTemplate, generatePlainTextEmail } from '@/lib/emailTemplate'

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Newsletter API] Request received')
    
    // Check if API key is configured (use newsletter-specific key if available, fallback to general key)
    const apiKey = process.env.RESEND_API_KEY_NEWSLETTER || process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('[Newsletter API] RESEND_API_KEY_NEWSLETTER or RESEND_API_KEY is not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }
    
    console.log('[Newsletter API] API key found:', apiKey.substring(0, 10) + '...')

    // Initialize Resend inside the function to ensure env variable is loaded
    const resend = new Resend(apiKey)

    let body
    const contentType = request.headers.get('content-type') || ''
    
    try {
      if (contentType.includes('application/json')) {
        body = await request.json()
        console.log('[Newsletter API] Parsed as JSON:', body)
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Handle form-encoded data
        const formData = await request.formData()
        const email = formData.get('email')
        const turnstileResponse = formData.get('cf-turnstile-response') || formData.get('turnstileToken')
        console.log('[Newsletter API] Parsing form-encoded data. FormData entries:')
        console.log(`  email: ${email}`)
        console.log(`  cf-turnstile-response: ${turnstileResponse ? 'present' : 'missing'}`)
        body = {
          email: email || '',
          turnstileToken: turnstileResponse || ''
        }
        console.log('[Newsletter API] Extracted from form data:', body)
      } else {
        // Try JSON first, fallback to form data
        try {
          body = await request.json()
          console.log('[Newsletter API] Parsed as JSON (fallback):', body)
        } catch {
          const formData = await request.formData()
          const email = formData.get('email')
          const turnstileResponse = formData.get('cf-turnstile-response') || formData.get('turnstileToken')
          console.log('[Newsletter API] Parsing as form data (fallback). FormData entries:')
          console.log(`  email: ${email}`)
          console.log(`  cf-turnstile-response: ${turnstileResponse ? 'present' : 'missing'}`)
          body = {
            email: email || '',
            turnstileToken: turnstileResponse || ''
          }
          console.log('[Newsletter API] Extracted from form data (fallback):', body)
        }
      }
      
      console.log('[Newsletter API] Final request body:', { email: body.email, hasToken: !!body.turnstileToken })
    } catch (parseError: any) {
      console.error('[Newsletter API] Error parsing request body:', parseError)
      return NextResponse.json({ 
        error: 'Invalid request body', 
        details: parseError?.message 
      }, { status: 400 })
    }
    
    const { email, emailHtml, emailText, timestamp, turnstileToken } = body

    // Validate email on server side
    if (!email || typeof email !== 'string') {
      console.error('[Newsletter API] Email is missing or invalid type')
      return NextResponse.json({ 
        error: 'Email is required', 
      }, { status: 400 })
    }

    // Trim email (remove whitespace)
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail) {
      console.error('[Newsletter API] Email is empty after trimming')
      return NextResponse.json({ 
        error: 'Email cannot be empty', 
      }, { status: 400 })
    }

    // Validate email format (must be a valid email address)
    if (!validateEmail(trimmedEmail)) {
      console.error('[Newsletter API] Invalid email format:', trimmedEmail)
      return NextResponse.json({ 
        error: 'Invalid email format', 
      }, { status: 400 })
    }

    console.log('[Newsletter API] Email validated:', trimmedEmail)

    // Verify Turnstile token
    if (turnstileToken) {
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY || '',
            response: turnstileToken,
          }),
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        const verifyData = await verifyResponse.json()
        
        if (!verifyData.success) {
          console.error('[Newsletter API] Turnstile verification failed:', verifyData)
          return NextResponse.json({ 
            error: 'Captcha verification failed', 
            details: verifyData 
          }, { status: 400 })
        }
        
        console.log('[Newsletter API] Turnstile verification successful')
      } catch (verifyError: any) {
        // If it's a timeout or network error, log but don't block submission
        if (verifyError.name === 'AbortError' || verifyError.code === 'UND_ERR_CONNECT_TIMEOUT') {
          console.warn('[Newsletter API] Turnstile verification timed out, proceeding anyway:', verifyError.message)
          // Continue with submission - don't block on network issues
        } else {
          console.error('[Newsletter API] Turnstile verification error:', verifyError)
          // For other errors, you might want to block or allow - currently allowing
          console.warn('[Newsletter API] Turnstile verification error, proceeding anyway')
        }
      }
    } else {
      console.warn('[Newsletter API] No Turnstile token provided')
    }

    // Add contact to Resend audience (use validated and trimmed email)
    // Resend contacts.create requires an audience ID
    const audienceId = process.env.RESEND_AUDIENCE_ID
    
    if (!audienceId) {
      console.error('[Newsletter API] RESEND_AUDIENCE_ID is not configured')
      return NextResponse.json({ 
        error: 'Audience ID not configured. Please add RESEND_AUDIENCE_ID to .env.local' 
      }, { status: 500 })
    }
    
    // First, try to check if contact already exists by listing contacts in the audience
    // and searching for the email. This prevents duplicate notifications.
    try {
      console.log('[Newsletter API] Checking if contact already exists:', trimmedEmail, 'in audience:', audienceId)
      
      // List contacts in the audience and search for the email
      const listResult = await resend.contacts.list({ 
        audienceId: audienceId 
      })
      
      console.log('[Newsletter API] List contacts result:', {
        hasData: !!listResult.data,
        dataLength: listResult.data?.data?.length || 0,
        hasError: !!listResult.error
      })
      
      if (listResult.data && listResult.data.data) {
        // Search for the email in the list
        const existingContact = listResult.data.data.find(
          (contact: any) => contact.email?.toLowerCase() === trimmedEmail.toLowerCase()
        )
        
        if (existingContact) {
          // Contact exists!
          console.log('[Newsletter API] ✅ DUPLICATE DETECTED - Contact already exists:', trimmedEmail, 'ID:', existingContact.id)
          console.log('[Newsletter API] ✅ Returning early - NO notification email will be sent')
          return NextResponse.json({ 
            success: true, 
            alreadySubscribed: true,
            message: 'You are already subscribed to our newsletter!' 
          }, { status: 200 })
        } else {
          console.log('[Newsletter API] Contact not found in list, proceeding with create')
        }
      } else if (listResult.error) {
        console.log('[Newsletter API] Error listing contacts (proceeding with create):', listResult.error)
      }
    } catch (listError: any) {
      // If listing fails, proceed with create (might be permission issue or API limitation)
      console.log('[Newsletter API] Exception listing contacts (proceeding with create):', listError?.message)
    }

    console.log('[Newsletter API] Proceeding to create new contact:', trimmedEmail, 'audience ID:', audienceId)
    
    // Try to create the contact
    const result = await resend.contacts.create({
      audienceId: audienceId,
      email: trimmedEmail,
      unsubscribed: false,
    })
    
    const { data, error } = result

    if (error) {
      console.error('[Newsletter API] Resend error (full error object):', JSON.stringify(error, null, 2))
      console.error('[Newsletter API] Error type:', typeof error)
      console.error('[Newsletter API] Error keys:', Object.keys(error || {}))
      
      // Check if the error indicates the contact already exists
      const errorMessage = String((error as any)?.message || (error as any)?.name || '').toLowerCase()
      const errorCode = (error as any)?.statusCode || (error as any)?.code || (error as any)?.status || ''
      const errorString = JSON.stringify(error).toLowerCase()
      
      console.log('[Newsletter API] Error analysis:', {
        errorMessage,
        errorCode,
        errorString: errorString.substring(0, 200)
      })
      
      // Resend typically returns 422 with a message about duplicate/conflict
      // Common patterns: "already exists", "duplicate", "conflict", statusCode 422
      const isDuplicate = 
        errorCode === 422 ||
        errorCode === 409 ||
        errorCode === '422' ||
        errorCode === '409' ||
        errorMessage.includes('already exists') ||
        errorMessage.includes('duplicate') ||
        errorMessage.includes('conflict') ||
        errorMessage.includes('already in') ||
        errorString.includes('already exists') ||
        errorString.includes('duplicate') ||
        errorString.includes('conflict') ||
        errorString.includes('422') ||
        errorString.includes('409')
      
      if (isDuplicate) {
        console.log('[Newsletter API] ✅ DUPLICATE DETECTED - Contact already exists in audience:', trimmedEmail)
        console.log('[Newsletter API] ✅ Returning early - NO notification email will be sent')
        // Return success but indicate it's a duplicate (no notification email sent)
        return NextResponse.json({ 
          success: true, 
          alreadySubscribed: true,
          message: 'You are already subscribed to our newsletter!' 
        }, { status: 200 })
      }
      
      // If it's a different error, return it
      console.error('[Newsletter API] ❌ Different error (not duplicate):', error)
      return NextResponse.json({ error: 'Failed to add contact to audience', details: error }, { status: 500 })
    }

    // Log the contact creation result
    if (data) {
      console.log('[Newsletter API] Contact operation result:', JSON.stringify(data, null, 2))
    }

    // IMPORTANT: If we reach here with no error, we assume it's a new contact
    // However, if Resend doesn't throw errors for duplicates, we need to track this differently
    // For now, we'll send the notification. If duplicates still occur, we need to implement
    // a local tracking mechanism (database/cache) to track which emails we've already notified about
    
    console.log('[Newsletter API] ✅ NEW CONTACT - Contact added to audience successfully:', data)

    // Send notification email to admin (only for new subscriptions)
    const notificationTimestamp = new Date().toISOString()
    const notificationEmailData = {
      email: trimmedEmail,
      timestamp: notificationTimestamp
    }
    
    const notificationEmailHtml = generateEmailTemplate(notificationEmailData, 'newsletter')
    const notificationEmailText = generatePlainTextEmail(notificationEmailData, 'newsletter')
    
    console.log('[Newsletter API] Sending notification email to: cognerax@outlook.com')
    const { data: emailData_result, error: emailError } = await resend.emails.send({
      from: 'CogneraX Website <onboarding@resend.dev>',
      to: ['cognerax@outlook.com'],
      subject: 'New Newsletter Subscription',
      html: notificationEmailHtml,
      text: notificationEmailText,
    })

    if (emailError) {
      console.error('[Newsletter API] Error sending notification email:', JSON.stringify(emailError, null, 2))
      // Don't fail the request if notification email fails - contact was already added
      console.warn('[Newsletter API] Contact added but notification email failed')
    } else {
      console.log('[Newsletter API] Notification email sent successfully:', emailData_result)
    }

    return NextResponse.json({ success: true, data, emailSent: !emailError }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('[Newsletter API] API error:', error)
    console.error('[Newsletter API] Error stack:', error?.stack)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error?.message || 'Unknown error' 
    }, { status: 500 })
  }
}
