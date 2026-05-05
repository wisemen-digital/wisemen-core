import { tv } from '@/styles/tailwindVariants.lib'

export const createInlineNumberFieldStyle = tv({
  slots: {
    input: `
      size-full truncate bg-transparent text-primary outline-none
      placeholder:text-placeholder
      read-only:cursor-default
      disabled:cursor-not-allowed disabled:text-disabled
      disabled:placeholder:text-fg-disabled-subtle
    `,
  },
  variants: {
    size: {
      md: {
        input: 'text-sm',
      },
      sm: {
        input: 'text-sm',
      },
      xs: {
        input: 'text-xs',
      },
    },
  },
})

export type InlineNumberFieldStyle = ReturnType<typeof createInlineNumberFieldStyle>
