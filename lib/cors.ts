// CORS configuration for API routes
export function getCorsHeaders(origin: string | null) {
  // List of allowed origins
  const allowedOrigins = [
    'https://cogneraxai.com',
    'https://www.cogneraxai.com',
    'https://cognerax.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ]
  
  // Check if the origin is allowed
  const allowedOrigin = origin && allowedOrigins.includes(origin) 
    ? origin 
    : allowedOrigins[0] // Default to first allowed origin
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
}
