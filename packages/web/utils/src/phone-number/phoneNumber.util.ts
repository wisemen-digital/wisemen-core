import {
  format,
  parsePhoneNumberWithError,
} from 'libphonenumber-js'

export class PhoneNumberUtil {
  static format(dto: string): string {
    return format(dto, 'INTERNATIONAL')
  }

  static parse(phoneNumber: string): string {
    const {
      countryCallingCode, nationalNumber,
    } = parsePhoneNumberWithError(phoneNumber)

    return `+${countryCallingCode} ${nationalNumber}`
  }
}
