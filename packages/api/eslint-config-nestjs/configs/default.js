import tseslint from 'typescript-eslint'
import globals from 'globals'
import eslintImportTypescript from 'eslint-plugin-import-typescript'

/**
 * @type {import('eslint').Linter.Config[]}
 */
const config = [
  {
    files: ['**/*.ts', 'lib/**/*.js'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow' },
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow'
        },
        { selector: 'import', format: ['camelCase', 'PascalCase'] },
        { selector: 'objectLiteralProperty', format: null },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'interface', format: ['PascalCase'] },
        { selector: 'class', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
        {
          selector: 'classProperty',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow'
        },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'classicAccessor', format: ['camelCase', 'PascalCase'] }
      ],
      'nonblock-statement-body-position': ['error', 'beside']
    }
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked
  },
  {
    ignores: ['dist', 'node_modules', 'src/modules/localization/generated/i18n.generated.ts']
  },
  {
    plugins: {
      'import-typescript': eslintImportTypescript
    },
    rules: {
      'import-typescript/no-relative-parent-imports': ['error', { onlyPathsImport: true }]
    }
  }
]

export default config
