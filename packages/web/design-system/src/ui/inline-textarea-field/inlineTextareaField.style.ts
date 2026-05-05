import { tv } from '@/styles/tailwindVariants.lib'

export const createInlineTextareaFieldStyle = tv({
  slots: {
    textarea: `
      size-full bg-transparent text-primary outline-none
      placeholder:text-placeholder
      read-only:cursor-default
      disabled:cursor-not-allowed disabled:text-disabled
      disabled:placeholder:text-fg-disabled-subtle
    `,
  },
  variants: {
    resize: {
      'auto-vertical': {
        textarea: 'resize-none',
      },
      'none': {
        textarea: 'resize-none',
      },
      'vertical': {
        textarea: 'resize-y',
      },
    },
    size: {
      md: {
        textarea: 'text-sm',
      },
      sm: {
        textarea: 'text-sm',
      },
      xs: {
        textarea: 'text-xs',
      },
    },
  },
})

export type InlineTextareaFieldStyle = ReturnType<typeof createInlineTextareaFieldStyle>
