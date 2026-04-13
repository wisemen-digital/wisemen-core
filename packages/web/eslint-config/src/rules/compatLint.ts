import { FlatCompat } from '@eslint/eslintrc'

import type { LintConfig } from '@/types/lint.type.ts'

const compat = new FlatCompat()

export const compatConfig: LintConfig[] = compat.config({
  plugins: [
    'check-file',
    'newline-destructuring',
    'import-newlines',
  ],

  rules: {
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.{js,ts}': 'CAMEL_CASE',
        '**/*.{vue}': 'PASCAL_CASE',
      },
      {
        ignoreMiddleExtensions: true,
      },
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        'src/**/': 'KEBAB_CASE',
      },
    ],
    'import-newlines/enforce': [
      'error',
      {
        items: 1,
      },
    ],
    'newline-destructuring/newline': 'error',
    'sort-imports': 'off',
    'unused-imports/no-unused-imports': 'error',
  },
})
