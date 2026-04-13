import { extendTailwindMerge } from 'tailwind-merge'

export const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        'none',
        'xxs',
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        '7xl',
        '8xl',
        '9xl',
        '10xl',
        '11xl',
      ],
    },
  },
})
