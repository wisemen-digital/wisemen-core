import eslintNestJSConfig from '@wisemen/eslint-config-nestjs'

export default [
  ...eslintNestJSConfig,
  {
    rules: {
      'import-typescript/no-relative-parent-imports': 'off'
    }
  }
]
