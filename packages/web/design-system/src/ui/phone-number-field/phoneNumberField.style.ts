import { tv } from '@/styles/tailwindVariants.lib'

export const createPhoneNumberFieldStyle = tv({
  slots: {
    countryFlag: `
      block h-3.5 w-5 shrink-0 overflow-hidden rounded-xxs
      [&>svg]:size-full [&>svg]:object-cover
    `,
    countryFlag: `
      block h-3.5 w-5 shrink-0 overflow-hidden rounded-xxs
      [&>svg]:size-full [&>svg]:object-cover
    `,
    countryTrigger: `
      ml-xxs flex h-6.5 shrink-0 items-center gap-xs rounded-sm pr-xs pl-sm
      outline-none
      not-disabled:hover:bg-secondary-hover
      focus-visible:ring-2 focus-visible:ring-fg-brand-primary
      disabled:cursor-not-allowed
    `,
    dialCode: 'shrink-0 text-xs text-disabled select-none',
    dialCode: 'shrink-0 text-xs text-disabled select-none',
    input: `
      size-full truncate bg-transparent text-xs text-primary outline-none
      placeholder:text-placeholder
      read-only:cursor-default
      disabled:cursor-not-allowed disabled:text-disabled
      disabled:placeholder:text-fg-disabled-subtle
    `,
  },
  variants: {
    size: {
      md: {
        countryTrigger: 'ml-xxs h-6.5',
        input: 'px-md',
      },
      sm: {
        countryTrigger: 'ml-xxs h-5.5',
        input: 'px-sm',
      },
    },
  },
})

export type PhoneNumberFieldStyle = ReturnType<typeof createPhoneNumberFieldStyle>
