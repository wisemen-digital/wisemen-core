import importX from './configs/imports.js'
import defaultConfig from './configs/default.js'

/**
 * @type {import('eslint').Linter.Config[]}
 */
const config = [...defaultConfig, ...importX]

export default config
