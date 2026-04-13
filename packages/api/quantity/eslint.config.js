import eslintNestJSConfig from '@wisemen/eslint-config-nestjs'

export default [
  ...eslintNestJSConfig,
  {
    rules: {
      'import-typescript/no-relative-parent-imports': 'off'
    }
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-floating-promises': 'off'
    }
  }
]
