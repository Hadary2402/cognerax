/**
 * Sanitizes user input by escaping HTML entities
 * Prevents XSS attacks by converting special characters to HTML entities
 * Escapes apostrophes for use in HTML attributes (e.g., onclick='...')
 * 
 * @param input - The string to sanitize
 * @returns The sanitized string with HTML entities escaped
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .replace(/&/g, '&amp;')   // Must be first to avoid double encoding
    .replace(/</g, '&lt;')     // < → &lt;
    .replace(/>/g, '&gt;')     // > → &gt;
    .replace(/"/g, '&quot;')   // " → &quot;
    .replace(/'/g, '&#39;')    // ' → &#39;
}

/**
 * Sanitizes text content for HTML display
 * Escapes dangerous characters but preserves apostrophes in normal words
 * Use this for HTML text content (not attributes) to preserve words like "Rico's"
 * 
 * @param input - The string to sanitize
 * @returns The sanitized string safe for HTML text content (apostrophes preserved)
 */
export function sanitizeTextContent(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  // Escape dangerous characters but NOT apostrophes
  // Apostrophes are safe in HTML text content (only need escaping in attributes)
  return input
    .replace(/&/g, '&amp;')   // Must be first to avoid double encoding
    .replace(/</g, '&lt;')     // < → &lt;
    .replace(/>/g, '&gt;')     // > → &gt;
    .replace(/"/g, '&quot;')   // " → &quot;
    // Note: Apostrophes (') are NOT escaped - they're safe in HTML text content
}

/**
 * Sanitizes an object by sanitizing all string values
 * 
 * @param obj - The object to sanitize
 * @returns A new object with all string values sanitized
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]) as T[Extract<keyof T, string>]
    }
  }
  
  return sanitized
}

/**
 * Validates email format
 * 
 * @param email - The email to validate
 * @returns true if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validates that a string is not empty after trimming
 * 
 * @param value - The value to validate
 * @returns true if value is not empty, false otherwise
 */
export function validateNotEmpty(value: string): boolean {
  if (typeof value !== 'string') return false
  return value.trim().length > 0
}

/**
 * Sanitizes input for Excel export safety
 * ONLY escapes LEADING dangerous characters (=, +, -, @) that could be interpreted as formulas
 * Prefixes with single quote (') ONLY when the string STARTS with a dangerous character
 * 
 * Examples:
 * - "=SUM(1+1)" → "'=SUM(1+1)" (starts with =, gets prefix)
 * - "test@example.com" → "test@example.com" (contains @ but doesn't start with it, no prefix)
 * - "+123456" → "'+123456" (starts with +, gets prefix)
 * 
 * @param input - The string to sanitize for Excel
 * @returns The sanitized string safe for Excel export (only modified if starts with =, +, -, or @)
 */
export function sanitizeForExcel(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  // Trim whitespace first to check the actual start of the content
  const trimmed = input.trim()
  
  // ONLY if the string STARTS (after trimming) with a dangerous character, prefix with single quote
  // Single quote in Excel forces the cell to be treated as text
  // This regex ^[=+\-@] checks if the FIRST character is =, +, -, or @
  if (trimmed.length > 0 && /^[=+\-@]/.test(trimmed)) {
    return "'" + trimmed
  }
  
  // Return original input if it doesn't start with dangerous characters
  // (e.g., "test@example.com" returns as-is since @ is not at the beginning)
  return input
}

/**
 * Sanitizes input for both HTML and Excel safety
 * First escapes HTML entities, then handles Excel-dangerous LEADING characters only
 * 
 * Note: Excel sanitization only affects strings that START with =, +, -, or @
 * Strings like "test@example.com" are NOT modified (since @ is not at the beginning)
 * 
 * @param input - The string to sanitize
 * @returns The sanitized string safe for both HTML display and Excel export
 */
export function sanitizeInputSafe(input: string): string {
  const htmlSafe = sanitizeInput(input)
  // Only prefixes with ' if the string starts with =, +, -, or @
  return sanitizeForExcel(htmlSafe)
}

/**
 * Sanitizes an object for both HTML and Excel safety
 * Sanitizes all string values to prevent XSS and Excel formula injection
 * 
 * @param obj - The object to sanitize
 * @returns A new object with all string values sanitized for HTML and Excel
 */
export function sanitizeObjectSafe<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInputSafe(sanitized[key]) as T[Extract<keyof T, string>]
    }
  }
  
  return sanitized
}

/**
 * Sanitizes an object for Excel safety only (no HTML escaping)
 * Only prefixes strings that start with dangerous Excel characters (=, +, -, @)
 * Use this when data will be sent as JSON (JSON.stringify handles JSON escaping)
 * 
 * @param obj - The object to sanitize
 * @returns A new object with all string values sanitized for Excel only
 */
export function sanitizeObjectForExcel<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeForExcel(sanitized[key]) as T[Extract<keyof T, string>]
    }
  }
  
  return sanitized
}

