const WHITESPACE_REGEX = /\s+/g
const PROTOCOL_REGEX = /^https?:\/\//
const WWW_REGEX = /^www\./
const TRAILING_SLASH_REGEX = /\/+$/
const SENTENCE_CASE_REGEX = /(^\s*\w|[.!?]\s+\w)/g
const DIACRITICS_REGEX = /[\u0300-\u036F]/g
const NON_SLUG_REGEX = /[^a-z0-9\s-]/g
const WHITESPACE_UNDERSCORE_REGEX = /[\s_]+/g
const MULTIPLE_HYPHEN_REGEX = /-+/g
const WORD_BOUNDARY_REGEX = /\b\w/g

export class StringFormatUtil {
  /**
   * Format a nullable string, returning a fallback if the value is null, undefined, or blank.
   * E.g., format("hello") → "hello", format(null) → "-", format("  ") → "-".
   */
  static format(value: string | null | undefined, fallback = '-'): string {
    if (value == null || value.trim().length === 0) {
      return fallback
    }

    return value
  }

  /**
   * Collapse all whitespace sequences into a single space and trim.
   * E.g., "  hello   world  " → "hello world".
   */
  static normalizeWhitespace(str: string): string {
    return str.replace(WHITESPACE_REGEX, ' ').trim()
  }

  /**
   * Strip the protocol and trailing slashes from a URL for display.
   * E.g., "https://www.example.com/" → "example.com".
   */
  static toPrettyUrl(url: string): string {
    return url
      .replace(PROTOCOL_REGEX, '')
      .replace(WWW_REGEX, '')
      .replace(TRAILING_SLASH_REGEX, '')
  }

  /**
   * Convert a string to sentence case.
   * E.g., "hello world. goodbye world" → "Hello world. Goodbye world".
   */
  static toSentenceCase(str: string): string {
    return str
      .toLowerCase()
      .replace(SENTENCE_CASE_REGEX, (char) => char.toUpperCase())
  }

  /**
   * Convert a string to a URL-friendly slug.
   * Strips diacritics, lowercases, and replaces spaces/special chars with hyphens.
   * E.g., "Hello Wörld!" → "hello-world".
   */
  static toSlug(str: string): string {
    return str
      .normalize('NFD')
      .replace(DIACRITICS_REGEX, '')
      .toLowerCase()
      .trim()
      .replace(NON_SLUG_REGEX, '')
      .replace(WHITESPACE_UNDERSCORE_REGEX, '-')
      .replace(MULTIPLE_HYPHEN_REGEX, '-')
  }

  /**
   * Convert a string to title case.
   * E.g., "hello world" → "Hello World".
   */
  static toTitleCase(str: string): string {
    return str.toLowerCase().replace(WORD_BOUNDARY_REGEX, (char) => char.toUpperCase())
  }

  /**
   * Truncate a string from the end if it exceeds the max length.
   * E.g., truncate("Hello world", 8) → "Hello w…".
   */
  static truncate(str: string, maxLength: number, ellipsis = '…'): string {
    if (str.length <= maxLength) {
      return str
    }

    if (maxLength <= ellipsis.length) {
      return ellipsis.slice(0, maxLength)
    }

    return str.slice(0, maxLength - ellipsis.length).trimEnd() + ellipsis
  }

  /**
   * Truncate a string from the middle if it exceeds the max length.
   * E.g., truncateMiddle("Hello world", 8) → "Hel…rld".
   */
  static truncateMiddle(
    str: string,
    maxLength: number,
    ellipsis = '…',
  ): string {
    if (str.length <= maxLength) {
      return str
    }

    if (maxLength <= ellipsis.length) {
      return ellipsis.slice(0, maxLength)
    }

    const charsToShow = maxLength - ellipsis.length
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)

    return str.slice(0, frontChars) + ellipsis + str.slice(-backChars)
  }
}
