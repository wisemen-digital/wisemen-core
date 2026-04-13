import simpleImportSort from 'eslint-plugin-simple-import-sort'

import type { LintConfig } from '@/types/lint.type.ts'

export const simpleSortConfig: LintConfig = {
  name: 'simple-import-sort',
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
  },
}
