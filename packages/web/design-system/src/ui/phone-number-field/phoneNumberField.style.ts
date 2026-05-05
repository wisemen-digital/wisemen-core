import { tv } from '@/styles/tailwindVariants.lib'

export const createPhoneNumberFieldStyle = tv({
  slots: {
    countryFlag: 'block h-3.5 w-5 shrink-0 overflow-hidden rounded-xxs [&>svg]:size-full [&>svg]:object-cover',
    countryTrigger: `
      flex shrink-0 items-center gap-xs rounded-xs px-sm outline-none
      disabled:cursor-not-allowed
      not-disabled:hover:bg-secondary-hover
      focus-visible:ring-1 focus-visible:ring-fg-brand-primary
    `,
    dialCode: 'shrink-0 select-none text-xs text-disabled',
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
        countryTrigger: 'h-7',
        input: 'px-md',
      },
      sm: {
        countryTrigger: 'h-6',
        input: 'px-sm',
      },
    },
  },
})

export type PhoneNumberFieldStyle = ReturnType<typeof createPhoneNumberFieldStyle>
