import type { VariantProps } from 'tailwind-variants'

import { tv } from '@/libs/tailwindVariants.lib'

export const createPhoneNumberFieldStyle = tv({
  slots: {
    countryFlag: 'block h-3.5 w-5 shrink-0 rounded-xxs object-cover',
    dialCode: 'pl-xs text-sm text-placeholder',
  },
  variants: {
    variant: {},
  },
})

export type PhoneNumberFieldStyle = VariantProps<typeof createPhoneNumberFieldStyle>
export type CreatePhoneNumberFieldStyle = ReturnType<typeof createPhoneNumberFieldStyle>
