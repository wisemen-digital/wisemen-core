import { tv } from '@/styles/tailwindVariants.lib'

export const createTextStyle = tv({
  slots: {
    text: `max-w-full`,
  },
  variants: {
    truncate: {
      1: {
        text: 'line-clamp-1',
      },
      2: {
        text: 'line-clamp-2',
      },
      3: {
        text: 'line-clamp-3',
      },
      4: {
        text: 'line-clamp-4',
      },
      5: {
        text: 'line-clamp-5',
      },
      6: {
        text: 'line-clamp-6',
      },
      true: {
        text: 'truncate',
      },
    },

  },
})

export type TextStyle = ReturnType<typeof createTextStyle>
