import importX from './configs/imports.js'
import defaultConfig from './configs/default.js'
import customRules from './configs/custom-rules.js'

/**
 * @type {import('eslint').Linter.Config[]}
 */
const config = [
  ...defaultConfig,
  ...importX,
  ...customRules
]

export default config
