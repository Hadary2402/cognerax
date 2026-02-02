'use client'

import { useEffect, useRef, useState } from 'react'

interface TurnstileProps {
  siteKey: string
  onSuccess: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  className?: string
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement | string, options: {
        sitekey: string
        callback?: (token: string) => void
        'error-callback'?: () => void
        'expired-callback'?: () => void
        theme?: 'light' | 'dark' | 'auto'
        size?: 'normal' | 'compact'
      }) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export default function Turnstile({
  siteKey,
  onSuccess,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal',
  className = ''
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Turnstile script is loaded
    const checkTurnstile = () => {
      if (typeof window !== 'undefined' && window.turnstile) {
        setIsReady(true)
        setError(null)
        return true
      }
      return false
    }

    // Check immediately
    if (checkTurnstile()) {
      return
    }

    // Poll for script loading
    const interval = setInterval(() => {
      if (checkTurnstile()) {
        clearInterval(interval)
      }
    }, 100)

    // Cleanup interval after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (!window.turnstile) {
        setError('Turnstile script failed to load')
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!isReady || !containerRef.current || widgetIdRef.current) {
      return
    }

    try {
      const widgetId = window.turnstile!.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          console.log('[Turnstile] Success callback called with token')
          onSuccess(token)
        },
        'error-callback': () => {
          console.error('[Turnstile] Error callback called')
          setError('Turnstile verification failed')
          onError?.()
        },
        'expired-callback': () => {
          console.log('[Turnstile] Expired callback called')
          onExpire?.()
        },
        theme: theme,
        size: size
      })

      widgetIdRef.current = widgetId
      console.log('[Turnstile] Widget rendered with ID:', widgetId)
    } catch (err) {
      console.error('[Turnstile] Error rendering widget:', err)
      setError('Failed to render Turnstile widget')
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        } catch (err) {
          console.error('[Turnstile] Error removing widget:', err)
        }
      }
    }
    // Only depend on isReady and siteKey - callbacks are stable references
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, siteKey, theme, size])

  return (
    <div className={className}>
      <div ref={containerRef} className="cf-turnstile" data-sitekey={siteKey} />
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}
