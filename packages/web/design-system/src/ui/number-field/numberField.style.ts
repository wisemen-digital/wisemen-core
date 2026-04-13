import { tv } from '@/styles/tailwindVariants.lib'

export const createNumberFieldStyle = tv({
  slots: {
    input: `
      size-full truncate bg-transparent px-md text-xs text-primary outline-none
      placeholder:text-placeholder
      read-only:cursor-default
      disabled:cursor-not-allowed disabled:text-disabled
      disabled:placeholder:text-fg-disabled-subtle
    `,
    leftControl: `pl-xs`,
    rightControl: `pr-xs`,
  },
  variants: {
    showControls: {
      true: {
        input: 'text-center',
      },
    },
  },
})

export type NumberFieldStyle = ReturnType<typeof createNumberFieldStyle>
