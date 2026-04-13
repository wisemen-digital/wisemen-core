import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'

import type { LintConfig } from '@/types/lint.type.ts'

export const DEFAULT_TAILWIND_CONFIG_PATH = './src/assets/styles/index.css'
export const DEFAULT_TAILWIND_ROOT_FONT_SIZE = 16

export interface TailwindConfigOptions {
  tailwindConfigPath?: string
  tailwindRootFontSize?: number
}

export function tailwindConfig(config: TailwindConfigOptions): LintConfig {
  return [
    {
      name: 'tailwindcss',
      plugins: {
        'better-tailwindcss': eslintPluginBetterTailwindcss,
      },
      rules: {
        'better-tailwindcss/enforce-canonical-classes': [
          'error',
          {
            rootFontSize: config.tailwindRootFontSize ?? DEFAULT_TAILWIND_ROOT_FONT_SIZE,
          },
        ],
        'better-tailwindcss/enforce-consistent-class-order': 'error',
        'better-tailwindcss/enforce-consistent-line-wrapping': 'error',
        'better-tailwindcss/no-conflicting-classes': 'error',
        'better-tailwindcss/no-deprecated-classes': 'error',
        'better-tailwindcss/no-duplicate-classes': 'error',
        'better-tailwindcss/no-restricted-classes': 'error',
        'better-tailwindcss/no-unknown-classes': [
          'error',
          {
            ignore: [
              '^group(?:\\/(\\S*))?$',
              '^peer(?:\\/(\\S*))?$',
              // anything starting with custom- should be ignored
              '^custom-(?:\\S+)?$',
            ],
          },
        ],
        'better-tailwindcss/no-unnecessary-whitespace': 'error',
      },
      settings: {
        'better-tailwindcss': {
          entryPoint: config.tailwindConfigPath ?? DEFAULT_TAILWIND_CONFIG_PATH,
        },
      },
    },
  ]
}
