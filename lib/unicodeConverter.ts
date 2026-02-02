/**
 * Converts unicode characters to ASCII/text equivalents
 * Handles common unicode characters, emojis, and special symbols
 */

/**
 * Converts unicode text to ASCII equivalent
 * Removes or converts special unicode characters, emojis, and symbols
 * 
 * @param text - The text to convert
 * @returns ASCII text with unicode characters converted or removed
 */
export function unicodeToText(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }

  // Common unicode to ASCII mappings
  const unicodeMap: Record<string, string> = {
    // Quotation marks
    '\u201C': '"', // Left double quotation mark
    '\u201D': '"', // Right double quotation mark
    '\u201E': '"', // Double low-9 quotation mark
    '\u201F': '"', // Double high-reversed-9 quotation mark
    '\u2018': "'", // Left single quotation mark
    '\u2019': "'", // Right single quotation mark
    '\u201A': "'", // Single low-9 quotation mark
    '\u201B': "'", // Single high-reversed-9 quotation mark
    '\u2032': "'", // Prime
    '\u2033': '"', // Double prime
    
    // Dashes and hyphens
    '\u2013': '-', // En dash
    '\u2014': '--', // Em dash
    '\u2015': '--', // Horizontal bar
    '\u2212': '-', // Minus sign
    
    // Ellipsis
    '\u2026': '...', // Horizontal ellipsis
    
    // Spaces
    '\u00A0': ' ', // Non-breaking space
    '\u2000': ' ', // En quad
    '\u2001': ' ', // Em quad
    '\u2002': ' ', // En space
    '\u2003': ' ', // Em space
    '\u2004': ' ', // Three-per-em space
    '\u2005': ' ', // Four-per-em space
    '\u2006': ' ', // Six-per-em space
    '\u2007': ' ', // Figure space
    '\u2008': ' ', // Punctuation space
    '\u2009': ' ', // Thin space
    '\u200A': ' ', // Hair space
    '\u200B': '', // Zero width space (remove)
    '\u200C': '', // Zero width non-joiner (remove)
    '\u200D': '', // Zero width joiner (remove)
    '\uFEFF': '', // Zero width no-break space (remove)
    
    // Special characters
    '\u00A9': '(c)', // Copyright
    '\u00AE': '(R)', // Registered trademark
    '\u2122': '(TM)', // Trademark
    '\u2022': '*', // Bullet
    '\u2023': '>', // Triangular bullet
    '\u2043': '-', // Hyphen bullet
    
    // Currency (optional - keep symbols but normalize)
    '\u20AC': 'EUR', // Euro
    '\u00A3': 'GBP', // Pound
    '\u00A5': 'JPY', // Yen
    '\u00A2': 'cent', // Cent
    
    // Mathematical operators
    '\u00D7': 'x', // Multiplication sign
    '\u00F7': '/', // Division sign
    '\u2260': '!=', // Not equal to
    '\u2264': '<=', // Less than or equal to
    '\u2265': '>=', // Greater than or equal to
    '\u2248': '~=', // Almost equal to
  }

  let result = text

  // Replace mapped unicode characters
  for (const [unicode, ascii] of Object.entries(unicodeMap)) {
    result = result.replace(new RegExp(unicode, 'g'), ascii)
  }

  // Remove emojis and other unicode symbols (keep basic ASCII)
  // This regex removes characters outside the ASCII range (0-127) except common punctuation
  // More aggressive: remove everything that's not alphanumeric or common punctuation
  result = result
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      // Keep ASCII printable characters (32-126) and some common extended ASCII
      // Keep: letters, numbers, spaces, and common punctuation
      if (
        (code >= 32 && code <= 126) || // Standard ASCII
        code === 9 || // Tab
        code === 10 || // Line feed
        code === 13 // Carriage return
      ) {
        return char
      }
      // For other characters, try to convert to closest ASCII equivalent
      // Use normalization to decompose characters
      try {
        const normalized = char.normalize('NFD')
        const asciiChar = normalized.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        // If normalized character is ASCII, use it, otherwise remove
        if (asciiChar.length > 0 && asciiChar.charCodeAt(0) >= 32 && asciiChar.charCodeAt(0) <= 126) {
          return asciiChar
        }
        return '' // Remove if can't convert
      } catch {
        return '' // Remove on error
      }
    })
    .join('')

  // Clean up multiple spaces
  result = result.replace(/\s+/g, ' ').trim()

  return result
}

/**
 * Converts unicode text in an object's string values
 * 
 * @param obj - The object to convert
 * @returns New object with unicode converted to text
 */
export function unicodeObjectToText<T extends Record<string, any>>(obj: T): T {
  const converted = { ...obj }
  
  for (const key in converted) {
    if (typeof converted[key] === 'string') {
      converted[key] = unicodeToText(converted[key]) as T[Extract<keyof T, string>]
    }
  }
  
  return converted
}

