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

// Helper function to get full API URL (dynamic - checks window at call time)
export const getApiUrl = (endpoint: string): string => {
  // Get base URL dynamically (check window first, then fallback to module-level)
  let base = ''
  if (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) {
    base = (window as any).__API_BASE_URL__
    // Remove trailing slash if present
    base = base.endsWith('/') ? base.slice(0, -1) : base
  } else {
    base = API_BASE_URL
  }
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  if (base) {
    // Remove trailing slash from base if present
    let cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
    const hadProtocol = cleanBase.match(/^https?:\/\//)
    
    // Ensure protocol is present (add https:// if missing)
    if (cleanBase && !hadProtocol) {
      if (typeof window !== 'undefined') {
        console.warn('[API Config] ⚠️ API base URL missing protocol, adding https://');
        console.warn('[API Config] Original base URL:', cleanBase);
      }
      cleanBase = `https://${cleanBase}`;
    }
    
    const finalUrl = `${cleanBase}${cleanEndpoint}`
    
    // Debug logging in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[API Config] Generated URL:', finalUrl);
    }
    
    return finalUrl
  }
  
  return cleanEndpoint
}

// API endpoints - computed dynamically when accessed
export const API_ENDPOINTS = {
  get CONTACT() { return getApiUrl('/api/contact') },
  get REQUEST_DEMO() { return getApiUrl('/api/request-demo') },
  get NEWSLETTER() { return getApiUrl('/api/newsletter') },
} as const
