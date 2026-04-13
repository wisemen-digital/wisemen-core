const WHITESPACE_REGEX = /\s/g
const GROUP_REGEX = /(.{4})/g

export class IbanFormatUtil {
  /**
   * Mask an IBAN number, showing only the country code and last 4 characters.
   * E.g., "BE68 5390 0754 7034" → "BE** **** **** 7034".
   */
  static maskIban(iban: string): string {
    const cleaned = iban.replace(WHITESPACE_REGEX, '')

    if (cleaned.length < 8) {
      return iban
    }

    const countryCode = cleaned.slice(0, 2)
    const lastFour = cleaned.slice(-4)
    const maskedLength = cleaned.length - 2 - 4
    const masked = countryCode + '*'.repeat(maskedLength) + lastFour

    return masked.replace(GROUP_REGEX, '$1 ').trim()
  }
}
