/**
 * Rate limiting utility to prevent spam submissions
 * Uses multiple identifiers for better spam prevention
 */

interface RateLimitEntry {
  timestamp: number
  count: number
  identifiers: string[]
}

interface RateLimitConfig {
  maxSubmissions: number // Maximum number of submissions
  windowMs: number // Time window in milliseconds (e.g., 5 minutes = 300000)
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxSubmissions: 3, // Allow 3 submissions
  windowMs: 5 * 60 * 1000 // 5 minutes
}

const STORAGE_KEY = 'cognerax_rate_limit'

/**
 * Gets client identifiers for rate limiting
 * Uses email, company, and other available data
 */
function getIdentifiers(data: Record<string, any>): string[] {
  const identifiers: string[] = []
  
  // Email is the primary identifier
  if (data.email) {
    identifiers.push(`email:${data.email.toLowerCase().trim()}`)
  }
  
  // Company name as secondary identifier
  if (data.company) {
    identifiers.push(`company:${data.company.toLowerCase().trim()}`)
  }
  
  // Combination of name and email
  if (data.name && data.email) {
    identifiers.push(`name_email:${data.name.toLowerCase().trim()}_${data.email.toLowerCase().trim()}`)
  }
  
  // Get form type
  if (data.formType) {
    identifiers.push(`form:${data.formType}`)
  }
  
  return identifiers
}

/**
 * Gets rate limit data from localStorage
 */
function getRateLimitData(): Record<string, RateLimitEntry> {
  if (typeof window === 'undefined') {
    return {}
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    
    const data = JSON.parse(stored)
    const now = Date.now()
    
    // Clean up expired entries
    const cleaned: Record<string, RateLimitEntry> = {}
    for (const key in data) {
      const entry = data[key]
      // Keep entries that are still within the time window
      if (now - entry.timestamp < DEFAULT_CONFIG.windowMs) {
        cleaned[key] = entry
      }
    }
    
    // Update storage if entries were removed
    if (Object.keys(cleaned).length !== Object.keys(data).length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
    }
    
    return cleaned
  } catch (error) {
    console.error('Error reading rate limit data:', error)
    return {}
  }
}

/**
 * Saves rate limit data to localStorage
 */
function saveRateLimitData(data: Record<string, RateLimitEntry>): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving rate limit data:', error)
    // If storage is full, try to clean old entries more aggressively
    try {
      const now = Date.now()
      const cleaned: Record<string, RateLimitEntry> = {}
      for (const key in data) {
        const entry = data[key]
        // Keep only entries from last hour
        if (now - entry.timestamp < 60 * 60 * 1000) {
          cleaned[key] = entry
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
    } catch (e) {
      console.error('Failed to clean rate limit storage:', e)
    }
  }
}

/**
 * Checks if a submission should be rate limited
 * 
 * @param formData - The form data to check
 * @param config - Optional rate limit configuration
 * @returns Object with isLimited flag and retryAfter seconds
 */
export function checkRateLimit(
  formData: Record<string, any>,
  config: Partial<RateLimitConfig> = {}
): { isLimited: boolean; retryAfter: number } {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const rateLimitData = getRateLimitData()
  const identifiers = getIdentifiers(formData)
  const now = Date.now()
  
  // Debug logging
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[Rate Limit Check] Identifiers:', identifiers)
    console.log('[Rate Limit Check] Current data in storage:', rateLimitData)
    console.log('[Rate Limit Check] Config:', finalConfig)
  }
  
  // Check each identifier
  for (const identifier of identifiers) {
    const entry = rateLimitData[identifier]
    
    if (entry) {
      // Check if within time window
      const timeSinceFirst = now - entry.timestamp
      
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log(`[Rate Limit Check] Identifier "${identifier}":`, {
          count: entry.count,
          maxAllowed: finalConfig.maxSubmissions,
          timeSinceFirst: `${Math.floor(timeSinceFirst / 1000)}s`,
          windowMs: `${finalConfig.windowMs / 1000}s`,
          withinWindow: timeSinceFirst < finalConfig.windowMs,
          isLimited: entry.count >= finalConfig.maxSubmissions
        })
      }
      
      if (timeSinceFirst < finalConfig.windowMs) {
        // Check if max submissions exceeded
        if (entry.count >= finalConfig.maxSubmissions) {
          const retryAfter = Math.ceil((finalConfig.windowMs - timeSinceFirst) / 1000)
          if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.log(`[Rate Limit Check] RATE LIMITED! Retry after ${retryAfter}s`)
          }
          return { isLimited: true, retryAfter }
        }
      } else {
        // Entry expired - will be cleaned up later
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.log(`[Rate Limit Check] Identifier "${identifier}" expired, will be reset`)
        }
      }
    } else {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log(`[Rate Limit Check] Identifier "${identifier}": No entry found (not limited)`)
      }
    }
  }
  
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[Rate Limit Check] Result: NOT LIMITED')
  }
  
  return { isLimited: false, retryAfter: 0 }
}

