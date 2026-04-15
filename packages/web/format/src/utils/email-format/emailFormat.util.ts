export class EmailFormatUtil {
  /**
   * Mask an email address, showing only the first character of the local part.
   * E.g., "john@example.com" → "j***@example.com".
   */
  static mask(email: string): string {
    const [
      local,
      domain,
    ] = email.split('@')

    if (local == null || domain == null) {
      return email
    }

    const visibleChars = Math.min(1, local.length)

    return `${local.slice(0, visibleChars)}${'*'.repeat(local.length - visibleChars)}@${domain}`
  }
}
