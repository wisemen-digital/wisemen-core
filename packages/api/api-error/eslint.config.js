import eslintNestJSConfig from '@wisemen/eslint-config-nestjs'

export default [
  ...eslintNestJSConfig,
  {
    rules: {
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      'import-typescript/no-relative-parent-imports': 'off',
      '@stylistic/padding-line-between-statements': ['off'],
      'no-magic-numbers': [
        'warn',
        {
          ignore: [0, 1, -1],
          ignoreReadonlyClassProperties: true,
          ignoreArrayIndexes: true,
          enforceConst: true,
          detectObjects: false
        }
      ]
    }
  }
]
