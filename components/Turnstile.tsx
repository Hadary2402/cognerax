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
  const isRenderingRef = useRef(false)
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
    // Prevent duplicate renders
    if (!isReady || !containerRef.current) {
      return
    }

    const container = containerRef.current
    if (!container) {
      return
    }

    // Cleanup any existing widget first (handles re-renders when dependencies change)
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
        isRenderingRef.current = false
        // Clear the container
        container.innerHTML = ''
      } catch (err) {
        console.error('[Turnstile] Error removing existing widget:', err)
      }
    }

    // If already rendering, skip (prevents race conditions)
    if (isRenderingRef.current) {
      return
    }

    // Check if container already has Turnstile widget elements (iframe or widget div)
    // This prevents double renders in React Strict Mode
    const hasWidget = container.querySelector('iframe') || 
                      container.querySelector('[data-callback]') ||
                      (container.children.length > 0 && widgetIdRef.current === null)
    
    if (hasWidget && widgetIdRef.current === null) {
      console.log('[Turnstile] Container already has widget but no widgetId, skipping render')
      return
    }

    // Mark as rendering to prevent race conditions
    isRenderingRef.current = true

    try {
      const widgetId = window.turnstile!.render(container, {
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
      isRenderingRef.current = false
      console.log('[Turnstile] Widget rendered with ID:', widgetId)
    } catch (err) {
      isRenderingRef.current = false
      console.error('[Turnstile] Error rendering widget:', err)
      setError('Failed to render Turnstile widget')
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
          isRenderingRef.current = false
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
