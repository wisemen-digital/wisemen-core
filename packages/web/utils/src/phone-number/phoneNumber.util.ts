import {
  format,
  parsePhoneNumberWithError,
} from 'libphonenumber-js'

export class PhoneNumberUtil {
  /**
   * Formats a phone number string into international format (e.g. `+1 650 253 0000`).
   *
   * @param dto - A phone number string
   * @returns The phone number in international format.
   */
  static format(dto: string): string {
    return format(dto, 'INTERNATIONAL')
  }

  /**
   * Parses a phone number and returns it as `+<countryCallingCode> <nationalNumber>`.
   * Throws if the phone number cannot be parsed.
   *
   * @param phoneNumber - A phone number string
   * @returns The formatted string, e.g. `+1 6502530000`.
   */
  static parse(phoneNumber: string): string {
    const {
      countryCallingCode, nationalNumber,
    } = parsePhoneNumberWithError(phoneNumber)

    return `+${countryCallingCode} ${nationalNumber}`
  }
}
