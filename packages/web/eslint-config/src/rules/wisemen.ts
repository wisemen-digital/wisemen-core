import eslintPluginWisemen from '@wisemen/eslint-plugin-vue'

import type { LintConfig } from '@/types/lint.type.ts'

export const wisemenConfig: LintConfig = {
  name: 'wisemen-explicit-function-return-type',
  plugins: {
    'eslint-plugin-wisemen': eslintPluginWisemen,
  },
  rules: {
    'eslint-plugin-wisemen/explicit-function-return-type-with-regex': [
      'error',
      {

        allowedRegexes: [
          '^use[A-Z]',
        ],
      },
    ],

    'eslint-plugin-wisemen/vue-computed-ref-generics': 'error',
  },
}
