import type { LintConfig } from '#types/lint.type.ts'

export const jsonConfig: LintConfig[] = [
  {
  // Override rules for JSON files
    files: [
      '**/*.json',
      '**/*.jsonc',
      '**/*.json5',
    ],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          order: {
            type: 'asc',
          },
          pathPattern: '^$', // Validates the top-level keys
        },
        {
          order: {
            type: 'asc',
          },
          pathPattern: '.*', // Validates nested keys
        },
      ],
    },
  },
  {
  // Ignore package.json files from key sorting
    files: [
      '**/package.json',
      '**/package-lock.json',
      '**/tsconfig.json',
    ],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  },
]
