import eslintNestJSConfig from '@wisemen/eslint-config-nestjs'
import eslintImportTypescript from 'eslint-plugin-import-typescript'

export default [
  ...eslintNestJSConfig,
  {
    ignores: [
      'src/modules/localization/generated/i18n.generated.ts'
    ]
  },
  {
    plugins: {
      'import-typescript': eslintImportTypescript
    },
    rules: {
      'import-typescript/no-relative-parent-imports': [
        'error', { onlyPathsImport: true }
      ]
    }
  }
]
