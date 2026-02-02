// API Configuration
// For static hosting (like GoDaddy), API routes need to be hosted separately
// Set this to your API server URL (e.g., Vercel deployment, Railway, etc.)

// Use environment variable if available, otherwise use relative path (won't work on static hosting)
const getApiBaseUrl = (): string => {
  // First check window (set by script tag in layout.tsx) - works in browser
  if (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) {
    const url = (window as any).__API_BASE_URL__
    // Remove trailing slash if present
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url
    if (cleanUrl) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log('[API Config] Using API Base URL from window:', cleanUrl)
      }
      // Warn if protocol is missing (but don't add it here - let getApiUrl handle it)
      if (cleanUrl && !cleanUrl.match(/^https?:\/\//)) {
        console.warn('[API Config] ⚠️ API Base URL missing protocol (https://). Will be added automatically.');
      }
    }
    return cleanUrl
  }
  
  // Check for Next.js public env var (build time) - only works during SSR/build
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url
    if (cleanUrl) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log('[API Config] Using API Base URL from process.env:', cleanUrl)
      }
      // Warn if protocol is missing
      if (cleanUrl && !cleanUrl.match(/^https?:\/\//)) {
        console.warn('[API Config] ⚠️ API Base URL missing protocol (https://). Will be added automatically.');
      }
    }
    return cleanUrl
  }
  
  // Default to empty (relative paths) - only works with Node.js server
  // For static hosting, this will need to be set via window.__API_BASE_URL__
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn('[API Config] ⚠️ No API Base URL configured - using relative paths')
  }
  return ''
}

export const API_BASE_URL = getApiBaseUrl()

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  const base = API_BASE_URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  if (base) {
    // Remove trailing slash from base if present
    let cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
    
    // Ensure protocol is present (add https:// if missing)
    if (cleanBase && !cleanBase.match(/^https?:\/\//)) {
      console.warn('[API Config] ⚠️ API base URL missing protocol, adding https://');
      cleanBase = `https://${cleanBase}`;
    }
    
    return `${cleanBase}${cleanEndpoint}`
  }
  
  return cleanEndpoint
}

// API endpoints
export const API_ENDPOINTS = {
  CONTACT: getApiUrl('/api/contact'),
  REQUEST_DEMO: getApiUrl('/api/request-demo'),
  NEWSLETTER: getApiUrl('/api/newsletter'),
} as const
