import { tv } from '@/styles/tailwindVariants.lib'

export const createTextareaFieldStyle = tv({
  slots: {
    root: `
      group/textarea-field inline-flex w-full flex-col overflow-hidden
      rounded-md border border-primary bg-primary shadow-xs outline
      outline-transparent duration-100
      data-disabled:cursor-not-allowed data-disabled:border-disabled-subtle
      data-disabled:bg-disabled-subtle
      data-error:border-error
      [&:has(textarea:focus-visible)]:data-interactive:border-fg-brand-primary
      [&:has(textarea:focus-visible)]:data-interactive:outline-fg-brand-primary
      [&:has(textarea:focus-visible)]:data-interactive:data-error:border-error
      [&:has(textarea:focus-visible)]:data-interactive:data-error:outline-fg-error-primary
    `,
    textarea: `
      size-full bg-transparent text-xs text-primary outline-none
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
  },
})

export type TextareaFieldStyle = ReturnType<typeof createTextareaFieldStyle>
