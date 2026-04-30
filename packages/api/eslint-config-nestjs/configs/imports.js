import importX from 'eslint-plugin-import-x'

/**
 * @type {import('eslint').Linter.Config[]}
 */
const config = [
  {
    plugins: {
      import: importX
    },
    rules: {
      'import/no-extraneous-dependencies': 'error',
      'import/no-useless-path-segments': 'error',
      'import/newline-after-import': 'error'
    }
  }
]

export default config