/**
 * Records a submission for rate limiting
 * 
 * @param formData - The form data that was submitted
 */
export function recordSubmission(formData: Record<string, any>): void {
  const rateLimitData = getRateLimitData()
  const identifiers = getIdentifiers(formData)
  const now = Date.now()
  
  // Debug logging
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[Record Submission] Identifiers:', identifiers)
    console.log('[Record Submission] Form data:', formData)
  }
  
  // Update or create entries for each identifier
  for (const identifier of identifiers) {
    const entry = rateLimitData[identifier]
    
    if (entry) {
      // Update existing entry
      const timeSinceFirst = now - entry.timestamp
      
      if (timeSinceFirst < DEFAULT_CONFIG.windowMs) {
        // Still within window, increment count
        entry.count++
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.log(`[Record Submission] Identifier "${identifier}": Incremented count to ${entry.count}`)
        }
      } else {
        // Window expired, reset
        rateLimitData[identifier] = {
          timestamp: now,
          count: 1,
          identifiers: [identifier]
        }
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.log(`[Record Submission] Identifier "${identifier}": Reset (window expired)`)
        }
      }
    } else {
      // Create new entry
      rateLimitData[identifier] = {
        timestamp: now,
        count: 1,
        identifiers: [identifier]
      }
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log(`[Record Submission] Identifier "${identifier}": Created new entry (count = 1)`)
      }
    }
  }
  
  saveRateLimitData(rateLimitData)
  
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[Record Submission] Saved rate limit data:', rateLimitData)
  }
}

/**
 * Clears rate limit data (useful for testing or manual reset)
 */
export function clearRateLimit(): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log('[Rate Limit] Cleared all rate limit data')
  } catch (error) {
    console.error('Error clearing rate limit:', error)
  }
}

/**
 * Gets raw rate limit data from storage (for debugging)
 */
export function getRawRateLimitData(): any {
  if (typeof window === 'undefined') {
    return null
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Error getting raw rate limit data:', error)
    return null
  }
}

/**
 * Formats retry after time in a user-friendly way
 */
export function formatRetryAfter(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`
  }
  
  const minutes = Math.ceil(seconds / 60)
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`
}

/**
 * Debug function to check current rate limit status
 * Useful for troubleshooting
 */
export function debugRateLimit(formData: Record<string, any>): void {
  if (typeof window === 'undefined') {
    console.log('Rate limit debug: Not in browser environment')
    return
  }
  
  const identifiers = getIdentifiers(formData)
  const rateLimitData = getRateLimitData()
  const rawData = getRawRateLimitData()
  const now = Date.now()
  
  console.log('=== Rate Limit Debug ===')
  console.log('Current time:', new Date(now).toISOString())
  console.log('Form data:', formData)
  console.log('Identifiers for this submission:', identifiers)
  console.log('All rate limit entries (cleaned):', rateLimitData)
  console.log('Raw localStorage data:', rawData)
  console.log('Storage key:', STORAGE_KEY)
  console.log('Config:', DEFAULT_CONFIG)
  
  identifiers.forEach(identifier => {
    const entry = rateLimitData[identifier]
    if (entry) {
      const timeSinceFirst = now - entry.timestamp
      const timeRemaining = DEFAULT_CONFIG.windowMs - timeSinceFirst
      const isLimited = entry.count >= DEFAULT_CONFIG.maxSubmissions && timeRemaining > 0
      console.log(`Identifier "${identifier}":`, {
        count: entry.count,
        maxAllowed: DEFAULT_CONFIG.maxSubmissions,
        firstSubmission: new Date(entry.timestamp).toISOString(),
        timeSinceFirst: `${Math.floor(timeSinceFirst / 1000)}s`,
        timeRemaining: `${Math.ceil(timeRemaining / 1000)}s`,
        isLimited,
        withinWindow: timeSinceFirst < DEFAULT_CONFIG.windowMs
      })
    } else {
      console.log(`Identifier "${identifier}": No entry found (not rate limited)`)
    }
  })
  console.log('========================')
  
  // Check localStorage availability
  try {
    const testKey = '__rate_limit_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    console.log('[Rate Limit] localStorage is available and working')
  } catch (e) {
    console.error('[Rate Limit] localStorage ERROR:', e)
    console.error('[Rate Limit] This might be why rate limiting is not working!')
  }
}

