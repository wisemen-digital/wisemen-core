import eslintNestJSConfig from '@wisemen/eslint-config-nestjs'

export default [
  ...eslintNestJSConfig,
  {
    rules: {
      'no-console': 'off'
    }
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-floating-promises': 'off'
    }
  }
]
