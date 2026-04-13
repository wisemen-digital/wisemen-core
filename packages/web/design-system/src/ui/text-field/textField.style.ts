import { tv } from '@/styles/tailwindVariants.lib'

export const createTextFieldStyle = tv({
  slots: {
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
        input: 'px-md',
      },
      sm: {
        input: 'px-sm',
      },
    },
  },
})

export type TextFieldStyle = ReturnType<typeof createTextFieldStyle>
