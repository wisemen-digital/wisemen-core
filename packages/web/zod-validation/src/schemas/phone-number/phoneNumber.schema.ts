import { parsePhoneNumberWithError } from 'libphonenumber-js'
import { z } from 'zod'

import { getZodValidationConfig } from '#/config/config.ts'

export const phoneNumberSchema = z.string().refine((val) => {
  try {
    const phoneNumber = parsePhoneNumberWithError(val)

    return phoneNumber.isPossible() && phoneNumber.isValid()
  }
  catch {
    return false
  }
}, {
  error: () => getZodValidationConfig().i18nInstance.t('package.zod_validation.invalid_phone_number'),
})
