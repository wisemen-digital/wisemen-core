import type { LintConfig } from '@/types/lint.type.ts'

export const spacingConfig: LintConfig = {
  name: 'spacing',
  rules: {
    'style/padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        next: 'return',
        prev: '*',
      },
      {
        blankLine: 'always',
        next: 'expression',
        prev: '*',
      },
      {
        blankLine: 'always',
        next: '*',
        prev: 'expression',
      },
      {
        blankLine: 'any',
        next: 'expression',
        prev: 'expression',
      },
      {
        blankLine: 'always',
        next: 'function',
        prev: '*',
      },
      {
        blankLine: 'always',
        next: '*',
        prev: 'function',
      },
      {
        blankLine: 'always',
        next: '*',
        prev: [
          'const',
          'let',
          'var',
        ],
      },
      {
        blankLine: 'any',
        next: [
          'const',
          'let',
          'var',
        ],
        prev: [
          'const',
          'let',
          'var',
        ],
      },
    ],
  },
}
