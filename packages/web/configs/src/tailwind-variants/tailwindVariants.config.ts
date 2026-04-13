/* eslint-disable unicorn/no-keyword-prefix */
import defu from 'defu'
import type { TVConfig } from 'tailwind-variants'

export const DEFAULT_TV_CONFIG: TVConfig = {
  twMerge: true,
  twMergeConfig: {
    extend: {
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
}

export function tailwindVariantsConfig(config?: TVConfig): TVConfig {
  return defu(config, DEFAULT_TV_CONFIG)
}
