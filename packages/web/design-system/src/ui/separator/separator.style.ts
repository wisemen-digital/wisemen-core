import { tv } from '@/styles/tailwindVariants.lib'

export const createSeparatorStyle = tv({
  slots: {
    separator: `
      shrink-0 bg-quaternary
      dark:bg-tertiary
    `,
  },
  variants: {
    orientation: {
      horizontal: {
        separator: 'h-px w-full',
      },
      vertical: {
        separator: 'h-full w-px',
      },
    },
  },
})

export type SeparatorStyle = ReturnType<typeof createSeparatorStyle>
