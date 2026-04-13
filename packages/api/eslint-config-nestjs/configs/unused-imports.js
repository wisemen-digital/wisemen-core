import unusedImports from 'eslint-plugin-unused-imports'

export default [{
  plugins: {
    'unused-imports': unusedImports
  },
  rules: {
    'unused-imports/no-unused-imports': 'error'
  }
}]
