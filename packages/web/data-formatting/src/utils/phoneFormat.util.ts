const NON_DIGIT_REGEX = /\D/g
const DIGIT_REGEX = /\d/

export class PhoneFormatUtil {
  /**
   * Mask a phone number, preserving formatting and showing only the last 4 digits.
   * E.g., "+1 (555) 123-4567" → "+* (***) ***-4567".
   */
  static maskPhone(phone: string): string {
    const digits = phone.replace(NON_DIGIT_REGEX, '')

    if (digits.length < 4) {
      return phone
    }

    const lastFour = digits.slice(-4)
    const masked = '*'.repeat(digits.length - 4) + lastFour

    let result = ''
    let digitIndex = 0

    for (const char of phone) {
      if (DIGIT_REGEX.test(char)) {
        result += masked[digitIndex++]
      }
      else {
        result += char
      }
    }

    return result
  }
}
