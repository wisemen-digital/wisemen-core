import eslintPluginPath from 'eslint-plugin-path'

import type { LintConfig } from '@/types/lint.type.ts'

export const pathConfig: LintConfig = {
  name: 'path-no-relative-imports',
  plugins: {
    path: eslintPluginPath,
  },
  rules: {
    'path/no-relative-imports': [
      'error',
      {
        maxDepth: 0,
        suggested: false,
      },
    ],
  },
}
