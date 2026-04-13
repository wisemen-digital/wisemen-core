import { createTV } from 'tailwind-variants'

export const tv = createTV({
  twMerge: true,
  twMergeConfig: {
    extend: {
      // eslint-disable-next-line unicorn/no-keyword-prefix
      classGroups: {
        'font-size': [
          {
            text: [
              'xxs',
            ],
          },
        ],
      },
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
  },
})
